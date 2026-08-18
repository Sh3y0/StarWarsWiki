import { getAllItems } from '../databank/databank.service';
import type { DatabankItem } from '../databank/databank.types';
import {
  fetchFilm,
  fetchFilms,
  fetchPeople,
  fetchPerson,
  fetchPlanet,
  fetchPlanets,
  fetchStarship,
  fetchStarships,
  fetchVehicle,
  fetchVehicles,
} from './swapi.client';
import { FILM_IMAGES } from './swapi.constants';
import { findBestMatch } from './swapi.matching';
import type {
  EnrichedCharacter,
  EnrichedFilm,
  EnrichedPlanet,
  EnrichedStarship,
  EnrichedVehicle,
  SwapiFilm,
  SwapiPerson,
  SwapiPlanet,
  SwapiStarship,
  SwapiVehicle,
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

// Some SWAPI vehicles/starships have no counterpart in the Databank under their in-universe
// `name` (e.g. "Rebel transport"), but their `model` does (e.g. "GR-75 medium transport" ->
// "GR-75 Medium Transport"), so fall back to matching on model when the name doesn't resolve.
function findDatabankMatchByNameOrModel(
  entity: { name: string; model: string },
  items: DatabankItem[],
): DatabankItem | null {
  return findDatabankMatch(entity.name, items) ?? findDatabankMatch(entity.model, items);
}

function extractIds(urls: string[]): string[] {
  return urls.map((url) => extractIdFromUrl(url));
}

function enrichPerson(person: SwapiPerson, items: DatabankItem[]): EnrichedCharacter {
  const { url, homeworld, films, starships, vehicles, ...rest } = person;
  return {
    ...rest,
    character_id: extractIdFromUrl(url),
    homeworld: extractIdFromUrl(homeworld),
    films: extractIds(films),
    starships: extractIds(starships),
    vehicles: extractIds(vehicles),
    databank: findDatabankMatch(person.name, items),
  };
}

function enrichStarship(starship: SwapiStarship, items: DatabankItem[]): EnrichedStarship {
  const { url, films, pilots, ...rest } = starship;
  return {
    ...rest,
    starship_id: extractIdFromUrl(url),
    films: extractIds(films),
    pilots: extractIds(pilots),
    databank: findDatabankMatchByNameOrModel(starship, items),
  };
}

function enrichVehicle(vehicle: SwapiVehicle, items: DatabankItem[]): EnrichedVehicle {
  const { url, films, pilots, ...rest } = vehicle;
  return {
    ...rest,
    vehicle_id: extractIdFromUrl(url),
    films: extractIds(films),
    pilots: extractIds(pilots),
    databank: findDatabankMatchByNameOrModel(vehicle, items),
  };
}

function enrichPlanet(planet: SwapiPlanet, items: DatabankItem[]): EnrichedPlanet {
  const { url, films, residents, ...rest } = planet;
  return {
    ...rest,
    planet_id: extractIdFromUrl(url),
    films: extractIds(films),
    residents: extractIds(residents),
    databank: findDatabankMatch(planet.name, items),
  };
}

// Films have no matching Databank category, so there's no name/title matching here — just the
// SWAPI data with its reference arrays reduced to ids, plus a locally-served poster image.
// `species` is intentionally left untouched: there's no /api/swapi/species endpoint to link to.
function enrichFilm(film: SwapiFilm): EnrichedFilm {
  const { url, characters, planets, starships, vehicles, ...rest } = film;
  return {
    ...rest,
    film_id: extractIdFromUrl(url),
    characters: extractIds(characters),
    planets: extractIds(planets),
    starships: extractIds(starships),
    vehicles: extractIds(vehicles),
    image: FILM_IMAGES[film.episode_id] ?? null,
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

export async function getVehicles(
  options: GetSwapiListOptions = {},
): Promise<GetSwapiListResult<EnrichedVehicle>> {
  const isSearch = Boolean(options.search);

  const [swapiResponse, databankItems] = await Promise.all([
    isSearch
      ? fetchVehicles({ search: options.search })
      : fetchVehicles({ page: options.page ?? 1 }),
    getAllItems('vehicles'),
  ]);

  return {
    count: swapiResponse.count,
    currentPage: isSearch ? null : (options.page ?? 1),
    nextPage: extractPageNumber(swapiResponse.next),
    previousPage: extractPageNumber(swapiResponse.previous),
    results: swapiResponse.results.map((vehicle) => enrichVehicle(vehicle, databankItems)),
  };
}

export async function getVehicleById(id: string): Promise<EnrichedVehicle | null> {
  const [vehicle, databankItems] = await Promise.all([fetchVehicle(id), getAllItems('vehicles')]);

  if (!vehicle) {
    return null;
  }

  return enrichVehicle(vehicle, databankItems);
}

export async function getPlanets(
  options: GetSwapiListOptions = {},
): Promise<GetSwapiListResult<EnrichedPlanet>> {
  const isSearch = Boolean(options.search);

  const [swapiResponse, databankItems] = await Promise.all([
    isSearch ? fetchPlanets({ search: options.search }) : fetchPlanets({ page: options.page ?? 1 }),
    getAllItems('locations'),
  ]);

  return {
    count: swapiResponse.count,
    currentPage: isSearch ? null : (options.page ?? 1),
    nextPage: extractPageNumber(swapiResponse.next),
    previousPage: extractPageNumber(swapiResponse.previous),
    results: swapiResponse.results.map((planet) => enrichPlanet(planet, databankItems)),
  };
}

export async function getPlanetById(id: string): Promise<EnrichedPlanet | null> {
  const [planet, databankItems] = await Promise.all([fetchPlanet(id), getAllItems('locations')]);

  if (!planet) {
    return null;
  }

  return enrichPlanet(planet, databankItems);
}

export async function getFilms(
  options: GetSwapiListOptions = {},
): Promise<GetSwapiListResult<EnrichedFilm>> {
  const isSearch = Boolean(options.search);

  const swapiResponse = isSearch
    ? await fetchFilms({ search: options.search })
    : await fetchFilms({ page: options.page ?? 1 });

  return {
    count: swapiResponse.count,
    currentPage: isSearch ? null : (options.page ?? 1),
    nextPage: extractPageNumber(swapiResponse.next),
    previousPage: extractPageNumber(swapiResponse.previous),
    results: swapiResponse.results.map((film) => enrichFilm(film)),
  };
}

export async function getFilmById(id: string): Promise<EnrichedFilm | null> {
  const film = await fetchFilm(id);

  if (!film) {
    return null;
  }

  return enrichFilm(film);
}
