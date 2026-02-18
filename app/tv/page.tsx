import type { Metadata } from "next";
import {
  getPopularTV,
  getTopRatedTV,
  getAiringTodayTV,
  getOnTheAirTV,
  getTVGenres,
  discoverByGenre,
} from "@/lib/tmdb/endpoints";
import { buildContentRow } from "@/lib/tmdb/mappers";
import type { ContentRow, TMDBGenre } from "@/types/tmdb";
import TVClient from "./TVClient";

export const metadata: Metadata = {
  title: "TV Shows",
  description: "Browse popular TV shows, airing today, and top rated series on MFLIX.",
};

export default async function TVPage() {
  const [popular, topRated, airingToday, onTheAir, genreData, drama, comedy, crime, docuSeries, animation] =
    await Promise.all([
      getPopularTV(),
      getTopRatedTV(),
      getAiringTodayTV(),
      getOnTheAirTV(),
      getTVGenres(),
      discoverByGenre("tv", 18),
      discoverByGenre("tv", 35),
      discoverByGenre("tv", 80),
      discoverByGenre("tv", 99),
      discoverByGenre("tv", 16),
    ]);

  const genres: TMDBGenre[] = genreData?.genres ?? [];

  const rows: ContentRow[] = [
    buildContentRow("popular", "Popular TV Shows", popular?.results ?? [], "backdrop"),
    buildContentRow("airing-today", "Airing Today", airingToday?.results ?? []),
    buildContentRow("on-the-air", "Currently On Air", onTheAir?.results ?? []),
    buildContentRow("top-rated", "Top Rated Series", topRated?.results ?? []),
    buildContentRow("drama", "Drama Series", drama?.results ?? []),
    buildContentRow("comedy", "Comedy Series", comedy?.results ?? []),
    buildContentRow("crime", "Crime & Mystery", crime?.results ?? []),
    buildContentRow("documentary", "Documentary Series", docuSeries?.results ?? []),
    buildContentRow("animation", "Animation", animation?.results ?? []),
  ].filter((r) => r.items.length > 0);

  return <TVClient rows={rows} genres={genres} />;
}
