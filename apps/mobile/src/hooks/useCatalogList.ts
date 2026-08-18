import { useInfiniteQuery } from '@tanstack/react-query';
import { getCatalogPage } from '../api/endpoints';
import type { CatalogCategory } from '../types/catalog';

export interface UseCatalogListOptions {
  search?: string;
}

export function useCatalogList(category: CatalogCategory, options: UseCatalogListOptions = {}) {
  const search = options.search?.trim() || undefined;

  return useInfiniteQuery({
    queryKey: ['catalog-list', category, search ?? ''],
    queryFn: ({ pageParam }) => getCatalogPage(category, { page: pageParam, search }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (search ? undefined : (lastPage.nextPage ?? undefined)),
  });
}
