import { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { WatchPlayer } from '@/components/WatchPlayer';
import { getMovieById, getTvById } from '@/lib/tmdb';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const { type } = await searchParams;
  const mediaType = type === 'tv' ? 'tv' : 'movie';
  const item = mediaType === 'tv' ? await getTvById(id) : await getMovieById(id);
  const title = item?.title ?? item?.name ?? 'Watch';
  return { title: `${title} | MFLIX` };
}

export default async function WatchPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { type } = await searchParams;
  const mediaType = (type === 'tv' ? 'tv' : 'movie') as 'movie' | 'tv';

  return (
    <div className="min-h-screen bg-pitch">
      <Navbar />
      <WatchPlayer id={id} type={mediaType} />
    </div>
  );
}
