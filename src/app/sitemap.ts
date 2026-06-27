import type { MetadataRoute } from "next";
import { getAllHexSlugs } from "@/lib/archive";

export default function sitemap(): MetadataRoute.Sitemap {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://rgb-radio.vercel.app";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${base}/archive`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  const colorRoutes: MetadataRoute.Sitemap = getAllHexSlugs().map((hex) => ({
    url: `${base}/color/${hex}`,
    lastModified: new Date(),
    changeFrequency: "never" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...colorRoutes];
}
