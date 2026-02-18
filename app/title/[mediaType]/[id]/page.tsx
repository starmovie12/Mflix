import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/layout/site-header";
import TitlePage from "@/features/title/components/title-page";
import { getTitlePageData } from "@/features/title/server/get-title-page-data";
import { getTmdbImageUrl } from "@/lib/tmdb/image";
import { isMediaType } from "@/lib/utils";

interface TitleRouteProps {
  params: {
    mediaType: string;
    id: string;
  };
}

export const revalidate = 60 * 30;

export async function generateMetadata({ params }: TitleRouteProps): Promise<Metadata> {
  const mediaType = params.mediaType;
  const id = Number(params.id);

  if (!Number.isFinite(id) || !isMediaType(mediaType)) {
    return {
      title: "Title Not Found | MFLIX"
    };
  }

  const details = await getTitlePageData(mediaType, id);

  if (!details) {
    return {
      title: "Title Not Found | MFLIX"
    };
  }

  const title = `${details.title} | MFLIX`;
  const description =
    details.overview ||
    `Stream ${details.title} on MFLIX. Discover cast, related titles, trailers, and rich metadata.`;
  const image = getTmdbImageUrl(details.backdropPath || details.posterPath, "w1280");
  const canonical = `/title/${details.mediaType}/${details.id}`;

  return {
    title,
    description,
    alternates: {
      canonical
    },
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: image, width: 1280, height: 720, alt: details.title }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image]
    }
  };
}

export default async function TitleDetailsRoute({ params }: TitleRouteProps) {
  const mediaType = params.mediaType;
  const id = Number(params.id);

  if (!Number.isFinite(id) || !isMediaType(mediaType)) {
    notFound();
  }

  const details = await getTitlePageData(mediaType, id);

  if (!details) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <TitlePage details={details} />
    </>
  );
}
