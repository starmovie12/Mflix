import { Suspense } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { HomeContent } from '@/components/HomeContent';
import { RowSkeleton } from '@/components/Skeleton';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="pb-16">
        <Hero />
        <Suspense fallback={<RowSkeleton count={5} />}>
          <HomeContent />
        </Suspense>
      </main>
    </>
  );
}
