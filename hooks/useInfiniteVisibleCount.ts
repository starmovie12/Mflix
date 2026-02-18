"use client";

import { useEffect, useState } from "react";

interface UseInfiniteVisibleCountOptions {
  total: number;
  initial?: number;
  step?: number;
}

export function useInfiniteVisibleCount({
  total,
  initial = 8,
  step = 6
}: UseInfiniteVisibleCountOptions) {
  const [visibleCount, setVisibleCount] = useState(Math.min(initial, total));
  const [sentinel, setSentinel] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    setVisibleCount(Math.min(initial, total));
  }, [initial, total]);

  useEffect(() => {
    if (!sentinel || visibleCount >= total) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting) {
          return;
        }

        setVisibleCount((current) => Math.min(current + step, total));
      },
      { rootMargin: "200px 0px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [sentinel, step, total, visibleCount]);

  return {
    visibleCount,
    setSentinel
  };
}
