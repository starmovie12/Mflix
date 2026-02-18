"use client";

import PageShell from "@/components/PageShell";
import ContentRow from "@/components/ContentRow";
import type { ContentRow as ContentRowType } from "@/types/tmdb";

interface NewPopularClientProps {
  rows: ContentRowType[];
}

export default function NewPopularClient({ rows }: NewPopularClientProps) {
  return (
    <PageShell>
      <main className="min-h-screen pt-20">
        <div className="px-4 pb-4 md:px-12">
          <h1 className="text-fluid-3xl font-bold">New & Popular</h1>
          <p className="mt-1 text-sm text-zinc-400">
            See what&apos;s trending, new releases, and what everyone is watching.
          </p>
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
