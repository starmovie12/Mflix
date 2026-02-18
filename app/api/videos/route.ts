import { getVideos } from '@/lib/tmdb';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const type = (searchParams.get('type') as 'movie' | 'tv') || 'movie';

  if (!id) {
    return NextResponse.json({ results: [] }, { status: 200 });
  }

  try {
    const results = await getVideos(id, type);
    return NextResponse.json({ results });
  } catch (error) {
    console.error('[API] Videos error:', error);
    return NextResponse.json({ results: [] }, { status: 200 });
  }
}
