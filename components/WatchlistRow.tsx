"use client";

import { useWatchlist } from "@/hooks/useWatchlist";
import MovieRow from "./MovieRow";

export default function WatchlistRow() {
  const { watchlist, mounted } = useWatchlist();

  if (!mounted || watchlist.length === 0) return null;

  return <MovieRow title="My List" movies={watchlist} />;
}
