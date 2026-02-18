import { getAppEnv } from "@/lib/env";

export type TmdbImageSize =
  | "w92"
  | "w154"
  | "w185"
  | "w300"
  | "w342"
  | "w500"
  | "w780"
  | "w1280"
  | "original";

export function getTmdbImageUrl(path: string | null | undefined, size: TmdbImageSize = "w500"): string {
  if (!path) return "/placeholder.svg";
  const { tmdbImageBaseUrl } = getAppEnv();
  return `${tmdbImageBaseUrl}/${size}${path}`;
}

