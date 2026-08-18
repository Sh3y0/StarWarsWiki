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
  homeworld: '28',
  films: [],
  species: [],
  vehicles: [],
  starships: [],
  created: '2014-12-15T12:26:01.042000Z',
  edited: '2014-12-20T21:17:50.345000Z',
  databank: null,
};

const millenniumFalcon = {
  starship_id: '10',
  name: 'Millennium Falcon',
  model: 'YT-1300 light freighter',
  manufacturer: 'Corellian Engineering Corporation',
  cost_in_credits: '100000',
  length: '34.37',
  max_atmosphering_speed: '1050',
  crew: '4',
  passengers: '6',
  cargo_capacity: '100000',
  consumables: '2 months',
  hyperdrive_rating: '0.5',
  MGLT: '75',
  starship_class: 'Light freighter',
  pilots: [],
  films: [],
  created: '2014-12-10T16:59:45.094000Z',
  edited: '2014-12-20T21:23:49.880000Z',
  databank: null,
};

const sandCrawler = {
  vehicle_id: '4',
  name: 'Sand Crawler',
  model: 'Digger Crawler',
  manufacturer: 'Corellia Mining Corporation',
  cost_in_credits: '150000',
  length: '36.8',
  max_atmosphering_speed: '30',
  crew: '46',
  passengers: '30',
  cargo_capacity: '50000',
  consumables: '2 months',
  vehicle_class: 'wheeled',
  pilots: [],
  films: [],
  created: '2014-12-10T15:36:25.724000Z',
  edited: '2014-12-20T21:30:21.661000Z',
  databank: null,
};

const tatooine = {
  planet_id: '1',
  name: 'Tatooine',
  rotation_period: '23',
  orbital_period: '304',
  diameter: '10465',
  climate: 'arid',
  gravity: '1 standard',
  terrain: 'desert',
  surface_water: '1',
  population: '200000',
  residents: [],
  films: [],
  created: '2014-12-09T13:50:49.641000Z',
  edited: '2014-12-20T20:58:18.411000Z',
  databank: null,
};

const aNewHope = {
  film_id: '1',
  title: 'A New Hope',
  episode_id: 4,
  opening_crawl: 'It is a period of civil war...',
  director: 'George Lucas',
  producer: 'Gary Kurtz, Rick McCallum',
  release_date: '1977-05-25',
  characters: ['1', '2'],
  planets: ['1'],
  starships: ['2'],
  vehicles: ['4'],
  species: ['https://swapi.dev/api/species/1/'],
  created: '2014-12-10T14:23:31.880000Z',
  edited: '2014-12-20T19:49:45.256000Z',
  image: '/static/films/4.jpg',
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

  describe('GET /api/swapi/starships', () => {
    it('returns enriched starships with starship_id instead of url', async () => {
      jest.spyOn(service, 'getStarships').mockResolvedValue({
        count: 1,
        currentPage: 1,
        nextPage: null,
        previousPage: null,
        results: [millenniumFalcon],
      });

      const response = await app.inject({ method: 'GET', url: '/api/swapi/starships' });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body).toMatchObject({
        count: 1,
        results: [{ name: 'Millennium Falcon', starship_id: '10' }],
      });
      expect(body.results[0]).not.toHaveProperty('url');
    });

    it('returns 502 when SWAPI is unreachable', async () => {
      jest.spyOn(service, 'getStarships').mockRejectedValue(new Error('SWAPI unreachable'));

      const response = await app.inject({ method: 'GET', url: '/api/swapi/starships' });

      expect(response.statusCode).toBe(502);
      expect(response.json()).toMatchObject({ error: 'SWAPI_FETCH_FAILED' });
    });

    it('rejects an invalid page query param', async () => {
      const response = await app.inject({ method: 'GET', url: '/api/swapi/starships?page=abc' });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /api/swapi/starships/:id', () => {
    it('returns the enriched starship', async () => {
      jest.spyOn(service, 'getStarshipById').mockResolvedValue(millenniumFalcon);

      const response = await app.inject({ method: 'GET', url: '/api/swapi/starships/10' });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toMatchObject({ name: 'Millennium Falcon', starship_id: '10' });
    });

    it('returns 404 when the starship does not exist', async () => {
      jest.spyOn(service, 'getStarshipById').mockResolvedValue(null);

      const response = await app.inject({ method: 'GET', url: '/api/swapi/starships/99999' });

      expect(response.statusCode).toBe(404);
      expect(response.json()).toMatchObject({ error: 'STARSHIP_NOT_FOUND' });
    });

    it('returns 502 when SWAPI is unreachable', async () => {
      jest.spyOn(service, 'getStarshipById').mockRejectedValue(new Error('SWAPI unreachable'));

      const response = await app.inject({ method: 'GET', url: '/api/swapi/starships/1' });

      expect(response.statusCode).toBe(502);
      expect(response.json()).toMatchObject({ error: 'SWAPI_FETCH_FAILED' });
    });

    it('rejects a non-numeric id', async () => {
      const response = await app.inject({ method: 'GET', url: '/api/swapi/starships/abc' });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /api/swapi/vehicles', () => {
    it('returns enriched vehicles with vehicle_id instead of url', async () => {
      jest.spyOn(service, 'getVehicles').mockResolvedValue({
        count: 1,
        currentPage: 1,
        nextPage: null,
        previousPage: null,
        results: [sandCrawler],
      });

      const response = await app.inject({ method: 'GET', url: '/api/swapi/vehicles' });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body).toMatchObject({
        count: 1,
        results: [{ name: 'Sand Crawler', vehicle_id: '4' }],
      });
      expect(body.results[0]).not.toHaveProperty('url');
    });

    it('returns 502 when SWAPI is unreachable', async () => {
      jest.spyOn(service, 'getVehicles').mockRejectedValue(new Error('SWAPI unreachable'));

      const response = await app.inject({ method: 'GET', url: '/api/swapi/vehicles' });

      expect(response.statusCode).toBe(502);
      expect(response.json()).toMatchObject({ error: 'SWAPI_FETCH_FAILED' });
    });

    it('rejects an invalid page query param', async () => {
      const response = await app.inject({ method: 'GET', url: '/api/swapi/vehicles?page=abc' });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /api/swapi/vehicles/:id', () => {
    it('returns the enriched vehicle', async () => {
      jest.spyOn(service, 'getVehicleById').mockResolvedValue(sandCrawler);

      const response = await app.inject({ method: 'GET', url: '/api/swapi/vehicles/4' });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toMatchObject({ name: 'Sand Crawler', vehicle_id: '4' });
    });

    it('returns 404 when the vehicle does not exist', async () => {
      jest.spyOn(service, 'getVehicleById').mockResolvedValue(null);

      const response = await app.inject({ method: 'GET', url: '/api/swapi/vehicles/99999' });

      expect(response.statusCode).toBe(404);
      expect(response.json()).toMatchObject({ error: 'VEHICLE_NOT_FOUND' });
    });

    it('returns 502 when SWAPI is unreachable', async () => {
      jest.spyOn(service, 'getVehicleById').mockRejectedValue(new Error('SWAPI unreachable'));

      const response = await app.inject({ method: 'GET', url: '/api/swapi/vehicles/1' });

      expect(response.statusCode).toBe(502);
      expect(response.json()).toMatchObject({ error: 'SWAPI_FETCH_FAILED' });
    });

    it('rejects a non-numeric id', async () => {
      const response = await app.inject({ method: 'GET', url: '/api/swapi/vehicles/abc' });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /api/swapi/planets', () => {
    it('returns enriched planets with planet_id instead of url', async () => {
      jest.spyOn(service, 'getPlanets').mockResolvedValue({
        count: 1,
        currentPage: 1,
        nextPage: null,
        previousPage: null,
        results: [tatooine],
      });

      const response = await app.inject({ method: 'GET', url: '/api/swapi/planets' });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body).toMatchObject({
        count: 1,
        results: [{ name: 'Tatooine', planet_id: '1' }],
      });
      expect(body.results[0]).not.toHaveProperty('url');
    });

    it('returns 502 when SWAPI is unreachable', async () => {
      jest.spyOn(service, 'getPlanets').mockRejectedValue(new Error('SWAPI unreachable'));

      const response = await app.inject({ method: 'GET', url: '/api/swapi/planets' });

      expect(response.statusCode).toBe(502);
      expect(response.json()).toMatchObject({ error: 'SWAPI_FETCH_FAILED' });
    });

    it('rejects an invalid page query param', async () => {
      const response = await app.inject({ method: 'GET', url: '/api/swapi/planets?page=abc' });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /api/swapi/planets/:id', () => {
    it('returns the enriched planet', async () => {
      jest.spyOn(service, 'getPlanetById').mockResolvedValue(tatooine);

      const response = await app.inject({ method: 'GET', url: '/api/swapi/planets/1' });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toMatchObject({ name: 'Tatooine', planet_id: '1' });
    });

    it('returns 404 when the planet does not exist', async () => {
      jest.spyOn(service, 'getPlanetById').mockResolvedValue(null);

      const response = await app.inject({ method: 'GET', url: '/api/swapi/planets/99999' });

      expect(response.statusCode).toBe(404);
      expect(response.json()).toMatchObject({ error: 'PLANET_NOT_FOUND' });
    });

    it('returns 502 when SWAPI is unreachable', async () => {
      jest.spyOn(service, 'getPlanetById').mockRejectedValue(new Error('SWAPI unreachable'));

      const response = await app.inject({ method: 'GET', url: '/api/swapi/planets/1' });

      expect(response.statusCode).toBe(502);
      expect(response.json()).toMatchObject({ error: 'SWAPI_FETCH_FAILED' });
    });

    it('rejects a non-numeric id', async () => {
      const response = await app.inject({ method: 'GET', url: '/api/swapi/planets/abc' });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /api/swapi/films', () => {
    it('returns films with film_id instead of url', async () => {
      jest.spyOn(service, 'getFilms').mockResolvedValue({
        count: 1,
        currentPage: 1,
        nextPage: null,
        previousPage: null,
        results: [aNewHope],
      });

      const response = await app.inject({ method: 'GET', url: '/api/swapi/films' });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body).toMatchObject({
        count: 1,
        results: [{ title: 'A New Hope', film_id: '1', image: '/static/films/4.jpg' }],
      });
      expect(body.results[0]).not.toHaveProperty('url');
    });

    it('returns 502 when SWAPI is unreachable', async () => {
      jest.spyOn(service, 'getFilms').mockRejectedValue(new Error('SWAPI unreachable'));

      const response = await app.inject({ method: 'GET', url: '/api/swapi/films' });

      expect(response.statusCode).toBe(502);
      expect(response.json()).toMatchObject({ error: 'SWAPI_FETCH_FAILED' });
    });

    it('rejects an invalid page query param', async () => {
      const response = await app.inject({ method: 'GET', url: '/api/swapi/films?page=abc' });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /api/swapi/films/:id', () => {
    it('returns the film', async () => {
      jest.spyOn(service, 'getFilmById').mockResolvedValue(aNewHope);

      const response = await app.inject({ method: 'GET', url: '/api/swapi/films/1' });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toMatchObject({ title: 'A New Hope', film_id: '1' });
    });

    it('returns 404 when the film does not exist', async () => {
      jest.spyOn(service, 'getFilmById').mockResolvedValue(null);

      const response = await app.inject({ method: 'GET', url: '/api/swapi/films/99999' });

      expect(response.statusCode).toBe(404);
      expect(response.json()).toMatchObject({ error: 'FILM_NOT_FOUND' });
    });

    it('returns 502 when SWAPI is unreachable', async () => {
      jest.spyOn(service, 'getFilmById').mockRejectedValue(new Error('SWAPI unreachable'));

      const response = await app.inject({ method: 'GET', url: '/api/swapi/films/1' });

      expect(response.statusCode).toBe(502);
      expect(response.json()).toMatchObject({ error: 'SWAPI_FETCH_FAILED' });
    });

    it('rejects a non-numeric id', async () => {
      const response = await app.inject({ method: 'GET', url: '/api/swapi/films/abc' });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /static/films/:file', () => {
    it('serves the poster image files', async () => {
      const response = await app.inject({ method: 'GET', url: '/static/films/4.jpg' });

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toContain('image/jpeg');
    });

    it('returns 404 for a non-existent poster', async () => {
      const response = await app.inject({ method: 'GET', url: '/static/films/99.jpg' });

      expect(response.statusCode).toBe(404);
    });
  });
});
