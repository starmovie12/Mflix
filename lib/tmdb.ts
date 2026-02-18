import type { HeroMovie, MovieRowData, TMDBMovie, TMDBMovieDetails, TMDBVideo } from "@/lib/types";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
const DEFAULT_REVALIDATE_SECONDS = 60 * 15;
const FALLBACK_TMDB_API_KEY = "aa844700ff3f44363be5bf50f78df0b1";

const TMDB_API_KEY =
  process.env.TMDB_API_KEY ||
  process.env.NEXT_PUBLIC_TMDB_API_KEY ||
  FALLBACK_TMDB_API_KEY;

const ROW_DEFINITIONS: Array<Omit<MovieRowData, "movies"> & { endpoint: string }> = [
  { id: "trending", title: "Trending Now", endpoint: "/trending/movie/week" },
  { id: "top-rated", title: "Top Rated", endpoint: "/movie/top_rated" },
  { id: "action", title: "Action Blockbusters", endpoint: "/discover/movie?with_genres=28" },
  { id: "comedy", title: "Comedy Hits", endpoint: "/discover/movie?with_genres=35" },
  { id: "horror", title: "Horror Nights", endpoint: "/discover/movie?with_genres=27" },
  { id: "romance", title: "Romance", endpoint: "/discover/movie?with_genres=10749" },
  { id: "documentary", title: "Documentaries", endpoint: "/discover/movie?with_genres=99" }
];

interface TMDBListResponse {
  results?: TMDBMovie[];
}

interface TMDBVideosResponse {
  results?: TMDBVideo[];
}

type FetchParams = Record<string, string | number | boolean | undefined>;

function cleanMovie(movie: TMDBMovie): TMDBMovie {
  return {
    id: movie.id,
    title: movie.title ?? movie.name ?? "Untitled",
    name: movie.name ?? movie.title ?? "Untitled",
    overview: movie.overview ?? "",
    backdrop_path: movie.backdrop_path ?? null,
    poster_path: movie.poster_path ?? null,
    release_date: movie.release_date ?? movie.first_air_date ?? "",
    first_air_date: movie.first_air_date ?? movie.release_date ?? "",
    vote_average: movie.vote_average ?? 0,
    vote_count: movie.vote_count ?? 0,
    popularity: movie.popularity ?? 0,
    genre_ids: movie.genre_ids ?? [],
    media_type: movie.media_type ?? "movie"
  };
}

function withBaseParams(params: FetchParams = {}) {
  return {
    api_key: TMDB_API_KEY,
    language: "en-US",
    ...params
  };
}

async function fetchFromTMDB<T>(
  endpoint: string,
  params?: FetchParams,
  revalidateSeconds: number = DEFAULT_REVALIDATE_SECONDS
): Promise<T | null> {
  const [path, queryString] = endpoint.split("?");
  const mergedParams = withBaseParams(params);
  const searchParams = new URLSearchParams(queryString ?? "");

  Object.entries(mergedParams).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    searchParams.set(key, String(value));
  });

  const url = `${TMDB_BASE_URL}${path}?${searchParams.toString()}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: revalidateSeconds }
    });

    if (!response.ok) {
      console.error(`[TMDB] Request failed (${response.status}) for ${endpoint}`);
      return null;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error(`[TMDB] Unexpected error while fetching ${endpoint}`, error);
    return null;
  }
}

function normalizeList(payload: TMDBListResponse | null): TMDBMovie[] {
  if (!payload?.results?.length) {
    return [];
  }

  return payload.results.map(cleanMovie);
}

export function getMovieTitle(movie: TMDBMovie) {
  return movie.title || movie.name || "Untitled";
}

export function getImageUrl(path: string | null | undefined, size: "w300" | "w500" | "w780" | "original" = "w500") {
  if (!path) {
    return "/placeholder.svg";
  }

  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

export async function getTrendingMovies() {
  const payload = await fetchFromTMDB<TMDBListResponse>("/trending/movie/week");
  return normalizeList(payload);
}

export async function getTopRatedMovies() {
  const payload = await fetchFromTMDB<TMDBListResponse>("/movie/top_rated");
  return normalizeList(payload);
}

export async function getMoviesByGenre(genreId: number) {
  const payload = await fetchFromTMDB<TMDBListResponse>("/discover/movie", {
    with_genres: genreId,
    sort_by: "popularity.desc",
    include_adult: false
  });

  return normalizeList(payload);
}

export async function getHomeRows(): Promise<MovieRowData[]> {
  const rows = await Promise.all(
    ROW_DEFINITIONS.map(async (row) => {
      const payload = await fetchFromTMDB<TMDBListResponse>(row.endpoint);
      return {
        id: row.id,
        title: row.title,
        movies: normalizeList(payload)
      };
    })
  );

  return rows;
}

function selectBestTrailer(videos: TMDBVideo[] = []) {
  const youtubeVideos = videos.filter((video) => video.site === "YouTube" && video.key);
  if (!youtubeVideos.length) {
    return null;
  }

  const ranked = youtubeVideos.sort((a, b) => {
    const score = (video: TMDBVideo) => {
      if (video.type === "Trailer" && video.official) return 5;
      if (video.type === "Trailer") return 4;
      if (video.type === "Teaser") return 3;
      if (video.type === "Clip") return 2;
      return 1;
    };

    return score(b) - score(a);
  });

  return ranked[0]?.key ?? null;
}

export async function getMovieTrailerKey(movieId: number) {
  const payload = await fetchFromTMDB<TMDBVideosResponse>(`/movie/${movieId}/videos`);
  return selectBestTrailer(payload?.results ?? []);
}

export async function getFeaturedMovie(): Promise<HeroMovie | null> {
  const trending = await getTrendingMovies();
  const featured = trending.find((movie) => movie.backdrop_path || movie.poster_path);

  if (!featured) {
    return null;
  }

  const trailerKey = await getMovieTrailerKey(featured.id);
  return {
    ...featured,
    trailerKey
  };
}

export async function searchMovies(query: string) {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const payload = await fetchFromTMDB<TMDBListResponse>(
    "/search/movie",
    { query: trimmed, include_adult: false },
    60
  );

  return normalizeList(payload);
}

export async function getMovieDetails(movieId: number): Promise<TMDBMovieDetails | null> {
  const payload = await fetchFromTMDB<TMDBMovieDetails>(
    `/movie/${movieId}`,
    { append_to_response: "videos" },
    60 * 30
  );

  if (!payload?.id) {
    return null;
  }

  const normalizedVideos = payload.videos?.results ?? [];
  const base = cleanMovie(payload);

  return {
    ...payload,
    ...base,
    videos: {
      results: normalizedVideos
    }
  };
}
