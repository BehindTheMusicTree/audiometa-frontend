"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  BTMT_ICON_LINK_CLASS,
  BTMT_ICON_LINK_DARK_CLASS,
  IconBookOpen,
} from "@behindthemusictree/assets/components";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Link } from "@/i18n/navigation";
import MusicTreeHorizontalLockup from "@/components/MusicTreeHorizontalLockup";
import MusicTreeMarkLockup from "@/components/MusicTreeMarkLockup";

export default function PageHeader() {
  const t = useTranslations("PageHeader");

  return (
    <header className="relative grid flex-none grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-2 border-b border-amber-500/20 bg-linear-to-b from-slate-900 to-slate-800 px-4 py-4 sm:gap-x-4 sm:px-6">
      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-amber-500/40 to-transparent" />
      <div className="flex min-w-0 items-center justify-start justify-self-start">
        <div className="sm:hidden">
          <MusicTreeMarkLockup
            variant="default"
            className="relative z-10 origin-left shrink-0 scale-[0.78] bg-slate-900/60 p-1.5 transition-colors hover:border-amber-400/40 hover:bg-slate-900/80"
            imageClassName="h-9 w-auto brightness-0 invert"
          />
        </div>
        <div className="hidden sm:block">
          <MusicTreeHorizontalLockup
            variant="onDark"
            className="relative z-10 origin-left shrink-0 scale-[0.88] bg-slate-900/60 p-1.5 transition-colors hover:border-amber-400/40 hover:bg-slate-900/80"
            imageClassName="h-14 w-auto"
          />
        </div>
      </div>
      <Link
        href="/audio-metadata-manager"
        className="flex min-w-0 max-w-full items-center justify-center gap-2 rounded-sm text-white outline-offset-4 focus-visible:outline-2 focus-visible:outline-amber-400/80 sm:gap-3 justify-self-center"
        aria-label={t("homeAria")}
      >
        <Image
          src="/logo-round.png"
          alt=""
          width={72}
          height={72}
          className="hidden h-[72px] w-[72px] shrink-0 rounded-full ring-2 ring-amber-500/30 sm:block"
        />
        <span className="min-w-0 truncate text-2xl font-semibold tracking-tight sm:text-3xl">
          Audiometa
        </span>
      </Link>
      <div className="flex shrink-0 flex-nowrap items-center justify-end gap-3 justify-self-end sm:gap-4">
        <Link
          href="/docs"
          className={`${BTMT_ICON_LINK_CLASS} ${BTMT_ICON_LINK_DARK_CLASS} outline-offset-4 focus-visible:outline-2 focus-visible:outline-amber-400/80`}
          aria-label={t("docsAria")}
          title={t("docsTitle")}
        >
          <IconBookOpen className="h-5 w-5 shrink-0" />
        </Link>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
