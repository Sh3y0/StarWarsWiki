import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import { useCatalogList } from '@/hooks/useCatalogList';
import { getCatalogPage } from '@/api/endpoints';
import type { CatalogPage } from '@/types/catalog';

jest.mock('@/api/endpoints', () => ({
  getCatalogPage: jest.fn(),
}));

const mockedGetCatalogPage = getCatalogPage as jest.MockedFunction<typeof getCatalogPage>;

let queryClient: QueryClient;

function createWrapper() {
  queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

const page = (overrides: Partial<CatalogPage> = {}): CatalogPage => ({
  count: 1,
  currentPage: 1,
  nextPage: null,
  previousPage: null,
  items: [{ id: '1', title: 'Luke Skywalker' }],
  ...overrides,
});

describe('useCatalogList', () => {
  afterEach(() => {
    jest.resetAllMocks();
    queryClient?.clear();
  });

  it('fetches a category page and exposes the items', async () => {
    mockedGetCatalogPage.mockResolvedValue(page());

    const { result } = await renderHook(() => useCatalogList('characters'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.pages[0].items).toEqual([{ id: '1', title: 'Luke Skywalker' }]);
    expect(mockedGetCatalogPage).toHaveBeenCalledWith('characters', { page: 1, search: undefined });
  });

  it('forwards the search option and skips pagination', async () => {
    mockedGetCatalogPage.mockResolvedValue(page({ currentPage: null, nextPage: 2 }));

    const { result } = await renderHook(() => useCatalogList('films', { search: 'hope' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedGetCatalogPage).toHaveBeenCalledWith('films', { page: 1, search: 'hope' });
    expect(result.current.hasNextPage).toBe(false);
  });

  it('exposes isError when the request fails', async () => {
    mockedGetCatalogPage.mockRejectedValue(new Error('network error'));

    const { result } = await renderHook(() => useCatalogList('planets'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
