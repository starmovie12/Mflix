"use client";

import type { TMDBGenre } from "@/types/tmdb";

interface GenreChipsProps {
  genres: TMDBGenre[];
  activeId: number | null;
  onSelect: (id: number | null) => void;
}

export default function GenreChips({ genres, activeId, onSelect }: GenreChipsProps) {
  return (
    <div className="row-scroll hide-scrollbar flex gap-2 overflow-x-auto pb-2">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`flex-none rounded-full px-4 py-1.5 text-sm font-medium transition ${
          activeId === null
            ? "bg-white text-black"
            : "border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white"
        }`}
      >
        All
      </button>
      {genres.map((genre) => (
        <button
          key={genre.id}
          type="button"
          onClick={() => onSelect(genre.id === activeId ? null : genre.id)}
          className={`flex-none whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition ${
            genre.id === activeId
              ? "bg-white text-black"
              : "border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white"
          }`}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
}
