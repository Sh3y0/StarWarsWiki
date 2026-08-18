import { env } from '../../config/env';
import type { SwapiPeopleResponse, SwapiPerson } from './swapi.types';

function swapiBase(): string {
  return env.SWAPI_BASE_URL.endsWith('/') ? env.SWAPI_BASE_URL : `${env.SWAPI_BASE_URL}/`;
}

export interface FetchPeopleOptions {
  page?: number;
  search?: string;
}

export async function fetchPeople(options: FetchPeopleOptions = {}): Promise<SwapiPeopleResponse> {
  const url = new URL('people/', swapiBase());
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

  return (await response.json()) as SwapiPeopleResponse;
}

export async function fetchPerson(id: string): Promise<SwapiPerson | null> {
  const url = new URL(`people/${id}/`, swapiBase());

  const response = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`SWAPI responded ${response.status} ${response.statusText} for ${url}`);
  }

  return (await response.json()) as SwapiPerson;
}
