import { useQuery } from '@tanstack/react-query';
import { getCharacterBySlug } from '../api/endpoints';
import type { Character } from '../types/databank';

// Only "characters" is wired to the real API for now — see useCategoryList.ts.
export function useCategoryDetail(category: 'characters', slug: string) {
  return useQuery<Character | null>({
    queryKey: ['category-detail', category, slug],
    queryFn: () => getCharacterBySlug(slug),
    enabled: Boolean(slug),
  });
}
