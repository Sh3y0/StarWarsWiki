import { ApiError, apiGet } from './client';
import { toDetail, toListItem } from './mappers';
import {
  characterListSchema,
  characterSchema,
  filmListSchema,
  filmSchema,
  planetListSchema,
  planetSchema,
  starshipListSchema,
  starshipSchema,
  vehicleListSchema,
  vehicleSchema,
} from './schemas';
import type { CatalogCategory, CatalogDetail, CatalogPage } from '../types/catalog';

const LIST_PATH: Record<CatalogCategory, string> = {
  characters: '/api/swapi/people',
  films: '/api/swapi/films',
  starships: '/api/swapi/starships',
  vehicles: '/api/swapi/vehicles',
  planets: '/api/swapi/planets',
};

const DETAIL_PATH: Record<CatalogCategory, (id: string) => string> = {
  characters: (id) => `/api/swapi/people/${id}`,
  films: (id) => `/api/swapi/films/${id}`,
  starships: (id) => `/api/swapi/starships/${id}`,
  vehicles: (id) => `/api/swapi/vehicles/${id}`,
  planets: (id) => `/api/swapi/planets/${id}`,
};

const LIST_SCHEMA = {
  characters: characterListSchema,
  films: filmListSchema,
  starships: starshipListSchema,
  vehicles: vehicleListSchema,
  planets: planetListSchema,
} as const;

const DETAIL_SCHEMA = {
  characters: characterSchema,
  films: filmSchema,
  starships: starshipSchema,
  vehicles: vehicleSchema,
  planets: planetSchema,
} as const;

export interface GetCatalogPageOptions {
  page?: number;
  search?: string;
}

export async function getCatalogPage(
  category: CatalogCategory,
  options: GetCatalogPageOptions = {},
): Promise<CatalogPage> {
  const search = options.search?.trim() || undefined;
  const data = await apiGet<unknown>(LIST_PATH[category], {
    search,
    page: search ? undefined : options.page,
  });
  const parsed = LIST_SCHEMA[category].parse(data);

  return {
    count: parsed.count,
    currentPage: parsed.currentPage,
    nextPage: parsed.nextPage,
    previousPage: parsed.previousPage,
    items: parsed.results.map((item) => toListItem(category, item)),
  };
}

export async function getCatalogById(
  category: CatalogCategory,
  id: string,
): Promise<CatalogDetail | null> {
  try {
    const data = await apiGet<unknown>(DETAIL_PATH[category](id));
    return toDetail(category, DETAIL_SCHEMA[category].parse(data));
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}
