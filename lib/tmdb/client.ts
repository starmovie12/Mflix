import "server-only";

import { z } from "zod";
import { env, hasTmdbApiKey } from "@/lib/env";

const DEFAULT_REVALIDATE_SECONDS = 60 * 15;
const DEFAULT_TIMEOUT_MS = 8000;
const DEFAULT_RETRIES = 2;

type TmdbErrorCode = "CONFIG" | "NETWORK" | "HTTP" | "PARSE" | "TIMEOUT";
type TmdbRequestParams = Record<string, string | number | boolean | undefined>;

interface TmdbRequestOptions {
  params?: TmdbRequestParams;
  revalidate?: number;
  retries?: number;
  timeoutMs?: number;
  cache?: RequestCache;
  tags?: string[];
}

export class TmdbApiError extends Error {
  readonly code: TmdbErrorCode;
  readonly status: number | null;
  readonly details: unknown;

  constructor(message: string, code: TmdbErrorCode, status: number | null = null, details: unknown = null) {
    super(message);
    this.name = "TmdbApiError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

function isRetryableStatus(status: number) {
  return status >= 500 || status === 429;
}

function toUrl(endpoint: string, params: TmdbRequestParams = {}) {
  if (!hasTmdbApiKey() || !env.TMDB_API_KEY) {
    throw new TmdbApiError(
      "TMDB_API_KEY is not configured. Add it to .env.local before running TMDB-powered routes.",
      "CONFIG"
    );
  }

  const [path, existingQuery = ""] = endpoint.split("?");
  const searchParams = new URLSearchParams(existingQuery);

  searchParams.set("api_key", env.TMDB_API_KEY);
  searchParams.set("language", "en-US");

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) {
      continue;
    }

    searchParams.set(key, String(value));
  }

  return `${env.TMDB_BASE_URL}${path}?${searchParams.toString()}`;
}

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

async function fetchWithTimeout(url: string, options: TmdbRequestOptions) {
  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const requestInit: RequestInit & {
      next?: {
        revalidate: number;
        tags?: string[];
      };
    } = {
      method: "GET",
      signal: controller.signal
    };

    if (options.cache) {
      requestInit.cache = options.cache;
    } else {
      requestInit.next = {
        revalidate: options.revalidate ?? DEFAULT_REVALIDATE_SECONDS,
        tags: options.tags
      };
    }

    return await fetch(url, requestInit);
  } catch (error) {
    if (isAbortError(error)) {
      throw new TmdbApiError(`TMDB request timed out after ${timeoutMs}ms`, "TIMEOUT");
    }

    throw new TmdbApiError("TMDB network request failed", "NETWORK", null, error);
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function tmdbRequest<T>(
  endpoint: string,
  schema: z.ZodType<T>,
  options: TmdbRequestOptions = {}
): Promise<T> {
  const retries = options.retries ?? DEFAULT_RETRIES;
  const url = toUrl(endpoint, options.params);

  let lastError: unknown = null;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetchWithTimeout(url, options);

      if (!response.ok) {
        const body = await response.text();
        const requestError = new TmdbApiError(
          `TMDB request failed with status ${response.status}`,
          "HTTP",
          response.status,
          body
        );

        if (attempt < retries && isRetryableStatus(response.status)) {
          await sleep(250 * 2 ** attempt);
          continue;
        }

        throw requestError;
      }

      const json = (await response.json()) as unknown;
      const parsed = schema.safeParse(json);

      if (!parsed.success) {
        throw new TmdbApiError("TMDB response validation failed", "PARSE", response.status, parsed.error.issues);
      }

      return parsed.data;
    } catch (error) {
      lastError = error;

      if (attempt >= retries) {
        break;
      }

      if (error instanceof TmdbApiError) {
        if (error.code === "CONFIG" || error.code === "PARSE") {
          break;
        }

        if (error.code === "HTTP" && error.status !== null && !isRetryableStatus(error.status)) {
          break;
        }
      }

      await sleep(250 * 2 ** attempt);
    }
  }

  if (lastError instanceof Error) {
    throw lastError;
  }

  throw new TmdbApiError("Unknown TMDB request error", "NETWORK");
}

export function mapTmdbError(error: unknown) {
  if (error instanceof TmdbApiError) {
    switch (error.code) {
      case "CONFIG":
        return {
          code: error.code,
          message: "TMDB key is missing. Set TMDB_API_KEY in .env.local."
        };
      case "TIMEOUT":
        return {
          code: error.code,
          message: "TMDB took too long to respond. Please retry in a moment."
        };
      case "HTTP":
        return {
          code: error.code,
          message:
            error.status === 404
              ? "The requested title was not found."
              : "TMDB request failed. Please retry."
        };
      default:
        return {
          code: error.code,
          message: "TMDB data is unavailable right now."
        };
    }
  }

  return {
    code: "UNKNOWN",
    message: "Unexpected error while loading TMDB data."
  };
}
