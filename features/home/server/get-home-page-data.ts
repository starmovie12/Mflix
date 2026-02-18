import "server-only";

import { getFeaturedWithTrailer, getHomeRailsData } from "@/lib/tmdb/index";

export async function getHomePageData() {
  const [featured, rails] = await Promise.all([getFeaturedWithTrailer(), getHomeRailsData()]);

  return {
    featured,
    rails: rails.filter((rail) => rail.items.length > 0)
  };
}
