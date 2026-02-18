/**
 * TMDB API endpoint definitions and row configurations.
 */

import type { MovieRowData } from "@/lib/tmdb/types";

export const TMDB_IMAGE_BASE_URL =
  process.env.TMDB_IMAGE_BASE_URL ?? "https://image.tmdb.org/t/p";

export type ImageSize = "w92" | "w154" | "w185" | "w300" | "w500" | "w780" | "original";

export function getImageUrl(
  path: string | null | undefined,
  size: ImageSize = "w500"
): string {
  if (!path) {
    return "/placeholder.svg";
  }
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

export const ROW_DEFINITIONS: Array<Omit<MovieRowData, "movies"> & { endpoint: string }> = [
  { id: "trending-day", title: "Trending Today", endpoint: "/trending/all/day" },
  { id: "trending-week", title: "Trending This Week", endpoint: "/trending/all/week" },
  { id: "popular-movies", title: "Popular Movies", endpoint: "/movie/popular" },
  { id: "popular-tv", title: "Popular TV Shows", endpoint: "/tv/popular" },
  { id: "top-rated", title: "Top Rated", endpoint: "/movie/top_rated" },
  { id: "upcoming", title: "Upcoming", endpoint: "/movie/upcoming" },
  { id: "now-playing", title: "Now Playing", endpoint: "/movie/now_playing" },
  { id: "action", title: "Action Blockbusters", endpoint: "/discover/movie?with_genres=28" },
  { id: "comedy", title: "Comedy Hits", endpoint: "/discover/movie?with_genres=35" },
  { id: "horror", title: "Horror Nights", endpoint: "/discover/movie?with_genres=27" },
  { id: "romance", title: "Romance", endpoint: "/discover/movie?with_genres=10749" },
  { id: "documentary", title: "Documentaries", endpoint: "/discover/movie?with_genres=99" },
];
