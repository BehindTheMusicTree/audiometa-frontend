import type { MetadataRoute } from "next";
import { getDocsBundle, getDocSlugs } from "@/lib/docs-bundle";
import { getSiteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const bundle = await getDocsBundle();
  const slugs = getDocSlugs(bundle);
  const lastModified = new Date();

  return [
    {
      url: `${base}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/audio-metadata-manager`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/docs`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...slugs.map((slug) => ({
      url: `${base}/docs/${slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
