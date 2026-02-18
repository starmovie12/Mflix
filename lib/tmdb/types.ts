export type TMDBMediaType = "movie" | "tv";

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

export interface TMDBImageAsset {
  file_path: string;
  width: number;
  height: number;
  aspect_ratio: number;
  vote_average?: number;
}

export interface TMDBCreditPerson {
  id: number;
  name: string;
  profile_path?: string | null;
  character?: string;
  job?: string;
  department?: string;
  known_for_department?: string;
}

export interface TMDBCredits {
  cast?: TMDBCreditPerson[];
  crew?: TMDBCreditPerson[];
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
  media_type?: TMDBMediaType;
}

export interface TMDBListResponse {
  results?: TMDBMovie[];
  page?: number;
  total_pages?: number;
  total_results?: number;
}

export interface TMDBVideosResponse {
  results?: TMDBVideo[];
}

export interface TMDBImagesResponse {
  backdrops?: TMDBImageAsset[];
  posters?: TMDBImageAsset[];
  logos?: TMDBImageAsset[];
}

export interface TMDBMovieDetails extends TMDBMovie {
  runtime?: number;
  episode_run_time?: number[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  status?: string;
  tagline?: string;
  genres?: TMDBGenre[];
  videos?: TMDBVideosResponse;
  credits?: TMDBCredits;
  images?: TMDBImagesResponse;
  similar?: TMDBListResponse;
  recommendations?: TMDBListResponse;
}

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
  media_type: TMDBMediaType;
}
