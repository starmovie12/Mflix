"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { getTmdbImageUrl, type TmdbImageSize } from "@/lib/tmdb";

interface PosterImageProps {
  path: string | null | undefined;
  alt: string;
  width: number;
  height: number;
  size?: TmdbImageSize;
  className?: string;
  priority?: boolean;
}

export default function PosterImage({
  path,
  alt,
  width,
  height,
  size = "w500",
  className,
  priority = false
}: PosterImageProps) {
  const initialSource = useMemo(() => getTmdbImageUrl(path, size), [path, size]);
  const [src, setSrc] = useState(initialSource);

  useEffect(() => {
    setSrc(initialSource);
  }, [initialSource]);

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      onError={() => setSrc("/placeholder.svg")}
    />
  );
}
