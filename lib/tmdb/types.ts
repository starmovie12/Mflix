/**
 * TMDB API response types and UI-friendly normalized types.
 * Used for runtime validation and type safety across the app.
 */

export type MediaType = "movie" | "tv" | "person";

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at?: string;
}

export interface TMDBCastMember {
  id: number;
  name: string;
  character?: string;
  profile_path: string | null;
  order?: number;
}

export interface TMDBCrewMember {
  id: number;
  name: string;
  job: string;
  department?: string;
  profile_path: string | null;
}

export interface TMDBMovie {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  backdrop_path?: string | null;
  poster_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  vote_count?: number;
  popularity?: number;
  genre_ids?: number[];
  media_type?: MediaType;
}

export interface TMDBMovieDetails extends TMDBMovie {
  runtime?: number;
  genres?: TMDBGenre[];
  videos?: { results?: TMDBVideo[] };
  credits?: {
    cast?: TMDBCastMember[];
    crew?: TMDBCrewMember[];
  };
  similar?: { results?: TMDBMovie[] };
  recommendations?: { results?: TMDBMovie[] };
}

export interface TMDBTvDetails extends TMDBMovieDetails {
  number_of_seasons?: number;
  number_of_episodes?: number;
  seasons?: Array<{
    id: number;
    season_number: number;
    name: string;
    overview?: string;
    poster_path: string | null;
    episode_count?: number;
  }>;
}

export interface TMDBListResponse<T = TMDBMovie> {
  results?: T[];
  page?: number;
  total_pages?: number;
  total_results?: number;
}

export interface TMDBVideosResponse {
  results?: TMDBVideo[];
}

export interface TMDBGenresResponse {
  genres?: TMDBGenre[];
}

/** UI-friendly normalized models */
export interface MovieRowData {
  id: string;
  title: string;
  movies: TMDBMovie[];
}

export interface HeroMovie extends TMDBMovie {
  trailerKey?: string | null;
}

export interface WatchlistMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  media_type?: MediaType;
}
