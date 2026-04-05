import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fr", "zh"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});
