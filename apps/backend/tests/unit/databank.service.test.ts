import { promises as fs } from 'node:fs';
import { getItems, syncCategory } from '../../src/modules/databank/databank.service';
import { fetchAllItems } from '../../src/modules/databank/databank.scraper';
import type { DatabankFile } from '../../src/modules/databank/databank.types';

jest.mock('node:fs', () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
    mkdir: jest.fn(),
  },
}));

jest.mock('../../src/modules/databank/databank.scraper', () => ({
  fetchAllItems: jest.fn(),
}));

const mockedReadFile = fs.readFile as jest.Mock;
const mockedWriteFile = fs.writeFile as jest.Mock;
const mockedFetchAllItems = fetchAllItems as jest.Mock;

describe('databank.service', () => {
  describe('getItems', () => {
    const storedFile: DatabankFile = {
      category: 'characters',
      updatedAt: '2024-01-01T00:00:00.000Z',
      count: 3,
      items: [
        { id: '1', slug: 'darth-vader', title: 'Darth Vader' },
        { id: '2', slug: 'luke-skywalker', title: 'Luke Skywalker' },
        { id: '3', slug: 'leia-organa', title: 'Leia Organa' },
      ],
    };

    beforeEach(() => {
      mockedReadFile.mockResolvedValue(JSON.stringify(storedFile));
    });

    it('returns all items when no options are given', async () => {
      const result = await getItems('characters');
      expect(result).toHaveLength(3);
    });

    it('filters by case-insensitive title search', async () => {
      const result = await getItems('characters', { search: 'vader' });
      expect(result).toEqual([storedFile.items[0]]);
    });

    it('returns a single item by slug', async () => {
      const result = await getItems('characters', { slug: 'leia-organa' });
      expect(result).toEqual([storedFile.items[2]]);
    });

    it('applies limit and offset', async () => {
      const result = await getItems('characters', { offset: 1, limit: 1 });
      expect(result).toEqual([storedFile.items[1]]);
    });

    it('returns empty array when the file does not exist yet', async () => {
      mockedReadFile.mockRejectedValueOnce(new Error('ENOENT'));
      const result = await getItems('vehicles');
      expect(result).toEqual([]);
    });
  });

  describe('syncCategory', () => {
    it('fetches items and writes them to disk', async () => {
      mockedFetchAllItems.mockResolvedValue([{ id: '1', slug: 'r2-d2', title: 'R2-D2' }]);
      mockedWriteFile.mockResolvedValue(undefined);

      const result = await syncCategory('droids');

      expect(mockedFetchAllItems).toHaveBeenCalledWith('droids');
      expect(mockedWriteFile).toHaveBeenCalledTimes(1);
      expect(result.category).toBe('droids');
      expect(result.totalFetched).toBe(1);
      expect(result.filePath).toContain('droids.json');
    });
  });
});
