import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import { useCategoryList } from '@/hooks/useCategoryList';
import { getCharacters } from '@/api/endpoints';
import type { Character } from '@/types/databank';

jest.mock('@/api/endpoints', () => ({
  getCharacters: jest.fn(),
}));

const mockedGetCharacters = getCharacters as jest.Mock;

let queryClient: QueryClient;

function createWrapper() {
  queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useCategoryList', () => {
  afterEach(() => {
    jest.resetAllMocks();
    // QueryClient schedules garbage-collection timers that otherwise keep Jest's process alive.
    queryClient?.clear();
  });

  it('fetches characters and exposes them as data', async () => {
    const characters: Character[] = [{ id: '1', slug: 'luke-skywalker', title: 'Luke Skywalker' }];
    mockedGetCharacters.mockResolvedValue(characters);

    const { result } = await renderHook(() => useCategoryList('characters'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(characters);
    expect(mockedGetCharacters).toHaveBeenCalledWith({ search: undefined });
  });

  it('forwards the search option to getCharacters', async () => {
    mockedGetCharacters.mockResolvedValue([]);

    const { result } = await renderHook(() => useCategoryList('characters', { search: 'vader' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedGetCharacters).toHaveBeenCalledWith({ search: 'vader' });
  });

  it('exposes isError when the request fails', async () => {
    mockedGetCharacters.mockRejectedValue(new Error('network error'));

    const { result } = await renderHook(() => useCategoryList('characters'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
