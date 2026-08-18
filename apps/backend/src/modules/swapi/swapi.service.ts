import { getAllItems } from '../databank/databank.service';
import type { DatabankItem } from '../databank/databank.types';
import { fetchPeople, fetchPerson } from './swapi.client';
import type { EnrichedCharacter, SwapiPerson } from './swapi.types';

export interface GetCharactersOptions {
  page?: number;
  search?: string;
}

export interface GetCharactersResult {
  count: number;
  currentPage: number | null;
  nextPage: number | null;
  previousPage: number | null;
  results: EnrichedCharacter[];
}

function extractPageNumber(url: string | null): number | null {
  if (!url) {
    return null;
  }
  const page = new URL(url).searchParams.get('page');
  return page ? Number(page) : null;
}

function extractCharacterId(url: string): string {
  const match = /\/(\d+)\/?$/.exec(url);
  if (!match) {
    throw new Error(`Could not extract character id from SWAPI url: ${url}`);
  }
  return match[1] as string;
}

function findDatabankMatch(person: SwapiPerson, items: DatabankItem[]): DatabankItem | null {
  const needle = person.name.toLowerCase();
  return items.find((item) => item.title?.toLowerCase().includes(needle)) ?? null;
}

function enrichPerson(person: SwapiPerson, items: DatabankItem[]): EnrichedCharacter {
  const { url, ...rest } = person;
  return {
    ...rest,
    character_id: extractCharacterId(url),
    databank: findDatabankMatch(person, items),
  };
}

export async function getCharacters(
  options: GetCharactersOptions = {},
): Promise<GetCharactersResult> {
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
