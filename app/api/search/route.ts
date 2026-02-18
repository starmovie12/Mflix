import { NextRequest, NextResponse } from "next/server";
import { searchMulti } from "@/lib/tmdb";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchMulti(query);
    return NextResponse.json({ results: results.slice(0, 20) });
  } catch (error) {
    console.error("[Search API] Failed to return search results", error);
    return NextResponse.json({ results: [] });
  }
}
