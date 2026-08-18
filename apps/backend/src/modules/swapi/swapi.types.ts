import type { DatabankItem } from '../databank/databank.types';

export interface SwapiPerson {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  films: string[];
  species: string[];
  vehicles: string[];
  starships: string[];
  created: string;
  edited: string;
  url: string;
}

export interface SwapiPeopleResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SwapiPerson[];
}

export type EnrichedCharacter = Omit<SwapiPerson, 'url'> & {
  character_id: string;
  databank: DatabankItem | null;
};

export interface SwapiStarship {
  name: string;
  model: string;
  manufacturer: string;
  cost_in_credits: string;
  length: string;
  max_atmosphering_speed: string;
  crew: string;
  passengers: string;
  cargo_capacity: string;
  consumables: string;
  hyperdrive_rating: string;
  MGLT: string;
  starship_class: string;
  pilots: string[];
  films: string[];
  created: string;
  edited: string;
  url: string;
}

export interface SwapiStarshipsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SwapiStarship[];
}

export type EnrichedStarship = Omit<SwapiStarship, 'url'> & {
  starship_id: string;
  databank: DatabankItem | null;
};

export interface SwapiVehicle {
  name: string;
  model: string;
  manufacturer: string;
  cost_in_credits: string;
  length: string;
  max_atmosphering_speed: string;
  crew: string;
  passengers: string;
  cargo_capacity: string;
  consumables: string;
  vehicle_class: string;
  pilots: string[];
  films: string[];
  created: string;
  edited: string;
  url: string;
}

export interface SwapiVehiclesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SwapiVehicle[];
}

export type EnrichedVehicle = Omit<SwapiVehicle, 'url'> & {
  vehicle_id: string;
  databank: DatabankItem | null;
};

export interface SwapiPlanet {
  name: string;
  rotation_period: string;
  orbital_period: string;
  diameter: string;
  climate: string;
  gravity: string;
  terrain: string;
  surface_water: string;
  population: string;
  residents: string[];
  films: string[];
  created: string;
  edited: string;
  url: string;
}

export interface SwapiPlanetsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SwapiPlanet[];
}

export type EnrichedPlanet = Omit<SwapiPlanet, 'url'> & {
  planet_id: string;
  databank: DatabankItem | null;
};

export interface SwapiFilm {
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string;
  characters: string[];
  planets: string[];
  starships: string[];
  vehicles: string[];
  species: string[];
  created: string;
  edited: string;
  url: string;
}

export interface SwapiFilmsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SwapiFilm[];
}

// No Databank category maps to films, so there's no `databank` field here — just the SWAPI
// data plus a locally-served poster `image` (see FILM_IMAGES in swapi.constants.ts).
export type EnrichedFilm = Omit<SwapiFilm, 'url'> & {
  film_id: string;
  image: string | null;
};
