import type { FastifyReply, FastifyRequest } from 'fastify';
import type { z } from 'zod';
import { getCharacterById, getCharacters, getStarshipById, getStarships } from './swapi.service';
import type { numericIdParamSchema, swapiListQuerySchema } from './swapi.schemas';

type SwapiListQuery = z.infer<typeof swapiListQuerySchema>;
type NumericIdParam = z.infer<typeof numericIdParamSchema>;

export async function getCharactersHandler(
  request: FastifyRequest<{ Querystring: SwapiListQuery }>,
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
  request: FastifyRequest<{ Params: NumericIdParam }>,
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

export async function getStarshipsHandler(
  request: FastifyRequest<{ Querystring: SwapiListQuery }>,
  reply: FastifyReply,
) {
  try {
    const result = await getStarships(request.query);
    return reply.send(result);
  } catch (error) {
    request.log.error(error, 'Failed to fetch starships from SWAPI');
    return reply.status(502).send({
      error: 'SWAPI_FETCH_FAILED',
      message: error instanceof Error ? error.message : 'Unknown error fetching from SWAPI',
    });
  }
}

export async function getStarshipByIdHandler(
  request: FastifyRequest<{ Params: NumericIdParam }>,
  reply: FastifyReply,
) {
  const { id } = request.params;

  try {
    const starship = await getStarshipById(id);

    if (!starship) {
      return reply.status(404).send({
        error: 'STARSHIP_NOT_FOUND',
        message: `No starship found in SWAPI for id "${id}"`,
      });
    }

    return reply.send(starship);
  } catch (error) {
    request.log.error(error, `Failed to fetch starship "${id}" from SWAPI`);
    return reply.status(502).send({
      error: 'SWAPI_FETCH_FAILED',
      message: error instanceof Error ? error.message : 'Unknown error fetching from SWAPI',
    });
  }
}
