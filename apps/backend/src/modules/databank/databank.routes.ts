import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from '@fastify/type-provider-zod';
import { getItemsHandler, syncCategoryHandler } from './databank.controller';
import {
  categoryParamSchema,
  errorResponseSchema,
  getItemsQuerySchema,
  getItemsResponseSchema,
  syncResponseSchema,
} from './databank.schemas';

export async function databankRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  app.get(
    '/api/:category',
    {
      schema: {
        tags: ['databank'],
        summary: 'Get stored items for a Databank category',
        description:
          'Returns the current content of the on-disk JSON file for the given category. Supports title search, pagination, and slug lookup.',
        params: categoryParamSchema,
        querystring: getItemsQuerySchema,
        response: {
          200: getItemsResponseSchema,
        },
      },
    },
    getItemsHandler,
  );

  app.post(
    '/api/:category/sync',
    {
      schema: {
        tags: ['databank'],
        summary: 'Sync a category against StarWars.com',
        description:
          'Triggers a full sync against the official StarWars.com Databank for the given category, overwrites the on-disk JSON file, and returns a summary.',
        params: categoryParamSchema,
        response: {
          200: syncResponseSchema,
          502: errorResponseSchema,
        },
      },
    },
    syncCategoryHandler,
  );
}
