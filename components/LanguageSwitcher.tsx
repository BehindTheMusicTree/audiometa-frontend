"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const hrefLangByLocale: Record<string, string> = {
  en: "en",
  fr: "fr",
  zh: "zh-Hans",
};

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("LanguageSwitcher");

  return (
    <nav
      aria-label={t("label")}
      className="flex flex-wrap items-center gap-x-1 text-sm text-slate-300"
    >
      {routing.locales.map((loc, index) => (
        <span key={loc} className="inline-flex items-center gap-x-1">
          {index > 0 ? (
            <span aria-hidden className="select-none text-slate-500">
              ·
            </span>
          ) : null}
          {loc === locale ? (
            <span
              className="font-semibold text-amber-300"
              aria-current="true"
            >
              {t(loc)}
            </span>
          ) : (
            <Link
              href={pathname}
              locale={loc}
              hrefLang={hrefLangByLocale[loc] ?? loc}
              className="underline decoration-slate-500/60 underline-offset-2 transition-colors hover:text-amber-200 hover:decoration-amber-400/80"
            >
              {t(loc)}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
