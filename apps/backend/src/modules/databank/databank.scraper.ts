import { env } from '../../config/env';
import {
  BATCH_SIZE,
  CATEGORY_MAP,
  DATABANK_ENDPOINT,
  MOD_PAGE_SIZE,
  SCRAPER_HEADERS,
  SCRAPER_REFERER_FALLBACK,
} from './databank.constants';
import type { DatabankApiResponse, DatabankCategory, DatabankItem } from './databank.types';

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 500;

function nowTimestamp(): string {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  return `${hh}_${mm}`;
}

function buildUrl(category: DatabankCategory, offset: number | undefined): string {
  const { filter, slug } = CATEGORY_MAP[category];
  const url = new URL(DATABANK_ENDPOINT, env.STARWARS_BASE_URL);
  url.searchParams.set('filter', filter);
  url.searchParams.set('mod', String(MOD_PAGE_SIZE));
  url.searchParams.set('slug', slug);

  if (offset === undefined) {
    url.searchParams.set('updated_at', nowTimestamp());
  } else {
    url.searchParams.set('offset', String(offset));
  }

  return url.toString();
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchPage(
  category: DatabankCategory,
  offset: number | undefined,
  useReferer: boolean,
): Promise<DatabankApiResponse> {
  const url = buildUrl(category, offset);
  const headers: Record<string, string> = { ...SCRAPER_HEADERS };
  if (useReferer) {
    headers.Referer = SCRAPER_REFERER_FALLBACK;
  }

  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const response = await fetch(url, { headers });

      if (!response.ok) {
        const contentType = response.headers.get('content-type') ?? '';
        if (!contentType.includes('application/json') && !useReferer) {
          return fetchPage(category, offset, true);
        }
        throw new Error(
          `StarWars.com responded ${response.status} ${response.statusText} for ${url}`,
        );
      }

      const contentType = response.headers.get('content-type') ?? '';
      if (!contentType.includes('application/json')) {
        if (!useReferer) {
          return fetchPage(category, offset, true);
        }
        throw new Error(
          `StarWars.com returned non-JSON content (likely an HTML error page) for ${url}`,
        );
      }

      const data = (await response.json()) as DatabankApiResponse;
      return data;
    } catch (error) {
      lastError = error;
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS * (attempt + 1));
      }
    }
  }

  throw new Error(
    `Sync failed for "${category}" after ${MAX_RETRIES + 1} attempts: ${
      lastError instanceof Error ? lastError.message : String(lastError)
    }`,
  );
}

export async function fetchAllItems(category: DatabankCategory): Promise<DatabankItem[]> {
  const items: DatabankItem[] = [];

  const first = await fetchPage(category, undefined, false);
  items.push(...first.data);

  const total = first.count ?? items.length;

  let offset = BATCH_SIZE;
  while (items.length < total) {
    const page = await fetchPage(category, offset, false);
    if (page.data.length === 0) {
      break;
    }
    items.push(...page.data);
    offset += BATCH_SIZE;
  }

  return items;
}
