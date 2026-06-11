---
title: One Expo Project, Two HeroUI CSS Pipelines: Avoiding Web and Native Style Conflicts
published: true
description: How I isolated HeroUI React and HeroUI Native styles in one Expo SDK 54 project after their setup CSS conflicted in a shared global stylesheet.
tags: expo, reactnative, css, webdev
---

> **AI disclosure:** This article was drafted with AI assistance, then supervised, tested, fact-checked, edited, and approved by a human.

I am building one Expo SDK 54 project that uses:

- `heroui-native` on iOS and Android
- `@heroui/react` on web
- Tailwind CSS and Uniwind on native
- Tailwind CSS and PostCSS on web

Rendering different components with `.web.tsx` files was not the difficult part. The non-obvious problem was CSS.

![HeroUI menu rendered from one Expo project on an iOS simulator using HeroUI Native and in a web browser using HeroUI React](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/fb8g2qyrztx3gfqz3713.png)

You can see the complete working example in the [GitHub repository](https://github.com/H11Maitree/expo-heroui-web-native-css-example).

## The CSS setup that caused the problem

I initially put both HeroUI setups into one global stylesheet:

```css
@import "tailwindcss";
@import "uniwind";
@import "heroui-native/styles";
@import "@heroui/styles";
```

It looked reasonable: one Expo project, one global stylesheet.

However, this made both HeroUI style systems enter the same setup and processing path. Their theme concepts, variables, utilities, and component styles overlap. Import order then affected which rules won.

Moving one import below another could make one platform look correct while breaking the other. The project could still compile, so I did not get a useful error. I saw incorrect colors, variables, spacing, or component styles instead.

Reordering the imports was not a fix. It only changed which stylesheet overrode the other.

The real requirement was:

- native must process `tailwindcss`, `uniwind`, and `heroui-native/styles`
- web must process `tailwindcss` and `@heroui/styles`
- neither platform should process the other platform's HeroUI setup CSS

In other words, I needed two CSS pipelines, not one shared `global.css`.

## The working structure

I moved the styles into separate platform entries:

```text
styles/
  native.css
  web.css

components/
  PlatformSpecificProvider.tsx
  PlatformSpecificProvider.web.tsx
```

Expo and Metro already understand platform-specific modules. The important part here is using that resolution to control which stylesheet enters each platform's dependency graph.

## Native CSS: Uniwind and HeroUI Native

The native entry contains only the native styling setup:

```css
/* styles/native.css */
@import "tailwindcss";
@import "uniwind";

@import "heroui-native/styles";
@source "../node_modules/heroui-native/lib";
```

Uniwind needs a CSS entry in the Metro configuration:

```js
// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const { withUniwindConfig } = require("uniwind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withUniwindConfig(config, {
  cssEntryFile: "./styles/native.css",
});
```

The native provider imports that stylesheet:

```tsx
// components/PlatformSpecificProvider.tsx
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

This module is selected on iOS and Android.

## Web CSS: PostCSS and HeroUI React

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

Metro selects `PlatformSpecificProvider.web.tsx` for web and `PlatformSpecificProvider.tsx` for native. As a result, each platform reaches only its own CSS entry.

That dependency-graph isolation is the important part. Merely creating `native.css` and `web.css` is not enough if a shared module still imports both.

## Keep platform setup files outside `app`

I keep these provider modules under `components/`, not inside Expo Router's `app/` directory.

Files inside `app/` participate in the route tree. Setup modules placed there can be treated as routes or included in routing analysis, which risks pulling an unwanted provider or stylesheet into the build.

The `app/` directory should contain routes and layouts. Platform setup modules should live elsewhere.

## A short note about components

The same boundary is useful for components, but that was not the main CSS fix.

HeroUI Native uses `Menu`, while HeroUI React uses `Dropdown`. I render them through:

```text
components/MenuExample.tsx
components/MenuExample.web.tsx
```

Both accept the same small application-level contract:

```tsx
interface MenuExampleProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}
```

Their internal JSX remains platform-specific.

This does not make both libraries fully interchangeable. Buttons are a good example: their composition, events, accessibility props, and styling can differ. Making buttons interchangeable will require another app-owned adapter such as `AppButton.tsx` and `AppButton.web.tsx`.

The lesson is to share application semantics, not blindly re-export a platform library's complete API.

## Checklist for humans and LLMs

When two platform libraries require different global CSS setups:

1. Do not combine both setup stylesheets in one `global.css`.
2. Do not treat import order as a solution to conflicting rules.
3. Create one CSS entry for each platform pipeline.
4. Import each CSS entry only from its platform-specific module.
5. Keep providers and setup modules outside Expo Router's `app/` directory.
6. Check the complete dependency graph, not only the stylesheet filenames.
7. Build every target platform to verify the isolation.

For an LLM, the key instruction is:

> When web and native packages require different global style processors, isolate their CSS entry points through platform-specific modules. Do not merge the setup imports and attempt to fix the result by reordering CSS.

## Verification

I verified this project with:

```bash
npm run lint
npx tsc --noEmit
npx expo export --platform web
npx expo export --platform android
npx expo-doctor
```

The web export produced the compiled HeroUI browser stylesheet. The Android export bundled the native implementation without including the web HeroUI CSS.

## Conclusion

The bug looked like a CSS ordering problem, but the real problem was architectural: two platform-specific styling systems were sharing one global entry point.

The fix was to give HeroUI Native and HeroUI React separate CSS pipelines and make each pipeline reachable only from its platform-specific provider.

Once the dependency graphs were isolated, CSS order stopped deciding which platform worked.

## References

- [Example repository](https://github.com/H11Maitree/expo-heroui-web-native-css-example)
- [Expo SDK 54 documentation](https://docs.expo.dev/versions/v54.0.0/)
- [Expo Metro configuration](https://docs.expo.dev/versions/v54.0.0/config/metro/)
- [Uniwind documentation](https://docs.uniwind.dev/)
- [HeroUI React documentation](https://heroui.com/docs/react/getting-started)
- [HeroUI Native documentation](https://www.heroui.com/docs/native)

> **Editorial disclosure:** AI assisted with structuring and editing this article. A human supervised the process, implemented and tested the code, checked the technical claims, and approved the final content.
