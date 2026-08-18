export function extractPageNumber(url: string | null): number | null {
  if (!url) {
    return null;
  }
  const page = new URL(url).searchParams.get('page');
  return page ? Number(page) : null;
}

export function extractIdFromUrl(url: string): string {
  const match = /\/(\d+)\/?$/.exec(url);
  if (!match) {
    throw new Error(`Could not extract id from SWAPI url: ${url}`);
  }
  return match[1] as string;
}
