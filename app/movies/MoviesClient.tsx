"use client";

import PageShell from "@/components/PageShell";
import ContentRow from "@/components/ContentRow";
import type { ContentRow as ContentRowType, TMDBGenre } from "@/types/tmdb";

interface MoviesClientProps {
  rows: ContentRowType[];
  genres: TMDBGenre[];
}

export default function MoviesClient({ rows, genres }: MoviesClientProps) {
  return (
    <PageShell>
      <main className="min-h-screen pt-20">
        <div className="px-4 pb-4 md:px-12">
          <h1 className="text-fluid-3xl font-bold">Movies</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Explore popular, top rated, and upcoming movies.
          </p>
          {genres.length > 0 && (
            <div className="row-scroll hide-scrollbar mt-4 flex gap-2 overflow-x-auto">
              {genres.slice(0, 16).map((g) => (
                <span
                  key={g.id}
                  className="flex-none rounded-full border border-zinc-700 px-4 py-1.5 text-xs text-zinc-300 transition hover:border-netflix hover:text-white"
                >
                  {g.name}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-8 pb-16">
          {rows.map((row) => (
            <ContentRow key={row.id} row={row} />
          ))}
        </div>
      </main>
    </PageShell>
  );
}
