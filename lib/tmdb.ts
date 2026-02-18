export {
  tmdbImage as getImageUrl,
  getTitle as getMovieTitle,
} from "@/lib/tmdb/mappers";

export {
  getMovieDetails,
  searchMovies,
} from "@/lib/tmdb/endpoints";

export {
  fetchTMDBSafe as fetchFromTMDB,
} from "@/lib/tmdb/client";
