import type { DatabankCategory } from './databank.types';

export const DATABANK_ENDPOINT = '/_grill/filter/databank';

export const CATEGORY_MAP: Record<DatabankCategory, { filter: string; slug: string }> = {
  characters: { filter: 'Characters', slug: 'characters' },
  creatures: { filter: 'Creatures', slug: 'creatures' },
  droids: { filter: 'Droids', slug: 'droids' },
  locations: { filter: 'Locations', slug: 'locations' },
  species: { filter: 'Species', slug: 'species' },
  vehicles: { filter: 'Vehicles', slug: 'vehicles' },
};

export const MOD_PAGE_SIZE = 24;
export const BATCH_SIZE = 40;

export const SCRAPER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
  Accept: 'application/json',
};

export const SCRAPER_REFERER_FALLBACK = 'https://www.starwars.com/databank';
