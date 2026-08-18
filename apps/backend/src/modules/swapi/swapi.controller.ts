import type { FastifyReply, FastifyRequest } from 'fastify';
import type { z } from 'zod';
import { getCharacterById, getCharacters } from './swapi.service';
import type { characterIdParamSchema, getCharactersQuerySchema } from './swapi.schemas';

type GetCharactersQuery = z.infer<typeof getCharactersQuerySchema>;
type CharacterIdParam = z.infer<typeof characterIdParamSchema>;

export async function getCharactersHandler(
  request: FastifyRequest<{ Querystring: GetCharactersQuery }>,
  reply: FastifyReply,
) {
  try {
    const result = await getCharacters(request.query);
    return reply.send(result);
  } catch (error) {
    request.log.error(error, 'Failed to fetch characters from SWAPI');
    return reply.status(502).send({
      error: 'SWAPI_FETCH_FAILED',
      message: error instanceof Error ? error.message : 'Unknown error fetching from SWAPI',
    });
  }
}

export async function getCharacterByIdHandler(
  request: FastifyRequest<{ Params: CharacterIdParam }>,
  reply: FastifyReply,
) {
  const { id } = request.params;

  try {
    const character = await getCharacterById(id);

    if (!character) {
      return reply.status(404).send({
        error: 'CHARACTER_NOT_FOUND',
        message: `No character found in SWAPI for id "${id}"`,
      });
    }

    return reply.send(character);
  } catch (error) {
    request.log.error(error, `Failed to fetch character "${id}" from SWAPI`);
    return reply.status(502).send({
      error: 'SWAPI_FETCH_FAILED',
      message: error instanceof Error ? error.message : 'Unknown error fetching from SWAPI',
    });
  }
}
