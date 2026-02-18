import type {
  MediaType,
  TmdbDetails,
  TmdbTitle,
  TitleCreditPerson,
  TitleDetails,
  TitleSummary,
  TitleVideo
} from "@/lib/tmdb/types";

function pickMediaType(input: Pick<TmdbTitle, "media_type">, fallback: MediaType): MediaType {
  return input.media_type === "movie" || input.media_type === "tv" ? input.media_type : fallback;
}

function pickTitle(input: Pick<TmdbTitle, "title" | "name">): string {
  const title = input.title?.trim() || input.name?.trim();
  return title && title.length > 0 ? title : "Untitled";
}

function pickOriginalTitle(input: Pick<TmdbTitle, "original_title" | "original_name">): string | undefined {
  const original = input.original_title?.trim() || input.original_name?.trim();
  return original && original.length > 0 ? original : undefined;
}

function pickReleaseDate(input: Pick<TmdbTitle, "release_date" | "first_air_date">): string | null {
  const date = (input.release_date || input.first_air_date || "").trim();
  return date ? date : null;
}

function pickYear(date: string | null): string | null {
  if (!date || date.length < 4) return null;
  const year = date.slice(0, 4);
  return /^\d{4}$/.test(year) ? year : null;
}

export function toTitleSummary(input: TmdbTitle, fallbackMediaType: MediaType): TitleSummary {
  const releaseDate = pickReleaseDate(input);

  return {
    id: input.id,
    mediaType: pickMediaType(input, fallbackMediaType),
    title: pickTitle(input),
    originalTitle: pickOriginalTitle(input),
    overview: input.overview?.trim() || "",
    posterPath: input.poster_path ?? null,
    backdropPath: input.backdrop_path ?? null,
    releaseDate,
    year: pickYear(releaseDate),
    voteAverage: typeof input.vote_average === "number" ? input.vote_average : 0,
    voteCount: typeof input.vote_count === "number" ? input.vote_count : 0
  };
}

function mapVideo(input: { key?: string; name?: string; site?: string; type?: string; official?: boolean; published_at?: string }): TitleVideo | null {
  const key = input.key?.trim();
  const site = input.site?.trim();
  if (!key || !site) return null;
  return {
    key,
    name: input.name?.trim() || "Video",
    site,
    type: input.type?.trim() || "Video",
    official: Boolean(input.official),
    publishedAt: input.published_at
  };
}

function pickCrewHighlights(crew: Array<{ id: number; name: string; job?: string; department?: string; profile_path?: string | null }>): TitleCreditPerson[] {
  const priorityJobs = new Set(["Director", "Creator", "Screenplay", "Writer", "Executive Producer", "Producer", "Showrunner"]);
  const filtered = crew.filter((person) => (person.job ? priorityJobs.has(person.job) : false));
  const unique = new Map<number, TitleCreditPerson>();

  for (const person of filtered) {
    if (unique.has(person.id)) continue;
    unique.set(person.id, {
      id: person.id,
      name: person.name,
      role: person.job,
      department: person.department,
      profilePath: person.profile_path ?? null
    });
  }

  return Array.from(unique.values()).slice(0, 8);
}

export function toTitleDetails(input: TmdbDetails, mediaType: MediaType): TitleDetails {
  const summary = toTitleSummary(input, mediaType);
  const genres = input.genres ?? [];
  const videos = (input.videos?.results ?? []).map(mapVideo).filter((v): v is TitleVideo => v !== null);
  const cast = (input.credits?.cast ?? [])
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .slice(0, 20)
    .map<TitleCreditPerson>((person) => ({
      id: person.id,
      name: person.name,
      role: person.character,
      profilePath: person.profile_path ?? null
    }));

  const crewHighlights = pickCrewHighlights(input.credits?.crew ?? []);

  const similar = (input.similar?.results ?? []).map((t) => toTitleSummary(t, mediaType));
  const recommendations = (input.recommendations?.results ?? []).map((t) => toTitleSummary(t, mediaType));

  const imageBackdrops = (input.images?.backdrops ?? []).map((img) => img.file_path).slice(0, 12);
  const imagePosters = (input.images?.posters ?? []).map((img) => img.file_path).slice(0, 12);

  const runtimeMinutes =
    mediaType === "movie"
      ? input.runtime ?? null
      : Array.isArray(input.episode_run_time) && input.episode_run_time.length > 0
        ? input.episode_run_time[0] ?? null
        : null;

  return {
    ...summary,
    genres,
    runtimeMinutes,
    seasonCount: input.number_of_seasons,
    episodeCount: input.number_of_episodes,
    videos,
    cast,
    crewHighlights,
    similar,
    recommendations,
    imageBackdrops,
    imagePosters
  };
}

export function pickBestYouTubeTrailerKey(videos: ReadonlyArray<TitleVideo>): string | null {
  const yt = videos.filter((v) => v.site === "YouTube");
  if (yt.length === 0) return null;

  const score = (v: TitleVideo) => {
    const t = v.type.toLowerCase();
    if (t === "trailer" && v.official) return 5;
    if (t === "trailer") return 4;
    if (t === "teaser") return 3;
    if (t === "clip") return 2;
    return 1;
  };

  const ranked = yt.slice().sort((a, b) => score(b) - score(a));
  return ranked[0]?.key ?? null;
}

