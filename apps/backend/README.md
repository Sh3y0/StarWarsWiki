# Star Wars Databank Sync API

Node.js + TypeScript + Fastify backend that syncs and serves information from the official StarWars.com Databank for 6 categories: `characters`, `creatures`, `droids`, `locations`, `species`, `vehicles`.

Part of the `StarWarsWiki` monorepo (`apps/backend`), alongside the upcoming `apps/mobile` and `apps/web` apps.

## Setup

From the monorepo root:

```bash
npm install
```

Configure the backend environment variables:

```bash
cp apps/backend/.env.example apps/backend/.env
```

## Running the project

```bash
npm run backend:dev
```

Or directly inside `apps/backend`:

```bash
npm run dev
```

The server starts on `http://localhost:3000` by default. Swagger UI is available at `http://localhost:3000/docs`.

Other scripts (run inside `apps/backend`):

| Script               | Description                       |
| -------------------- | --------------------------------- |
| `npm run dev`        | Hot-reload dev server (tsx watch) |
| `npm run build`      | Compiles TypeScript to `dist/`    |
| `npm start`          | Runs the compiled build           |
| `npm test`           | Runs the Jest test suite          |
| `npm run test:watch` | Jest in watch mode                |
| `npm run lint`       | ESLint                            |
| `npm run format`     | Prettier (write)                  |

## Endpoints

For each category (`characters`, `creatures`, `droids`, `locations`, `species`, `vehicles`):

- **`GET /api/{category}`** — returns the content currently stored in `data/{category}.json`.
  - `?search=` — case-insensitive title search
  - `?limit=` / `?offset=` — pagination over the stored data
  - `?slug=` — fetch a single item by slug
- **`POST /api/{category}/sync`** — syncs against StarWars.com, overwrites `data/{category}.json`, and returns `{ category, totalFetched, updatedAt, filePath }`.

### SWAPI

- **`GET /api/swapi/people`** — proxies [SWAPI](https://swapi.dev/api/people)'s people list.
  - `?page=` — paginate the full list (defaults to page 1).
  - `?search=` — search globally across all of SWAPI; `?page=` is ignored when searching, since the search itself isn't paginated by us.
  - Each result is enriched with the matching Databank `characters` item — joined by checking whether `person.name` (lowercased) is contained in the stored `characters.json` `title` (lowercased) — under a `databank` field, or `null` when no match is found.
  - The raw SWAPI `url` field is replaced with `character_id`, the numeric id parsed from that url (e.g. `"https://swapi.dev/api/people/4/"` → `"4"`), for use with the detail endpoint below.
  - The `starships`, `vehicles`, and `films` arrays (SWAPI urls, e.g. `["https://swapi.dev/api/starships/12/", ...]`) are each replaced with just the numeric ids (`["12", ...]`), for use with `GET /api/swapi/starships/:id`, `GET /api/swapi/vehicles/:id`, and `GET /api/swapi/films/:id` respectively.
  - `homeworld` (a single SWAPI url) is likewise reduced to just its numeric id, for use with `GET /api/swapi/planets/:id`. `species` is left as-is — there's no `/api/swapi/species` endpoint.
- **`GET /api/swapi/people/:id`** — fetches a single person from SWAPI by `character_id` (e.g. `/api/swapi/people/4`) and enriches it the same way. Returns `404` if SWAPI has no person with that id.
- **`GET /api/swapi/starships`** / **`GET /api/swapi/starships/:id`** — same shape as the people endpoints above (`?page=`, `?search=`, `starship_id` instead of `url`), but proxying [SWAPI's starships](https://swapi.dev/api/starships) and enriching against the Databank `vehicles` category.
- **`GET /api/swapi/vehicles`** / **`GET /api/swapi/vehicles/:id`** — same shape again (`vehicle_id` instead of `url`), proxying [SWAPI's vehicles](https://swapi.dev/api/vehicles) and enriching against the same Databank `vehicles` category (`data/vehicles.json` holds both starships and ground/land vehicles).
  - For both starships and vehicles: SWAPI's `name` and the Databank `title` drift more than character names do (e.g. `"Calamari Cruiser"` vs `"Mon Calamari Star Cruiser"`, `"EF76 Nebulon-B escort frigate"` vs `"Nebulon-B Frigate"`, `"Sand Crawler"` vs `"Sandcrawler"`). Matching (`src/modules/swapi/swapi.matching.ts`) handles this with tiers, most confident first: exact match (including when only whitespace differs, e.g. the Sandcrawler case, or a roman numeral vs digit, e.g. `"Yavin IV"` vs `"Yavin 4"`), one string fully containing the other, and token-overlap (all significant words of the shorter name/title found in the other). It returns `null` rather than guessing when no tier is confident enough (e.g. `"CR90 corvette"`, `"Droid control ship"` have no reliable match in the current data).
  - When `name` doesn't resolve to anything, matching is retried against SWAPI's `model` field — this is what resolves `"Rebel transport"` (name) to `"GR-75 Medium Transport"` (Databank title), since the Databank entry is keyed off the model (`"GR-75 medium transport"`) rather than the in-universe nickname.
  - The `pilots` and `films` arrays (SWAPI urls) are replaced with just the numeric character/film ids, for use with `GET /api/swapi/people/:id` and `GET /api/swapi/films/:id`.
- **`GET /api/swapi/planets`** / **`GET /api/swapi/planets/:id`** — same shape again (`planet_id` instead of `url`), proxying [SWAPI's planets](https://swapi.dev/api/planets) and enriching against the Databank `locations` category (`data/locations.json`), matched by `name` (no `model` fallback, since planets don't have one).
  - The `residents` and `films` arrays (SWAPI urls) are replaced with just the numeric character/film ids, for use with `GET /api/swapi/people/:id` and `GET /api/swapi/films/:id`.
- **`GET /api/swapi/films`** / **`GET /api/swapi/films/:id`** — proxies [SWAPI's films](https://swapi.dev/api/films). There's no Databank category for films, so there's no `databank` field here — instead each result gets an `image` field: a locally-hosted poster path (e.g. `"/static/films/4.jpg"`, served by `@fastify/static` from `apps/backend/public/films/`), keyed by SWAPI's `episode_id` (not its `id`/url position — SWAPI's own film `id` follows release order, while the poster files are named by episode number), or `null` if no poster is mapped for that episode.
  - The `characters`, `planets`, `starships`, and `vehicles` arrays (SWAPI urls) are each replaced with just the numeric ids, for use with the corresponding detail endpoints. `species` is intentionally left untouched, since there's no `/api/swapi/species` endpoint. The raw SWAPI `url` is replaced with `film_id`.
  - `?page=` and `?search=` behave the same as the other SWAPI endpoints (only 6 films exist in total, so pagination rarely matters in practice).

## Running a sync from Swagger

1. Start the server (`npm run backend:dev`).
2. Open `http://localhost:3000/docs`.
3. Find `POST /api/{category}/sync`, click **Try it out**.
4. Replace `{category}` with one of the 6 valid categories and execute.
5. The response returns the sync summary; `data/{category}.json` is updated on disk.

If StarWars.com rejects the request (404 / HTML instead of JSON), the endpoint responds with `502` and an explicit error message. Internally, the request is retried a couple of times before failing.

## Storage

There's no database in this MVP: data is stored as flat JSON in `apps/backend/data/` (one file per category). Moving to SQLite/Postgres will be evaluated later.

Static assets (currently just the 6 film poster images) live in `apps/backend/public/` and are served as-is by `@fastify/static` under `/static/`.

## Tests

```bash
npm test
```

Includes unit tests for the scraper (mocking `fetch`) and the service (mocking the filesystem), plus integration tests for the routes using `fastify.inject()`.
