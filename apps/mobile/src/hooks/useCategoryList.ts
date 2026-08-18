import { useQuery } from '@tanstack/react-query';
import { getCharacters } from '../api/endpoints';
import type { Character } from '../types/databank';

export interface UseCategoryListOptions {
  search?: string;
}

// Only "characters" is wired to the real API for now; the other 5 categories will be
// connected the same way once their screens are built against the Stitch designs.
export function useCategoryList(category: 'characters', options: UseCategoryListOptions = {}) {
  return useQuery<Character[]>({
    queryKey: ['category-list', category, options.search ?? ''],
    queryFn: () => getCharacters(options),
  });
}
