import { z } from "zod";

export const mediaTypeSchema = z.union([z.literal("movie"), z.literal("tv")]);
export type MediaType = z.infer<typeof mediaTypeSchema>;

const tmdbBaseTitleSchema = z.object({
  id: z.number(),
  media_type: mediaTypeSchema.optional(),
  title: z.string().optional(),
  name: z.string().optional(),
  original_title: z.string().optional(),
  original_name: z.string().optional(),
  overview: z.string().optional(),
  poster_path: z.string().nullable().optional(),
  backdrop_path: z.string().nullable().optional(),
  release_date: z.string().optional(),
  first_air_date: z.string().optional(),
  vote_average: z.number().optional(),
  vote_count: z.number().optional(),
  popularity: z.number().optional()
});

export const tmdbListResponseSchema = z.object({
  results: z.array(tmdbBaseTitleSchema).default([])
});
export type TmdbListResponse = z.infer<typeof tmdbListResponseSchema>;
export type TmdbTitle = z.infer<typeof tmdbBaseTitleSchema>;

export const tmdbGenreSchema = z.object({
  id: z.number(),
  name: z.string()
});

export const tmdbVideoSchema = z.object({
  id: z.string().optional(),
  key: z.string().optional(),
  name: z.string().optional(),
  site: z.string().optional(),
  type: z.string().optional(),
  official: z.boolean().optional(),
  published_at: z.string().optional()
});

export const tmdbCreditsSchema = z.object({
  cast: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        character: z.string().optional(),
        profile_path: z.string().nullable().optional(),
        order: z.number().optional()
      })
    )
    .default([]),
  crew: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        job: z.string().optional(),
        department: z.string().optional(),
        profile_path: z.string().nullable().optional()
      })
    )
    .default([])
});

export const tmdbImagesSchema = z.object({
  backdrops: z.array(z.object({ file_path: z.string() })).default([]),
  posters: z.array(z.object({ file_path: z.string() })).default([])
});

export const tmdbDetailsSchema = tmdbBaseTitleSchema.extend({
  genres: z.array(tmdbGenreSchema).default([]),
  runtime: z.number().nullable().optional(),
  episode_run_time: z.array(z.number()).optional(),
  number_of_seasons: z.number().optional(),
  number_of_episodes: z.number().optional(),
  videos: z
    .object({
      results: z.array(tmdbVideoSchema).default([])
    })
    .optional(),
  credits: tmdbCreditsSchema.optional(),
  images: tmdbImagesSchema.optional(),
  similar: tmdbListResponseSchema.optional(),
  recommendations: tmdbListResponseSchema.optional()
});
export type TmdbDetails = z.infer<typeof tmdbDetailsSchema>;

export type TitleSummary = Readonly<{
  id: number;
  mediaType: MediaType;
  title: string;
  originalTitle?: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string | null;
  year: string | null;
  voteAverage: number;
  voteCount: number;
}>;

export type TitleVideo = Readonly<{
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  publishedAt?: string;
}>;

export type TitleCreditPerson = Readonly<{
  id: number;
  name: string;
  role?: string;
  department?: string;
  profilePath: string | null;
}>;

export type TitleDetails = TitleSummary &
  Readonly<{
    genres: ReadonlyArray<{ id: number; name: string }>;
    runtimeMinutes: number | null;
    seasonCount?: number;
    episodeCount?: number;
    videos: ReadonlyArray<TitleVideo>;
    cast: ReadonlyArray<TitleCreditPerson>;
    crewHighlights: ReadonlyArray<TitleCreditPerson>;
    similar: ReadonlyArray<TitleSummary>;
    recommendations: ReadonlyArray<TitleSummary>;
    imageBackdrops: ReadonlyArray<string>;
    imagePosters: ReadonlyArray<string>;
  }>;

