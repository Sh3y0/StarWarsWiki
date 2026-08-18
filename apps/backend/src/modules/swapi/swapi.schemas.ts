import { z } from 'zod';
import { databankItemSchema } from '../databank/databank.schemas';

export const swapiListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  search: z.string().optional(),
});

export const getCharactersQuerySchema = swapiListQuerySchema;
export const getStarshipsQuerySchema = swapiListQuerySchema;
export const getVehiclesQuerySchema = swapiListQuerySchema;
export const getPlanetsQuerySchema = swapiListQuerySchema;

export const numericIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'id must be numeric'),
});

export const characterIdParamSchema = numericIdParamSchema;
export const starshipIdParamSchema = numericIdParamSchema;
export const vehicleIdParamSchema = numericIdParamSchema;
export const planetIdParamSchema = numericIdParamSchema;

export const enrichedCharacterSchema = z
  .object({
    character_id: z.string(),
    name: z.string(),
    height: z.string(),
    mass: z.string(),
    hair_color: z.string(),
    skin_color: z.string(),
    eye_color: z.string(),
    birth_year: z.string(),
    gender: z.string(),
    homeworld: z.string(),
    films: z.array(z.string()),
    species: z.array(z.string()),
    vehicles: z.array(z.string()),
    starships: z.array(z.string()),
    created: z.string(),
    edited: z.string(),
    databank: databankItemSchema.nullable(),
  })
  .passthrough();

export const getCharactersResponseSchema = z.object({
  count: z.number(),
  currentPage: z.number().nullable(),
  nextPage: z.number().nullable(),
  previousPage: z.number().nullable(),
  results: z.array(enrichedCharacterSchema),
});

export const getCharacterResponseSchema = enrichedCharacterSchema;

export const enrichedStarshipSchema = z
  .object({
    starship_id: z.string(),
    name: z.string(),
    model: z.string(),
    manufacturer: z.string(),
    cost_in_credits: z.string(),
    length: z.string(),
    max_atmosphering_speed: z.string(),
    crew: z.string(),
    passengers: z.string(),
    cargo_capacity: z.string(),
    consumables: z.string(),
    hyperdrive_rating: z.string(),
    MGLT: z.string(),
    starship_class: z.string(),
    pilots: z.array(z.string()),
    films: z.array(z.string()),
    created: z.string(),
    edited: z.string(),
    databank: databankItemSchema.nullable(),
  })
  .passthrough();

export const getStarshipsResponseSchema = z.object({
  count: z.number(),
  currentPage: z.number().nullable(),
  nextPage: z.number().nullable(),
  previousPage: z.number().nullable(),
  results: z.array(enrichedStarshipSchema),
});

export const getStarshipResponseSchema = enrichedStarshipSchema;

export const enrichedVehicleSchema = z
  .object({
    vehicle_id: z.string(),
    name: z.string(),
    model: z.string(),
    manufacturer: z.string(),
    cost_in_credits: z.string(),
    length: z.string(),
    max_atmosphering_speed: z.string(),
    crew: z.string(),
    passengers: z.string(),
    cargo_capacity: z.string(),
    consumables: z.string(),
    vehicle_class: z.string(),
    pilots: z.array(z.string()),
    films: z.array(z.string()),
    created: z.string(),
    edited: z.string(),
    databank: databankItemSchema.nullable(),
  })
  .passthrough();

export const getVehiclesResponseSchema = z.object({
  count: z.number(),
  currentPage: z.number().nullable(),
  nextPage: z.number().nullable(),
  previousPage: z.number().nullable(),
  results: z.array(enrichedVehicleSchema),
});

export const getVehicleResponseSchema = enrichedVehicleSchema;

export const enrichedPlanetSchema = z
  .object({
    planet_id: z.string(),
    name: z.string(),
    rotation_period: z.string(),
    orbital_period: z.string(),
    diameter: z.string(),
    climate: z.string(),
    gravity: z.string(),
    terrain: z.string(),
    surface_water: z.string(),
    population: z.string(),
    residents: z.array(z.string()),
    films: z.array(z.string()),
    created: z.string(),
    edited: z.string(),
    databank: databankItemSchema.nullable(),
  })
  .passthrough();

export const getPlanetsResponseSchema = z.object({
  count: z.number(),
  currentPage: z.number().nullable(),
  nextPage: z.number().nullable(),
  previousPage: z.number().nullable(),
  results: z.array(enrichedPlanetSchema),
});

export const getPlanetResponseSchema = enrichedPlanetSchema;
