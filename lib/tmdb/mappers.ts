/**
 * TMDB API response mappers - normalize raw API data into UI-friendly models.
 */

import type {
  TMDBMovie,
  TMDBMovieDetails,
  TMDBVideo,
  TMDBCastMember,
  TMDBCrewMember,
  HeroMovie,
} from "@/lib/tmdb/types";

export function getMovieTitle(movie: TMDBMovie): string {
  return movie.title ?? movie.name ?? "Untitled";
}

export function cleanMovie(movie: TMDBMovie): TMDBMovie {
  return {
    id: movie.id,
    title: movie.title ?? movie.name ?? "Untitled",
    name: movie.name ?? movie.title ?? "Untitled",
    overview: movie.overview ?? "",
    backdrop_path: movie.backdrop_path ?? null,
    poster_path: movie.poster_path ?? null,
    release_date: movie.release_date ?? movie.first_air_date ?? "",
    first_air_date: movie.first_air_date ?? movie.release_date ?? "",
    vote_average: movie.vote_average ?? 0,
    vote_count: movie.vote_count ?? 0,
    popularity: movie.popularity ?? 0,
    genre_ids: movie.genre_ids ?? [],
    media_type: movie.media_type ?? "movie",
  };
}

export function selectBestTrailer(videos: TMDBVideo[] = []): string | null {
  const youtubeVideos = videos.filter((v) => v.site === "YouTube" && v.key);
  if (!youtubeVideos.length) return null;

  const ranked = [...youtubeVideos].sort((a, b) => {
    const score = (v: TMDBVideo) => {
      if (v.type === "Trailer" && v.official) return 5;
      if (v.type === "Trailer") return 4;
      if (v.type === "Teaser") return 3;
      if (v.type === "Clip") return 2;
      return 1;
    };
    return score(b) - score(a);
  });

  return ranked[0]?.key ?? null;
}

export function normalizeMovieList(results: TMDBMovie[] | undefined): TMDBMovie[] {
  if (!results?.length) return [];
  return results.map(cleanMovie);
}

export function normalizeDetails(
  payload: TMDBMovieDetails | null,
  trailerKey?: string | null
): TMDBMovieDetails | null {
  if (!payload?.id) return null;

  const base = cleanMovie(payload);
  const videos = payload.videos?.results ?? [];

  return {
    ...payload,
    ...base,
    videos: { results: videos },
    credits: payload.credits ?? { cast: [], crew: [] },
    similar: payload.similar ?? { results: [] },
    recommendations: payload.recommendations ?? { results: [] },
  };
}

export function toHeroMovie(movie: TMDBMovie, trailerKey: string | null): HeroMovie {
  return {
    ...cleanMovie(movie),
    trailerKey: trailerKey ?? null,
  };
}

export function getDirector(crew: TMDBCrewMember[] | undefined): TMDBCrewMember | undefined {
  return crew?.find((c) => c.job === "Director");
}

export function getTopCast(cast: TMDBCastMember[] | undefined, limit = 10): TMDBCastMember[] {
  return (cast ?? []).slice(0, limit);
}
