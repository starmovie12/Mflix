import type { HeroMovie, TMDBMediaType, TMDBMovie, TMDBMovieDetails, TMDBVideo } from "@/lib/tmdb/types";

function toMediaType(value: unknown, fallback: TMDBMediaType): TMDBMediaType {
  return value === "tv" ? "tv" : fallback;
}

function toStringValue(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function toNullableString(value: unknown) {
  return typeof value === "string" ? value : null;
}

function toNumberValue(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function normalizeMovie(input: unknown, fallbackMediaType: TMDBMediaType = "movie"): TMDBMovie | null {
  if (!input || typeof input !== "object") {
    return null;
  }

  const source = input as Record<string, unknown>;
  const id = toNumberValue(source.id, Number.NaN);
  if (!Number.isFinite(id)) {
    return null;
  }

  const mediaType = toMediaType(source.media_type, fallbackMediaType);

  return {
    id,
    title: toStringValue(source.title),
    name: toStringValue(source.name),
    overview: toStringValue(source.overview),
    backdrop_path: toNullableString(source.backdrop_path),
    poster_path: toNullableString(source.poster_path),
    release_date: toStringValue(source.release_date),
    first_air_date: toStringValue(source.first_air_date),
    vote_average: toNumberValue(source.vote_average),
    vote_count: toNumberValue(source.vote_count),
    popularity: toNumberValue(source.popularity),
    genre_ids: Array.isArray(source.genre_ids) ? source.genre_ids.map((genre) => toNumberValue(genre)).filter(Number.isFinite) : [],
    media_type: mediaType
  };
}

export function normalizeMovieList(items: unknown, fallbackMediaType: TMDBMediaType = "movie"): TMDBMovie[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => normalizeMovie(item, fallbackMediaType))
    .filter((movie): movie is TMDBMovie => Boolean(movie));
}

export function normalizeTitleDetails(
  payload: TMDBMovieDetails | null,
  mediaType: TMDBMediaType
): TMDBMovieDetails | null {
  if (!payload) {
    return null;
  }

  const normalizedBase = normalizeMovie(payload, mediaType);
  if (!normalizedBase) {
    return null;
  }

  const similar = normalizeMovieList(payload.similar?.results, mediaType);
  const recommendations = normalizeMovieList(payload.recommendations?.results, mediaType);

  return {
    ...payload,
    ...normalizedBase,
    runtime: payload.runtime,
    episode_run_time: payload.episode_run_time,
    genres: Array.isArray(payload.genres) ? payload.genres : [],
    videos: {
      results: Array.isArray(payload.videos?.results) ? payload.videos?.results : []
    },
    credits: {
      cast: Array.isArray(payload.credits?.cast) ? payload.credits?.cast : [],
      crew: Array.isArray(payload.credits?.crew) ? payload.credits?.crew : []
    },
    images: {
      backdrops: Array.isArray(payload.images?.backdrops) ? payload.images.backdrops : [],
      posters: Array.isArray(payload.images?.posters) ? payload.images.posters : [],
      logos: Array.isArray(payload.images?.logos) ? payload.images.logos : []
    },
    similar: {
      ...payload.similar,
      results: similar
    },
    recommendations: {
      ...payload.recommendations,
      results: recommendations
    }
  };
}

export function getMovieTitle(movie: Pick<TMDBMovie, "title" | "name">) {
  return movie.title || movie.name || "Untitled";
}

export function pickBestTrailerKey(videos: TMDBVideo[] = []) {
  const youtubeVideos = videos.filter((video) => video.site === "YouTube" && video.key);
  if (!youtubeVideos.length) {
    return null;
  }

  const scoreByType = (video: TMDBVideo) => {
    if (video.type === "Trailer" && video.official) return 5;
    if (video.type === "Trailer") return 4;
    if (video.type === "Teaser") return 3;
    if (video.type === "Clip") return 2;
    return 1;
  };

  const ranked = [...youtubeVideos].sort((a, b) => scoreByType(b) - scoreByType(a));
  return ranked[0]?.key ?? null;
}

export function buildHeroMovie(movie: TMDBMovie, trailerKey: string | null): HeroMovie {
  return {
    ...movie,
    trailerKey
  };
}
