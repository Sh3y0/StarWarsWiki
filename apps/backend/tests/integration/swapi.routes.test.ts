import type { FastifyInstance } from 'fastify';
import { buildApp } from '../../src/app';
import * as service from '../../src/modules/swapi/swapi.service';

const yoda = {
  character_id: '20',
  name: 'Yoda',
  height: '66',
  mass: '17',
  hair_color: 'white',
  skin_color: 'green',
  eye_color: 'brown',
  birth_year: '896BBY',
  gender: 'male',
  homeworld: 'https://swapi.dev/api/planets/28/',
  films: [],
  species: [],
  vehicles: [],
  starships: [],
  created: '2014-12-15T12:26:01.042000Z',
  edited: '2014-12-20T21:17:50.345000Z',
  databank: null,
};

describe('swapi routes', () => {
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

  describe('GET /api/swapi/people', () => {
    it('returns enriched characters with character_id instead of url', async () => {
      jest.spyOn(service, 'getCharacters').mockResolvedValue({
        count: 1,
        currentPage: 1,
        nextPage: null,
        previousPage: null,
        results: [yoda],
      });

      const response = await app.inject({ method: 'GET', url: '/api/swapi/people' });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body).toMatchObject({ count: 1, results: [{ name: 'Yoda', character_id: '20' }] });
      expect(body.results[0]).not.toHaveProperty('url');
    });

    it('returns 502 when SWAPI is unreachable', async () => {
      jest.spyOn(service, 'getCharacters').mockRejectedValue(new Error('SWAPI unreachable'));

      const response = await app.inject({ method: 'GET', url: '/api/swapi/people' });

      expect(response.statusCode).toBe(502);
      expect(response.json()).toMatchObject({ error: 'SWAPI_FETCH_FAILED' });
    });

    it('rejects an invalid page query param', async () => {
      const response = await app.inject({ method: 'GET', url: '/api/swapi/people?page=abc' });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /api/swapi/people/:id', () => {
    it('returns the enriched character', async () => {
      jest.spyOn(service, 'getCharacterById').mockResolvedValue(yoda);

      const response = await app.inject({ method: 'GET', url: '/api/swapi/people/20' });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toMatchObject({ name: 'Yoda', character_id: '20' });
    });

    it('returns 404 when the character does not exist', async () => {
      jest.spyOn(service, 'getCharacterById').mockResolvedValue(null);

      const response = await app.inject({ method: 'GET', url: '/api/swapi/people/99999' });

      expect(response.statusCode).toBe(404);
      expect(response.json()).toMatchObject({ error: 'CHARACTER_NOT_FOUND' });
    });

    it('returns 502 when SWAPI is unreachable', async () => {
      jest.spyOn(service, 'getCharacterById').mockRejectedValue(new Error('SWAPI unreachable'));

      const response = await app.inject({ method: 'GET', url: '/api/swapi/people/1' });

      expect(response.statusCode).toBe(502);
      expect(response.json()).toMatchObject({ error: 'SWAPI_FETCH_FAILED' });
    });

    it('rejects a non-numeric id', async () => {
      const response = await app.inject({ method: 'GET', url: '/api/swapi/people/abc' });

      expect(response.statusCode).toBe(400);
    });
  });
});
