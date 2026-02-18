import type {
  TMDBMovie,
  TMDBMovieDetails,
  TMDBTVDetails,
  TMDBVideo,
  TMDBCastMember,
  TMDBCrewMember,
  HeroContent,
  ContentRow,
  MediaType,
  ImageSize,
} from "@/types/tmdb";

const IMAGE_BASE = process.env.TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p";

// ─── Image utilities ─────────────────────────────────────────────────

export function tmdbImage(path: string | null | undefined, size: ImageSize = "w500"): string {
  if (!path) return "/placeholder.svg";
  return `${IMAGE_BASE}/${size}${path}`;
}

export function tmdbBackdrop(path: string | null | undefined): string {
  return tmdbImage(path, "original");
}

export function tmdbPoster(path: string | null | undefined, size: ImageSize = "w500"): string {
  return tmdbImage(path, size);
}

export function tmdbProfile(path: string | null | undefined): string {
  return tmdbImage(path, "w185");
}

// ─── Title helpers ───────────────────────────────────────────────────

export function getTitle(item: TMDBMovie): string {
  return item.title || item.name || "Untitled";
}

export function getYear(item: TMDBMovie): string {
  const date = item.release_date || item.first_air_date;
  return date ? date.slice(0, 4) : "";
}

export function getMediaType(item: TMDBMovie): MediaType {
  if (item.media_type === "tv") return "tv";
  if (item.first_air_date && !item.release_date) return "tv";
  return "movie";
}

export function getRating(item: TMDBMovie): number {
  return Math.round((item.vote_average ?? 0) * 10);
}

export function formatRuntime(minutes: number | null | undefined): string {
  if (!minutes) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function formatEpisodeCount(details: TMDBTVDetails): string {
  const s = details.number_of_seasons;
  const e = details.number_of_episodes;
  const parts: string[] = [];
  if (s) parts.push(`${s} Season${s > 1 ? "s" : ""}`);
  if (e) parts.push(`${e} Episodes`);
  return parts.join(" · ");
}

// ─── Video/Trailer helpers ───────────────────────────────────────────

export function selectBestTrailer(videos: TMDBVideo[] = []): TMDBVideo | null {
  const ytVideos = videos.filter((v) => v.site === "YouTube" && v.key);
  if (!ytVideos.length) return null;

  return ytVideos.sort((a, b) => {
    const score = (v: TMDBVideo) => {
      if (v.type === "Trailer" && v.official) return 5;
      if (v.type === "Trailer") return 4;
      if (v.type === "Teaser") return 3;
      if (v.type === "Clip") return 2;
      return 1;
    };
    return score(b) - score(a);
  })[0];
}

export function getTrailerKey(videos: TMDBVideo[] = []): string | null {
  return selectBestTrailer(videos)?.key ?? null;
}

export function getYouTubeEmbedUrl(key: string): string {
  return `https://www.youtube.com/embed/${key}?autoplay=1&mute=1&controls=0&loop=1&playlist=${key}&modestbranding=1&rel=0&showinfo=0`;
}

export function getYouTubeThumbnail(key: string): string {
  return `https://i.ytimg.com/vi/${key}/hqdefault.jpg`;
}

// ─── Crew/Cast helpers ───────────────────────────────────────────────

export function getDirectors(crew: TMDBCrewMember[] = []): TMDBCrewMember[] {
  return crew.filter((c) => c.job === "Director");
}

export function getWriters(crew: TMDBCrewMember[] = []): TMDBCrewMember[] {
  return crew.filter((c) => c.job === "Screenplay" || c.job === "Writer" || c.job === "Story");
}

export function getKeyCrewMembers(crew: TMDBCrewMember[] = []): TMDBCrewMember[] {
  const jobs = new Set(["Director", "Producer", "Executive Producer", "Screenplay", "Writer"]);
  const seen = new Set<number>();
  return crew.filter((c) => {
    if (!jobs.has(c.job) || seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  }).slice(0, 8);
}

// ─── Normalization / Cleaning ────────────────────────────────────────

export function cleanMovie(raw: TMDBMovie): TMDBMovie {
  return {
    id: raw.id,
    title: raw.title ?? raw.name ?? "Untitled",
    name: raw.name ?? raw.title ?? "Untitled",
    overview: raw.overview ?? "",
    backdrop_path: raw.backdrop_path ?? null,
    poster_path: raw.poster_path ?? null,
    release_date: raw.release_date ?? raw.first_air_date ?? "",
    first_air_date: raw.first_air_date ?? raw.release_date ?? "",
    vote_average: raw.vote_average ?? 0,
    vote_count: raw.vote_count ?? 0,
    popularity: raw.popularity ?? 0,
    genre_ids: raw.genre_ids ?? [],
    media_type: raw.media_type ?? "movie",
    original_language: raw.original_language,
    adult: raw.adult,
  };
}

export function normalizeResults(results: TMDBMovie[] | undefined | null): TMDBMovie[] {
  if (!results?.length) return [];
  return results.map(cleanMovie);
}

// ─── Hero mapping ────────────────────────────────────────────────────

export function mapToHero(movie: TMDBMovie, trailerKey: string | null): HeroContent {
  return {
    id: movie.id,
    title: getTitle(movie),
    overview: movie.overview ?? "",
    backdropUrl: tmdbBackdrop(movie.backdrop_path),
    posterUrl: tmdbPoster(movie.poster_path),
    mediaType: getMediaType(movie),
    rating: getRating(movie),
    year: getYear(movie),
    trailerKey,
    genres: movie.genre_ids ?? [],
  };
}

// ─── Row mapping ─────────────────────────────────────────────────────

export function buildContentRow(
  id: string,
  title: string,
  items: TMDBMovie[],
  variant: ContentRow["variant"] = "poster"
): ContentRow {
  return { id, title, items: normalizeResults(items), variant };
}
