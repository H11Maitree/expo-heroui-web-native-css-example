# Platform CSS Isolation

The project uses one Metro process but two platform-specific CSS pipelines.

## Native

- `native.css` is the fixed Uniwind entry in `metro.config.js`.
- Uniwind compiles Tailwind classes and `heroui-native/styles` into native
  React Native styles.
- `@source "../node_modules/heroui-native/lib"` includes classes used inside
  HeroUI Native.

## Web

- `web.css` is imported only by `PlatformSpecificProvider.web.tsx`.
- Expo processes it through PostCSS and Tailwind CSS v4 at build time.
- It imports `@heroui/styles`; the browser receives the compiled CSS.

## Why It Works

Metro resolves `.web.tsx` for web and `.tsx` for native. Shared route files do
not import either HeroUI package directly, so each platform reaches only its
own components, provider, and stylesheet.

- Web: `@heroui/react` + `web.css`
- Native: `heroui-native` + `native.css`

Keep platform modules outside `app/`. Expo Router treats files there as routes,
which can make otherwise unused platform files enter the route graph and pull
the wrong stylesheet into a build.
