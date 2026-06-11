# Expo HeroUI Platform Example

An Expo SDK 54 example that uses:

- `heroui-native` on iOS and Android
- `@heroui/react` on web
- one Expo project and one Metro process

Platform-specific files keep each HeroUI implementation, provider, and CSS
pipeline out of the other platform's bundle.

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

## How It Works

Shared routes import modules such as `PlatformSpecificProvider` and
`MenuExample`. Metro resolves the `.web.tsx` version for web and the matching
`.tsx` version for native.

Native CSS is compiled by Uniwind. Web CSS is compiled by Expo, PostCSS, and
Tailwind CSS. This prevents `heroui-native` and `@heroui/react` styles from
being processed or bundled together.

See [`styles/README.md`](styles/README.md) for the CSS setup and constraints.
