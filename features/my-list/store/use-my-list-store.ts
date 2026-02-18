"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { MediaItem } from "@/types/media";

export interface MyListItem {
  id: number;
  mediaType: "movie" | "tv";
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string | null;
  voteAverage: number;
}

interface MyListState {
  items: MyListItem[];
  has: (id: number, mediaType: "movie" | "tv") => boolean;
  toggle: (item: MediaItem | MyListItem) => void;
  remove: (id: number, mediaType: "movie" | "tv") => void;
}

function keyFrom(item: { id: number; mediaType: "movie" | "tv" }) {
  return `${item.mediaType}:${item.id}`;
}

function toMyListItem(item: MediaItem | MyListItem): MyListItem {
  return {
    id: item.id,
    mediaType: item.mediaType,
    title: item.title,
    overview: item.overview,
    posterPath: item.posterPath,
    backdropPath: item.backdropPath,
    releaseDate: item.releaseDate,
    voteAverage: item.voteAverage
  };
}

export const useMyListStore = create<MyListState>()(
  persist(
    (set, get) => ({
      items: [],
      has: (id, mediaType) => get().items.some((item) => keyFrom(item) === keyFrom({ id, mediaType })),
      toggle: (input) => {
        set((state) => {
          const nextItem = toMyListItem(input);
          const nextKey = keyFrom(nextItem);
          const exists = state.items.some((item) => keyFrom(item) === nextKey);

          if (exists) {
            return {
              items: state.items.filter((item) => keyFrom(item) !== nextKey)
            };
          }

          return {
            items: [nextItem, ...state.items]
          };
        });
      },
      remove: (id, mediaType) => {
        set((state) => ({
          items: state.items.filter((item) => keyFrom(item) !== keyFrom({ id, mediaType }))
        }));
      }
    }),
    {
      name: "mflix-my-list",
      storage: createJSONStorage(() => localStorage),
      version: 1
    }
  )
);
