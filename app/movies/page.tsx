import type { Metadata } from "next";
import {
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getMovieGenres,
  discoverByGenre,
} from "@/lib/tmdb/endpoints";
import { normalizeResults, buildContentRow } from "@/lib/tmdb/mappers";
import type { ContentRow, TMDBGenre } from "@/types/tmdb";
import MoviesClient from "./MoviesClient";

export const metadata: Metadata = {
  title: "Movies",
  description: "Browse popular, top rated, and upcoming movies on MFLIX.",
};

export default async function MoviesPage() {
  const [popular, topRated, nowPlaying, upcoming, genreData, action, comedy, thriller, scifi, drama] =
    await Promise.all([
      getPopularMovies(),
      getTopRatedMovies(),
      getNowPlayingMovies(),
      getUpcomingMovies(),
      getMovieGenres(),
      discoverByGenre("movie", 28),
      discoverByGenre("movie", 35),
      discoverByGenre("movie", 53),
      discoverByGenre("movie", 878),
      discoverByGenre("movie", 18),
    ]);

  const genres: TMDBGenre[] = genreData?.genres ?? [];

  const rows: ContentRow[] = [
    buildContentRow("popular", "Popular Movies", popular?.results ?? [], "backdrop"),
    buildContentRow("now-playing", "Now Playing", nowPlaying?.results ?? []),
    buildContentRow("top-rated", "Top Rated", topRated?.results ?? []),
    buildContentRow("upcoming", "Coming Soon", upcoming?.results ?? []),
    buildContentRow("action", "Action & Adventure", action?.results ?? []),
    buildContentRow("comedy", "Comedy", comedy?.results ?? []),
    buildContentRow("thriller", "Thriller", thriller?.results ?? []),
    buildContentRow("scifi", "Sci-Fi", scifi?.results ?? []),
    buildContentRow("drama", "Drama", drama?.results ?? []),
  ].filter((r) => r.items.length > 0);

  return <MoviesClient rows={rows} genres={genres} />;
}
