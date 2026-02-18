import { tmdbGet } from "@/lib/tmdb/client";
import { tmdbEndpoints } from "@/lib/tmdb/endpoints";
import { pickBestYouTubeTrailerKey, toTitleDetails, toTitleSummary } from "@/lib/tmdb/mappers";
import { mediaTypeSchema, tmdbDetailsSchema, tmdbListResponseSchema, type MediaType, type TitleDetails, type TitleSummary } from "@/lib/tmdb/types";
import { getAppEnv } from "@/lib/env";
export { getTmdbImageUrl, type TmdbImageSize } from "@/lib/tmdb/image";
export type { MediaType, TitleDetails, TitleSummary } from "@/lib/tmdb/types";

export type HomeRail = Readonly<{
  id: string;
  title: string;
  items: ReadonlyArray<TitleSummary>;
}>;

export type HomePageData = Readonly<{
  hero: (TitleSummary & { trailerKey: string | null }) | null;
  rails: ReadonlyArray<HomeRail>;
  tmdbEnabled: boolean;
}>;

export async function getHomePageData(): Promise<HomePageData> {
  const env = getAppEnv();
  const railsDef: Array<{ id: string; title: string; endpoint: string; fallbackMediaType: MediaType }> = [
    { id: "trending-day", title: "Trending Today", endpoint: tmdbEndpoints.trending("day"), fallbackMediaType: "movie" },
    { id: "trending-week", title: "Trending This Week", endpoint: tmdbEndpoints.trending("week"), fallbackMediaType: "movie" },
    { id: "popular-movies", title: "Popular Movies", endpoint: tmdbEndpoints.popularMovies(), fallbackMediaType: "movie" },
    { id: "popular-tv", title: "Popular TV", endpoint: tmdbEndpoints.popularTv(), fallbackMediaType: "tv" },
    { id: "top-rated", title: "Top Rated Movies", endpoint: tmdbEndpoints.topRatedMovies(), fallbackMediaType: "movie" },
    { id: "upcoming", title: "Upcoming Movies", endpoint: tmdbEndpoints.upcomingMovies(), fallbackMediaType: "movie" },
    { id: "now-playing", title: "Now Playing", endpoint: tmdbEndpoints.nowPlayingMovies(), fallbackMediaType: "movie" }
  ];

  const fetched = await Promise.all(railsDef.map((def) => tmdbGet(def.endpoint, tmdbListResponseSchema)));

  const tmdbEnabled = Boolean(env.tmdbApiKey);
  const rails: HomeRail[] = fetched.map((result, idx) => {
    const def = railsDef[idx]!;
    const titles = result.ok ? result.data.results.map((t) => toTitleSummary(t, def.fallbackMediaType)) : [];
    return { id: def.id, title: def.title, items: titles };
  });

  const heroCandidate = rails.find((r) => r.items.length > 0)?.items.find((t) => t.backdropPath || t.posterPath) ?? null;
  if (!heroCandidate) {
    return { hero: null, rails, tmdbEnabled };
  }

  const details = await getTitleDetails(heroCandidate.mediaType, heroCandidate.id);
  const trailerKey = details ? pickBestYouTubeTrailerKey(details.videos) : null;

  return { hero: { ...heroCandidate, trailerKey }, rails, tmdbEnabled };
}

export async function getTitleDetails(mediaType: MediaType, id: number): Promise<TitleDetails | null> {
  const endpoint = tmdbEndpoints.details(mediaType, id);
  const params =
    mediaType === "movie"
      ? { append_to_response: "videos,images,credits,similar,recommendations" }
      : { append_to_response: "videos,images,credits,similar,recommendations" };

  const result = await tmdbGet(endpoint, tmdbDetailsSchema, { params, revalidateSeconds: 60 * 30 });
  if (!result.ok) return null;
  return toTitleDetails(result.data, mediaType);
}

export async function searchMulti(query: string): Promise<TitleSummary[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const result = await tmdbGet(tmdbEndpoints.multiSearch(), tmdbListResponseSchema, {
    params: { query: trimmed, include_adult: false },
    revalidateSeconds: 60
  });

  if (!result.ok) return [];

  const items = result.data.results
    .map((t) => {
      const parsed = mediaTypeSchema.safeParse(t.media_type);
      if (!parsed.success) return null;
      return toTitleSummary(t, parsed.data);
    })
    .filter((t): t is TitleSummary => Boolean(t));

  return items;
}

