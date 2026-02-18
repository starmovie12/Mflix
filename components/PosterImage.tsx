"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { getImageUrl } from "@/lib/tmdb";

interface PosterImageProps {
  path: string | null | undefined;
  alt: string;
  width: number;
  height: number;
  size?: "w300" | "w500" | "w780" | "original";
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
  const initialSource = useMemo(() => getImageUrl(path, size), [path, size]);
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
