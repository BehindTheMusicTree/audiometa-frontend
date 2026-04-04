import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import WebSiteJsonLd from "@/components/WebSiteJsonLd";
import { siteWideDescription } from "@/lib/site-description";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";
import "@behindthemusictree/assets/styles/icon-links.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteOrigin = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: {
    default: "Audiometa",
    template: "%s | Audiometa",
  },
  description: siteWideDescription,
  icons: {
    icon: "/icons/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Audiometa",
    title: "Audiometa",
    description: siteWideDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: "Audiometa",
    description: siteWideDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <WebSiteJsonLd siteUrl={siteOrigin} />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
