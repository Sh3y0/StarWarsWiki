import type { FastifyInstance } from 'fastify';
import { buildApp } from '../../src/app';
import * as service from '../../src/modules/databank/databank.service';

describe('databank routes', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('GET /api/:category returns 400 for an invalid category', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/not-a-category' });
    expect(response.statusCode).toBe(400);
  });

  it('GET /api/:category returns stored items for a valid category', async () => {
    jest.spyOn(service, 'getItems').mockResolvedValue([{ id: '1', slug: 'yoda', title: 'Yoda' }]);

    const response = await app.inject({ method: 'GET', url: '/api/characters' });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([{ id: '1', slug: 'yoda', title: 'Yoda' }]);
  });

  it('POST /api/:category/sync returns a summary on success', async () => {
    jest.spyOn(service, 'syncCategory').mockResolvedValue({
      category: 'droids',
      totalFetched: 42,
      updatedAt: '2024-01-01T00:00:00.000Z',
      filePath: '/data/droids.json',
    });

    const response = await app.inject({ method: 'POST', url: '/api/droids/sync' });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({ category: 'droids', totalFetched: 42 });
  });

  it('POST /api/:category/sync returns 502 when the sync fails', async () => {
    jest.spyOn(service, 'syncCategory').mockRejectedValue(new Error('StarWars.com unreachable'));

    const response = await app.inject({ method: 'POST', url: '/api/vehicles/sync' });

    expect(response.statusCode).toBe(502);
    expect(response.json()).toMatchObject({ error: 'SYNC_FAILED' });
  });
});
