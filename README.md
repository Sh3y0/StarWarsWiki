# StarWarsWiki

Star Wars Characters Gallery and More.

An npm-workspaces monorepo with a backend API and a mobile app (a web app is planned next):

| App | Path | Stack | Status |
|---|---|---|---|
| **Backend** | [`apps/backend`](apps/backend/README.md) | Node.js + TypeScript + Fastify | Complete — Databank sync + full SWAPI proxy/enrichment |
| **Mobile** | [`apps/mobile`](apps/mobile/README.md) | Expo + React Native + TypeScript | Initial setup done — only the Characters tab is wired to real data so far |
| **Web** | `apps/web` | TBD | Not started |

## Quickstart

```bash
npm install
```

Run the backend (needed by the mobile app):

```bash
npm run backend:dev
```

In a second terminal, run the mobile app:

```bash
cp apps/mobile/.env.example apps/mobile/.env
npm run mobile:start   # then press i / a / w for iOS / Android / web
```

See each app's own README for full details — env vars, all scripts, and (for the backend) the complete endpoint reference.

## What each app does

### `apps/backend` — Star Wars Databank Sync API

Node.js + TypeScript + Fastify API with two data sources:

- **Databank sync**: `GET /api/{category}` / `POST /api/{category}/sync` for 6 StarWars.com Databank categories (`characters`, `creatures`, `droids`, `locations`, `species`, `vehicles`), stored as flat JSON in `apps/backend/data/`. No database in this MVP.
- **SWAPI proxy + enrichment**: `GET /api/swapi/{people,starships,vehicles,planets,films}` (list + `/:id` detail), each proxying [swapi.dev](https://swapi.dev/api) with pagination and global search, and enriching results against the matching Databank category where one exists. Cross-reference arrays (`films`, `starships`, `vehicles`, `pilots`, `residents`, `homeworld`, `characters`, `planets`) are reduced from SWAPI urls to plain numeric ids, so every resource can be looked up via its own detail endpoint. Films additionally get a locally-hosted poster `image` (served via `@fastify/static` from `apps/backend/public/films/`), since SWAPI has none.
- Matching SWAPI names against Databank titles handles real-world naming drift (exact match, substring, roman-numeral-vs-digit, whitespace differences, token overlap, and a `model`-field fallback for vehicles/starships) — see `src/modules/swapi/swapi.matching.ts` and the [backend README](apps/backend/README.md#endpoints) for the full breakdown and examples.
- Swagger UI at `/docs`, including a runnable `sync` action.
- `@fastify/cors` is enabled with `origin: true` (open) — this is an MVP-only API with no deployed clients yet.

→ Full endpoint reference, matching-algorithm details, and setup: [`apps/backend/README.md`](apps/backend/README.md)

### `apps/mobile` — Star Wars Explorer

Expo + React Native + TypeScript app consuming the backend above. Expo Router with a bottom-tab navigator for 5 categories (Characters, Films, Starships, Vehicles, Planets), styled-components for styling, TanStack Query for data fetching, Zod for validating API responses, expo-image for remote images.

This is the **initial setup only**: only the Characters tab does a real fetch (`GET /api/characters`) and has a working detail screen; the other 4 tabs and their detail routes are placeholders, to be built out screen-by-screen against the upcoming Stitch designs.

→ Full stack, project structure, and env var notes (including Android emulator / physical device host quirks): [`apps/mobile/README.md`](apps/mobile/README.md)

## Monorepo notes

- **npm workspaces** (`apps/*`). Run workspace scripts from the root via `npm run <script> --workspace=apps/<name>`, or use the root convenience scripts below.
- **Pinned React version**: the root `package.json` has an `overrides` block pinning `react`, `react-dom`, and `react-test-renderer` to `19.2.3` (the exact version Expo SDK 57 expects). Without this, npm's peer resolution installs a second, newer React copy for transitive dependencies (`@tanstack/react-query`, `expo-router`, `@testing-library/react-native`, …), which silently breaks React Native testing (`@testing-library/react-native`'s internal renderer ends up on a different React instance than the app code). If you bump Expo's SDK, bump this override to match.
- **Husky + lint-staged** run ESLint/Prettier on staged `.ts`/`.tsx` files per-workspace on commit (`.husky/pre-commit`).

## Root scripts

| Script | Description |
|---|---|
| `npm run backend:dev` | Start the backend dev server (`apps/backend`) |
| `npm run backend:build` | Compile the backend |
| `npm run backend:test` | Run backend tests |
| `npm run mobile:start` | Start the Expo dev server (`apps/mobile`) |
| `npm run mobile:ios` / `mobile:android` / `mobile:web` | Start the mobile app on a specific platform |
| `npm run mobile:test` | Run mobile tests |

## Tests

```bash
npm run backend:test
npm run mobile:test
```

Backend: unit tests for the Databank scraper/service and the SWAPI matching/enrichment logic (mocking `fetch`/filesystem), plus integration tests for every route via `fastify.inject()`.

Mobile: a unit test for a UI component and one for the `useCategoryList` hook (mocking the API layer), using Jest + `@testing-library/react-native`.
