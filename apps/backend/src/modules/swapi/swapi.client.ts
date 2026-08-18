import { env } from '../../config/env';
import type {
  SwapiPeopleResponse,
  SwapiPerson,
  SwapiPlanet,
  SwapiPlanetsResponse,
  SwapiStarship,
  SwapiStarshipsResponse,
  SwapiVehicle,
  SwapiVehiclesResponse,
} from './swapi.types';

function swapiBase(): string {
  return env.SWAPI_BASE_URL.endsWith('/') ? env.SWAPI_BASE_URL : `${env.SWAPI_BASE_URL}/`;
}

export interface FetchListOptions {
  page?: number;
  search?: string;
}

async function fetchList<T>(resource: string, options: FetchListOptions = {}): Promise<T> {
  const url = new URL(`${resource}/`, swapiBase());
  if (options.page) {
    url.searchParams.set('page', String(options.page));
  }
  if (options.search) {
    url.searchParams.set('search', options.search);
  }

  const response = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`SWAPI responded ${response.status} ${response.statusText} for ${url}`);
  }

  return (await response.json()) as T;
}

async function fetchOne<T>(resource: string, id: string): Promise<T | null> {
  const url = new URL(`${resource}/${id}/`, swapiBase());

  const response = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`SWAPI responded ${response.status} ${response.statusText} for ${url}`);
  }

  return (await response.json()) as T;
}

export async function fetchPeople(options: FetchListOptions = {}): Promise<SwapiPeopleResponse> {
  return fetchList<SwapiPeopleResponse>('people', options);
}

export async function fetchPerson(id: string): Promise<SwapiPerson | null> {
  return fetchOne<SwapiPerson>('people', id);
}

export async function fetchStarships(
  options: FetchListOptions = {},
): Promise<SwapiStarshipsResponse> {
  return fetchList<SwapiStarshipsResponse>('starships', options);
}

export async function fetchStarship(id: string): Promise<SwapiStarship | null> {
  return fetchOne<SwapiStarship>('starships', id);
}

export async function fetchVehicles(
  options: FetchListOptions = {},
): Promise<SwapiVehiclesResponse> {
  return fetchList<SwapiVehiclesResponse>('vehicles', options);
}

export async function fetchVehicle(id: string): Promise<SwapiVehicle | null> {
  return fetchOne<SwapiVehicle>('vehicles', id);
}

export async function fetchPlanets(options: FetchListOptions = {}): Promise<SwapiPlanetsResponse> {
  return fetchList<SwapiPlanetsResponse>('planets', options);
}

export async function fetchPlanet(id: string): Promise<SwapiPlanet | null> {
  return fetchOne<SwapiPlanet>('planets', id);
}
