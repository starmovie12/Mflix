import { tmdbFetch } from "@/lib/tmdb/client";
import { detailsEndpoint, HOME_ROW_DEFINITIONS, searchMultiEndpoint, videosEndpoint } from "@/lib/tmdb/endpoints";
import { buildHeroMovie, normalizeMovieList, normalizeTitleDetails, pickBestTrailerKey } from "@/lib/tmdb/mappers";
import type { HeroMovie, MovieRowData, TMDBListResponse, TMDBMediaType, TMDBMovie, TMDBMovieDetails, TMDBVideosResponse } from "@/lib/tmdb/types";

const FAST_REVALIDATE_SECONDS = 60;
const DETAILS_REVALIDATE_SECONDS = 60 * 30;

async function getTitleTrailerKey(mediaType: TMDBMediaType, id: number) {
  const payload = await tmdbFetch<TMDBVideosResponse>(videosEndpoint(mediaType, id), {
    revalidateSeconds: DETAILS_REVALIDATE_SECONDS
  });

  return pickBestTrailerKey(payload?.results ?? []);
}

export async function getHomeRows(): Promise<MovieRowData[]> {
  const rows = await Promise.all(
    HOME_ROW_DEFINITIONS.map(async (row) => {
      const payload = await tmdbFetch<TMDBListResponse>(row.endpoint);
      const movies = normalizeMovieList(payload?.results, row.mediaType);

      return {
        id: row.id,
        title: row.title,
        movies
      } satisfies MovieRowData;
    })
  );

  return rows.filter((row) => row.movies.length > 0);
}

export async function getFeaturedMovie(): Promise<HeroMovie | null> {
  const payload = await tmdbFetch<TMDBListResponse>("/trending/movie/week");
  const movies = normalizeMovieList(payload?.results, "movie");
  const featured = movies.find((movie) => movie.backdrop_path || movie.poster_path);

  if (!featured) {
    return null;
  }

  const trailerKey = await getTitleTrailerKey(featured.media_type ?? "movie", featured.id);
  return buildHeroMovie(featured, trailerKey);
}

export async function searchMovies(query: string) {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const payload = await tmdbFetch<TMDBListResponse>(searchMultiEndpoint(), {
    params: {
      query: trimmed,
      include_adult: false
    },
    revalidateSeconds: FAST_REVALIDATE_SECONDS
  });

  return normalizeMovieList(payload?.results, "movie").filter(
    (movie) => movie.media_type === "movie" || movie.media_type === "tv"
  );
}

export async function getTitleDetails(mediaType: TMDBMediaType, id: number): Promise<TMDBMovieDetails | null> {
  const payload = await tmdbFetch<TMDBMovieDetails>(detailsEndpoint(mediaType, id), {
    params: {
      append_to_response: "videos,images,credits,similar,recommendations"
    },
    revalidateSeconds: DETAILS_REVALIDATE_SECONDS
  });

  return normalizeTitleDetails(payload, mediaType);
}

export async function getMovieDetails(movieId: number) {
  return getTitleDetails("movie", movieId);
}

export function getContinueWatchingSeed(movie: TMDBMovie) {
  return {
    id: movie.id,
    mediaType: movie.media_type ?? "movie"
  };
}
