import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMovieDetails, getTVDetails } from "@/lib/tmdb/endpoints";
import { getTitle, getYear, tmdbBackdrop, tmdbPoster } from "@/lib/tmdb/mappers";
import type { MediaType } from "@/types/tmdb";
import TitleDetailClient from "@/components/TitleDetailClient";

interface TitlePageProps {
  params: { mediaType: string; id: string };
}

function isValidMediaType(type: string): type is MediaType {
  return type === "movie" || type === "tv";
}

export async function generateMetadata({ params }: TitlePageProps): Promise<Metadata> {
  const { mediaType, id } = params;
  if (!isValidMediaType(mediaType)) return { title: "Not Found | MFLIX" };

  const numericId = parseInt(id, 10);
  if (!Number.isFinite(numericId)) return { title: "Not Found | MFLIX" };

  const details =
    mediaType === "movie"
      ? await getMovieDetails(numericId)
      : await getTVDetails(numericId);

  if (!details) return { title: "Not Found | MFLIX" };

  const title = getTitle(details);
  const description = details.overview?.slice(0, 200) || `Watch ${title} on MFLIX`;

  return {
    title: `${title} | MFLIX`,
    description,
    openGraph: {
      title: `${title} | MFLIX`,
      description,
      type: mediaType === "movie" ? "video.movie" : "video.tv_show",
      images: details.backdrop_path
        ? [{ url: tmdbBackdrop(details.backdrop_path), width: 1280, height: 720 }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | MFLIX`,
      description,
      images: details.backdrop_path ? [tmdbBackdrop(details.backdrop_path)] : [],
    },
  };
}

export default async function TitleDetailPage({ params }: TitlePageProps) {
  const { mediaType, id } = params;

  if (!isValidMediaType(mediaType)) {
    notFound();
  }

  const numericId = parseInt(id, 10);
  if (!Number.isFinite(numericId)) {
    notFound();
  }

  const details =
    mediaType === "movie"
      ? await getMovieDetails(numericId)
      : await getTVDetails(numericId);

  if (!details) {
    notFound();
  }

  return (
    <TitleDetailClient
      details={details}
      mediaType={mediaType}
    />
  );
}
