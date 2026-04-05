type WebSiteJsonLdProps = {
  siteUrl: string;
  description: string;
};

export default function WebSiteJsonLd({
  siteUrl,
  description,
}: WebSiteJsonLdProps) {
  const origin = siteUrl.replace(/\/$/, "");
  const pageUrl = `${origin}/`;
  const json = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        name: "Audiometa",
        url: pageUrl,
        description,
      },
      {
        "@type": "SoftwareApplication",
        name: "Audiometa",
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Web",
        url: pageUrl,
        description,
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
