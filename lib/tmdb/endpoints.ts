import { fetchTMDB, fetchTMDBSafe } from "./client";
import type {
  TMDBListResponse,
  TMDBMovie,
  TMDBMovieDetails,
  TMDBTVDetails,
  TMDBSeasonDetails,
  TMDBGenre,
  MediaType,
} from "@/types/tmdb";

// ─── Trending ────────────────────────────────────────────────────────
export async function getTrending(mediaType: MediaType | "all" = "all", timeWindow: "day" | "week" = "week") {
  return fetchTMDBSafe<TMDBListResponse>(`/trending/${mediaType}/${timeWindow}`);
}

// ─── Movies ──────────────────────────────────────────────────────────
export async function getPopularMovies(page = 1) {
  return fetchTMDBSafe<TMDBListResponse>("/movie/popular", { page });
}

export async function getTopRatedMovies(page = 1) {
  return fetchTMDBSafe<TMDBListResponse>("/movie/top_rated", { page });
}

export async function getUpcomingMovies(page = 1) {
  return fetchTMDBSafe<TMDBListResponse>("/movie/upcoming", { page });
}

export async function getNowPlayingMovies(page = 1) {
  return fetchTMDBSafe<TMDBListResponse>("/movie/now_playing", { page });
}

// ─── TV Shows ────────────────────────────────────────────────────────
export async function getPopularTV(page = 1) {
  return fetchTMDBSafe<TMDBListResponse>("/tv/popular", { page });
}

export async function getTopRatedTV(page = 1) {
  return fetchTMDBSafe<TMDBListResponse>("/tv/top_rated", { page });
}

export async function getAiringTodayTV(page = 1) {
  return fetchTMDBSafe<TMDBListResponse>("/tv/airing_today", { page });
}

export async function getOnTheAirTV(page = 1) {
  return fetchTMDBSafe<TMDBListResponse>("/tv/on_the_air", { page });
}

// ─── Discover ────────────────────────────────────────────────────────
export async function discoverByGenre(mediaType: MediaType, genreId: number, page = 1) {
  return fetchTMDBSafe<TMDBListResponse>(`/discover/${mediaType}`, {
    with_genres: genreId,
    sort_by: "popularity.desc",
    include_adult: false,
    page,
  });
}

export async function discoverKidsSafe(mediaType: MediaType = "movie", page = 1) {
  return fetchTMDBSafe<TMDBListResponse>(`/discover/${mediaType}`, {
    certification_country: "US",
    "certification.lte": "G",
    sort_by: "popularity.desc",
    with_genres: 16,
    page,
  });
}

// ─── Details ─────────────────────────────────────────────────────────
export async function getMovieDetails(movieId: number) {
  return fetchTMDBSafe<TMDBMovieDetails>(
    `/movie/${movieId}`,
    { append_to_response: "videos,credits,images,similar,recommendations" },
    60 * 30
  );
}

export async function getTVDetails(tvId: number) {
  return fetchTMDBSafe<TMDBTVDetails>(
    `/tv/${tvId}`,
    { append_to_response: "videos,credits,images,similar,recommendations" },
    60 * 30
  );
}

export async function getTVSeasonDetails(tvId: number, seasonNumber: number) {
  return fetchTMDBSafe<TMDBSeasonDetails>(
    `/tv/${tvId}/season/${seasonNumber}`,
    undefined,
    60 * 30
  );
}

// ─── Search ──────────────────────────────────────────────────────────
export async function multiSearch(query: string, page = 1) {
  return fetchTMDB<TMDBListResponse>(
    "/search/multi",
    { query, include_adult: false, page },
    60
  );
}

export async function searchMovies(query: string, page = 1) {
  return fetchTMDB<TMDBListResponse>(
    "/search/movie",
    { query, include_adult: false, page },
    60
  );
}

export async function searchTV(query: string, page = 1) {
  return fetchTMDB<TMDBListResponse>(
    "/search/tv",
    { query, include_adult: false, page },
    60
  );
}

// ─── Genres ──────────────────────────────────────────────────────────
export async function getMovieGenres() {
  return fetchTMDBSafe<{ genres: TMDBGenre[] }>("/genre/movie/list");
}

export async function getTVGenres() {
  return fetchTMDBSafe<{ genres: TMDBGenre[] }>("/genre/tv/list");
}
