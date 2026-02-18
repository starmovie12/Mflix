const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';
const API_KEY = 'aa844700ff3f44363be5bf50f78df0b1';

export interface Movie {
  id: number;
  title: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  media_type?: 'movie' | 'tv';
}

export interface TmdbResponse<T> {
  results: T[];
  page: number;
  total_pages: number;
  total_results: number;
}

export interface VideoResult {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface VideoResponse {
  id: number;
  results: VideoResult[];
}

async function fetchTmdb<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const searchParams = new URLSearchParams({ api_key: API_KEY, ...params });
  const url = `${TMDB_BASE}${endpoint}?${searchParams}`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);
    return res.json();
  } catch (error) {
    console.error(`[TMDB] Fetch failed for ${endpoint}:`, error);
    throw error;
  }
}

export async function getTrending(mediaType: 'all' | 'movie' | 'tv' = 'all'): Promise<Movie[]> {
  try {
    const data = await fetchTmdb<TmdbResponse<Movie>>('/trending/all/week', {
      media_type: mediaType,
    });
    return data.results ?? [];
  } catch {
    return [];
  }
}

export async function getTopRated(mediaType: 'movie' | 'tv' = 'movie'): Promise<Movie[]> {
  try {
    const endpoint = mediaType === 'movie' ? '/movie/top_rated' : '/tv/top_rated';
    const data = await fetchTmdb<TmdbResponse<Movie>>(endpoint);
    return data.results ?? [];
  } catch {
    return [];
  }
}

export async function getDiscoverByGenre(
  genreId: number,
  mediaType: 'movie' | 'tv' = 'movie'
): Promise<Movie[]> {
  try {
    const data = await fetchTmdb<TmdbResponse<Movie>>('/discover/movie', {
      with_genres: String(genreId),
    });
    return data.results ?? [];
  } catch {
    return [];
  }
}

export async function getActionMovies(): Promise<Movie[]> {
  return getDiscoverByGenre(28, 'movie');
}

export async function getComedyMovies(): Promise<Movie[]> {
  return getDiscoverByGenre(35, 'movie');
}

export async function getHorrorMovies(): Promise<Movie[]> {
  return getDiscoverByGenre(27, 'movie');
}

export async function getRomanceMovies(): Promise<Movie[]> {
  return getDiscoverByGenre(10749, 'movie');
}

export async function getDocumentaries(): Promise<Movie[]> {
  return getDiscoverByGenre(99, 'movie');
}

export async function getMovieById(id: string): Promise<Movie | null> {
  try {
    const data = await fetchTmdb<Movie>(`/movie/${id}`);
    return data ?? null;
  } catch {
    return null;
  }
}

export async function getTvById(id: string): Promise<Movie | null> {
  try {
    const data = await fetchTmdb<Movie>(`/tv/${id}`);
    return data ?? null;
  } catch {
    return null;
  }
}

export async function getVideos(id: string, type: 'movie' | 'tv' = 'movie'): Promise<VideoResult[]> {
  try {
    const endpoint = type === 'movie' ? `/movie/${id}/videos` : `/tv/${id}/videos`;
    const data = await fetchTmdb<VideoResponse>(endpoint);
    return data.results ?? [];
  } catch {
    return [];
  }
}

export async function searchMulti(query: string): Promise<Movie[]> {
  if (!query.trim()) return [];
  try {
    const data = await fetchTmdb<TmdbResponse<Movie>>('/search/multi', {
      query: query.trim(),
      include_adult: 'false',
    });
    return (data.results ?? []).filter(
      (r) => r.media_type === 'movie' || r.media_type === 'tv'
    );
  } catch {
    return [];
  }
}

export function getPosterUrl(path: string | null, size: 'w92' | 'w185' | 'w342' | 'w500' | 'original' = 'w500'): string {
  if (!path) return '/placeholder-poster.svg';
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getBackdropUrl(path: string | null, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'): string {
  if (!path) return '/placeholder-backdrop.svg';
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getMovieTitle(movie: Movie): string {
  return movie.title ?? movie.name ?? 'Unknown';
}
