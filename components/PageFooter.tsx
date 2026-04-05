"use client";

import {
  BTMT_ICON_LINK_CLASS,
  BTMT_ICON_LINK_DARK_CLASS,
  EmailSocialLink,
  GithubSocialLink,
  IconBookOpen,
  LinkedInSocialLink,
  MastodonSocialLink,
} from "@behindthemusictree/assets/components";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

function OrgSocialLinks() {
  return (
    <span className="flex items-center gap-1">
      <GithubSocialLink
        className={BTMT_ICON_LINK_DARK_CLASS}
        iconClassName="h-5 w-5 shrink-0"
      />
      <LinkedInSocialLink
        className={BTMT_ICON_LINK_DARK_CLASS}
        iconClassName="h-5 w-5 shrink-0"
      />
      <MastodonSocialLink
        className={BTMT_ICON_LINK_DARK_CLASS}
        iconClassName="h-5 w-5 shrink-0"
      />
      <EmailSocialLink
        className={BTMT_ICON_LINK_DARK_CLASS}
        iconClassName="h-5 w-5 shrink-0"
      />
    </span>
  );
}

export default function PageFooter() {
  const t = useTranslations("PageFooter");

  return (
    <footer className="flex flex-none flex-wrap items-center justify-center gap-x-2 gap-y-1 border-t border-amber-500/20 bg-linear-to-t from-slate-800 to-slate-900 px-6 py-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <span className="flex flex-wrap items-center gap-x-2 text-sm text-slate-400">
        <OrgSocialLinks />
        <Link
          href="/docs"
          className={`${BTMT_ICON_LINK_CLASS} ${BTMT_ICON_LINK_DARK_CLASS}`}
          aria-label={t("docsAria")}
          title={t("docsTitle")}
        >
          <IconBookOpen className="h-5 w-5 shrink-0" />
        </Link>
      </span>
    </footer>
  );
}
