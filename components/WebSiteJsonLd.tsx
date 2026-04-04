import { siteWideDescription } from "@/lib/site-description";

type WebSiteJsonLdProps = {
  siteUrl: string;
};

export default function WebSiteJsonLd({ siteUrl }: WebSiteJsonLdProps) {
  const json = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: "Audiometa",
        url: `${siteUrl}/`,
        description: siteWideDescription,
      },
      {
        "@type": "SoftwareApplication",
        name: "Audiometa",
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Web",
        url: `${siteUrl}/`,
        description: siteWideDescription,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
