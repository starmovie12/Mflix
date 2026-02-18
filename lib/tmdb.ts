/**
 * TMDB API - backward-compatible re-export.
 * Prefer importing from @/lib/tmdb for specific modules.
 */

export { getImageUrl } from "./tmdb/endpoints";
export { getMovieTitle, getDirector, getTopCast } from "./tmdb/mappers";
export {
  getTrendingMovies,
  getTopRatedMovies,
  getHomeRows,
  getFeaturedMovie,
  getMovieDetails,
  getMovieTrailerKey,
  getTitleDetails,
  getPopularMovies,
  getPopularTv,
  getTrendingToday,
  getTrendingWeek,
  getUpcomingMovies,
  getNowPlayingMovies,
  getTvDetails,
  searchMovies,
} from "./tmdb/api";
export type { HeroMovie, MovieRowData, TMDBMovie, TMDBMovieDetails, TMDBVideo } from "./tmdb/types";
