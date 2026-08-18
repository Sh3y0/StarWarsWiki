import type { FastifyReply, FastifyRequest } from 'fastify';
import { getItems, syncCategory } from './databank.service';
import type { getItemsQuerySchema, categoryParamSchema } from './databank.schemas';
import type { z } from 'zod';

type CategoryParam = z.infer<typeof categoryParamSchema>;
type GetItemsQuery = z.infer<typeof getItemsQuerySchema>;

export async function getItemsHandler(
  request: FastifyRequest<{ Params: CategoryParam; Querystring: GetItemsQuery }>,
  reply: FastifyReply,
) {
  const { category } = request.params;
  const items = await getItems(category, request.query);
  return reply.send(items);
}

export async function syncCategoryHandler(
  request: FastifyRequest<{ Params: CategoryParam }>,
  reply: FastifyReply,
) {
  const { category } = request.params;

  try {
    const result = await syncCategory(category);
    return reply.send(result);
  } catch (error) {
    request.log.error(error, `Sync failed for category "${category}"`);
    return reply.status(502).send({
      error: 'SYNC_FAILED',
      message: error instanceof Error ? error.message : 'Unknown error during sync',
    });
  }
}
