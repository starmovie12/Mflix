import { NextResponse } from "next/server";
import { z } from "zod";
import { getTmdbApiKey, getTmdbConfigHelpText } from "@/lib/env";
import { mapTmdbError, tmdbRequest } from "@/lib/tmdb/client";

export const dynamic = "force-dynamic";

const tmdbHealthSchema = z.object({
  images: z
    .object({
      secure_base_url: z.string().optional()
    })
    .optional()
});

export async function GET() {
  const apiKey = getTmdbApiKey();

  if (!apiKey) {
    return NextResponse.json(
      {
        ok: false,
        status: "misconfigured",
        message: getTmdbConfigHelpText()
      },
      { status: 503 }
    );
  }

  try {
    const payload = await tmdbRequest("/configuration", tmdbHealthSchema, {
      cache: "no-store",
      retries: 0,
      timeoutMs: 6000
    });

    return NextResponse.json(
      {
        ok: true,
        status: "healthy",
        imageBase: payload.images?.secure_base_url ?? null
      },
      { status: 200 }
    );
  } catch (error) {
    const mapped = mapTmdbError(error);

    return NextResponse.json(
      {
        ok: false,
        status: "unreachable",
        message: mapped.message,
        code: mapped.code
      },
      { status: 502 }
    );
  }
}
