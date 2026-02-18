const TMDB_BASE_URL = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";
const FALLBACK_KEY = "aa844700ff3f44363be5bf50f78df0b1";
const TMDB_API_KEY = process.env.TMDB_API_KEY || FALLBACK_KEY;

const DEFAULT_REVALIDATE = 60 * 15;
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 800;

type QueryParams = Record<string, string | number | boolean | undefined>;

function buildUrl(endpoint: string, params: QueryParams = {}): string {
  const [path, existingQuery] = endpoint.split("?");
  const searchParams = new URLSearchParams(existingQuery ?? "");

  searchParams.set("api_key", TMDB_API_KEY);
  searchParams.set("language", "en-US");

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  }

  return `${TMDB_BASE_URL}${path}?${searchParams.toString()}`;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchTMDB<T>(
  endpoint: string,
  params?: QueryParams,
  revalidate: number = DEFAULT_REVALIDATE
): Promise<T> {
  const url = buildUrl(endpoint, params);

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, {
        next: { revalidate },
      });

      if (!response.ok) {
        if (response.status === 429 && attempt < MAX_RETRIES) {
          await sleep(RETRY_DELAY_MS * (attempt + 1));
          continue;
        }
        throw new Error(`TMDB API error: ${response.status} ${response.statusText} for ${endpoint}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS * (attempt + 1));
      }
    }
  }

  throw lastError ?? new Error(`Failed to fetch ${endpoint}`);
}

export async function fetchTMDBSafe<T>(
  endpoint: string,
  params?: QueryParams,
  revalidate?: number
): Promise<T | null> {
  try {
    return await fetchTMDB<T>(endpoint, params, revalidate);
  } catch (error) {
    console.error(`[TMDB] ${(error as Error).message}`);
    return null;
  }
}
