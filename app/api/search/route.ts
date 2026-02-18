import { NextRequest, NextResponse } from "next/server";
import { multiSearch } from "@/lib/tmdb/endpoints";
import { normalizeResults } from "@/lib/tmdb/mappers";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const data = await multiSearch(query);
    const filtered = (data.results ?? []).filter(
      (r) => r.media_type === "movie" || r.media_type === "tv"
    );
    return NextResponse.json({ results: normalizeResults(filtered).slice(0, 20) });
  } catch (error) {
    console.error("[Search API] Error:", error);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
