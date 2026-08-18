import { fetchAllItems } from '../../src/modules/databank/databank.scraper';
import type { DatabankItem } from '../../src/modules/databank/databank.types';

function makeItem(id: string): DatabankItem {
  return { id, slug: id, title: id };
}

describe('databank.scraper', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('fetches a single page when total count fits in the first batch', async () => {
    const items = Array.from({ length: 5 }, (_, i) => makeItem(`item-${i}`));

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({ count: 5, data: items }),
    }) as unknown as typeof fetch;

    const result = await fetchAllItems('characters');

    expect(result).toHaveLength(5);
    expect(global.fetch).toHaveBeenCalledTimes(1);

    const [url] = (global.fetch as jest.Mock).mock.calls[0];
    expect(String(url)).toContain('updated_at=');
    expect(String(url)).not.toContain('offset=');
  });

  it('paginates using offset increments of 40 until count is reached', async () => {
    const firstBatch = Array.from({ length: 40 }, (_, i) => makeItem(`a-${i}`));
    const secondBatch = Array.from({ length: 10 }, (_, i) => makeItem(`b-${i}`));

    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        headers: { get: () => 'application/json' },
        json: async () => ({ count: 50, data: firstBatch }),
      })
      .mockResolvedValueOnce({
        ok: true,
        headers: { get: () => 'application/json' },
        json: async () => ({ count: 50, data: secondBatch }),
      });

    global.fetch = fetchMock as unknown as typeof fetch;

    const result = await fetchAllItems('creatures');

    expect(result).toHaveLength(50);
    expect(fetchMock).toHaveBeenCalledTimes(2);

    const [secondUrl] = fetchMock.mock.calls[1];
    expect(String(secondUrl)).toContain('offset=40');
    expect(String(secondUrl)).not.toContain('updated_at=');
  });

  it('throws a clear error when StarWars.com keeps failing', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      headers: { get: () => 'text/html' },
    }) as unknown as typeof fetch;

    await expect(fetchAllItems('droids')).rejects.toThrow(/Sync failed/);
  });
});
