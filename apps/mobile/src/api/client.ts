export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function getBaseUrl(): string {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error(
      'Missing EXPO_PUBLIC_API_URL environment variable. Set it in apps/mobile/.env (see .env.example).',
    );
  }
  return baseUrl.replace(/\/$/, '');
}

export function resolveMediaUrl(path: string | undefined | null): string | undefined {
  if (!path) {
    return undefined;
  }
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  return `${getBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;
}

export async function apiGet<T>(
  path: string,
  params?: Record<string, string | number | undefined>,
): Promise<T> {
  const url = new URL(path, `${getBaseUrl()}/`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new ApiError(
      `Request to ${url.pathname} failed with status ${response.status}`,
      response.status,
    );
  }

  return (await response.json()) as T;
}
