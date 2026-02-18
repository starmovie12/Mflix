"use client";

import Image from "next/image";
import { useState } from "react";
import { tmdbImage } from "@/lib/tmdb/mappers";
import type { ImageSize } from "@/types/tmdb";

interface PosterImageProps {
  path: string | null | undefined;
  alt: string;
  width: number;
  height: number;
  size?: ImageSize;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export default function PosterImage({
  path,
  alt,
  width,
  height,
  size = "w500",
  className = "",
  priority = false,
  sizes,
}: PosterImageProps) {
  const src = tmdbImage(path, size);
  const [imgSrc, setImgSrc] = useState(src);
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-surface ${className}`}>
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        className={`h-full w-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
        onError={() => setImgSrc("/placeholder.svg")}
      />
      {!loaded && <div className="skeleton-shimmer absolute inset-0" />}
    </div>
  );
}
