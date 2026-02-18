export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatRuntime(minutes: number | null) {
  if (!minutes || minutes <= 0) {
    return "Runtime unavailable";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours <= 0) {
    return `${remainingMinutes}m`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

export function formatVoteAverage(voteAverage: number) {
  if (!Number.isFinite(voteAverage) || voteAverage <= 0) {
    return "N/A";
  }

  return voteAverage.toFixed(1);
}

export function formatYear(date: string | null) {
  if (!date) {
    return "N/A";
  }

  return date.slice(0, 4);
}

export function isMediaType(value: string): value is "movie" | "tv" {
  return value === "movie" || value === "tv";
}
