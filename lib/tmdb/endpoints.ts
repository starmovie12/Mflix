import type { MediaType } from "@/types/media";

export type TmdbTimeWindow = "day" | "week";

export const tmdbEndpoints = {
  trending: (mediaType: MediaType | "all", timeWindow: TmdbTimeWindow) =>
    `/trending/${mediaType}/${timeWindow}`,
  popular: (mediaType: MediaType) => `/${mediaType}/popular`,
  topRated: (mediaType: MediaType) => `/${mediaType}/top_rated`,
  upcomingMovies: "/movie/upcoming",
  nowPlayingMovies: "/movie/now_playing",
  airingTodayTv: "/tv/airing_today",
  onTheAirTv: "/tv/on_the_air",
  discoverByGenre: (mediaType: MediaType, genreId: number) =>
    `/discover/${mediaType}?with_genres=${genreId}&sort_by=popularity.desc&include_adult=false`,
  genres: (mediaType: MediaType) => `/genre/${mediaType}/list`,
  multiSearch: "/search/multi",
  details: (mediaType: MediaType, id: number) => `/${mediaType}/${id}`
} as const;

export interface HomeRailDefinition {
  id: string;
  title: string;
  endpoint: string;
  mediaTypeHint?: MediaType;
  revalidate?: number;
}

export const HOME_RAILS: HomeRailDefinition[] = [
  {
    id: "trending-day",
    title: "Trending Today",
    endpoint: tmdbEndpoints.trending("all", "day"),
    revalidate: 60 * 5
  },
  {
    id: "trending-week",
    title: "Trending This Week",
    endpoint: tmdbEndpoints.trending("all", "week"),
    revalidate: 60 * 10
  },
  {
    id: "popular-movies",
    title: "Popular Movies",
    endpoint: tmdbEndpoints.popular("movie"),
    mediaTypeHint: "movie",
    revalidate: 60 * 15
  },
  {
    id: "popular-tv",
    title: "Popular TV",
    endpoint: tmdbEndpoints.popular("tv"),
    mediaTypeHint: "tv",
    revalidate: 60 * 15
  },
  {
    id: "top-rated-movies",
    title: "Top Rated Movies",
    endpoint: tmdbEndpoints.topRated("movie"),
    mediaTypeHint: "movie",
    revalidate: 60 * 30
  },
  {
    id: "upcoming-movies",
    title: "Upcoming Movies",
    endpoint: tmdbEndpoints.upcomingMovies,
    mediaTypeHint: "movie",
    revalidate: 60 * 30
  },
  {
    id: "now-playing",
    title: "Now Playing",
    endpoint: tmdbEndpoints.nowPlayingMovies,
    mediaTypeHint: "movie",
    revalidate: 60 * 10
  },
  {
    id: "airing-today",
    title: "Airing Today",
    endpoint: tmdbEndpoints.airingTodayTv,
    mediaTypeHint: "tv",
    revalidate: 60 * 10
  }
];
