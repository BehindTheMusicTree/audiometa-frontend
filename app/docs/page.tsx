import Link from "next/link";
import { getDocsBundle, getDocSlugs } from "@/lib/docs-bundle";

export default async function DocsIndexPage() {
  const bundle = await getDocsBundle();
  const slugs = getDocSlugs(bundle);

  return (
    <section>
      <header className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">
          Documentation
        </h2>
        <p className="mt-1 text-slate-600">
          Metadata formats, field support, and how Audiometa handles audio
          metadata (ID3, Vorbis, RIFF).
        </p>
      </header>
      <ul className="space-y-2">
        {slugs.map((slug) => {
          const doc = bundle[slug];
          if (!doc) return null;
          return (
            <li key={slug}>
              <Link
                href={`/docs/${slug}`}
                className="font-medium text-amber-600 underline decoration-amber-500/50 underline-offset-2 hover:text-amber-700"
              >
                {doc.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
