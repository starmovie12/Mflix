import "server-only";

import type { HeroMovie, MovieRowData, TMDBMovie, TMDBMovieDetails } from "@/lib/types";
import type { MediaItem, TitleDetails } from "@/types/media";
import { getDisplayTitle, getTmdbImageUrl } from "@/lib/tmdb/image";
import { getFeaturedWithTrailer, getHomeRailsData, getTitleDetails, searchTitles } from "@/lib/tmdb/index";

function toLegacyMovie(item: MediaItem): TMDBMovie {
  return {
    id: item.id,
    title: item.title,
    name: item.title,
    overview: item.overview,
    backdrop_path: item.backdropPath,
    poster_path: item.posterPath,
    release_date: item.releaseDate ?? "",
    first_air_date: item.releaseDate ?? "",
    vote_average: item.voteAverage,
    vote_count: item.voteCount,
    popularity: item.popularity,
    genre_ids: item.genreIds,
    media_type: item.mediaType
  };
}

function toLegacyMovieDetails(details: TitleDetails): TMDBMovieDetails {
  return {
    ...toLegacyMovie(details),
    runtime: details.runtimeMinutes ?? undefined,
    genres: details.genres,
    videos: {
      results: details.videos.map((video) => ({
        id: video.id,
        key: video.key,
        name: video.name,
        site: video.site,
        type: video.type,
        official: video.official,
        published_at: video.publishedAt ?? undefined
      }))
    }
  };
}

export function getMovieTitle(movie: TMDBMovie) {
  return getDisplayTitle(movie);
}

export function getImageUrl(path: string | null | undefined, size: "w300" | "w500" | "w780" | "original" = "w500") {
  return getTmdbImageUrl(path, size);
}

export async function getHomeRows(): Promise<MovieRowData[]> {
  const rows = await getHomeRailsData();

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    movies: row.items.map(toLegacyMovie)
  }));
}

export async function getFeaturedMovie(): Promise<HeroMovie | null> {
  const featured = await getFeaturedWithTrailer();

  if (!featured) {
    return null;
  }

  return {
    ...toLegacyMovie(featured),
    trailerKey: featured.trailerKey
  };
}

export async function searchMovies(query: string) {
  const result = await searchTitles(query);
  return result.results.filter((item) => item.mediaType === "movie").map(toLegacyMovie);
}

export async function getMovieDetails(movieId: number): Promise<TMDBMovieDetails | null> {
  const details = await getTitleDetails("movie", movieId);

  if (!details) {
    return null;
  }

  return toLegacyMovieDetails(details);
}
