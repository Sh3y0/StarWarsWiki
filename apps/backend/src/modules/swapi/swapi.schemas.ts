import { z } from 'zod';
import { databankItemSchema } from '../databank/databank.schemas';

export const getCharactersQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  search: z.string().optional(),
});

export const characterIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'id must be numeric'),
});

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
