export interface TMDBVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at?: string;
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
  media_type?: string;
}

export interface TMDBMovieDetails extends TMDBMovie {
  runtime?: number;
  genres?: Array<{ id: number; name: string }>;
  videos?: {
    results?: TMDBVideo[];
  };
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
}
