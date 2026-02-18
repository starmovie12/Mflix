/**
 * TMDB API functions - server-side data fetching.
 */

import type { HeroMovie, MovieRowData, TMDBMovieDetails, TMDBMovie } from "@/lib/tmdb/types";
import { fetchFromTMDB } from "./client";
import { ROW_DEFINITIONS } from "./endpoints";
import {
  cleanMovie,
  normalizeMovieList,
  normalizeDetails,
  selectBestTrailer,
  toHeroMovie,
} from "./mappers";
import type { TMDBListResponse, TMDBVideosResponse } from "./types";

const DEFAULT_REVALIDATE = 60 * 15;

export async function getTrendingMovies(): Promise<TMDBMovie[]> {
  const payload = await fetchFromTMDB<TMDBListResponse>("/trending/movie/week", undefined, {
    revalidate: 60 * 60,
  });
  return normalizeMovieList(payload?.results);
}

export async function getTrendingToday(): Promise<TMDBMovie[]> {
  const payload = await fetchFromTMDB<TMDBListResponse>("/trending/all/day", undefined, {
    revalidate: 60 * 60,
  });
  return normalizeMovieList(payload?.results);
}

export async function getTrendingWeek(): Promise<TMDBMovie[]> {
  const payload = await fetchFromTMDB<TMDBListResponse>("/trending/all/week", undefined, {
    revalidate: 60 * 60,
  });
  return normalizeMovieList(payload?.results);
}

export async function getPopularMovies(): Promise<TMDBMovie[]> {
  const payload = await fetchFromTMDB<TMDBListResponse>("/movie/popular", undefined, {
    revalidate: DEFAULT_REVALIDATE,
  });
  return normalizeMovieList(payload?.results);
}

export async function getPopularTv(): Promise<TMDBMovie[]> {
  const payload = await fetchFromTMDB<TMDBListResponse>("/tv/popular", undefined, {
    revalidate: DEFAULT_REVALIDATE,
  });
  return normalizeMovieList(payload?.results);
}

export async function getTopRatedMovies(): Promise<TMDBMovie[]> {
  const payload = await fetchFromTMDB<TMDBListResponse>("/movie/top_rated", undefined, {
    revalidate: DEFAULT_REVALIDATE,
  });
  return normalizeMovieList(payload?.results);
}

export async function getUpcomingMovies(): Promise<TMDBMovie[]> {
  const payload = await fetchFromTMDB<TMDBListResponse>("/movie/upcoming", undefined, {
    revalidate: 60 * 60,
  });
  return normalizeMovieList(payload?.results);
}

export async function getNowPlayingMovies(): Promise<TMDBMovie[]> {
  const payload = await fetchFromTMDB<TMDBListResponse>("/movie/now_playing", undefined, {
    revalidate: 60 * 60,
  });
  return normalizeMovieList(payload?.results);
}

export async function getHomeRows(): Promise<MovieRowData[]> {
  const rows = await Promise.all(
    ROW_DEFINITIONS.map(async (row) => {
      const [path, queryString] = row.endpoint.split("?");
      const params: Record<string, string | number | boolean> = {};
      if (queryString) {
        new URLSearchParams(queryString).forEach((v, k) => {
          const num = Number(v);
          params[k] = Number.isFinite(num) ? num : v;
        });
      }
      const payload = await fetchFromTMDB<TMDBListResponse>(path, params);
      return {
        id: row.id,
        title: row.title,
        movies: normalizeMovieList(payload?.results),
      };
    })
  );
  return rows;
}

export async function getMovieTrailerKey(movieId: number, mediaType: "movie" | "tv" = "movie"): Promise<string | null> {
  const payload = await fetchFromTMDB<TMDBVideosResponse>(`/${mediaType}/${movieId}/videos`, undefined, {
    revalidate: 60 * 30,
  });
  return selectBestTrailer(payload?.results ?? []);
}

export async function getFeaturedMovie(): Promise<HeroMovie | null> {
  const trending = await getTrendingMovies();
  const featured = trending.find((m) => m.backdrop_path || m.poster_path);
  if (!featured) return null;

  const trailerKey = await getMovieTrailerKey(featured.id, "movie");
  return toHeroMovie(featured, trailerKey);
}

export async function getMovieDetails(movieId: number): Promise<TMDBMovieDetails | null> {
  const payload = await fetchFromTMDB<TMDBMovieDetails>(
    `/movie/${movieId}`,
    { append_to_response: "videos,images,credits,similar,recommendations" },
    { revalidate: 60 * 30 }
  );
  return normalizeDetails(payload);
}

export async function getTvDetails(tvId: number): Promise<TMDBMovieDetails | null> {
  const payload = await fetchFromTMDB<TMDBMovieDetails>(
    `/tv/${tvId}`,
    { append_to_response: "videos,images,credits,similar,recommendations,seasons" },
    { revalidate: 60 * 30 }
  );
  return normalizeDetails(payload);
}

export async function getTitleDetails(
  mediaType: "movie" | "tv",
  id: number
): Promise<TMDBMovieDetails | null> {
  if (mediaType === "tv") {
    return getTvDetails(id);
  }
  return getMovieDetails(id);
}

export async function searchMovies(query: string): Promise<TMDBMovie[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const payload = await fetchFromTMDB<TMDBListResponse>("/search/movie", {
    query: trimmed,
    include_adult: false,
  }, { revalidate: 60 });
  return normalizeMovieList(payload?.results);
}
