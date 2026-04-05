import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import WebSiteJsonLd from "@/components/WebSiteJsonLd";
import { routing } from "@/i18n/routing";
import { absoluteUrlForLocale } from "@/lib/language-alternates";
import { getSiteUrl } from "@/lib/site-url";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <WebSiteJsonLd
            siteUrl={siteOrigin}
            description={tSite("description")}
          />
          {children}
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
