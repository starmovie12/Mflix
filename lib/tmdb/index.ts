/**
 * TMDB API - unified exports.
 * All TMDB access goes through server-side functions; never expose API key to client.
 */

export { fetchFromTMDB } from "./client";
export { getImageUrl, ROW_DEFINITIONS } from "./endpoints";
export {
  getMovieTitle,
  cleanMovie,
  selectBestTrailer,
  normalizeMovieList,
  normalizeDetails,
  toHeroMovie,
  getDirector,
  getTopCast,
} from "./mappers";
export type {
  MediaType,
  TMDBMovie,
  TMDBMovieDetails,
  TMDBTvDetails,
  TMDBVideo,
  TMDBGenre,
  TMDBCastMember,
  TMDBCrewMember,
  TMDBListResponse,
  MovieRowData,
  HeroMovie,
  WatchlistMovie,
} from "./types";
