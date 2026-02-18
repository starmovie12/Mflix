import { z } from "zod";
import { getAppEnv } from "@/lib/env";

export type TmdbFetchParams = Readonly<Record<string, string | number | boolean | undefined>>;

export type TmdbError = Readonly<{
  kind: "missing_api_key" | "http" | "network" | "invalid_response";
  endpoint: string;
  message: string;
  status?: number;
}>;

export type TmdbResult<T> = Readonly<{ ok: true; data: T }> | Readonly<{ ok: false; error: TmdbError }>;

export type TmdbRequestOptions = Readonly<{
  params?: TmdbFetchParams;
  revalidateSeconds?: number;
  timeoutMs?: number;
  retries?: number;
}>;

function buildUrl(endpoint: string, params: TmdbFetchParams | undefined): string {
  const { tmdbApiKey, tmdbBaseUrl } = getAppEnv();
  const [path, queryString] = endpoint.split("?");

  const searchParams = new URLSearchParams(queryString ?? "");
  if (tmdbApiKey) searchParams.set("api_key", tmdbApiKey);
  searchParams.set("language", "en-US");

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined) continue;
      searchParams.set(key, String(value));
    }
  }

  return `${tmdbBaseUrl}${path}?${searchParams.toString()}`;
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

function toNetworkError(endpoint: string, error: unknown): TmdbError {
  const message = error instanceof Error ? error.message : "Unknown network error";
  return { kind: "network", endpoint, message };
}

function toHttpError(endpoint: string, status: number, message: string): TmdbError {
  return { kind: "http", endpoint, status, message };
}

export async function tmdbGet<T>(
  endpoint: string,
  schema: z.ZodType<T>,
  options: TmdbRequestOptions = {}
): Promise<TmdbResult<T>> {
  const { tmdbApiKey } = getAppEnv();
  if (!tmdbApiKey) {
    return {
      ok: false,
      error: {
        kind: "missing_api_key",
        endpoint,
        message: "Missing TMDB_API_KEY. Add it to .env.local to enable TMDB requests."
      }
    };
  }

  const url = buildUrl(endpoint, options.params);
  const revalidateSeconds = options.revalidateSeconds ?? 60 * 15;
  const timeoutMs = options.timeoutMs ?? 8000;
  const retries = Math.max(0, Math.min(3, options.retries ?? 1));

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        next: { revalidate: revalidateSeconds }
      });

      if (!response.ok) {
        const shouldRetry = response.status >= 500 && response.status <= 599 && attempt < retries;
        if (shouldRetry) {
          await sleep(250 * Math.pow(2, attempt));
          continue;
        }

        return {
          ok: false,
          error: toHttpError(endpoint, response.status, `TMDB request failed (${response.status})`)
        };
      }

      const json = (await response.json()) as unknown;
      const parsed = schema.safeParse(json);
      if (!parsed.success) {
        return {
          ok: false,
          error: {
            kind: "invalid_response",
            endpoint,
            message: `Unexpected TMDB response shape: ${parsed.error.issues[0]?.message ?? "unknown error"}`
          }
        };
      }

      return { ok: true, data: parsed.data };
    } catch (error) {
      if (attempt < retries) {
        await sleep(250 * Math.pow(2, attempt));
        continue;
      }

      return { ok: false, error: toNetworkError(endpoint, error) };
    } finally {
      clearTimeout(timeout);
    }
  }

  return { ok: false, error: toNetworkError(endpoint, new Error("Unreachable")) };
}

