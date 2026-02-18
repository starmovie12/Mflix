interface SkeletonProps {
  cards?: number;
  variant?: "poster" | "backdrop";
}

export default function Skeleton({ cards = 8, variant = "poster" }: SkeletonProps) {
  const isPoster = variant === "poster";
  return (
    <div className="space-y-3 px-4 md:px-12">
      <div className="skeleton-shimmer h-6 w-44 rounded-md" />
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: cards }).map((_, i) => (
          <div
            key={`skel-${i}`}
            className={`skeleton-shimmer flex-none rounded-md ${
              isPoster
                ? "h-[200px] w-[135px] sm:h-[220px] sm:w-[148px]"
                : "h-[130px] w-[230px] sm:h-[150px] sm:w-[267px]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
