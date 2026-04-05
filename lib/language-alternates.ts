import { getSiteUrl } from "@/lib/site-url";
import { routing } from "@/i18n/routing";

/** Path without locale prefix, e.g. `/` or `/docs/foo`. */
export function absoluteUrlForLocale(locale: string, pathname: string): string {
  const base = getSiteUrl().replace(/\/$/, "");
  const path = pathname === "/" ? "" : pathname;
  if (locale === routing.defaultLocale) {
    return `${base}${path || "/"}`;
  }
  return `${base}/${locale}${path}`;
}

export function languageAlternates(pathname: string): Record<string, string> {
  return Object.fromEntries(
    routing.locales.map((locale) => [
      locale,
      absoluteUrlForLocale(locale, pathname),
    ]),
  );
}
