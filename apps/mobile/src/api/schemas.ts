import { z } from 'zod';

export const databankImageSetSchema = z.object({
  desktop_2x1: z.string().optional(),
  desktop_16x9: z.string().optional(),
  desktop_4x3: z.string().optional(),
  desktop_1x1: z.string().optional(),
});

export const databankItemSchema = z
  .object({
    id: z.string(),
    slug: z.string(),
    title: z.string(),
    description: z.string().optional(),
    short_desc: z.string().optional(),
    dynamic_desc: z.string().optional(),
    type: z.string().optional(),
    images: z
      .object({
        desktop: databankImageSetSchema.optional(),
      })
      .optional(),
    alt_text: z.string().optional(),
    href: z.string().optional(),
  })
  .passthrough();

const swapiListEnvelope = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    count: z.number(),
    currentPage: z.number().nullable(),
    nextPage: z.number().nullable(),
    previousPage: z.number().nullable(),
    results: z.array(itemSchema),
  });

export const characterSchema = z
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
    databank: databankItemSchema.nullable(),
  })
  .passthrough();

export const starshipSchema = z
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
    databank: databankItemSchema.nullable(),
  })
  .passthrough();

export const vehicleSchema = z
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
    databank: databankItemSchema.nullable(),
  })
  .passthrough();

export const planetSchema = z
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
    databank: databankItemSchema.nullable(),
  })
  .passthrough();

export const filmSchema = z
  .object({
    film_id: z.string(),
    title: z.string(),
    episode_id: z.number(),
    opening_crawl: z.string(),
    director: z.string(),
    producer: z.string(),
    release_date: z.string(),
    characters: z.array(z.string()),
    planets: z.array(z.string()),
    starships: z.array(z.string()),
    vehicles: z.array(z.string()),
    species: z.array(z.string()),
    image: z.string().nullable(),
  })
  .passthrough();

export const characterListSchema = swapiListEnvelope(characterSchema);
export const starshipListSchema = swapiListEnvelope(starshipSchema);
export const vehicleListSchema = swapiListEnvelope(vehicleSchema);
export const planetListSchema = swapiListEnvelope(planetSchema);
export const filmListSchema = swapiListEnvelope(filmSchema);

export type Character = z.infer<typeof characterSchema>;
export type Starship = z.infer<typeof starshipSchema>;
export type Vehicle = z.infer<typeof vehicleSchema>;
export type Planet = z.infer<typeof planetSchema>;
export type Film = z.infer<typeof filmSchema>;
