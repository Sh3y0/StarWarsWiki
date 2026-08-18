import {
  getCharacterById,
  getCharacters,
  getPlanetById,
  getPlanets,
  getStarshipById,
  getStarships,
  getVehicleById,
  getVehicles,
} from '../../src/modules/swapi/swapi.service';
import {
  fetchPeople,
  fetchPerson,
  fetchPlanet,
  fetchPlanets,
  fetchStarship,
  fetchStarships,
  fetchVehicle,
  fetchVehicles,
} from '../../src/modules/swapi/swapi.client';
import { getAllItems } from '../../src/modules/databank/databank.service';

jest.mock('../../src/modules/swapi/swapi.client', () => ({
  fetchPeople: jest.fn(),
  fetchPerson: jest.fn(),
  fetchStarships: jest.fn(),
  fetchStarship: jest.fn(),
  fetchVehicles: jest.fn(),
  fetchVehicle: jest.fn(),
  fetchPlanets: jest.fn(),
  fetchPlanet: jest.fn(),
}));

jest.mock('../../src/modules/databank/databank.service', () => ({
  getAllItems: jest.fn(),
}));

const mockedFetchPeople = fetchPeople as jest.Mock;
const mockedFetchPerson = fetchPerson as jest.Mock;
const mockedFetchStarships = fetchStarships as jest.Mock;
const mockedFetchStarship = fetchStarship as jest.Mock;
const mockedFetchVehicles = fetchVehicles as jest.Mock;
const mockedFetchVehicle = fetchVehicle as jest.Mock;
const mockedFetchPlanets = fetchPlanets as jest.Mock;
const mockedFetchPlanet = fetchPlanet as jest.Mock;
const mockedGetAllItems = getAllItems as jest.Mock;

describe('swapi.service', () => {
  describe('getCharacters', () => {
    it('enriches SWAPI results with the matching databank item by name/title', async () => {
      mockedFetchPeople.mockResolvedValue({
        count: 2,
        next: 'https://swapi.dev/api/people/?page=2',
        previous: null,
        results: [
          {
            name: 'Luke Skywalker',
            url: 'https://swapi.dev/api/people/1/',
            homeworld: 'https://swapi.dev/api/planets/1/',
            starships: [],
            vehicles: [],
          },
          {
            name: 'Unknown Guy',
            url: 'https://swapi.dev/api/people/99/',
            homeworld: 'https://swapi.dev/api/planets/1/',
            starships: [],
            vehicles: [],
          },
        ],
      });

      mockedGetAllItems.mockResolvedValue([
        { id: '1', slug: 'luke-skywalker', title: 'Luke Skywalker' },
      ]);

      const result = await getCharacters({ page: 1 });

      expect(result.count).toBe(2);
      expect(result.currentPage).toBe(1);
      expect(result.nextPage).toBe(2);
      expect(result.previousPage).toBeNull();
      expect(result.results[0]?.databank).toEqual({
        id: '1',
        slug: 'luke-skywalker',
        title: 'Luke Skywalker',
      });
      expect(result.results[1]?.databank).toBeNull();
    });

    it('replaces url with a numeric character_id extracted from the SWAPI url', async () => {
      mockedFetchPeople.mockResolvedValue({
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            name: 'Luke Skywalker',
            url: 'https://swapi.dev/api/people/1/',
            homeworld: 'https://swapi.dev/api/planets/1/',
            starships: [],
            vehicles: [],
          },
        ],
      });
      mockedGetAllItems.mockResolvedValue([]);

      const result = await getCharacters();

      expect(result.results[0]?.character_id).toBe('1');
      expect(result.results[0]).not.toHaveProperty('url');
    });

    it('replaces the starships and vehicles arrays of urls with arrays of ids', async () => {
      mockedFetchPeople.mockResolvedValue({
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            name: 'Luke Skywalker',
            url: 'https://swapi.dev/api/people/1/',
            homeworld: 'https://swapi.dev/api/planets/1/',
            starships: [
              'https://swapi.dev/api/starships/12/',
              'https://swapi.dev/api/starships/22/',
            ],
            vehicles: ['https://swapi.dev/api/vehicles/14/', 'https://swapi.dev/api/vehicles/30/'],
          },
        ],
      });
      mockedGetAllItems.mockResolvedValue([]);

      const result = await getCharacters();

      expect(result.results[0]?.starships).toEqual(['12', '22']);
      expect(result.results[0]?.vehicles).toEqual(['14', '30']);
    });

    it('replaces the homeworld url with just its numeric id', async () => {
      mockedFetchPeople.mockResolvedValue({
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            name: 'Luke Skywalker',
            url: 'https://swapi.dev/api/people/1/',
            homeworld: 'https://swapi.dev/api/planets/1/',
            starships: [],
            vehicles: [],
          },
        ],
      });
      mockedGetAllItems.mockResolvedValue([]);

      const result = await getCharacters();

      expect(result.results[0]?.homeworld).toBe('1');
    });

    it('matches when the SWAPI name is only a substring of the databank title', async () => {
      mockedFetchPeople.mockResolvedValue({
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            name: 'C-3PO',
            url: 'https://swapi.dev/api/people/2/',
            homeworld: 'https://swapi.dev/api/planets/1/',
            starships: [],
            vehicles: [],
          },
        ],
      });

      mockedGetAllItems.mockResolvedValue([
        { id: '2', slug: 'c-3po', title: 'C-3PO (See-Threepio)' },
      ]);

      const result = await getCharacters();

      expect(result.results[0]?.databank?.slug).toBe('c-3po');
    });

    it('does not forward page to the SWAPI client when searching (search is global)', async () => {
      mockedFetchPeople.mockResolvedValue({ count: 0, next: null, previous: null, results: [] });
      mockedGetAllItems.mockResolvedValue([]);

      const result = await getCharacters({ page: 3, search: 'vader' });

      expect(mockedFetchPeople).toHaveBeenCalledWith({ search: 'vader' });
      expect(mockedFetchPeople).not.toHaveBeenCalledWith(expect.objectContaining({ page: 3 }));
      expect(result.currentPage).toBeNull();
    });
  });

  describe('getCharacterById', () => {
    it('fetches a person by id and enriches it with the matching databank item', async () => {
      mockedFetchPerson.mockResolvedValue({
        name: 'Darth Vader',
        url: 'https://swapi.dev/api/people/4/',
        homeworld: 'https://swapi.dev/api/planets/1/',
        starships: ['https://swapi.dev/api/starships/13/'],
        vehicles: [],
      });
      mockedGetAllItems.mockResolvedValue([{ id: '4', slug: 'darth-vader', title: 'Darth Vader' }]);

      const result = await getCharacterById('4');

      expect(mockedFetchPerson).toHaveBeenCalledWith('4');
      expect(result?.character_id).toBe('4');
      expect(result).not.toHaveProperty('url');
      expect(result?.starships).toEqual(['13']);
      expect(result?.databank?.slug).toBe('darth-vader');
    });

    it('returns null when SWAPI has no matching person', async () => {
      mockedFetchPerson.mockResolvedValue(null);
      mockedGetAllItems.mockResolvedValue([]);

      const result = await getCharacterById('99999');

      expect(result).toBeNull();
    });
  });

  describe('getStarships', () => {
    it('replaces url with starship_id and reads databank items from the vehicles category', async () => {
      mockedFetchStarships.mockResolvedValue({
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            name: 'Millennium Falcon',
            url: 'https://swapi.dev/api/starships/10/',
            pilots: [],
          },
        ],
      });
      mockedGetAllItems.mockResolvedValue([
        { id: '10', slug: 'millennium-falcon', title: 'Millennium Falcon' },
      ]);

      const result = await getStarships();

      expect(mockedGetAllItems).toHaveBeenCalledWith('vehicles');
      expect(result.results[0]?.starship_id).toBe('10');
      expect(result.results[0]).not.toHaveProperty('url');
      expect(result.results[0]?.databank?.slug).toBe('millennium-falcon');
    });

    it('replaces the pilots array of urls with an array of ids', async () => {
      mockedFetchStarships.mockResolvedValue({
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            name: 'Millennium Falcon',
            model: 'YT-1300 light freighter',
            url: 'https://swapi.dev/api/starships/10/',
            pilots: ['https://swapi.dev/api/people/13/', 'https://swapi.dev/api/people/14/'],
          },
        ],
      });
      mockedGetAllItems.mockResolvedValue([]);

      const result = await getStarships();

      expect(result.results[0]?.pilots).toEqual(['13', '14']);
    });

    it('matches via token overlap for real-world name drift (Calamari Cruiser -> Mon Calamari Star Cruiser)', async () => {
      mockedFetchStarships.mockResolvedValue({
        count: 1,
        next: null,
        previous: null,
        results: [
          { name: 'Calamari Cruiser', url: 'https://swapi.dev/api/starships/27/', pilots: [] },
        ],
      });
      mockedGetAllItems.mockResolvedValue([
        { id: '1', slug: 'mon-calamari-star-cruiser', title: 'Mon Calamari Star Cruiser' },
        { id: '2', slug: 'republic-cruiser', title: 'Republic Cruiser' },
      ]);

      const result = await getStarships();

      expect(result.results[0]?.databank?.slug).toBe('mon-calamari-star-cruiser');
    });

    it('does not forward page to the SWAPI client when searching', async () => {
      mockedFetchStarships.mockResolvedValue({
        count: 0,
        next: null,
        previous: null,
        results: [],
      });
      mockedGetAllItems.mockResolvedValue([]);

      const result = await getStarships({ page: 2, search: 'falcon' });

      expect(mockedFetchStarships).toHaveBeenCalledWith({ search: 'falcon' });
      expect(mockedFetchStarships).not.toHaveBeenCalledWith(expect.objectContaining({ page: 2 }));
      expect(result.currentPage).toBeNull();
    });

    it('falls back to matching by model when the name has no databank match', async () => {
      mockedFetchStarships.mockResolvedValue({
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            name: 'Rebel transport',
            model: 'GR-75 medium transport',
            url: 'https://swapi.dev/api/starships/17/',
            pilots: [],
          },
        ],
      });
      mockedGetAllItems.mockResolvedValue([
        { id: '1', slug: 'gr-75-medium-transport', title: 'GR-75 Medium Transport' },
      ]);

      const result = await getStarships();

      expect(result.results[0]?.databank?.slug).toBe('gr-75-medium-transport');
    });

    it('prefers a name match over a model match when both exist', async () => {
      mockedFetchStarships.mockResolvedValue({
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            name: 'Millennium Falcon',
            model: 'YT-1300 light freighter',
            url: 'https://swapi.dev/api/starships/10/',
            pilots: [],
          },
        ],
      });
      mockedGetAllItems.mockResolvedValue([
        { id: '1', slug: 'millennium-falcon', title: 'Millennium Falcon' },
        { id: '2', slug: 'yt-1300-light-freighter', title: 'YT-1300 Light Freighter' },
      ]);

      const result = await getStarships();

      expect(result.results[0]?.databank?.slug).toBe('millennium-falcon');
    });
  });

  describe('getStarshipById', () => {
    it('fetches a starship by id and enriches it with the matching databank item', async () => {
      mockedFetchStarship.mockResolvedValue({
        name: 'Millennium Falcon',
        url: 'https://swapi.dev/api/starships/10/',
        pilots: ['https://swapi.dev/api/people/13/'],
      });
      mockedGetAllItems.mockResolvedValue([
        { id: '10', slug: 'millennium-falcon', title: 'Millennium Falcon' },
      ]);

      const result = await getStarshipById('10');

      expect(mockedFetchStarship).toHaveBeenCalledWith('10');
      expect(result?.starship_id).toBe('10');
      expect(result).not.toHaveProperty('url');
      expect(result?.pilots).toEqual(['13']);
      expect(result?.databank?.slug).toBe('millennium-falcon');
    });

    it('returns null when SWAPI has no matching starship', async () => {
      mockedFetchStarship.mockResolvedValue(null);
      mockedGetAllItems.mockResolvedValue([]);

      const result = await getStarshipById('99999');

      expect(result).toBeNull();
    });
  });

  describe('getVehicles', () => {
    it('replaces url with vehicle_id and reads databank items from the vehicles category', async () => {
      mockedFetchVehicles.mockResolvedValue({
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            name: 'Sand Crawler',
            model: 'Digger Crawler',
            url: 'https://swapi.dev/api/vehicles/4/',
            pilots: [],
          },
        ],
      });
      mockedGetAllItems.mockResolvedValue([
        { id: '4', slug: 'sand-crawler', title: 'Sand Crawler' },
      ]);

      const result = await getVehicles();

      expect(mockedGetAllItems).toHaveBeenCalledWith('vehicles');
      expect(result.results[0]?.vehicle_id).toBe('4');
      expect(result.results[0]).not.toHaveProperty('url');
      expect(result.results[0]?.databank?.slug).toBe('sand-crawler');
    });

    it('replaces the pilots array of urls with an array of ids', async () => {
      mockedFetchVehicles.mockResolvedValue({
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            name: 'Snowspeeder',
            model: 't-47 airspeeder',
            url: 'https://swapi.dev/api/vehicles/14/',
            pilots: ['https://swapi.dev/api/people/1/', 'https://swapi.dev/api/people/18/'],
          },
        ],
      });
      mockedGetAllItems.mockResolvedValue([]);

      const result = await getVehicles();

      expect(result.results[0]?.pilots).toEqual(['1', '18']);
    });

    it('falls back to matching by model when the name has no databank match', async () => {
      mockedFetchVehicles.mockResolvedValue({
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            name: 'Rebel transport',
            model: 'GR-75 medium transport',
            url: 'https://swapi.dev/api/vehicles/17/',
            pilots: [],
          },
        ],
      });
      mockedGetAllItems.mockResolvedValue([
        { id: '1', slug: 'gr-75-medium-transport', title: 'GR-75 Medium Transport' },
      ]);

      const result = await getVehicles();

      expect(result.results[0]?.databank?.slug).toBe('gr-75-medium-transport');
    });

    it('does not forward page to the SWAPI client when searching', async () => {
      mockedFetchVehicles.mockResolvedValue({
        count: 0,
        next: null,
        previous: null,
        results: [],
      });
      mockedGetAllItems.mockResolvedValue([]);

      const result = await getVehicles({ page: 2, search: 'speeder' });

      expect(mockedFetchVehicles).toHaveBeenCalledWith({ search: 'speeder' });
      expect(mockedFetchVehicles).not.toHaveBeenCalledWith(expect.objectContaining({ page: 2 }));
      expect(result.currentPage).toBeNull();
    });
  });

  describe('getVehicleById', () => {
    it('fetches a vehicle by id and enriches it with the matching databank item', async () => {
      mockedFetchVehicle.mockResolvedValue({
        name: 'Sand Crawler',
        model: 'Digger Crawler',
        url: 'https://swapi.dev/api/vehicles/4/',
        pilots: ['https://swapi.dev/api/people/5/'],
      });
      mockedGetAllItems.mockResolvedValue([
        { id: '4', slug: 'sand-crawler', title: 'Sand Crawler' },
      ]);

      const result = await getVehicleById('4');

      expect(mockedFetchVehicle).toHaveBeenCalledWith('4');
      expect(result?.vehicle_id).toBe('4');
      expect(result).not.toHaveProperty('url');
      expect(result?.pilots).toEqual(['5']);
      expect(result?.databank?.slug).toBe('sand-crawler');
    });

    it('returns null when SWAPI has no matching vehicle', async () => {
      mockedFetchVehicle.mockResolvedValue(null);
      mockedGetAllItems.mockResolvedValue([]);

      const result = await getVehicleById('99999');

      expect(result).toBeNull();
    });
  });

  describe('getPlanets', () => {
    it('replaces url with planet_id and reads databank items from the locations category', async () => {
      mockedFetchPlanets.mockResolvedValue({
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            name: 'Tatooine',
            url: 'https://swapi.dev/api/planets/1/',
            residents: [],
          },
        ],
      });
      mockedGetAllItems.mockResolvedValue([{ id: '1', slug: 'tatooine', title: 'Tatooine' }]);

      const result = await getPlanets();

      expect(mockedGetAllItems).toHaveBeenCalledWith('locations');
      expect(result.results[0]?.planet_id).toBe('1');
      expect(result.results[0]).not.toHaveProperty('url');
      expect(result.results[0]?.databank?.slug).toBe('tatooine');
    });

    it('replaces the residents array of urls with an array of ids', async () => {
      mockedFetchPlanets.mockResolvedValue({
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            name: 'Tatooine',
            url: 'https://swapi.dev/api/planets/1/',
            residents: ['https://swapi.dev/api/people/1/', 'https://swapi.dev/api/people/2/'],
          },
        ],
      });
      mockedGetAllItems.mockResolvedValue([]);

      const result = await getPlanets();

      expect(result.results[0]?.residents).toEqual(['1', '2']);
    });

    it('matches roman-numeral vs digit naming drift (Yavin IV -> Yavin 4)', async () => {
      mockedFetchPlanets.mockResolvedValue({
        count: 1,
        next: null,
        previous: null,
        results: [{ name: 'Yavin IV', url: 'https://swapi.dev/api/planets/3/', residents: [] }],
      });
      mockedGetAllItems.mockResolvedValue([{ id: '1', slug: 'yavin-4', title: 'Yavin 4' }]);

      const result = await getPlanets();

      expect(result.results[0]?.databank?.slug).toBe('yavin-4');
    });

    it('does not forward page to the SWAPI client when searching', async () => {
      mockedFetchPlanets.mockResolvedValue({
        count: 0,
        next: null,
        previous: null,
        results: [],
      });
      mockedGetAllItems.mockResolvedValue([]);

      const result = await getPlanets({ page: 2, search: 'tatooine' });

      expect(mockedFetchPlanets).toHaveBeenCalledWith({ search: 'tatooine' });
      expect(mockedFetchPlanets).not.toHaveBeenCalledWith(expect.objectContaining({ page: 2 }));
      expect(result.currentPage).toBeNull();
    });
  });

  describe('getPlanetById', () => {
    it('fetches a planet by id and enriches it with the matching databank item', async () => {
      mockedFetchPlanet.mockResolvedValue({
        name: 'Tatooine',
        url: 'https://swapi.dev/api/planets/1/',
        residents: ['https://swapi.dev/api/people/1/'],
      });
      mockedGetAllItems.mockResolvedValue([{ id: '1', slug: 'tatooine', title: 'Tatooine' }]);

      const result = await getPlanetById('1');

      expect(mockedFetchPlanet).toHaveBeenCalledWith('1');
      expect(result?.planet_id).toBe('1');
      expect(result).not.toHaveProperty('url');
      expect(result?.residents).toEqual(['1']);
      expect(result?.databank?.slug).toBe('tatooine');
    });

    it('returns null when SWAPI has no matching planet', async () => {
      mockedFetchPlanet.mockResolvedValue(null);
      mockedGetAllItems.mockResolvedValue([]);

      const result = await getPlanetById('99999');

      expect(result).toBeNull();
    });
  });
});
