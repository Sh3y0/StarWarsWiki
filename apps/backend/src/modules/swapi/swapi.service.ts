import { getAllItems } from '../databank/databank.service';
import type { DatabankItem } from '../databank/databank.types';
import { fetchPeople, fetchPerson, fetchStarship, fetchStarships } from './swapi.client';
import { findBestMatch } from './swapi.matching';
import type {
  EnrichedCharacter,
  EnrichedStarship,
  SwapiPerson,
  SwapiStarship,
} from './swapi.types';
import { extractIdFromUrl, extractPageNumber } from './swapi.utils';

export interface GetSwapiListOptions {
  page?: number;
  search?: string;
}

export interface GetSwapiListResult<T> {
  count: number;
  currentPage: number | null;
  nextPage: number | null;
  previousPage: number | null;
  results: T[];
}

function findDatabankMatch(name: string, items: DatabankItem[]): DatabankItem | null {
  return findBestMatch(name, items, (item) => item.title);
}

function extractIds(urls: string[]): string[] {
  return urls.map((url) => extractIdFromUrl(url));
}

function enrichPerson(person: SwapiPerson, items: DatabankItem[]): EnrichedCharacter {
  const { url, starships, ...rest } = person;
  return {
    ...rest,
    character_id: extractIdFromUrl(url),
    starships: extractIds(starships),
    databank: findDatabankMatch(person.name, items),
  };
}

function enrichStarship(starship: SwapiStarship, items: DatabankItem[]): EnrichedStarship {
  const { url, pilots, ...rest } = starship;
  // Some SWAPI starship names have no counterpart in the Databank (e.g. "Rebel transport"),
  // but their model does (e.g. "GR-75 medium transport" -> "GR-75 Medium Transport"),
  // so fall back to matching on model when the name doesn't resolve.
  const databank =
    findDatabankMatch(starship.name, items) ?? findDatabankMatch(starship.model, items);
  return {
    ...rest,
    starship_id: extractIdFromUrl(url),
    pilots: extractIds(pilots),
    databank,
  };
}

export async function getCharacters(
  options: GetSwapiListOptions = {},
): Promise<GetSwapiListResult<EnrichedCharacter>> {
  const isSearch = Boolean(options.search);

  const [swapiResponse, databankItems] = await Promise.all([
    isSearch ? fetchPeople({ search: options.search }) : fetchPeople({ page: options.page ?? 1 }),
    getAllItems('characters'),
  ]);

  return {
    count: swapiResponse.count,
    currentPage: isSearch ? null : (options.page ?? 1),
    nextPage: extractPageNumber(swapiResponse.next),
    previousPage: extractPageNumber(swapiResponse.previous),
    results: swapiResponse.results.map((person) => enrichPerson(person, databankItems)),
  };
}

export async function getCharacterById(id: string): Promise<EnrichedCharacter | null> {
  const [person, databankItems] = await Promise.all([fetchPerson(id), getAllItems('characters')]);

  if (!person) {
    return null;
  }

  return enrichPerson(person, databankItems);
}

export async function getStarships(
  options: GetSwapiListOptions = {},
): Promise<GetSwapiListResult<EnrichedStarship>> {
  const isSearch = Boolean(options.search);

  const [swapiResponse, databankItems] = await Promise.all([
    isSearch
      ? fetchStarships({ search: options.search })
      : fetchStarships({ page: options.page ?? 1 }),
    getAllItems('vehicles'),
  ]);

  return {
    count: swapiResponse.count,
    currentPage: isSearch ? null : (options.page ?? 1),
    nextPage: extractPageNumber(swapiResponse.next),
    previousPage: extractPageNumber(swapiResponse.previous),
    results: swapiResponse.results.map((starship) => enrichStarship(starship, databankItems)),
  };
}

export async function getStarshipById(id: string): Promise<EnrichedStarship | null> {
  const [starship, databankItems] = await Promise.all([fetchStarship(id), getAllItems('vehicles')]);

  if (!starship) {
    return null;
  }

  return enrichStarship(starship, databankItems);
}
