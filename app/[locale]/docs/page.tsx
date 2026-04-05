import { Link } from "@/i18n/navigation";
import { getDocsBundle, getDocSlugs } from "@/lib/docs-bundle";
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function DocsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "DocsIndex" });
  const bundle = await getDocsBundle();
  const slugs = getDocSlugs(bundle);

  return (
    <section>
      <header className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">{t("title")}</h1>
        <p className="mt-1 text-slate-600">{t("intro")}</p>
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
