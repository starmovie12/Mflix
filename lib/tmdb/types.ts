import { z } from "zod";

export const tmdbVideoSchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  site: z.string(),
  type: z.string(),
  official: z.boolean().optional().default(false),
  published_at: z.string().nullable().optional()
});

export const tmdbGenreSchema = z.object({
  id: z.number(),
  name: z.string()
});

export const tmdbImageSchema = z.object({
  file_path: z.string(),
  width: z.number().nullable().optional(),
  height: z.number().nullable().optional(),
  iso_639_1: z.string().nullable().optional()
});

export const tmdbCreditSchema = z.object({
  id: z.number(),
  name: z.string(),
  profile_path: z.string().nullable().optional(),
  character: z.string().nullable().optional(),
  job: z.string().nullable().optional(),
  known_for_department: z.string().nullable().optional(),
  department: z.string().nullable().optional()
});

const tmdbBaseMediaSchema = z.object({
  id: z.number(),
  media_type: z.string().optional(),
  title: z.string().optional(),
  name: z.string().optional(),
  overview: z.string().optional(),
  poster_path: z.string().nullable().optional(),
  backdrop_path: z.string().nullable().optional(),
  release_date: z.string().optional(),
  first_air_date: z.string().optional(),
  vote_average: z.number().optional(),
  vote_count: z.number().optional(),
  popularity: z.number().optional(),
  genre_ids: z.array(z.number()).optional(),
  original_language: z.string().optional(),
  adult: z.boolean().optional()
});

export const tmdbMediaListResponseSchema = z.object({
  page: z.number().optional(),
  results: z.array(tmdbBaseMediaSchema).default([]),
  total_pages: z.number().optional(),
  total_results: z.number().optional()
});

export const tmdbMovieDetailsSchema = tmdbBaseMediaSchema.extend({
  title: z.string().optional(),
  runtime: z.number().nullable().optional(),
  tagline: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  genres: z.array(tmdbGenreSchema).optional(),
  videos: z
    .object({
      results: z.array(tmdbVideoSchema).default([])
    })
    .optional(),
  images: z
    .object({
      backdrops: z.array(tmdbImageSchema).default([]),
      posters: z.array(tmdbImageSchema).default([])
    })
    .optional(),
  credits: z
    .object({
      cast: z.array(tmdbCreditSchema).default([]),
      crew: z.array(tmdbCreditSchema).default([])
    })
    .optional(),
  similar: tmdbMediaListResponseSchema.optional(),
  recommendations: tmdbMediaListResponseSchema.optional()
});

const tmdbSeasonSchema = z.object({
  id: z.number(),
  name: z.string(),
  episode_count: z.number().optional().default(0),
  air_date: z.string().nullable().optional(),
  overview: z.string().optional().default(""),
  poster_path: z.string().nullable().optional()
});

export const tmdbTvDetailsSchema = tmdbBaseMediaSchema.extend({
  name: z.string().optional(),
  number_of_seasons: z.number().optional(),
  episode_run_time: z.array(z.number()).optional(),
  tagline: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  genres: z.array(tmdbGenreSchema).optional(),
  seasons: z.array(tmdbSeasonSchema).optional(),
  videos: z
    .object({
      results: z.array(tmdbVideoSchema).default([])
    })
    .optional(),
  images: z
    .object({
      backdrops: z.array(tmdbImageSchema).default([]),
      posters: z.array(tmdbImageSchema).default([])
    })
    .optional(),
  credits: z
    .object({
      cast: z.array(tmdbCreditSchema).default([]),
      crew: z.array(tmdbCreditSchema).default([])
    })
    .optional(),
  similar: tmdbMediaListResponseSchema.optional(),
  recommendations: tmdbMediaListResponseSchema.optional()
});

export const tmdbGenreListSchema = z.object({
  genres: z.array(tmdbGenreSchema).default([])
});

export const tmdbMultiSearchItemSchema = tmdbBaseMediaSchema.extend({
  media_type: z.string()
});

export const tmdbMultiSearchResponseSchema = z.object({
  page: z.number().default(1),
  total_pages: z.number().default(1),
  total_results: z.number().default(0),
  results: z.array(tmdbMultiSearchItemSchema).default([])
});

export type TmdbMediaListResponse = z.infer<typeof tmdbMediaListResponseSchema>;
export type TmdbMediaSummary = z.infer<typeof tmdbMediaListResponseSchema>["results"][number];
export type TmdbMovieDetails = z.infer<typeof tmdbMovieDetailsSchema>;
export type TmdbTvDetails = z.infer<typeof tmdbTvDetailsSchema>;
export type TmdbGenreList = z.infer<typeof tmdbGenreListSchema>;
export type TmdbMultiSearchResponse = z.infer<typeof tmdbMultiSearchResponseSchema>;
export type TmdbVideo = z.infer<typeof tmdbVideoSchema>;
export type TmdbImage = z.infer<typeof tmdbImageSchema>;
export type TmdbCredit = z.infer<typeof tmdbCreditSchema>;
