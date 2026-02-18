"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { getTmdbImageUrl } from "@/lib/tmdb/image";
import type { TmdbImageSize } from "@/types/media";

interface TmdbImageProps {
  path: string | null;
  alt: string;
  width: number;
  height: number;
  className?: string;
  sizes: string;
  size?: TmdbImageSize;
  priority?: boolean;
}

const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNDAwJyBoZWlnaHQ9JzYwMCcgdmlld0JveD0nMCAwIDQwMCA2MDAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHJlY3Qgd2lkdGg9JzQwMCcgaGVpZ2h0PSc2MDAnIGZpbGw9JyMxMTEnLz48L3N2Zz4=";

export default function TmdbImage({
  path,
  alt,
  width,
  height,
  className,
  sizes,
  size = "w780",
  priority = false
}: TmdbImageProps) {
  const initialSource = useMemo(() => getTmdbImageUrl(path, size), [path, size]);
  const [src, setSrc] = useState(initialSource);

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      className={className}
      placeholder="blur"
      blurDataURL={BLUR_DATA_URL}
      onError={() => setSrc("/placeholder.svg")}
    />
  );
}
