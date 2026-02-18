import SiteHeader from "@/components/layout/site-header";
import HeroBillboard from "@/features/home/components/hero-billboard";
import MediaRail from "@/features/home/components/media-rail";
import type { FeaturedMedia, MediaRail as MediaRailType } from "@/types/media";

interface HomePageProps {
  featured: FeaturedMedia | null;
  rails: MediaRailType[];
}

export default function HomePage({ featured, rails }: HomePageProps) {
  return (
    <div className="min-h-screen bg-pitch text-white">
      <SiteHeader />
      <HeroBillboard featured={featured} />

      <main className="-mt-14 space-y-8 pb-16 md:space-y-10">
        {rails.map((rail, index) => (
          <MediaRail key={rail.id} title={rail.title} items={rail.items} topTen={index === 0} />
        ))}
      </main>
    </div>
  );
}
