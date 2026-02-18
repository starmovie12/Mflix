import { getTopRated } from '@/lib/tmdb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const results = await getTopRated('movie');
    return NextResponse.json({ results });
  } catch (error) {
    console.error('[API] Top rated error:', error);
    return NextResponse.json({ results: [] }, { status: 200 });
  }
}
