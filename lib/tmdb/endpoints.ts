import type { TMDBMediaType } from "@/lib/tmdb/types";

export interface HomeRowDefinition {
  id: string;
  title: string;
  endpoint: string;
  mediaType: TMDBMediaType;
}

export const HOME_ROW_DEFINITIONS: HomeRowDefinition[] = [
  { id: "trending", title: "Trending This Week", endpoint: "/trending/movie/week", mediaType: "movie" },
  { id: "popular-movies", title: "Popular Movies", endpoint: "/movie/popular", mediaType: "movie" },
  { id: "popular-tv", title: "Popular TV", endpoint: "/tv/popular", mediaType: "tv" },
  { id: "top-rated", title: "Top Rated", endpoint: "/movie/top_rated", mediaType: "movie" },
  { id: "now-playing", title: "Now Playing", endpoint: "/movie/now_playing", mediaType: "movie" },
  { id: "action", title: "Action Blockbusters", endpoint: "/discover/movie?with_genres=28", mediaType: "movie" },
  { id: "crime-tv", title: "Crime Series", endpoint: "/discover/tv?with_genres=80", mediaType: "tv" }
];

export function detailsEndpoint(mediaType: TMDBMediaType, id: number) {
  return `/${mediaType}/${id}`;
}

export function videosEndpoint(mediaType: TMDBMediaType, id: number) {
  return `/${mediaType}/${id}/videos`;
}

export function searchMultiEndpoint() {
  return "/search/multi";
}
