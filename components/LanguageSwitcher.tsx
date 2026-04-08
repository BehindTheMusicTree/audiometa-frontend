"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const hrefLangByLocale: Record<string, string> = {
  en: "en",
  fr: "fr",
  zh: "zh-Hans",
  pt: "pt",
  ja: "ja",
  ar: "ar",
  de: "de",
  es: "es",
};

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("LanguageSwitcher");

  return (
    <nav aria-label={t("label")} className="relative text-sm">
      <details className="relative">
        <summary
          className="flex cursor-pointer list-none items-center gap-1.5 rounded border border-amber-500/30 bg-slate-900/70 px-3 py-1.5 font-medium text-amber-200 transition-colors hover:bg-slate-900 [&::-webkit-details-marker]:hidden"
          aria-label={`${t("label")}: ${t(locale)}`}
        >
          <span>{t(locale)}</span>
          <span aria-hidden className="text-xs text-slate-400">
            ▾
          </span>
        </summary>
        <div className="absolute end-0 z-50 mt-2 min-w-[10rem] rounded-lg border border-amber-500 bg-slate-900/95 py-2 shadow-lg">
          <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
            {routing.locales.map((loc) => (
              <li key={loc}>
                {loc === locale ? (
                  <span
                    className="block px-3 py-2 font-semibold text-amber-300"
                    aria-current="true"
                  >
                    {t(loc)}
                  </span>
                ) : (
                  <Link
                    href={pathname}
                    locale={loc}
                    hrefLang={hrefLangByLocale[loc] ?? loc}
                    className="block px-3 py-2 text-slate-200 transition-colors hover:bg-slate-800 hover:text-amber-200"
                  >
                    {t(loc)}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </details>
    </nav>
  );
}
