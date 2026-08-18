import Fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from '@fastify/type-provider-zod';
import { env } from './config/env';
import { registerStatic } from './plugins/static';
import { registerSwagger } from './plugins/swagger';
import { databankRoutes } from './modules/databank/databank.routes';
import { swapiRoutes } from './modules/swapi/swapi.routes';

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: env.LOG_LEVEL,
      transport: {
        target: 'pino-pretty',
        options: { translateTime: 'HH:MM:ss', ignore: 'pid,hostname' },
      },
    },
  }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await registerSwagger(app);
  await registerStatic(app);
  await app.register(databankRoutes);
  await app.register(swapiRoutes);

  app.get('/health', async () => ({ status: 'ok' }));

  return app;
}
