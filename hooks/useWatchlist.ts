"use client";

import { useEffect } from "react";
import { useWatchlistStore } from "@/lib/store";

export function useWatchlist() {
  const store = useWatchlistStore();

  useEffect(() => {
    store.hydrate();
  }, [store]);

  return store;
}
