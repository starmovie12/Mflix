import { searchMulti } from '@/lib/tmdb';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') ?? '';

  if (!q.trim()) {
    return NextResponse.json({ results: [] }, { status: 200 });
  }

  try {
    const results = await searchMulti(q);
    return NextResponse.json({ results });
  } catch (error) {
    console.error('[API] Search error:', error);
    return NextResponse.json({ results: [] }, { status: 200 });
  }
}
