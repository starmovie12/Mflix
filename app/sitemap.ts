import type { MetadataRoute } from "next";

const baseUrl = "https://mflix.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 1
    },
    {
      url: `${baseUrl}/title/movie/550`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8
    }
  ];
}
