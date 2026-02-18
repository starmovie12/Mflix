"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Bookmark, Trash2 } from "lucide-react";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import PosterImage from "@/components/PosterImage";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useWatchlistStore } from "@/lib/store";

export default function MyListClient() {
  const items = useWatchlistStore((s) => s.items);
  const hydrated = useWatchlistStore((s) => s.hydrated);
  const remove = useWatchlistStore((s) => s.remove);

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => b.addedAt - a.addedAt),
    [items]
  );

  return (
    <PageShell>
      <main className="min-h-screen pt-20">
        <div className="mx-auto max-w-[1400px] px-4 pb-16 md:px-12">
          <h1 className="text-fluid-3xl font-bold">My List</h1>
          <p className="mt-1 text-sm text-zinc-400">
            {items.length > 0
              ? `${items.length} title${items.length > 1 ? "s" : ""} in your list`
              : "Titles you add to your list will appear here."}
          </p>

          {!hydrated && (
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton-shimmer aspect-poster rounded-lg" />
              ))}
            </div>
          )}

          {hydrated && items.length === 0 && (
            <EmptyState
              icon={<Bookmark className="h-8 w-8 text-zinc-500" />}
              title="Your list is empty"
              description="Browse movies and TV shows, then add them to your list to watch later."
              action={
                <Link href="/">
                  <Button variant="white" size="md">
                    Browse Now
                  </Button>
                </Link>
              }
            />
          )}

          {hydrated && items.length > 0 && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.04 } },
              }}
              className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
            >
              {sortedItems.map((item) => (
                <motion.div
                  key={item.id}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="group relative"
                >
                  <Link href={`/title/${item.mediaType}/${item.id}`}>
                    <div className="overflow-hidden rounded-lg ring-1 ring-zinc-800 transition group-hover:ring-zinc-600">
                      <PosterImage
                        path={item.posterPath}
                        alt={item.title}
                        width={300}
                        height={450}
                        size="w342"
                        className="aspect-poster"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                      />
                    </div>
                  </Link>
                  <div className="mt-2 space-y-0.5">
                    <p className="line-clamp-1 text-sm font-medium">{item.title}</p>
                    <div className="flex items-center gap-2">
                      {item.year && (
                        <span className="text-xs text-zinc-500">{item.year}</span>
                      )}
                      <Badge variant="outline" className="text-[10px]">
                        {item.mediaType === "tv" ? "TV" : "Movie"}
                      </Badge>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/80 text-zinc-400 opacity-0 ring-1 ring-white/10 transition hover:bg-red-600 hover:text-white group-hover:opacity-100"
                    aria-label={`Remove ${item.title} from list`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>
    </PageShell>
  );
}
