import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fr", "zh", "pt", "ja", "ar", "de", "es"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});
