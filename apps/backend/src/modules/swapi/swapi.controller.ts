import type { FastifyReply, FastifyRequest } from 'fastify';
import type { z } from 'zod';
import {
  getCharacterById,
  getCharacters,
  getFilmById,
  getFilms,
  getPlanetById,
  getPlanets,
  getStarshipById,
  getStarships,
  getVehicleById,
  getVehicles,
} from './swapi.service';
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

export async function getVehiclesHandler(
  request: FastifyRequest<{ Querystring: SwapiListQuery }>,
  reply: FastifyReply,
) {
  try {
    const result = await getVehicles(request.query);
    return reply.send(result);
  } catch (error) {
    request.log.error(error, 'Failed to fetch vehicles from SWAPI');
    return reply.status(502).send({
      error: 'SWAPI_FETCH_FAILED',
      message: error instanceof Error ? error.message : 'Unknown error fetching from SWAPI',
    });
  }
}

export async function getVehicleByIdHandler(
  request: FastifyRequest<{ Params: NumericIdParam }>,
  reply: FastifyReply,
) {
  const { id } = request.params;

  try {
    const vehicle = await getVehicleById(id);

    if (!vehicle) {
      return reply.status(404).send({
        error: 'VEHICLE_NOT_FOUND',
        message: `No vehicle found in SWAPI for id "${id}"`,
      });
    }

    return reply.send(vehicle);
  } catch (error) {
    request.log.error(error, `Failed to fetch vehicle "${id}" from SWAPI`);
    return reply.status(502).send({
      error: 'SWAPI_FETCH_FAILED',
      message: error instanceof Error ? error.message : 'Unknown error fetching from SWAPI',
    });
  }
}

export async function getPlanetsHandler(
  request: FastifyRequest<{ Querystring: SwapiListQuery }>,
  reply: FastifyReply,
) {
  try {
    const result = await getPlanets(request.query);
    return reply.send(result);
  } catch (error) {
    request.log.error(error, 'Failed to fetch planets from SWAPI');
    return reply.status(502).send({
      error: 'SWAPI_FETCH_FAILED',
      message: error instanceof Error ? error.message : 'Unknown error fetching from SWAPI',
    });
  }
}

export async function getPlanetByIdHandler(
  request: FastifyRequest<{ Params: NumericIdParam }>,
  reply: FastifyReply,
) {
  const { id } = request.params;

  try {
    const planet = await getPlanetById(id);

    if (!planet) {
      return reply.status(404).send({
        error: 'PLANET_NOT_FOUND',
        message: `No planet found in SWAPI for id "${id}"`,
      });
    }

    return reply.send(planet);
  } catch (error) {
    request.log.error(error, `Failed to fetch planet "${id}" from SWAPI`);
    return reply.status(502).send({
      error: 'SWAPI_FETCH_FAILED',
      message: error instanceof Error ? error.message : 'Unknown error fetching from SWAPI',
    });
  }
}

export async function getFilmsHandler(
  request: FastifyRequest<{ Querystring: SwapiListQuery }>,
  reply: FastifyReply,
) {
  try {
    const result = await getFilms(request.query);
    return reply.send(result);
  } catch (error) {
    request.log.error(error, 'Failed to fetch films from SWAPI');
    return reply.status(502).send({
      error: 'SWAPI_FETCH_FAILED',
      message: error instanceof Error ? error.message : 'Unknown error fetching from SWAPI',
    });
  }
}

export async function getFilmByIdHandler(
  request: FastifyRequest<{ Params: NumericIdParam }>,
  reply: FastifyReply,
) {
  const { id } = request.params;

  try {
    const film = await getFilmById(id);

    if (!film) {
      return reply.status(404).send({
        error: 'FILM_NOT_FOUND',
        message: `No film found in SWAPI for id "${id}"`,
      });
    }

    return reply.send(film);
  } catch (error) {
    request.log.error(error, `Failed to fetch film "${id}" from SWAPI`);
    return reply.status(502).send({
      error: 'SWAPI_FETCH_FAILED',
      message: error instanceof Error ? error.message : 'Unknown error fetching from SWAPI',
    });
  }
}
