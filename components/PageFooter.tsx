import Link from "next/link";
import {
  BTMT_ICON_LINK_CLASS,
  BTMT_ICON_LINK_DARK_CLASS,
  EmailSocialLink,
  GithubSocialLink,
  IconBookOpen,
  LinkedInSocialLink,
  MastodonSocialLink,
} from "@behindthemusictree/assets/components";

function OrgSocialLinks() {
  return (
    <span className="flex items-center gap-1">
      <GithubSocialLink
        className={BTMT_ICON_LINK_DARK_CLASS}
        iconClassName="shrink-0 h-5 w-5"
      />
      <LinkedInSocialLink
        className={BTMT_ICON_LINK_DARK_CLASS}
        iconClassName="shrink-0 h-5 w-5"
      />
      <MastodonSocialLink
        className={BTMT_ICON_LINK_DARK_CLASS}
        iconClassName="shrink-0 h-5 w-5"
      />
      <EmailSocialLink
        className={BTMT_ICON_LINK_DARK_CLASS}
        iconClassName="shrink-0 h-5 w-5"
      />
    </span>
  );
}

export default function PageFooter() {
  return (
    <footer className="flex flex-none flex-wrap items-center justify-center gap-x-2 gap-y-1 border-t border-amber-500/20 bg-linear-to-t from-slate-800 to-slate-900 px-6 py-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <span className="flex flex-wrap items-center gap-x-2 text-sm text-slate-400">
        <OrgSocialLinks />
        <Link
          href="/docs"
          className={`${BTMT_ICON_LINK_CLASS} ${BTMT_ICON_LINK_DARK_CLASS}`}
          aria-label="Documentation"
          title="Documentation"
        >
          <IconBookOpen className="shrink-0 h-5 w-5" />
        </Link>
      </span>
    </footer>
  );
}
