import { DEFAULT_TMDB_IMAGE_BASE_URL, getTmdbImageBaseUrl } from "@/lib/tmdb/config";

export type TMDBImageSize = "w92" | "w154" | "w185" | "w300" | "w342" | "w500" | "w780" | "original";

const IMAGE_FALLBACK = "/placeholder.svg";

function normalizeImagePath(path: string | null | undefined) {
  if (!path) {
    return null;
  }

  return path.startsWith("/") ? path : `/${path}`;
}

/**
 * Centralized TMDB image URL construction.
 * Combines base URL + size + path to avoid broken image links.
 */
export function getImageUrl(path: string | null | undefined, size: TMDBImageSize = "w500") {
  const normalizedPath = normalizeImagePath(path);
  if (!normalizedPath) {
    return IMAGE_FALLBACK;
  }

  const baseUrl = getTmdbImageBaseUrl() || DEFAULT_TMDB_IMAGE_BASE_URL;
  return `${baseUrl}/${size}${normalizedPath}`;
}
