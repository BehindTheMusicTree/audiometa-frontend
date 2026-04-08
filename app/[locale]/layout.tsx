import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import HtmlLangSync from "@/components/HtmlLangSync";
import { PostHogProvider } from "@/components/PostHogProvider";
import WebSiteJsonLd from "@/components/WebSiteJsonLd";
import { routing } from "@/i18n/routing";
import { absoluteUrlForLocale } from "@/lib/language-alternates";
import { getSiteUrl } from "@/lib/site-url";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Site" });
  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: t("titleDefault"),
      template: t("titleTemplate"),
    },
    description: t("description"),
    icons: {
      icon: "/icons/favicon.ico",
    },
    openGraph: {
      type: "website",
      locale: t("ogLocale"),
      siteName: "Audiometa",
      title: t("titleDefault"),
      description: t("description"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("titleDefault"),
      description: t("description"),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const siteOrigin = absoluteUrlForLocale(locale, "/");
  const tSite = await getTranslations({ locale, namespace: "Site" });

  return (
    <NextIntlClientProvider messages={messages}>
      <PostHogProvider>
        <HtmlLangSync />
        <WebSiteJsonLd
          siteUrl={siteOrigin}
          description={tSite("description")}
        />
        {children}
      </PostHogProvider>
    </NextIntlClientProvider>
  );
}
