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

Each tab (Characters, Films, Starships, Vehicles, Planets) has a searchable list and a detail screen, styled after the Stitch **Star Wars Galactic Archives** designs. Lists and details come from the backend SWAPI proxy (`GET /api/swapi/{people,films,starships,vehicles,planets}`), using Databank images/descriptions where the API enriches them, and local film posters for movies.

## Project structure

```
/app                    # Expo Router routes
  _layout.tsx            # root layout: QueryClientProvider, styled-components ThemeProvider
  /(tabs)                # bottom tab navigator
  /characters/[id].tsx    # detail routes (one per category, SWAPI numeric id)
  ...
/src
  /api                    # HTTP client, typed endpoints, Zod schemas, SWAPI mappers
  /components/ui          # generic UI components (SearchBar, PlaceholderScreen)
  /components/category    # shared list/detail screens, cards, stats, related rows
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

Includes a unit test for a UI component (`PlaceholderScreen`), catalog mappers/format helpers, and the `useCatalogList` hook (mocking the API layer).
