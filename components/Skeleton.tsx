interface SkeletonProps {
  cards?: number;
}

export default function Skeleton({ cards = 8 }: SkeletonProps) {
  return (
    <div className="space-y-4 px-4 md:px-12">
      <div className="skeleton-shimmer h-7 w-44 rounded-md" />
      <div className="row-scroll flex gap-3 overflow-x-auto pb-2">
        {Array.from({ length: cards }).map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className="skeleton-shimmer h-[160px] w-[110px] flex-none rounded-md sm:h-[190px] sm:w-[132px] md:h-[210px] md:w-[145px]"
          />
        ))}
      </div>
    </div>
  );
}
