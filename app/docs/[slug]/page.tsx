import { notFound } from "next/navigation";
import DocContent from "@/components/DocContent";
import { getDocsBundle, getDocSlugs } from "@/lib/docs-bundle";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const bundle = await getDocsBundle();
  return getDocSlugs(bundle).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const bundle = await getDocsBundle();
  const doc = bundle[slug];
  if (!doc) return { title: "Docs | Audiometa" };
  return {
    title: `${doc.title} | Audiometa`,
    description: `Audiometa documentation: ${doc.title}. Audio metadata formats, field support, and handling.`,
  };
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;
  const bundle = await getDocsBundle();
  const doc = bundle[slug];
  if (!doc) notFound();

  return (
    <section>
      <DocContent content={doc.content} />
    </section>
  );
}
