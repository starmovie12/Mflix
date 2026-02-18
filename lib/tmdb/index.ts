import "server-only";

import { z } from "zod";
import type { GenreTag, MediaItem, MediaRail, MediaType, SearchResult, TitleDetails } from "@/types/media";
import { hasTmdbApiKey } from "@/lib/env";
import {
  getMockFeaturedWithTrailer,
  getMockGenres,
  getMockHomeRails,
  getMockMediaByGenre,
  getMockSearchResults,
  getMockTitleDetails
} from "@/lib/mock/tmdb-fallback";
import { tmdbRequest } from "@/lib/tmdb/client";
import { HOME_RAILS, tmdbEndpoints } from "@/lib/tmdb/endpoints";
import { mapFeaturedMedia, mapMediaList, mapMediaSummary, mapTitleDetails } from "@/lib/tmdb/mappers";
import {
  tmdbGenreListSchema,
  tmdbMediaListResponseSchema,
  tmdbMovieDetailsSchema,
  tmdbMultiSearchResponseSchema,
  tmdbTvDetailsSchema,
  tmdbVideoSchema
} from "@/lib/tmdb/types";

const tmdbVideoListSchema = z.object({
  results: z.array(tmdbVideoSchema).default([])
});

function isTmdbConfigured() {
  return hasTmdbApiKey();
}

async function requestMediaList(endpoint: string, mediaTypeHint?: MediaType, revalidate = 60 * 15) {
  if (!isTmdbConfigured()) {
    return [];
  }

  const payload = await tmdbRequest(endpoint, tmdbMediaListResponseSchema, {
    revalidate,
    tags: ["tmdb", endpoint]
  });

  return mapMediaList(payload.results, mediaTypeHint);
}

export async function getHomeRailsData(): Promise<MediaRail[]> {
  if (!isTmdbConfigured()) {
    return getMockHomeRails();
  }

  const rows = await Promise.all(
    HOME_RAILS.map(async (row) => {
      try {
        const items = await requestMediaList(row.endpoint, row.mediaTypeHint, row.revalidate);
        return {
          id: row.id,
          title: row.title,
          items: items.slice(0, 24)
        } satisfies MediaRail;
      } catch (error) {
        console.error(`[TMDB] Failed loading row "${row.title}"`, error);
        return {
          id: row.id,
          title: row.title,
          items: []
        } satisfies MediaRail;
      }
    })
  );

  const hasRenderableRow = rows.some((row) => row.items.length > 0);
  if (!hasRenderableRow) {
    return getMockHomeRails();
  }

  return rows;
}

export async function getFeaturedTitle(): Promise<MediaItem | null> {
  if (!isTmdbConfigured()) {
    return getMockFeaturedWithTrailer();
  }

  try {
    const payload = await tmdbRequest(tmdbEndpoints.trending("movie", "week"), tmdbMediaListResponseSchema, {
      revalidate: 60 * 10,
      tags: ["tmdb", "featured"]
    });

    const movie = payload.results
      .map((item) => mapMediaSummary(item, "movie"))
      .find((item) => Boolean(item.backdropPath || item.posterPath));

    return movie ?? null;
  } catch (error) {
    console.error("[TMDB] Failed loading featured title", error);
    return getMockFeaturedWithTrailer();
  }
}

export async function getFeaturedWithTrailer() {
  if (!isTmdbConfigured()) {
    return getMockFeaturedWithTrailer();
  }

  const featured = await getFeaturedTitle();
  if (!featured) {
    return null;
  }

  try {
    const videosPayload = await tmdbRequest(
      `${tmdbEndpoints.details("movie", featured.id)}/videos`,
      tmdbVideoListSchema,
      {
        revalidate: 60 * 30,
        tags: ["tmdb", `videos-${featured.id}`]
      }
    );

    return mapFeaturedMedia(featured, videosPayload.results);
  } catch (error) {
    console.error("[TMDB] Failed loading featured trailer", error);
    return {
      ...featured,
      trailerKey: null
    };
  }
}

export async function getGenres(mediaType: MediaType): Promise<GenreTag[]> {
  if (!isTmdbConfigured()) {
    return getMockGenres(mediaType);
  }

  try {
    const payload = await tmdbRequest(tmdbEndpoints.genres(mediaType), tmdbGenreListSchema, {
      revalidate: 60 * 60 * 12,
      tags: ["tmdb", `genres-${mediaType}`]
    });

    return payload.genres;
  } catch (error) {
    console.error(`[TMDB] Failed loading ${mediaType} genres`, error);
    return getMockGenres(mediaType);
  }
}

export async function getMediaByGenre(mediaType: MediaType, genreId: number) {
  if (!isTmdbConfigured()) {
    return getMockMediaByGenre(mediaType, genreId);
  }

  try {
    return await requestMediaList(tmdbEndpoints.discoverByGenre(mediaType, genreId), mediaType, 60 * 30);
  } catch (error) {
    console.error(`[TMDB] Failed loading ${mediaType} by genre`, error);
    return getMockMediaByGenre(mediaType, genreId);
  }
}

export async function searchTitles(query: string, page = 1): Promise<SearchResult> {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return {
      query: "",
      page: 1,
      totalPages: 0,
      totalResults: 0,
      results: []
    };
  }

  if (!isTmdbConfigured()) {
    return getMockSearchResults(trimmedQuery, page);
  }

  try {
    const payload = await tmdbRequest(tmdbEndpoints.multiSearch, tmdbMultiSearchResponseSchema, {
      cache: "no-store",
      params: {
        query: trimmedQuery,
        include_adult: false,
        page
      },
      retries: 1
    });

    const filtered = payload.results.filter((item) => item.media_type === "movie" || item.media_type === "tv");

    return {
      query: trimmedQuery,
      page: payload.page,
      totalPages: payload.total_pages,
      totalResults: payload.total_results,
      results: mapMediaList(filtered)
    };
  } catch (error) {
    console.error("[TMDB] Failed searching titles", error);
    return getMockSearchResults(trimmedQuery, page);
  }
}

export async function getTitleDetails(mediaType: MediaType, id: number): Promise<TitleDetails | null> {
  if (!isTmdbConfigured()) {
    return getMockTitleDetails(mediaType, id);
  }

  const appendToResponse =
    mediaType === "movie"
      ? "videos,images,credits,similar,recommendations"
      : "videos,images,credits,similar,recommendations,seasons";

  try {
    const schema = mediaType === "movie" ? tmdbMovieDetailsSchema : tmdbTvDetailsSchema;
    const payload = await tmdbRequest(tmdbEndpoints.details(mediaType, id), schema, {
      params: {
        append_to_response: appendToResponse
      },
      revalidate: 60 * 30,
      tags: ["tmdb", `title-${mediaType}-${id}`]
    });

    return mapTitleDetails(payload, mediaType);
  } catch (error) {
    console.error(`[TMDB] Failed loading ${mediaType} details`, error);
    return getMockTitleDetails(mediaType, id);
  }
}
