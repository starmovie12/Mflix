import { create } from "zustand";
import type { ToastData } from "@/components/ui/Toast";
import type { WatchlistItem, PlaybackProgress, MediaType } from "@/types/tmdb";

// ─── Toast Store ─────────────────────────────────────────────────────

interface ToastStore {
  toasts: ToastData[];
  addToast: (message: string, type?: ToastData["type"]) => void;
  dismissToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, type = "info") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
  },
  dismissToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
}));

// ─── Watchlist Store ─────────────────────────────────────────────────

const WATCHLIST_KEY = "mflix_watchlist_v2";

function loadWatchlist(): WatchlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WATCHLIST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function persistWatchlist(items: WatchlistItem[]) {
  try {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(items));
  } catch {
    /* quota exceeded */
  }
}

interface WatchlistStore {
  items: WatchlistItem[];
  hydrated: boolean;
  hydrate: () => void;
  isInList: (id: number) => boolean;
  toggle: (item: WatchlistItem) => void;
  remove: (id: number) => void;
}

export const useWatchlistStore = create<WatchlistStore>((set, get) => ({
  items: [],
  hydrated: false,
  hydrate: () => {
    if (get().hydrated) return;
    set({ items: loadWatchlist(), hydrated: true });
  },
  isInList: (id) => get().items.some((i) => i.id === id),
  toggle: (item) => {
    const current = get().items;
    const exists = current.some((i) => i.id === item.id);
    const next = exists
      ? current.filter((i) => i.id !== item.id)
      : [{ ...item, addedAt: Date.now() }, ...current];
    set({ items: next });
    persistWatchlist(next);

    const store = useToastStore.getState();
    store.addToast(
      exists ? `Removed "${item.title}" from My List` : `Added "${item.title}" to My List`,
      "success"
    );
  },
  remove: (id) => {
    const next = get().items.filter((i) => i.id !== id);
    set({ items: next });
    persistWatchlist(next);
  },
}));

// ─── Playback Progress Store ─────────────────────────────────────────

const PROGRESS_KEY = "mflix_playback_progress";

function loadProgress(): PlaybackProgress[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistProgress(items: PlaybackProgress[]) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(items));
  } catch {
    /* quota exceeded */
  }
}

interface PlaybackStore {
  progress: PlaybackProgress[];
  hydrated: boolean;
  hydrate: () => void;
  getProgress: (mediaType: MediaType, id: number) => PlaybackProgress | undefined;
  saveProgress: (entry: PlaybackProgress) => void;
  clearProgress: (mediaType: MediaType, id: number) => void;
}

export const usePlaybackStore = create<PlaybackStore>((set, get) => ({
  progress: [],
  hydrated: false,
  hydrate: () => {
    if (get().hydrated) return;
    set({ progress: loadProgress(), hydrated: true });
  },
  getProgress: (mediaType, id) =>
    get().progress.find((p) => p.mediaType === mediaType && p.id === id),
  saveProgress: (entry) => {
    const current = get().progress.filter(
      (p) => !(p.mediaType === entry.mediaType && p.id === entry.id)
    );
    const next = [{ ...entry, updatedAt: Date.now() }, ...current].slice(0, 50);
    set({ progress: next });
    persistProgress(next);
  },
  clearProgress: (mediaType, id) => {
    const next = get().progress.filter(
      (p) => !(p.mediaType === mediaType && p.id === id)
    );
    set({ progress: next });
    persistProgress(next);
  },
}));
