"use client";

import MovieRow from "@/components/MovieRow";
import { useWatchlist } from "@/hooks/useWatchlist";
import type { TitleSummary } from "@/lib/tmdb";

type RelatedRailsProps = {
  similar: ReadonlyArray<TitleSummary>;
  recommendations: ReadonlyArray<TitleSummary>;
};

export function RelatedRails({ similar, recommendations }: RelatedRailsProps) {
  const { watchlistIds, toggleWatchlist } = useWatchlist();

  return (
    <div className="space-y-10">
      {similar.length > 0 ? (
        <MovieRow title="More Like This" movies={[...similar]} watchlistIds={watchlistIds} onToggleWatchlist={toggleWatchlist} />
      ) : null}
      {recommendations.length > 0 ? (
        <MovieRow
          title="Recommended For You"
          movies={[...recommendations]}
          watchlistIds={watchlistIds}
          onToggleWatchlist={toggleWatchlist}
        />
      ) : null}
    </div>
  );
}

