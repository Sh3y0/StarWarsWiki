import fastifyCors from '@fastify/cors';
import type { FastifyInstance } from 'fastify';

// This is an MVP-stage API consumed only by our own mobile/web clients, none of which are
// deployed yet — allow any origin for now rather than hardcoding dev ports that will change
// once those apps have real hosting.
export async function registerCors(app: FastifyInstance) {
  await app.register(fastifyCors, {
    origin: true,
  });
}
