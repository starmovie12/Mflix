import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTitleDetails, getImageUrl, getMovieTitle } from "@/lib/tmdb";
import TitleDetailClient from "@/features/title/TitleDetailClient";

type MediaType = "movie" | "tv";

interface TitlePageProps {
  params: Promise<{ mediaType: string; id: string }>;
}

function isValidMediaType(value: string): value is MediaType {
  return value === "movie" || value === "tv";
}

export async function generateMetadata({ params }: TitlePageProps): Promise<Metadata> {
  const { mediaType, id } = await params;
  const numericId = Number(id);

  if (!isValidMediaType(mediaType) || !Number.isFinite(numericId)) {
    return { title: "Not Found | MFLIX" };
  }

  const details = await getTitleDetails(mediaType, numericId);
  if (!details) {
    return { title: "Not Found | MFLIX" };
  }

  const title = getMovieTitle(details);
  const overview = details.overview?.slice(0, 160) ?? "";
  const image = getImageUrl(details.backdrop_path ?? details.poster_path, "w780");

  return {
    title: `${title} | MFLIX`,
    description: overview,
    openGraph: {
      title: `${title} | MFLIX`,
      description: overview,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | MFLIX`,
      description: overview,
    },
  };
}

export default async function TitlePage({ params }: TitlePageProps) {
  const { mediaType, id } = await params;
  const numericId = Number(id);

  if (!isValidMediaType(mediaType) || !Number.isFinite(numericId)) {
    notFound();
  }

  const details = await getTitleDetails(mediaType, numericId);
  if (!details) {
    notFound();
  }

  return <TitleDetailClient details={details} mediaType={mediaType} />;
}
