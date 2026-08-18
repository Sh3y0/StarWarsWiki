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
