import { NextRequest, NextResponse } from "next/server";
import { searchMovies } from "@/lib/tmdb/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchMovies(query);
    return NextResponse.json({ results: results.slice(0, 20) });
  } catch (error) {
    console.error("[Search API] Failed to return search results", error);
    return NextResponse.json({ results: [] });
  }
}
