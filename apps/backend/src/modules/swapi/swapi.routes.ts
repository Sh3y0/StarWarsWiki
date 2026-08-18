import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from '@fastify/type-provider-zod';
import { errorResponseSchema } from '../databank/databank.schemas';
import {
  getCharacterByIdHandler,
  getCharactersHandler,
  getStarshipByIdHandler,
  getStarshipsHandler,
} from './swapi.controller';
import {
  characterIdParamSchema,
  getCharacterResponseSchema,
  getCharactersQuerySchema,
  getCharactersResponseSchema,
  getStarshipResponseSchema,
  getStarshipsQuerySchema,
  getStarshipsResponseSchema,
  starshipIdParamSchema,
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
          'Proxies the SWAPI /people endpoint and enriches each result with the matching Databank character from characters.json. Use ?page= to paginate the full list, or ?search= to search globally across all of SWAPI (search ignores ?page=, since the search itself is global). Each result exposes character_id (the numeric id from the SWAPI url) instead of the raw url, for use with GET /api/swapi/people/:id.',
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
          'Proxies the SWAPI /starships endpoint and enriches each result with the matching Databank item from vehicles.json. Matching handles naming drift between SWAPI\'s name and the Databank title (e.g. "Calamari Cruiser" vs "Mon Calamari Star Cruiser") via exact/substring/token-overlap matching, falling back to null when no confident match is found. Use ?page= to paginate the full list, or ?search= to search globally across all of SWAPI (search ignores ?page=). Each result exposes starship_id instead of the raw url, for use with GET /api/swapi/starships/:id.',
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
}
