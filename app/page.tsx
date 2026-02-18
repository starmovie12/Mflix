import HomePageClient from "@/components/HomePageClient";
import { getHomePageData } from "@/lib/tmdb";

export default async function HomePage() {
  const data = await getHomePageData();
  return <HomePageClient data={data} />;
}
