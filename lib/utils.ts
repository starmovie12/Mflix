import { IMAGE_SIZES, PLACEHOLDER_IMAGE, PLACEHOLDER_BACKDROP, GENRE_MAP } from "./constants";
import type { Movie } from "./types";

export function getImageUrl(path: string | null, size: "small" | "medium" | "large" | "original" = "medium"): string {
  if (!path) return PLACEHOLDER_IMAGE;
  return `${IMAGE_SIZES.poster[size]}${path}`;
}

export function getBackdropUrl(path: string | null, size: "small" | "large" | "original" = "large"): string {
  if (!path) return PLACEHOLDER_BACKDROP;
  return `${IMAGE_SIZES.backdrop[size]}${path}`;
}

export function getProfileUrl(path: string | null): string {
  if (!path) return PLACEHOLDER_IMAGE;
  return `${IMAGE_SIZES.profile.medium}${path}`;
}

export function getTitle(movie: Movie): string {
  return movie.title || movie.name || movie.original_title || movie.original_name || "Untitled";
}

export function getYear(movie: Movie): string {
  const date = movie.release_date || movie.first_air_date;
  return date ? date.split("-")[0] : "";
}

export function getGenreNames(genreIds: number[]): string[] {
  return genreIds
    .map((id) => GENRE_MAP[id])
    .filter(Boolean)
    .slice(0, 3);
}

export function formatRuntime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

export function formatVoteAverage(vote: number): string {
  return (Math.round(vote * 10) / 10).toFixed(1);
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
