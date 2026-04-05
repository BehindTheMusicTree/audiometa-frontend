import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFoundPage() {
  const t = await getTranslations("NotFound");

  return (
    <main className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <h1 className="text-xl font-semibold text-slate-900">{t("title")}</h1>
      <p className="max-w-md text-slate-600">{t("body")}</p>
      <Link
        href="/"
        className="font-medium text-amber-600 underline decoration-amber-500/50 underline-offset-2 hover:text-amber-700"
      >
        {t("home")}
      </Link>
    </main>
  );
}
