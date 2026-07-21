import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE_URL = "https://maincharacter.one";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...["privacy", "terms", "support"].map((page) => ({
      url: `${SITE_URL}/backstage/${page}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
