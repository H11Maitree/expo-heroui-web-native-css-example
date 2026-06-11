---
title: "One Expo Project, Two HeroUI CSS Pipelines: Avoiding Web and Native Style Conflicts"
published: true
description: "How I isolated HeroUI React and HeroUI Native styles in one Expo SDK 54 project after their setup CSS conflicted in a shared global stylesheet."
tags: expo, reactnative, css, webdev
---

> **AI disclosure:** This article was drafted with AI assistance, then reviewed, tested, edited, and approved by the author.

I am building one Expo SDK 54 project that uses:

* `heroui-native` on iOS and Android
* `@heroui/react` on web
* Tailwind CSS and Uniwind on native
* Tailwind CSS and PostCSS on web

The platform-specific React components were not the hard part. Expo already makes `.web.tsx` and native files easy to split.

The real problem was CSS.

![HeroUI menu rendered from one Expo project on an iOS simulator using HeroUI Native and in a web browser using HeroUI React](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/fb8g2qyrztx3gfqz3713.png)

You can see the complete working example in the [GitHub repository](https://github.com/H11Maitree/expo-heroui-web-native-css-example).

## The bug

I first tried to put both HeroUI setups into one global stylesheet:

```css
@import "tailwindcss";
@import "uniwind";
@import "heroui-native/styles";
@import "@heroui/styles";
```

At first glance, this looks reasonable.

One Expo app. One global stylesheet. Done.

Except it was not done.

Both HeroUI styling systems were now entering the same CSS setup. Their themes, variables, utilities, and component styles could overlap. Import order started deciding which platform looked correct.

Moving one import below another could fix web and break native. Moving it back could fix native and break web.

The project still compiled, so there was no useful error message. The failure showed up as wrong colors, variables, spacing, or component styles.

That was the clue: this was not a CSS ordering issue.

It was a pipeline issue.

## What I actually needed

The real requirement was:

* native should process `tailwindcss`, `uniwind`, and `heroui-native/styles`
* web should process `tailwindcss` and `@heroui/styles`
* native should not process HeroUI React's browser CSS
* web should not process HeroUI Native's CSS setup

So the fix was not “reorder the imports.”

The fix was to stop using one shared `global.css`.

I needed two CSS entry points:

```text
styles/
  native.css
  web.css
```

And two platform-specific providers:

```text
components/
  PlatformSpecificProvider.tsx
  PlatformSpecificProvider.web.tsx
```

The important idea is this:

```text
native.css
  -> Tailwind CSS + Uniwind + HeroUI Native
  -> processed through Metro for React Native

web.css
  -> Tailwind CSS + HeroUI React
  -> processed through PostCSS for the browser
```

These are two different CSS pipelines. They should not share one setup file.

## Native CSS

The native entry contains only the native styling setup:

```css
/* styles/native.css */
@import "tailwindcss";
@import "uniwind";

@import "heroui-native/styles";
@source "../node_modules/heroui-native/lib";
```

This file is not just regular browser CSS.

It is an input file for Tailwind CSS and Uniwind.

For example, this line:

```css
@source "../node_modules/heroui-native/lib";
```

is not a normal CSS styling rule. It tells Tailwind where to scan for class names.

In this case, it tells Tailwind and Uniwind to scan HeroUI Native's compiled library files, so the classes used inside HeroUI Native components are included in the generated output.

## What `cssEntryFile` does

Uniwind also needs to know which CSS file is the native entry.

That happens in `metro.config.js`:

```js
// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const { withUniwindConfig } = require("uniwind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withUniwindConfig(config, {
  cssEntryFile: "./styles/native.css",
});
```

This part is easy to misunderstand.

`cssEntryFile` is not the same thing as importing CSS into the web app.

It tells Uniwind's Metro integration:

> Use `./styles/native.css` as the CSS entry file for the native styling pipeline.

That lets Uniwind process the file, understand Tailwind and Uniwind directives, handle `@source`, scan the right files, and generate the native styling output.

The native provider still imports the stylesheet:

```tsx
// components/PlatformSpecificProvider.tsx
import { PropsWithChildren } from "react";
import { HeroUINativeProvider } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../styles/native.css";

export function PlatformSpecificProvider({ children }: PropsWithChildren) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HeroUINativeProvider>{children}</HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}
```

So there are two separate jobs:

```text
cssEntryFile
  -> tells Uniwind/Metro which CSS file to process for native

import "../styles/native.css"
  -> makes the native app depend on that stylesheet
```

Setting this:

```js
cssEntryFile: "./styles/native.css"
```

does not automatically put `native.css` into the web build.

The web build only sees `native.css` if a web-reachable module imports it.

## Web CSS

The web entry contains only the browser styling setup:

```css
/* styles/web.css */
@import "tailwindcss";
@import "@heroui/styles";
```

Tailwind CSS is configured through PostCSS:

```json
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

Only the web provider imports this stylesheet:

```tsx
// components/PlatformSpecificProvider.web.tsx
import { PropsWithChildren } from "react";
import { ToastProvider } from "@heroui/react";
import "../styles/web.css";

export function PlatformSpecificProvider({ children }: PropsWithChildren) {
  return (
    <>
      {children}
      <ToastProvider placement="top" />
    </>
  );
}
```

The shared Expo Router layout imports the provider without an extension:

```tsx
import { Stack } from "expo-router";
import { PlatformSpecificProvider } from "@/components/PlatformSpecificProvider";

export default function RootLayout() {
  return (
    <PlatformSpecificProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </PlatformSpecificProvider>
  );
}
```

Metro selects the right file for each platform:

```text
web
  -> PlatformSpecificProvider.web.tsx
  -> styles/web.css

iOS / Android
  -> PlatformSpecificProvider.tsx
  -> styles/native.css
```

That dependency graph isolation is the fix.

Just creating `native.css` and `web.css` is not enough. If a shared file imports both, both stylesheets can still enter the build.

## Why `@source` matters

One confusing part is that `@source` looks like CSS, but it is really build configuration for Tailwind.

Tailwind scans files to find class names. If some class names live in a package under `node_modules`, Tailwind may not find them automatically.

That is why the native CSS entry includes:

```css
@source "../node_modules/heroui-native/lib";
```

Without it, HeroUI Native components may render without all the generated styles they need.

The short version:

```text
cssEntryFile = which CSS file Uniwind should process for native

@source = extra files or folders Tailwind should scan for class names
```

`cssEntryFile` does not replace `@source`.

`cssEntryFile` gives Uniwind the CSS entry to process. `@source` tells Tailwind where else to look for class names.

## Keep setup files outside `app`

I keep these provider modules under `components/`, not inside Expo Router's `app/` directory.

Files inside `app/` participate in the route tree. Setup modules placed there can be treated as routes or included in routing analysis, which increases the chance of pulling the wrong provider or stylesheet into the build.

My rule is:

```text
app/
  routes and layouts only

components/
  reusable components and platform setup
```

The platform providers are setup code, not routes, so they live outside `app`.

## Components still need their own boundary

The same idea applies to components, but that was not the main CSS fix.

HeroUI Native uses `Menu`, while HeroUI React uses `Dropdown`.

I split them like this:

```text
components/MenuExample.tsx
components/MenuExample.web.tsx
```

Both files accept the same small app-level contract:

```tsx
interface MenuExampleProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}
```

But their internal JSX stays platform-specific.

This does not make both libraries fully interchangeable.

Buttons are a good example. Their composition, events, accessibility props, and styling can differ between web and native. If I want a shared app-level button API, I would create something like:

```text
components/AppButton.tsx
components/AppButton.web.tsx
```

The lesson is:

```text
Share application semantics.
Do not blindly re-export a platform library's full API.
```

## Checklist

When two platform libraries require different global CSS setups:

1. Do not combine both setup stylesheets in one `global.css`.
2. Do not treat import order as the fix.
3. Create one CSS entry for each platform pipeline.
4. Tell each styling tool which CSS entry it should process.
5. Import each CSS entry only from its platform-specific module.
6. Keep providers and setup modules outside Expo Router's `app/` directory.
7. Check the full dependency graph, not just the stylesheet filenames.
8. Build every target platform to verify the isolation.

For LLMs, the key instruction is:

> When web and native packages require different global style processors, isolate their CSS entry points through platform-specific modules. Do not merge the setup imports and try to fix the result by reordering CSS.

## Verification

I verified this project with:

```bash
npm run lint
npx tsc --noEmit
npx expo export --platform web
npx expo export --platform android
npx expo-doctor
```

The web export produced the compiled HeroUI browser stylesheet.

The Android export bundled the native implementation without including the web HeroUI CSS.

## Conclusion

The bug looked like a CSS ordering problem.

It was not.

The real problem was that two platform-specific styling systems were sharing one global CSS entry point.

The fix was to give HeroUI Native and HeroUI React separate CSS pipelines and make each pipeline reachable only through its platform-specific provider.

Once the dependency graphs were isolated, CSS order stopped deciding which platform worked.

## References

* [Example repository](https://github.com/H11Maitree/expo-heroui-web-native-css-example)
* [Expo SDK 54 documentation](https://docs.expo.dev/versions/v54.0.0/)
* [Expo Metro configuration](https://docs.expo.dev/versions/v54.0.0/config/metro/)
* [Uniwind documentation](https://docs.uniwind.dev/)
* [Tailwind CSS documentation](https://tailwindcss.com/docs)
* [HeroUI React documentation](https://heroui.com/docs/react/getting-started)
* [HeroUI Native documentation](https://www.heroui.com/docs/native)
