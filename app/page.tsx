import HomePageClient from "@/components/HomePageClient";
import { getFeaturedMovie, getHomeRows } from "@/lib/tmdb/server";

export default async function HomePage() {
  const [heroMovie, rows] = await Promise.all([getFeaturedMovie(), getHomeRows()]);

  return <HomePageClient heroMovie={heroMovie} rows={rows} />;
}
