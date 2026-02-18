import { TMDB_API_KEY, TMDB_BASE_URL } from "./constants";
import type { Movie, MovieDetails, SearchResult } from "./types";

async function fetchTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T | null> {
  const searchParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    ...params,
  });

  try {
    const res = await fetch(`${TMDB_BASE_URL}${endpoint}?${searchParams}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getTrending(): Promise<Movie[]> {
  const data = await fetchTMDB<{ results: Movie[] }>("/trending/all/week");
  return data?.results ?? [];
}

export async function getTopRated(): Promise<Movie[]> {
  const data = await fetchTMDB<{ results: Movie[] }>("/movie/top_rated");
  return data?.results ?? [];
}

export async function getNetflixOriginals(): Promise<Movie[]> {
  const data = await fetchTMDB<{ results: Movie[] }>("/discover/tv", {
    with_networks: "213",
  });
  return data?.results ?? [];
}

export async function getActionMovies(): Promise<Movie[]> {
  const data = await fetchTMDB<{ results: Movie[] }>("/discover/movie", {
    with_genres: "28",
  });
  return data?.results ?? [];
}

export async function getComedyMovies(): Promise<Movie[]> {
  const data = await fetchTMDB<{ results: Movie[] }>("/discover/movie", {
    with_genres: "35",
  });
  return data?.results ?? [];
}

export async function getHorrorMovies(): Promise<Movie[]> {
  const data = await fetchTMDB<{ results: Movie[] }>("/discover/movie", {
    with_genres: "27",
  });
  return data?.results ?? [];
}

export async function getRomanceMovies(): Promise<Movie[]> {
  const data = await fetchTMDB<{ results: Movie[] }>("/discover/movie", {
    with_genres: "10749",
  });
  return data?.results ?? [];
}

export async function getDocumentaries(): Promise<Movie[]> {
  const data = await fetchTMDB<{ results: Movie[] }>("/discover/movie", {
    with_genres: "99",
  });
  return data?.results ?? [];
}

export async function getSciFiMovies(): Promise<Movie[]> {
  const data = await fetchTMDB<{ results: Movie[] }>("/discover/movie", {
    with_genres: "878",
  });
  return data?.results ?? [];
}

export async function getThrillerMovies(): Promise<Movie[]> {
  const data = await fetchTMDB<{ results: Movie[] }>("/discover/movie", {
    with_genres: "53",
  });
  return data?.results ?? [];
}

export async function getAnimationMovies(): Promise<Movie[]> {
  const data = await fetchTMDB<{ results: Movie[] }>("/discover/movie", {
    with_genres: "16",
  });
  return data?.results ?? [];
}

export async function getUpcoming(): Promise<Movie[]> {
  const data = await fetchTMDB<{ results: Movie[] }>("/movie/upcoming");
  return data?.results ?? [];
}

export async function getNowPlaying(): Promise<Movie[]> {
  const data = await fetchTMDB<{ results: Movie[] }>("/movie/now_playing");
  return data?.results ?? [];
}

export async function getMovieDetails(id: number, type: "movie" | "tv" = "movie"): Promise<MovieDetails | null> {
  return fetchTMDB<MovieDetails>(`/${type}/${id}`, {
    append_to_response: "videos,credits,similar",
  });
}

export async function searchMovies(query: string, page: number = 1): Promise<SearchResult> {
  const data = await fetchTMDB<SearchResult>("/search/multi", {
    query,
    page: page.toString(),
  });
  return data ?? { page: 1, results: [], total_pages: 0, total_results: 0 };
}

export async function getMoviesByPage(genreId: number, page: number = 1): Promise<Movie[]> {
  const data = await fetchTMDB<{ results: Movie[] }>("/discover/movie", {
    with_genres: genreId.toString(),
    page: page.toString(),
  });
  return data?.results ?? [];
}
