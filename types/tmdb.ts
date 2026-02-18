export interface TMDBVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at?: string;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface TMDBCrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface TMDBImage {
  file_path: string;
  width: number;
  height: number;
  aspect_ratio: number;
  vote_average: number;
}

export interface TMDBMovie {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  backdrop_path: string | null;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  media_type?: string;
  original_language?: string;
  adult?: boolean;
}

export interface TMDBMovieDetails extends TMDBMovie {
  runtime: number | null;
  genres: TMDBGenre[];
  tagline: string | null;
  status: string;
  budget: number;
  revenue: number;
  homepage: string | null;
  imdb_id: string | null;
  production_companies: Array<{ id: number; name: string; logo_path: string | null }>;
  spoken_languages: Array<{ english_name: string; iso_639_1: string }>;
  videos?: { results: TMDBVideo[] };
  credits?: {
    cast: TMDBCastMember[];
    crew: TMDBCrewMember[];
  };
  images?: {
    backdrops: TMDBImage[];
    posters: TMDBImage[];
  };
  similar?: { results: TMDBMovie[] };
  recommendations?: { results: TMDBMovie[] };
}

export interface TMDBTVDetails extends TMDBMovie {
  number_of_seasons: number;
  number_of_episodes: number;
  episode_run_time: number[];
  genres: TMDBGenre[];
  tagline: string | null;
  status: string;
  homepage: string | null;
  created_by: Array<{ id: number; name: string; profile_path: string | null }>;
  networks: Array<{ id: number; name: string; logo_path: string | null }>;
  spoken_languages: Array<{ english_name: string; iso_639_1: string }>;
  seasons: TMDBSeason[];
  videos?: { results: TMDBVideo[] };
  credits?: {
    cast: TMDBCastMember[];
    crew: TMDBCrewMember[];
  };
  images?: {
    backdrops: TMDBImage[];
    posters: TMDBImage[];
  };
  similar?: { results: TMDBMovie[] };
  recommendations?: { results: TMDBMovie[] };
}

export interface TMDBSeason {
  id: number;
  name: string;
  overview: string;
  season_number: number;
  episode_count: number;
  air_date: string | null;
  poster_path: string | null;
}

export interface TMDBEpisode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  air_date: string | null;
  still_path: string | null;
  runtime: number | null;
  vote_average: number;
}

export interface TMDBSeasonDetails {
  id: number;
  name: string;
  overview: string;
  season_number: number;
  air_date: string | null;
  poster_path: string | null;
  episodes: TMDBEpisode[];
}

export interface TMDBListResponse<T = TMDBMovie> {
  page: number;
  total_pages: number;
  total_results: number;
  results: T[];
}

export type MediaType = "movie" | "tv";

export type ImageSize = "w92" | "w154" | "w185" | "w300" | "w342" | "w500" | "w780" | "original";

export interface ContentRow {
  id: string;
  title: string;
  items: TMDBMovie[];
  variant?: "poster" | "backdrop" | "top10";
}

export interface HeroContent {
  id: number;
  title: string;
  overview: string;
  backdropUrl: string;
  posterUrl: string;
  mediaType: MediaType;
  rating: number;
  year: string;
  trailerKey: string | null;
  genres: number[];
}

export interface WatchlistItem {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  rating: number;
  year: string;
  mediaType: MediaType;
  addedAt: number;
}

export interface PlaybackProgress {
  mediaType: MediaType;
  id: number;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  currentTime: number;
  duration: number;
  updatedAt: number;
}
