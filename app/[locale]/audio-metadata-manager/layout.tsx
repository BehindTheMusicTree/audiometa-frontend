import { languageAlternates } from "@/lib/language-alternates";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "MetadataTool" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: "/audio-metadata-manager",
      languages: languageAlternates("/audio-metadata-manager"),
    },
    openGraph: {
      title: t("ogTitle"),
      description: t("description"),
    },
    twitter: {
      title: t("ogTitle"),
      description: t("description"),
    },
  };
}

export default async function AudioMetadataManagerLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return children;
}
