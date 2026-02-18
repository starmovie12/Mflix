import type { TmdbImageSize } from "@/types/media";

const DEFAULT_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export function getTmdbImageUrl(path: string | null | undefined, size: TmdbImageSize = "w780") {
  if (!path) {
    return "/placeholder.svg";
  }

  const baseUrl = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL || DEFAULT_IMAGE_BASE_URL;
  return `${baseUrl}/${size}${path}`;
}

export function getDisplayTitle(input: { title?: string | null; name?: string | null }) {
  return input.title?.trim() || input.name?.trim() || "Untitled";
}
