import type { Metadata } from "next";
import {
  getTrending,
  getUpcomingMovies,
  getNowPlayingMovies,
  getAiringTodayTV,
  getOnTheAirTV,
  getTopRatedMovies,
  getTopRatedTV,
} from "@/lib/tmdb/endpoints";
import { buildContentRow } from "@/lib/tmdb/mappers";
import type { ContentRow } from "@/types/tmdb";
import NewPopularClient from "./NewPopularClient";

export const metadata: Metadata = {
  title: "New & Popular",
  description: "Discover what is trending, new releases, and what everyone is watching on MFLIX.",
};

export default async function NewPopularPage() {
  const [trendingDay, trendingWeek, upcoming, nowPlaying, airingToday, onTheAir, topMovies, topTV] =
    await Promise.all([
      getTrending("all", "day"),
      getTrending("all", "week"),
      getUpcomingMovies(),
      getNowPlayingMovies(),
      getAiringTodayTV(),
      getOnTheAirTV(),
      getTopRatedMovies(),
      getTopRatedTV(),
    ]);

  const rows: ContentRow[] = [
    buildContentRow("trending-today", "Trending Today", trendingDay?.results ?? [], "backdrop"),
    buildContentRow("trending-week", "Trending This Week", trendingWeek?.results ?? [], "backdrop"),
    buildContentRow("now-playing", "New on MFLIX", nowPlaying?.results ?? []),
    buildContentRow("upcoming", "Coming Soon", upcoming?.results ?? []),
    buildContentRow("airing-today", "TV Airing Today", airingToday?.results ?? []),
    buildContentRow("on-the-air", "Currently On Air", onTheAir?.results ?? []),
    buildContentRow("top-movies", "Top Rated Movies", topMovies?.results ?? []),
    buildContentRow("top-tv", "Top Rated TV Shows", topTV?.results ?? []),
  ].filter((r) => r.items.length > 0);

  return <NewPopularClient rows={rows} />;
}
