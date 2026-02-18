import { cn } from "@/lib/utils";

interface MaturityRatingProps {
  rating: number;
  className?: string;
}

export default function MaturityRating({ rating, className }: MaturityRatingProps) {
  const label = rating >= 7 ? "TV-MA" : rating >= 5 ? "TV-14" : "TV-PG";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded border border-mflix-gray/40 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-mflix-gray",
        className
      )}
    >
      {label}
    </span>
  );
}
