import { Link } from "@/i18n/navigation";
import { languageAlternates } from "@/lib/language-alternates";
import PageLayout from "@/components/PageLayout";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "DocsLayout" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: "/docs",
      languages: languageAlternates("/docs"),
    },
  };
}

export default async function DocsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "DocsLayout" });
  const englishOnlyNotice = t("englishOnlyNotice");

  return (
    <PageLayout dataPage="docs">
      <div className="flex min-h-0 flex-1 gap-8">
        <nav
          className="hidden w-48 shrink-0 flex-col border-r border-slate-200 pr-4 md:flex"
          aria-label={t("navAria")}
        >
          <Link
            href="/audio-metadata-manager"
            className="mb-2 text-sm font-medium text-amber-600 underline decoration-amber-500/50 underline-offset-2 hover:text-amber-700"
          >
            {t("audioManager")}
          </Link>
          <Link
            href="/docs"
            className="mb-2 text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            {t("overview")}
          </Link>
          <Link
            href="/docs/metadata-formats"
            className="mb-2 text-sm text-slate-600 hover:text-slate-900"
          >
            {t("metadataFormats")}
          </Link>
          <Link
            href="/docs/field-support"
            className="mb-2 text-sm text-slate-600 hover:text-slate-900"
          >
            {t("fieldSupport")}
          </Link>
          <Link
            href="/docs/audio-technical-info"
            className="mb-2 text-sm text-slate-600 hover:text-slate-900"
          >
            {t("audioTechnicalInfo")}
          </Link>
          <Link
            href="/docs/writing-metadata"
            className="mb-2 text-sm text-slate-600 hover:text-slate-900"
          >
            {t("writingMetadata")}
          </Link>
        </nav>
        <main className="min-w-0 flex-1">
          {englishOnlyNotice ? (
            <p
              className="mb-4 px-3 py-2 text-sm text-slate-800 border border-amber-200 bg-amber-50 rounded-md"
              role="status"
            >
              {englishOnlyNotice}
            </p>
          ) : null}
          {children}
        </main>
      </div>
    </PageLayout>
  );
}
