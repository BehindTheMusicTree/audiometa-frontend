"use client";

import {
  BTMT_ICON_LINK_CLASS,
  BTMT_ICON_LINK_DARK_CLASS,
  EmailSocialLink,
  GithubSocialLink,
  IconBookOpen,
  LinkedInSocialLink,
  MastodonSocialLink,
  PypiSocialLink,
  TipeeeSocialLink,
} from "@behindthemusictree/assets/components";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const AUDIOMETA_PYTHON_PYPI_URL =
  "https://pypi.org/project/audiometa-python/";

function OrgSocialLinks() {
  return (
    <span className="flex items-center gap-1">
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

type PageFooterProps = {
  audiometaPythonGithubUrl: string;
};

export default function PageFooter({
  audiometaPythonGithubUrl,
}: PageFooterProps) {
  const t = useTranslations("PageFooter");

  return (
    <footer className="flex flex-none flex-col items-center justify-center gap-4 border-t border-amber-500/20 bg-linear-to-t from-slate-800 to-slate-900 px-6 py-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex max-w-xl flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
        <p className="text-center text-sm leading-snug text-slate-400">
          {t("supportPrompt")}
        </p>
        <TipeeeSocialLink
          className={BTMT_ICON_LINK_DARK_CLASS}
          text={t("tipeeeLinkLabel")}
          title={t("tipeeeLinkLabel")}
        />
      </div>
      <section
        aria-labelledby="footer-ami-python-heading"
        className="flex w-full max-w-xl flex-col items-center gap-2 border-t border-amber-500/15 pt-4"
      >
        <h2
          id="footer-ami-python-heading"
          className="m-0 text-center text-xs font-semibold uppercase tracking-wide text-slate-500"
        >
          {t("poweredByAudiometaPython")}
        </h2>
        <nav
          aria-label={t("pythonLibNavAria")}
          className="flex items-center justify-center gap-1"
        >
          <GithubSocialLink
            href={audiometaPythonGithubUrl}
            className={BTMT_ICON_LINK_DARK_CLASS}
            iconClassName="h-5 w-5 shrink-0"
            aria-label={t("pythonLibGithubAria")}
            title={t("pythonLibGithubTitle")}
          />
          <PypiSocialLink
            href={AUDIOMETA_PYTHON_PYPI_URL}
            className={BTMT_ICON_LINK_DARK_CLASS}
            iconClassName="h-5 w-5 shrink-0"
            aria-label={t("pypiAria")}
            title={t("pypiTitle")}
          />
        </nav>
      </section>
      <span className="flex flex-wrap items-center justify-center gap-x-2 text-sm text-slate-400">
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
