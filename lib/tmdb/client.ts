import "server-only";

import { DEFAULT_REVALIDATE_SECONDS, DEFAULT_TMDB_LANGUAGE, getTmdbApiKey, getTmdbBaseUrl } from "@/lib/tmdb/config";

type FetchParamValue = string | number | boolean | undefined | null;
type FetchParams = Record<string, FetchParamValue>;

interface TMDBFetchOptions {
  params?: FetchParams;
  revalidateSeconds?: number;
  retries?: number;
}

function buildUrl(path: string, params: FetchParams = {}) {
  const baseUrl = getTmdbBaseUrl().replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const [pathname, queryString = ""] = normalizedPath.split("?");
  const url = new URL(`${baseUrl}${pathname}`);
  const query = new URLSearchParams(queryString);

  const apiKey = getTmdbApiKey();
  if (apiKey) {
    query.set("api_key", apiKey);
  }

  query.set("language", DEFAULT_TMDB_LANGUAGE);

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    query.set(key, String(value));
  });

  url.search = query.toString();
  return url.toString();
}

export async function tmdbFetch<T>(
  path: string,
  { params = {}, revalidateSeconds = DEFAULT_REVALIDATE_SECONDS, retries = 1 }: TMDBFetchOptions = {}
): Promise<T | null> {
  const apiKey = getTmdbApiKey();
  if (!apiKey) {
    console.error("[TMDB] Missing TMDB_API_KEY environment variable.");
    return null;
  }

  const url = buildUrl(path, params);

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, {
        next: { revalidate: revalidateSeconds }
      });

      if (response.ok) {
        return (await response.json()) as T;
      }

      const shouldRetry = response.status >= 500 && attempt < retries;
      if (!shouldRetry) {
        console.error(`[TMDB] Request failed (${response.status}) for ${path}`);
        return null;
      }
    } catch (error) {
      if (attempt >= retries) {
        console.error(`[TMDB] Unexpected error while fetching ${path}`, error);
        return null;
      }
    }
  }

  return null;
}
