"use client";

import { useLocale } from "next-intl";
import { useLayoutEffect } from "react";

export default function HtmlLangSync() {
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  useLayoutEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  return null;
}
