import AudioMetadataManagerClient from "@/app/audio-metadata-manager/AudioMetadataManagerClient";
import {
  absoluteUrlForLocale,
  languageAlternates,
} from "@/lib/language-alternates";
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
      canonical: absoluteUrlForLocale(locale, "/"),
      languages: languageAlternates("/"),
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

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <AudioMetadataManagerClient
      audiometaPythonGithubUrl={process.env.AUDIOMETA_PYTHON_GITHUB_REPO_URL!.trim()}
    />
  );
}
