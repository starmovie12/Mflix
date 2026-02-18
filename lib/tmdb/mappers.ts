import type { CreditPerson, FeaturedMedia, ImageAsset, MediaItem, MediaType, SeasonSummary, TitleDetails, VideoAsset } from "@/types/media";
import type { TmdbCredit, TmdbImage, TmdbMediaSummary, TmdbMovieDetails, TmdbTvDetails, TmdbVideo } from "@/lib/tmdb/types";

const CREW_HIGHLIGHT_DEPARTMENTS = new Set(["Directing", "Writing", "Production", "Creator"]);

function toMediaType(value: string | undefined, fallback: MediaType = "movie"): MediaType {
  if (value === "tv") {
    return "tv";
  }

  if (value === "movie") {
    return "movie";
  }

  return fallback;
}

function toTitle(value: { title?: string; name?: string }) {
  const normalized = value.title?.trim() || value.name?.trim();
  return normalized || "Untitled";
}

function toCreditPerson(person: TmdbCredit): CreditPerson {
  return {
    id: person.id,
    name: person.name,
    profilePath: person.profile_path ?? null,
    character: person.character ?? null,
    job: person.job ?? null
  };
}

function toImageAsset(image: TmdbImage): ImageAsset {
  return {
    filePath: image.file_path,
    width: image.width ?? null,
    height: image.height ?? null,
    iso6391: image.iso_639_1 ?? null
  };
}

export function mapVideo(video: TmdbVideo): VideoAsset {
  return {
    id: video.id,
    key: video.key,
    name: video.name,
    site: video.site,
    type: video.type,
    official: Boolean(video.official),
    publishedAt: video.published_at ?? null
  };
}

export function mapMediaSummary(item: TmdbMediaSummary, mediaTypeHint?: MediaType): MediaItem {
  const inferredMediaType =
    mediaTypeHint ?? toMediaType(item.media_type, item.name && !item.title ? "tv" : "movie");

  return {
    id: item.id,
    mediaType: inferredMediaType,
    title: toTitle(item),
    overview: item.overview ?? "",
    posterPath: item.poster_path ?? null,
    backdropPath: item.backdrop_path ?? null,
    releaseDate: item.release_date ?? item.first_air_date ?? null,
    voteAverage: item.vote_average ?? 0,
    voteCount: item.vote_count ?? 0,
    popularity: item.popularity ?? 0,
    genreIds: item.genre_ids ?? [],
    originalLanguage: item.original_language ?? null,
    adult: item.adult ?? false
  };
}

export function mapMediaList(items: TmdbMediaSummary[], mediaTypeHint?: MediaType): MediaItem[] {
  return items
    .filter((item) => item.id > 0)
    .map((item) => mapMediaSummary(item, mediaTypeHint))
    .filter((item) => item.title !== "Untitled");
}

export function pickBestTrailerKey(videos: VideoAsset[]) {
  const youtubeVideos = videos.filter((video) => video.site === "YouTube" && video.key);
  if (!youtubeVideos.length) {
    return null;
  }

  const rank = (video: VideoAsset) => {
    if (video.type === "Trailer" && video.official) return 5;
    if (video.type === "Trailer") return 4;
    if (video.type === "Teaser") return 3;
    if (video.type === "Clip") return 2;
    return 1;
  };

  return youtubeVideos.sort((a, b) => rank(b) - rank(a))[0]?.key ?? null;
}

function mapCrewHighlights(crew: TmdbCredit[]) {
  const filtered = crew.filter((person) => {
    const department = person.department || person.known_for_department || "";
    return CREW_HIGHLIGHT_DEPARTMENTS.has(department);
  });

  return filtered.slice(0, 10).map(toCreditPerson);
}

function mapSeasons(payload: TmdbTvDetails): SeasonSummary[] {
  return (payload.seasons ?? []).map((season) => ({
    id: season.id,
    name: season.name,
    episodeCount: season.episode_count,
    airDate: season.air_date ?? null,
    overview: season.overview,
    posterPath: season.poster_path ?? null
  }));
}

export function mapTitleDetails(payload: TmdbMovieDetails | TmdbTvDetails, mediaType: MediaType): TitleDetails {
  const runtimeMinutes = mediaType === "movie"
    ? (payload as TmdbMovieDetails).runtime ?? null
    : Array.isArray((payload as TmdbTvDetails).episode_run_time)
      ? ((payload as TmdbTvDetails).episode_run_time?.[0] ?? null)
      : null;

  const base = mapMediaSummary(payload, mediaType);
  const videos = (payload.videos?.results ?? []).map(mapVideo);

  return {
    ...base,
    tagline: payload.tagline ?? null,
    status: payload.status ?? null,
    runtimeMinutes,
    genres: payload.genres ?? [],
    videos,
    cast: (payload.credits?.cast ?? []).slice(0, 16).map(toCreditPerson),
    crewHighlights: mapCrewHighlights(payload.credits?.crew ?? []),
    similar: mapMediaList(payload.similar?.results ?? [], mediaType),
    recommendations: mapMediaList(payload.recommendations?.results ?? [], mediaType),
    backdrops: (payload.images?.backdrops ?? []).map(toImageAsset),
    posters: (payload.images?.posters ?? []).map(toImageAsset),
    seasons: mediaType === "tv" ? mapSeasons(payload as TmdbTvDetails) : []
  };
}

export function mapFeaturedMedia(item: MediaItem, videos: TmdbVideo[]): FeaturedMedia {
  const normalizedVideos = videos.map(mapVideo);

  return {
    ...item,
    trailerKey: pickBestTrailerKey(normalizedVideos)
  };
}
