import {
  getTrending,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getNowPlayingMovies,
  getPopularTV,
  getTopRatedTV,
  discoverByGenre,
  discoverKidsSafe,
} from "@/lib/tmdb/endpoints";
import {
  normalizeResults,
  getTrailerKey,
  mapToHero,
  buildContentRow,
} from "@/lib/tmdb/mappers";
import type { HeroContent, ContentRow } from "@/types/tmdb";

export async function getHeroContent(): Promise<HeroContent | null> {
  const data = await getTrending("all", "day");
  if (!data?.results?.length) return null;

  const featured = data.results.find((m) => m.backdrop_path && m.overview);
  if (!featured) return null;

  let trailerKey: string | null = null;
  try {
    const { fetchTMDBSafe } = await import("@/lib/tmdb/client");
    const mediaType = featured.media_type === "tv" ? "tv" : "movie";
    const videos = await fetchTMDBSafe<{ results: Array<{ id: string; key: string; name: string; site: string; type: string; official: boolean }> }>(
      `/${mediaType}/${featured.id}/videos`
    );
    trailerKey = getTrailerKey(videos?.results ?? []);
  } catch {
    /* no trailer */
  }

  return mapToHero(featured, trailerKey);
}

export async function getHomeRows(): Promise<ContentRow[]> {
  const [
    trendingDay,
    trendingWeek,
    popularMovies,
    topRatedMovies,
    upcomingMovies,
    nowPlaying,
    popularTV,
    topRatedTV,
    actionMovies,
    comedyMovies,
    horrorMovies,
    sciFiMovies,
    anime,
    kids,
  ] = await Promise.all([
    getTrending("all", "day"),
    getTrending("movie", "week"),
    getPopularMovies(),
    getTopRatedMovies(),
    getUpcomingMovies(),
    getNowPlayingMovies(),
    getPopularTV(),
    getTopRatedTV(),
    discoverByGenre("movie", 28),
    discoverByGenre("movie", 35),
    discoverByGenre("movie", 27),
    discoverByGenre("movie", 878),
    discoverByGenre("movie", 16),
    discoverKidsSafe(),
  ]);

  const rows: ContentRow[] = [
    buildContentRow("trending-day", "Trending Today", trendingDay?.results ?? [], "backdrop"),
    buildContentRow("top-10", "Top 10 on MFLIX", (trendingWeek?.results ?? []).slice(0, 10), "top10"),
    buildContentRow("popular-movies", "Popular Movies", popularMovies?.results ?? []),
    buildContentRow("popular-tv", "Popular TV Shows", popularTV?.results ?? []),
    buildContentRow("now-playing", "Now Playing in Theaters", nowPlaying?.results ?? [], "backdrop"),
    buildContentRow("top-rated-movies", "Top Rated Movies", topRatedMovies?.results ?? []),
    buildContentRow("top-rated-tv", "Top Rated TV Shows", topRatedTV?.results ?? []),
    buildContentRow("upcoming", "Upcoming Movies", upcomingMovies?.results ?? []),
    buildContentRow("action", "Action Blockbusters", actionMovies?.results ?? []),
    buildContentRow("comedy", "Comedy Hits", comedyMovies?.results ?? []),
    buildContentRow("horror", "Horror Nights", horrorMovies?.results ?? []),
    buildContentRow("scifi", "Sci-Fi & Fantasy", sciFiMovies?.results ?? []),
    buildContentRow("anime", "Anime", anime?.results ?? []),
    buildContentRow("kids", "Kids & Family", kids?.results ?? []),
  ];

  return rows.filter((r) => r.items.length > 0);
}
