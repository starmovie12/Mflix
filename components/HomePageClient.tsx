"use client";

import { useMemo } from "react";
import Hero from "@/components/Hero";
import MovieRow from "@/components/MovieRow";
import Navbar from "@/components/Navbar";
import Skeleton from "@/components/Skeleton";
import { useWatchlist } from "@/hooks/useWatchlist";
import type { HomePageData } from "@/lib/tmdb";

interface HomePageClientProps {
  data: HomePageData;
}

export default function HomePageClient({ data }: HomePageClientProps) {
  const { watchlist, watchlistIds, toggleWatchlist, hydrated } = useWatchlist();
  const myList = useMemo(() => watchlist, [watchlist]);

  return (
    <div className="min-h-screen bg-pitch text-white">
      <Navbar />
      <Hero title={data.hero} tmdbEnabled={data.tmdbEnabled} />

      <main className="-mt-20 space-y-10 pb-16">
        {!hydrated ? <Skeleton cards={10} /> : null}

        {hydrated && myList.length > 0 ? (
          <MovieRow
            title="My List"
            movies={myList}
            watchlistIds={watchlistIds}
            onToggleWatchlist={toggleWatchlist}
          />
        ) : null}

        {data.rails.map((row) => (
          <MovieRow
            key={row.id}
            title={row.title}
            movies={row.items}
            watchlistIds={watchlistIds}
            onToggleWatchlist={toggleWatchlist}
          />
        ))}
      </main>
    </div>
  );
}
