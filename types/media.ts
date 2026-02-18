export type MediaType = "movie" | "tv";

export type TmdbImageSize =
  | "w45"
  | "w92"
  | "w154"
  | "w185"
  | "w300"
  | "w342"
  | "w500"
  | "w780"
  | "w1280"
  | "original";

export interface GenreTag {
  id: number;
  name: string;
}

export interface VideoAsset {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  publishedAt: string | null;
}

export interface CreditPerson {
  id: number;
  name: string;
  profilePath: string | null;
  character: string | null;
  job: string | null;
}

export interface ImageAsset {
  filePath: string;
  width: number | null;
  height: number | null;
  iso6391: string | null;
}

export interface MediaItem {
  id: number;
  mediaType: MediaType;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string | null;
  voteAverage: number;
  voteCount: number;
  popularity: number;
  genreIds: number[];
  originalLanguage: string | null;
  adult: boolean;
}

export interface FeaturedMedia extends MediaItem {
  trailerKey: string | null;
}

export interface MediaRail {
  id: string;
  title: string;
  items: MediaItem[];
}

export interface SeasonSummary {
  id: number;
  name: string;
  episodeCount: number;
  airDate: string | null;
  overview: string;
  posterPath: string | null;
}

export interface TitleDetails extends MediaItem {
  tagline: string | null;
  status: string | null;
  runtimeMinutes: number | null;
  genres: GenreTag[];
  videos: VideoAsset[];
  cast: CreditPerson[];
  crewHighlights: CreditPerson[];
  similar: MediaItem[];
  recommendations: MediaItem[];
  backdrops: ImageAsset[];
  posters: ImageAsset[];
  seasons: SeasonSummary[];
}

export interface SearchResult {
  query: string;
  page: number;
  totalPages: number;
  totalResults: number;
  results: MediaItem[];
}
