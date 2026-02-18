import { getTrending } from '@/lib/tmdb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const results = await getTrending('all');
    return NextResponse.json({ results });
  } catch (error) {
    console.error('[API] Trending error:', error);
    return NextResponse.json({ results: [] }, { status: 200 });
  }
}
