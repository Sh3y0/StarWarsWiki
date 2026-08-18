import { getCharacterById, getCharacters } from '../../src/modules/swapi/swapi.service';
import { fetchPeople, fetchPerson } from '../../src/modules/swapi/swapi.client';
import { getAllItems } from '../../src/modules/databank/databank.service';

jest.mock('../../src/modules/swapi/swapi.client', () => ({
  fetchPeople: jest.fn(),
  fetchPerson: jest.fn(),
}));

jest.mock('../../src/modules/databank/databank.service', () => ({
  getAllItems: jest.fn(),
}));

const mockedFetchPeople = fetchPeople as jest.Mock;
const mockedFetchPerson = fetchPerson as jest.Mock;
const mockedGetAllItems = getAllItems as jest.Mock;

describe('swapi.service', () => {
  describe('getCharacters', () => {
    it('enriches SWAPI results with the matching databank item by name/title', async () => {
      mockedFetchPeople.mockResolvedValue({
        count: 2,
        next: 'https://swapi.dev/api/people/?page=2',
        previous: null,
        results: [
          { name: 'Luke Skywalker', url: 'https://swapi.dev/api/people/1/' },
          { name: 'Unknown Guy', url: 'https://swapi.dev/api/people/99/' },
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
        results: [{ name: 'Luke Skywalker', url: 'https://swapi.dev/api/people/1/' }],
      });
      mockedGetAllItems.mockResolvedValue([]);

      const result = await getCharacters();

      expect(result.results[0]?.character_id).toBe('1');
      expect(result.results[0]).not.toHaveProperty('url');
    });

    it('matches names case-insensitively', async () => {
      mockedFetchPeople.mockResolvedValue({
        count: 1,
        next: null,
        previous: null,
        results: [{ name: 'C-3PO', url: 'https://swapi.dev/api/people/2/' }],
      });

      mockedGetAllItems.mockResolvedValue([{ id: '2', slug: 'c-3po', title: 'c-3po' }]);

      const result = await getCharacters();

      expect(result.results[0]?.databank?.slug).toBe('c-3po');
    });

    it('matches when the SWAPI name is only a substring of the databank title', async () => {
      mockedFetchPeople.mockResolvedValue({
        count: 1,
        next: null,
        previous: null,
        results: [{ name: 'C-3PO', url: 'https://swapi.dev/api/people/2/' }],
      });

      mockedGetAllItems.mockResolvedValue([
        { id: '2', slug: 'c-3po', title: 'C-3PO (See-Threepio)' },
      ]);

      const result = await getCharacters();

      expect(result.results[0]?.databank?.slug).toBe('c-3po');
    });

    it('forwards page to the SWAPI client when no search is given', async () => {
      mockedFetchPeople.mockResolvedValue({ count: 0, next: null, previous: null, results: [] });
      mockedGetAllItems.mockResolvedValue([]);

      await getCharacters({ page: 3 });

      expect(mockedFetchPeople).toHaveBeenCalledWith({ page: 3 });
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
      });
      mockedGetAllItems.mockResolvedValue([{ id: '4', slug: 'darth-vader', title: 'Darth Vader' }]);

      const result = await getCharacterById('4');

      expect(mockedFetchPerson).toHaveBeenCalledWith('4');
      expect(result?.character_id).toBe('4');
      expect(result).not.toHaveProperty('url');
      expect(result?.databank?.slug).toBe('darth-vader');
    });

    it('returns null when SWAPI has no matching person', async () => {
      mockedFetchPerson.mockResolvedValue(null);
      mockedGetAllItems.mockResolvedValue([]);

      const result = await getCharacterById('99999');

      expect(result).toBeNull();
    });
  });
});
