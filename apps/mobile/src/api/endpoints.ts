import { apiGet } from './client';
import { characterListSchema } from './schemas';
import type { Character } from '../types/databank';

export interface GetCharactersOptions {
  search?: string;
}

export async function getCharacters(options: GetCharactersOptions = {}): Promise<Character[]> {
  const data = await apiGet<unknown>('/api/characters', { search: options.search });
  return characterListSchema.parse(data);
}

export async function getCharacterBySlug(slug: string): Promise<Character | null> {
  const data = await apiGet<unknown>('/api/characters', { slug });
  const items = characterListSchema.parse(data);
  return items[0] ?? null;
}

// Films/Starships/Vehicles/Planets endpoints will be added here once their screens
// are built against the Stitch designs — characters is the only category wired to
// the real API for this initial setup.
