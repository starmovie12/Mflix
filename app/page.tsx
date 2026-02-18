import type { Metadata } from "next";
import { getHeroContent, getHomeRows } from "@/lib/home-data";
import HomeClient from "@/components/HomeClient";

export const metadata: Metadata = {
  title: "MFLIX | Stream Movies & TV Shows",
  description:
    "Discover and stream thousands of movies and TV shows on MFLIX. Premium cinematic experience with personalized recommendations.",
  openGraph: {
    title: "MFLIX | Stream Movies & TV Shows",
    description: "Your premium streaming destination.",
    type: "website",
  },
};

export default async function HomePage() {
  const [hero, rows] = await Promise.all([getHeroContent(), getHomeRows()]);

  return <HomeClient hero={hero} rows={rows} />;
}
