import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from '@fastify/type-provider-zod';
import { errorResponseSchema } from '../databank/databank.schemas';
import {
  getCharacterByIdHandler,
  getCharactersHandler,
  getPlanetByIdHandler,
  getPlanetsHandler,
  getStarshipByIdHandler,
  getStarshipsHandler,
  getVehicleByIdHandler,
  getVehiclesHandler,
} from './swapi.controller';
import {
  characterIdParamSchema,
  getCharacterResponseSchema,
  getCharactersQuerySchema,
  getCharactersResponseSchema,
  getPlanetResponseSchema,
  getPlanetsQuerySchema,
  getPlanetsResponseSchema,
  getStarshipResponseSchema,
  getStarshipsQuerySchema,
  getStarshipsResponseSchema,
  getVehicleResponseSchema,
  getVehiclesQuerySchema,
  getVehiclesResponseSchema,
  planetIdParamSchema,
  starshipIdParamSchema,
  vehicleIdParamSchema,
} from './swapi.schemas';

export async function swapiRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  app.get(
    '/api/swapi/people',
    {
      schema: {
        tags: ['swapi'],
        summary: 'Get characters from SWAPI, enriched with Databank data',
        description:
          'Proxies the SWAPI /people endpoint and enriches each result with the matching Databank character from characters.json. Use ?page= to paginate the full list, or ?search= to search globally across all of SWAPI (search ignores ?page=, since the search itself is global). Each result exposes character_id (the numeric id from the SWAPI url) instead of the raw url. The starships and vehicles arrays are likewise reduced to numeric ids (for use with GET /api/swapi/starships/:id and GET /api/swapi/vehicles/:id), and homeworld is reduced to a numeric id (for use with GET /api/swapi/planets/:id).',
        querystring: getCharactersQuerySchema,
        response: {
          200: getCharactersResponseSchema,
          502: errorResponseSchema,
        },
      },
    },
    getCharactersHandler,
  );

  app.get(
    '/api/swapi/people/:id',
    {
      schema: {
        tags: ['swapi'],
        summary: 'Get a single character from SWAPI by id, enriched with Databank data',
        description:
          'Fetches a single person from SWAPI (https://swapi.dev/api/people/{id}/) using the numeric character_id returned by GET /api/swapi/people, and enriches it with the matching Databank character.',
        params: characterIdParamSchema,
        response: {
          200: getCharacterResponseSchema,
          404: errorResponseSchema,
          502: errorResponseSchema,
        },
      },
    },
    getCharacterByIdHandler,
  );

  app.get(
    '/api/swapi/starships',
    {
      schema: {
        tags: ['swapi'],
        summary: 'Get starships from SWAPI, enriched with Databank data',
        description:
          'Proxies the SWAPI /starships endpoint and enriches each result with the matching Databank item from vehicles.json. Matching tries the SWAPI name first, falling back to model when the name has no confident match (e.g. "Rebel transport" -> "GR-75 Medium Transport"), handling naming drift via exact/substring/token-overlap matching and returning null when no tier is confident enough. Use ?page= to paginate the full list, or ?search= to search globally across all of SWAPI (search ignores ?page=). Each result exposes starship_id instead of the raw url, and pilots as an array of numeric character ids (for use with GET /api/swapi/people/:id) instead of urls.',
        querystring: getStarshipsQuerySchema,
        response: {
          200: getStarshipsResponseSchema,
          502: errorResponseSchema,
        },
      },
    },
    getStarshipsHandler,
  );

  app.get(
    '/api/swapi/starships/:id',
    {
      schema: {
        tags: ['swapi'],
        summary: 'Get a single starship from SWAPI by id, enriched with Databank data',
        description:
          'Fetches a single starship from SWAPI (https://swapi.dev/api/starships/{id}/) using the numeric starship_id returned by GET /api/swapi/starships, and enriches it with the matching Databank item.',
        params: starshipIdParamSchema,
        response: {
          200: getStarshipResponseSchema,
          404: errorResponseSchema,
          502: errorResponseSchema,
        },
      },
    },
    getStarshipByIdHandler,
  );

  app.get(
    '/api/swapi/vehicles',
    {
      schema: {
        tags: ['swapi'],
        summary: 'Get vehicles from SWAPI, enriched with Databank data',
        description:
          'Proxies the SWAPI /vehicles endpoint and enriches each result with the matching Databank item from vehicles.json, using the same name-then-model matching as GET /api/swapi/starships. Use ?page= to paginate the full list, or ?search= to search globally across all of SWAPI (search ignores ?page=). Each result exposes vehicle_id instead of the raw url, and pilots as an array of numeric character ids instead of urls.',
        querystring: getVehiclesQuerySchema,
        response: {
          200: getVehiclesResponseSchema,
          502: errorResponseSchema,
        },
      },
    },
    getVehiclesHandler,
  );

  app.get(
    '/api/swapi/vehicles/:id',
    {
      schema: {
        tags: ['swapi'],
        summary: 'Get a single vehicle from SWAPI by id, enriched with Databank data',
        description:
          'Fetches a single vehicle from SWAPI (https://swapi.dev/api/vehicles/{id}/) using the numeric vehicle_id returned by GET /api/swapi/vehicles, and enriches it with the matching Databank item.',
        params: vehicleIdParamSchema,
        response: {
          200: getVehicleResponseSchema,
          404: errorResponseSchema,
          502: errorResponseSchema,
        },
      },
    },
    getVehicleByIdHandler,
  );

  app.get(
    '/api/swapi/planets',
    {
      schema: {
        tags: ['swapi'],
        summary: 'Get planets from SWAPI, enriched with Databank data',
        description:
          'Proxies the SWAPI /planets endpoint and enriches each result with the matching Databank item from locations.json, matched by name (handles naming drift such as "Yavin IV" vs "Yavin 4"). Use ?page= to paginate the full list, or ?search= to search globally across all of SWAPI (search ignores ?page=). Each result exposes planet_id instead of the raw url, and residents as an array of numeric character ids (for use with GET /api/swapi/people/:id) instead of urls.',
        querystring: getPlanetsQuerySchema,
        response: {
          200: getPlanetsResponseSchema,
          502: errorResponseSchema,
        },
      },
    },
    getPlanetsHandler,
  );

  app.get(
    '/api/swapi/planets/:id',
    {
      schema: {
        tags: ['swapi'],
        summary: 'Get a single planet from SWAPI by id, enriched with Databank data',
        description:
          'Fetches a single planet from SWAPI (https://swapi.dev/api/planets/{id}/) using the numeric planet_id returned by GET /api/swapi/planets (or the homeworld id from GET /api/swapi/people), and enriches it with the matching Databank item.',
        params: planetIdParamSchema,
        response: {
          200: getPlanetResponseSchema,
          404: errorResponseSchema,
          502: errorResponseSchema,
        },
      },
    },
    getPlanetByIdHandler,
  );
}
