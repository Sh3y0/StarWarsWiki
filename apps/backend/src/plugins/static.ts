import path from 'node:path';
import fastifyStatic from '@fastify/static';
import type { FastifyInstance } from 'fastify';

export async function registerStatic(app: FastifyInstance) {
  await app.register(fastifyStatic, {
    root: path.resolve(__dirname, '../../public'),
    prefix: '/static/',
  });
}
