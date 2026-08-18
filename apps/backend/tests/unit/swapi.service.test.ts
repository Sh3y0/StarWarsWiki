import {
  getCharacterById,
  getCharacters,
  getStarshipById,
  getStarships,
} from '../../src/modules/swapi/swapi.service';
import {
  fetchPeople,
  fetchPerson,
  fetchStarship,
  fetchStarships,
} from '../../src/modules/swapi/swapi.client';
import { getAllItems } from '../../src/modules/databank/databank.service';

jest.mock('../../src/modules/swapi/swapi.client', () => ({
  fetchPeople: jest.fn(),
  fetchPerson: jest.fn(),
  fetchStarships: jest.fn(),
  fetchStarship: jest.fn(),
}));

jest.mock('../../src/modules/databank/databank.service', () => ({
  getAllItems: jest.fn(),
}));

const mockedFetchPeople = fetchPeople as jest.Mock;
const mockedFetchPerson = fetchPerson as jest.Mock;
const mockedFetchStarships = fetchStarships as jest.Mock;
const mockedFetchStarship = fetchStarship as jest.Mock;
const mockedGetAllItems = getAllItems as jest.Mock;

describe('swapi.service', () => {
  describe('getCharacters', () => {
    it('enriches SWAPI results with the matching databank item by name/title', async () => {
      mockedFetchPeople.mockResolvedValue({
        count: 2,
        next: 'https://swapi.dev/api/people/?page=2',
        previous: null,
        results: [
          { name: 'Luke Skywalker', url: 'https://swapi.dev/api/people/1/', starships: [] },
          { name: 'Unknown Guy', url: 'https://swapi.dev/api/people/99/', starships: [] },
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
          { name: 'Luke Skywalker', url: 'https://swapi.dev/api/people/1/', starships: [] },
        ],
      });
      mockedGetAllItems.mockResolvedValue([]);

      const result = await getCharacters();

      expect(result.results[0]?.character_id).toBe('1');
      expect(result.results[0]).not.toHaveProperty('url');
    });

    it('replaces the starships array of urls with an array of ids', async () => {
      mockedFetchPeople.mockResolvedValue({
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            name: 'Luke Skywalker',
            url: 'https://swapi.dev/api/people/1/',
            starships: [
              'https://swapi.dev/api/starships/12/',
              'https://swapi.dev/api/starships/22/',
            ],
          },
        ],
      });
      mockedGetAllItems.mockResolvedValue([]);

      const result = await getCharacters();

      expect(result.results[0]?.starships).toEqual(['12', '22']);
    });

    it('matches when the SWAPI name is only a substring of the databank title', async () => {
      mockedFetchPeople.mockResolvedValue({
        count: 1,
        next: null,
        previous: null,
        results: [{ name: 'C-3PO', url: 'https://swapi.dev/api/people/2/', starships: [] }],
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
        starships: ['https://swapi.dev/api/starships/13/'],
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
});
