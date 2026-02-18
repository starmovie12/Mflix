'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'poster' | 'backdrop' | 'row' | 'text';
}

export function Skeleton({ className = '', variant = 'poster' }: SkeletonProps) {
  const baseClass = 'animate-shimmer rounded';

  if (variant === 'poster') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`${baseClass} aspect-[2/3] bg-white/10 ${className}`}
      />
    );
  }

  if (variant === 'backdrop') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`${baseClass} aspect-video w-full bg-white/10 ${className}`}
      />
    );
  }

  if (variant === 'row') {
    return (
      <div className={`flex gap-3 overflow-hidden ${className}`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`${baseClass} min-w-[180px] aspect-[2/3] bg-white/10 flex-shrink-0`}
          />
        ))}
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`${baseClass} h-4 bg-white/10 ${className}`}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`${baseClass} bg-white/10 ${className}`}
    />
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative h-[85vh] min-h-[500px] w-full">
      <Skeleton variant="backdrop" className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-pitch via-pitch/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-12 md:p-16 space-y-4">
        <Skeleton variant="text" className="w-1/3 h-12" />
        <div className="flex gap-2">
          <Skeleton variant="text" className="w-24 h-10" />
          <Skeleton variant="text" className="w-24 h-10" />
        </div>
        <Skeleton variant="text" className="w-2/3 h-4" />
        <Skeleton variant="text" className="w-1/2 h-4" />
      </div>
    </div>
  );
}

export function RowSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton variant="text" className="w-32 h-6" />
          <Skeleton variant="row" />
        </div>
      ))}
    </div>
  );
}
