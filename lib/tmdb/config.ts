export const DEFAULT_TMDB_BASE_URL = "https://api.themoviedb.org/3";
export const DEFAULT_TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
export const DEFAULT_TMDB_LANGUAGE = "en-US";
export const DEFAULT_REVALIDATE_SECONDS = 60 * 15;

export function getTmdbBaseUrl() {
  return process.env.TMDB_BASE_URL?.trim() || DEFAULT_TMDB_BASE_URL;
}

export function getTmdbImageBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL?.trim() ||
    process.env.TMDB_IMAGE_BASE_URL?.trim() ||
    DEFAULT_TMDB_IMAGE_BASE_URL
  );
}

export function getTmdbApiKey() {
  return process.env.TMDB_API_KEY?.trim() || "";
}
