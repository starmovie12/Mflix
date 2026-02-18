import type { MediaType } from "@/lib/tmdb/types";

export const tmdbEndpoints = {
  trending: (window: "day" | "week") => `/trending/all/${window}`,
  trendingMovies: (window: "day" | "week") => `/trending/movie/${window}`,
  trendingTv: (window: "day" | "week") => `/trending/tv/${window}`,
  popularMovies: () => `/movie/popular`,
  popularTv: () => `/tv/popular`,
  topRatedMovies: () => `/movie/top_rated`,
  upcomingMovies: () => `/movie/upcoming`,
  nowPlayingMovies: () => `/movie/now_playing`,
  genres: (mediaType: MediaType) => `/genre/${mediaType}/list`,
  multiSearch: () => `/search/multi`,
  details: (mediaType: MediaType, id: number) => `/${mediaType}/${id}`,
  videos: (mediaType: MediaType, id: number) => `/${mediaType}/${id}/videos`
} as const;

