/**
 * TMDB API client - server-side only.
 * Never expose API key to the browser.
 */

const TMDB_BASE_URL = process.env.TMDB_BASE_URL ?? "https://api.themoviedb.org/3";
const DEFAULT_REVALIDATE_SECONDS = 60 * 15;

type FetchParams = Record<string, string | number | boolean | undefined>;

const FALLBACK_TMDB_API_KEY = "aa844700ff3f44363be5bf50f78df0b1";

function getApiKey(): string {
  return (
    process.env.TMDB_API_KEY ??
    process.env.NEXT_PUBLIC_TMDB_API_KEY ??
    FALLBACK_TMDB_API_KEY
  );
}

function withBaseParams(params: FetchParams = {}): URLSearchParams {
  const searchParams = new URLSearchParams();
  const merged = {
    api_key: getApiKey(),
    language: "en-US",
    ...params,
  };

  Object.entries(merged).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  });

  return searchParams;
}

export interface FetchOptions {
  revalidate?: number;
  retries?: number;
}

export async function fetchFromTMDB<T>(
  endpoint: string,
  params?: FetchParams,
  options: FetchOptions = {}
): Promise<T | null> {
  const { revalidate = DEFAULT_REVALIDATE_SECONDS, retries = 2 } = options;
  const [path, queryString] = endpoint.split("?");
  const baseParams = withBaseParams(params);
  const existingParams = new URLSearchParams(queryString ?? "");

  existingParams.forEach((value, key) => baseParams.set(key, value));

  const url = `${TMDB_BASE_URL}${path}?${baseParams.toString()}`;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        next: { revalidate },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        console.error(`[TMDB] Request failed (${response.status}) for ${endpoint}`);
        return null;
      }

      return (await response.json()) as T;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
  }

  console.error(`[TMDB] Failed after ${retries + 1} attempts for ${endpoint}`, lastError);
  return null;
}
