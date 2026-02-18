import "server-only";

import type { MediaType } from "@/types/media";
import { getTitleDetails } from "@/lib/tmdb/index";

export async function getTitlePageData(mediaType: MediaType, id: number) {
  return getTitleDetails(mediaType, id);
}
