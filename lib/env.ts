import { z } from "zod";

const envSchema = z.object({
  TMDB_API_KEY: z.string().trim().min(1).optional(),
  TMDB_BASE_URL: z.string().url().default("https://api.themoviedb.org/3"),
  TMDB_IMAGE_BASE_URL: z.string().url().default("https://image.tmdb.org/t/p"),
  NEXT_PUBLIC_APP_NAME: z.string().trim().min(1).default("MFLIX")
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const messages = parsedEnv.error.issues.map((issue) => issue.message).join(", ");
  throw new Error(`Environment configuration is invalid: ${messages}`);
}

export const env = parsedEnv.data;

export function hasTmdbApiKey() {
  return Boolean(getTmdbApiKey());
}

export function getTmdbApiKey() {
  const value = env.TMDB_API_KEY?.trim();
  return value ? value : null;
}

export function getTmdbConfigHelpText() {
  return "Set TMDB_API_KEY in your host environment variables (or .env.local for local development).";
}
