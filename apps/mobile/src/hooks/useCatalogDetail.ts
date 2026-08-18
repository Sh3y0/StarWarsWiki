import { useQuery } from '@tanstack/react-query';
import { getCatalogById } from '../api/endpoints';
import type { CatalogCategory } from '../types/catalog';

export function useCatalogDetail(category: CatalogCategory, id: string | undefined) {
  return useQuery({
    queryKey: ['catalog-detail', category, id],
    queryFn: () => getCatalogById(category, id as string),
    enabled: Boolean(id),
  });
}
