import DocContent from "@/components/DocContent";
import { getDocsBundle, getDocSlugs } from "@/lib/docs-bundle";
import { routing } from "@/i18n/routing";
import {
  absoluteUrlForLocale,
  languageAlternates,
} from "@/lib/language-alternates";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const bundle = await getDocsBundle();
  const slugs = getDocSlugs(bundle);
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = await params;
  const bundle = await getDocsBundle();
  const doc = bundle[slug];
  const t = await getTranslations({ locale, namespace: "DocPage" });
  if (!doc) {
    return { title: t("fallbackTitle") };
  }
  return {
    title: doc.title,
    description: t("description", { title: doc.title }),
    alternates: {
      canonical: absoluteUrlForLocale(locale, `/docs/${slug}`),
      languages: languageAlternates(`/docs/${slug}`),
    },
  };
}

export default async function DocPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const bundle = await getDocsBundle();
  const doc = bundle[slug];
  if (!doc) notFound();

  return (
    <section>
      <DocContent content={doc.content} />
    </section>
  );
}
