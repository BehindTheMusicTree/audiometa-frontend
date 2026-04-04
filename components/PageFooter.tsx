import Link from "next/link";
import {
  EmailSocialLink,
  GithubSocialLink,
  LinkedInSocialLink,
  MastodonSocialLink,
} from "@behindthemusictree/assets/components";

const socialIconLinkClassName =
  "rounded p-0.5 text-slate-400 transition-colors hover:text-amber-400";

function OrgSocialLinks() {
  return (
    <span className="flex items-center gap-1">
      <GithubSocialLink
        className={socialIconLinkClassName}
        iconClassName="h-5 w-5"
      />
      <LinkedInSocialLink
        className={socialIconLinkClassName}
        iconClassName="h-5 w-5"
      />
      <MastodonSocialLink
        className={socialIconLinkClassName}
        iconClassName="h-5 w-5"
      />
      <EmailSocialLink
        className={socialIconLinkClassName}
        iconClassName="h-5 w-5"
      />
    </span>
  );
}

export default function PageFooter() {
  return (
    <footer className="flex flex-none flex-wrap items-center justify-center gap-x-2 gap-y-1 border-t border-amber-500/20 bg-linear-to-t from-slate-800 to-slate-900 px-6 py-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <span className="flex flex-wrap items-center gap-x-2 text-sm text-slate-400">
        <span>Powered by</span>
        <OrgSocialLinks />
        <Link
          href="/docs"
          className="font-medium text-amber-400 underline decoration-amber-500/50 underline-offset-2 hover:text-amber-300"
        >
          Docs
        </Link>
      </span>
    </footer>
  );
}
