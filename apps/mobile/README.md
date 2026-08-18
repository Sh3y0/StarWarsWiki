# Star Wars Explorer (mobile)

Expo + React Native + TypeScript app that browses the Star Wars catalog served by [`apps/backend`](../backend/README.md): Characters, Films, Starships, Vehicles, Planets.

Part of the `StarWarsWiki` monorepo (`apps/mobile`).

## Stack

- Expo SDK 57 / React Native 0.86 / React 19, TypeScript strict
- Expo Router (file-based routing, bottom tabs + nested stacks)
- styled-components for styling
- TanStack Query for data fetching/caching
- expo-image for remote images
- Zod for validating API responses
- Jest + `@testing-library/react-native` for tests

## Setup

From the monorepo root:

```bash
npm install
```

Configure the API URL:

```bash
cp apps/mobile/.env.example apps/mobile/.env
```

`EXPO_PUBLIC_API_URL` must point at a running [`apps/backend`](../backend/README.md) instance (`npm run backend:dev` from the repo root, default `http://localhost:3000`).

- **iOS Simulator / web**: `http://localhost:3000` works as-is.
- **Android Emulator**: use `http://10.0.2.2:3000` instead of `localhost`.
- **Physical device**: use your machine's LAN IP (e.g. `http://192.168.1.20:3000`), and make sure the device is on the same network.

## Running the app

From `apps/mobile`:

```bash
npm start        # opens Expo Dev Tools / QR code
npm run ios      # iOS Simulator
npm run android  # Android Emulator
npm run web      # web
```

Only the **Characters** tab is wired to real data for now (`GET /api/characters` on the backend); the other 5 tabs and all detail screens are placeholders, to be built out screen-by-screen against the Stitch designs.

## Project structure

```
/app                    # Expo Router routes
  _layout.tsx            # root layout: QueryClientProvider, styled-components ThemeProvider
  /(tabs)                # bottom tab navigator
  /characters/[slug].tsx  # detail routes (one per category)
  ...
/src
  /api                    # HTTP client, typed endpoints, Zod schemas
  /components/ui          # generic UI components (Card, SearchBar, PlaceholderScreen)
  /components/category    # catalog-specific components (CategoryGrid)
  /hooks                  # TanStack Query hooks
  /theme                  # colors, typography, styled-components theme typing
  /types                  # shared TS types
/assets/images            # app icon, adaptive icon, splash image
/tests                    # unit tests (mirrors /src)
```

## Scripts

| Script                            | Description                  |
| --------------------------------- | ---------------------------- |
| `npm start`                       | Start the Expo dev server    |
| `npm run ios` / `android` / `web` | Start on a specific platform |
| `npm test`                        | Run the Jest test suite      |
| `npm run test:watch`              | Jest in watch mode           |
| `npm run lint`                    | ESLint                       |
| `npm run format`                  | Prettier (write)             |
| `npm run typecheck`               | `tsc --noEmit`               |

## Tests

```bash
npm test
```

Includes a unit test for a UI component (`PlaceholderScreen`) and for the `useCategoryList` hook (mocking the API layer).
