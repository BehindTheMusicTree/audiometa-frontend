import type { MetadataRoute } from "next";
import { getDocsBundle, getDocSlugs } from "@/lib/docs-bundle";
import { routing } from "@/i18n/routing";
import {
  absoluteUrlForLocale,
  languageAlternates,
} from "@/lib/language-alternates";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let slugs: string[] = [];
  try {
    const bundle = await getDocsBundle();
    slugs = getDocSlugs(bundle);
  } catch {}
  const lastModified = new Date();

  const paths: {
    pathname: string;
    changeFrequency: NonNullable<
      MetadataRoute.Sitemap[number]["changeFrequency"]
    >;
    priority: number;
  }[] = [
    {
      pathname: "/",
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      pathname: "/audio-metadata-manager",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      pathname: "/docs",
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...slugs.map((slug) => ({
      pathname: `/docs/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const { pathname, changeFrequency, priority } of paths) {
    const languages = languageAlternates(pathname);
    for (const locale of routing.locales) {
      entries.push({
        url: absoluteUrlForLocale(locale, pathname),
        lastModified,
        changeFrequency,
        priority,
        alternates: { languages },
      });
    }
  }

  return entries;
}
