import { useQueries } from '@tanstack/react-query';
import { getCatalogById } from '../api/endpoints';
import type { CatalogCategory, CatalogListItem } from '../types/catalog';

export function useRelatedItems(category: CatalogCategory, ids: string[]): CatalogListItem[] {
  const queries = useQueries({
    queries: ids.map((id) => ({
      queryKey: ['catalog-detail', category, id],
      queryFn: () => getCatalogById(category, id),
      enabled: ids.length > 0,
    })),
  });

  return queries.flatMap((query) => {
    if (!query.data) {
      return [];
    }
    return [
      {
        id: query.data.id,
        title: query.data.title,
        subtitle: query.data.subtitle,
        imageUrl: query.data.imageUrl,
      },
    ];
  });
}
