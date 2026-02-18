export type MediaTypeParam = "movie" | "tv";

export type TitleRouteParams = Readonly<{
  mediaType: string;
  id: string;
}>;

export function isMediaTypeParam(value: string): value is MediaTypeParam {
  return value === "movie" || value === "tv";
}

