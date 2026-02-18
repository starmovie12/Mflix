export type AppEnv = Readonly<{
  tmdbApiKey?: string;
  tmdbBaseUrl: string;
  tmdbImageBaseUrl: string;
  appName: string;
}>;

export function getAppEnv(): AppEnv {
  const tmdbApiKey = process.env.TMDB_API_KEY?.trim();
  const tmdbBaseUrl = process.env.TMDB_BASE_URL?.trim() || "https://api.themoviedb.org/3";
  const tmdbImageBaseUrl = process.env.TMDB_IMAGE_BASE_URL?.trim() || "https://image.tmdb.org/t/p";
  const appName = process.env.NEXT_PUBLIC_APP_NAME?.trim() || "MFLIX";

  return { tmdbApiKey: tmdbApiKey || undefined, tmdbBaseUrl, tmdbImageBaseUrl, appName };
}

