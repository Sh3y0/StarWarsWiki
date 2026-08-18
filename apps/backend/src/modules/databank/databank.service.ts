import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fetchAllItems } from './databank.scraper';
import type { DatabankCategory, DatabankFile, SyncResult } from './databank.types';

const DATA_DIR = path.resolve(__dirname, '../../../data');

function filePathFor(category: DatabankCategory): string {
  return path.join(DATA_DIR, `${category}.json`);
}

async function readDatabankFile(category: DatabankCategory): Promise<DatabankFile> {
  const filePath = filePathFor(category);
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw) as DatabankFile;
  } catch {
    return { category, updatedAt: null, count: 0, items: [] };
  }
}

async function writeDatabankFile(data: DatabankFile): Promise<string> {
  const filePath = filePathFor(data.category);
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  return filePath;
}

export interface GetItemsOptions {
  search?: string;
  limit?: number;
  offset?: number;
  slug?: string;
}

export async function getItems(category: DatabankCategory, options: GetItemsOptions = {}) {
  const file = await readDatabankFile(category);
  let items = file.items;

  if (options.slug) {
    const match = items.find((item) => item.slug === options.slug);
    return match ? [match] : [];
  }

  if (options.search) {
    const needle = options.search.toLowerCase();
    items = items.filter((item) => item.title?.toLowerCase().includes(needle));
  }

  const offset = options.offset ?? 0;
  const limit = options.limit ?? items.length;

  return items.slice(offset, offset + limit);
}

export async function syncCategory(category: DatabankCategory): Promise<SyncResult> {
  const items = await fetchAllItems(category);
  const updatedAt = new Date().toISOString();

  const filePath = await writeDatabankFile({
    category,
    updatedAt,
    count: items.length,
    items,
  });

  return {
    category,
    totalFetched: items.length,
    updatedAt,
    filePath,
  };
}
