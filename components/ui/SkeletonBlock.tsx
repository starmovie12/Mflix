interface SkeletonBlockProps {
  className?: string;
}

export default function SkeletonBlock({ className = "h-6 w-32" }: SkeletonBlockProps) {
  return <div className={`skeleton-shimmer rounded-md ${className}`} />;
}
