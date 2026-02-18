import HomeEmptyState from "@/features/home/components/home-empty-state";
import HomePage from "@/features/home/components/home-page";
import { getHomePageData } from "@/features/home/server/get-home-page-data";

export const revalidate = 60 * 5;

export default async function Page() {
  const { featured, rails } = await getHomePageData();

  if (!featured && rails.length === 0) {
    return <HomeEmptyState />;
  }

  return <HomePage featured={featured} rails={rails} />;
}
