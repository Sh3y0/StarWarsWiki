import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { jsonSchemaTransform } from '@fastify/type-provider-zod';
import type { FastifyInstance } from 'fastify';

export async function registerSwagger(app: FastifyInstance) {
  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Star Wars Databank Sync API',
        description:
          'API to sync and serve information from the official StarWars.com Databank (characters, creatures, droids, locations, species, vehicles).',
        version: '0.1.0',
      },
      tags: [
        { name: 'databank', description: 'StarWars.com Databank endpoints' },
        { name: 'swapi', description: 'SWAPI (swapi.dev) endpoints, enriched with Databank data' },
      ],
    },
    transform: jsonSchemaTransform,
  });

  await app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
  });
}
