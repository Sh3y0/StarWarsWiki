import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from '@fastify/type-provider-zod';
import { errorResponseSchema } from '../databank/databank.schemas';
import { getCharacterByIdHandler, getCharactersHandler } from './swapi.controller';
import {
  characterIdParamSchema,
  getCharacterResponseSchema,
  getCharactersQuerySchema,
  getCharactersResponseSchema,
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
          'Proxies the SWAPI /people endpoint and enriches each result with the matching Databank character, joined by checking whether person.name (lowercased) is contained in the stored characters.json title (lowercased). Use ?page= to paginate the full list, or ?search= to search globally across all of SWAPI (search ignores ?page=, since the search itself is global). Each result exposes character_id (the numeric id from the SWAPI url) instead of the raw url, for use with GET /api/swapi/people/:id.',
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
}
