import { getDiscoverByGenre } from '@/lib/tmdb';
import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const genreId = parseInt(id, 10);
  if (isNaN(genreId)) {
    return NextResponse.json({ results: [] }, { status: 200 });
  }
  try {
    const results = await getDiscoverByGenre(genreId, 'movie');
    return NextResponse.json({ results });
  } catch (error) {
    console.error('[API] Genre error:', error);
    return NextResponse.json({ results: [] }, { status: 200 });
  }
}
