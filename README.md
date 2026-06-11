# Expo HeroUI Web and Native Example

Use HeroUI React on web and HeroUI Native on iOS and Android from one Expo SDK
54 project without allowing their CSS setup pipelines to conflict.

![HeroUI menu rendered from one Expo project on an iOS simulator using HeroUI Native and in a web browser using HeroUI React](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/fb8g2qyrztx3gfqz3713.png)

Read the implementation guide:
[One Expo Project, Two HeroUI CSS Pipelines: Avoiding Web and Native Style Conflicts](https://dev.to/h11maitree/one-expo-project-two-heroui-css-pipelines-avoiding-web-and-native-style-conflicts-5d8)

## The Problem

Importing both HeroUI style systems from one global stylesheet sends them
through the same setup path:

```css
@import "tailwindcss";
@import "uniwind";
@import "heroui-native/styles";
@import "@heroui/styles";
```

Their rules and theme concepts can overlap, making CSS import order determine
which platform looks correct.

This project isolates them into two dependency graphs:

- Native: `heroui-native`, Uniwind, and `styles/native.css`
- Web: `@heroui/react`, PostCSS, and `styles/web.css`

## Run

```bash
npm install
npm start
```

Or start a platform directly:

```bash
npm run ios
npm run android
npm run web
```

## Project Structure

```text
app/
  _layout.tsx
  index.tsx

components/
  MenuExample.tsx
  MenuExample.web.tsx
  PlatformSpecificProvider.tsx
  PlatformSpecificProvider.web.tsx
  Screen.tsx
  Screen.web.tsx

styles/
  native.css
  web.css
```

Metro resolves `.web.tsx` on web and `.tsx` on native. Each platform-specific
provider imports only its own stylesheet, preventing the other HeroUI setup
from entering its bundle.

Keep platform setup modules outside `app/`, where Expo Router would treat them
as part of the route tree.

See [styles/README.md](styles/README.md) for the CSS configuration details.

## Verify

```bash
npm run lint
npx tsc --noEmit
npx expo export --platform web
npx expo export --platform android
npx expo-doctor
```
