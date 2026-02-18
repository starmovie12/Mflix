"use client";

import { useWatchlist } from "@/hooks/useWatchlist";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieCard from "@/components/MovieCard";

export default function MyListPage() {
  const { watchlist, mounted } = useWatchlist();

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="px-4 pb-12 pt-24 md:px-12">
        <h1 className="mb-8 text-2xl font-bold md:text-4xl">My List</h1>

        {!mounted ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] rounded-md animate-shimmer" />
            ))}
          </div>
        ) : watchlist.length === 0 ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
            <p className="mb-2 text-xl text-mflix-light">Your list is empty</p>
            <p className="mb-6 text-mflix-gray">
              Add movies and shows to your list to watch them later.
            </p>
            <a
              href="/"
              className="rounded bg-mflix-red px-6 py-3 font-semibold transition-colors hover:bg-mflix-red-hover"
            >
              Browse Content
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {watchlist.map((movie) => (
              <MovieCard key={movie.id} movie={movie} isLarge />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
