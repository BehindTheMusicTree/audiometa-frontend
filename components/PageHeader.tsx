"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Link } from "@/i18n/navigation";
import MusicTreeHorizontalLockup from "@/components/MusicTreeHorizontalLockup";

export default function PageHeader() {
  const t = useTranslations("PageHeader");

  return (
    <header className="relative grid flex-none grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-amber-500/20 bg-linear-to-b from-slate-900 to-slate-800 px-6 py-4 shadow-lg">
      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-amber-500/40 to-transparent" />
      <div className="flex min-w-0 items-center justify-start">
        <MusicTreeHorizontalLockup
          variant="onDark"
          className="relative z-10 origin-left scale-[0.88] shrink-0 bg-slate-900/60 p-1.5 transition-colors hover:border-amber-400/40 hover:bg-slate-900/80"
        />
      </div>
      <div className="flex min-w-0 items-center justify-start">
        <MusicTreeHorizontalLockup
          variant="onDark"
          className="relative z-10 origin-left scale-[0.88] shrink-0 bg-slate-900/60 p-1.5 transition-colors hover:border-amber-400/40 hover:bg-slate-900/80"
        />
      </div>
      <Link
        href="/audio-metadata-manager"
        className="flex min-w-0 items-center gap-3 rounded-sm text-white outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400/80"
        aria-label={t("homeAria")}
      >
        <Image
          src="/logo-round.png"
          alt=""
          width={72}
          height={72}
          className="h-[72px] w-[72px] shrink-0 rounded-full ring-2 ring-amber-500/30"
          width={72}
          height={72}
          className="h-[72px] w-[72px] shrink-0 rounded-full ring-2 ring-amber-500/30"
        />
        <span className="min-w-0 truncate text-3xl font-semibold tracking-tight">
        <span className="min-w-0 truncate text-3xl font-semibold tracking-tight">
          Audiometa
        </span>
      </Link>
      <div className="flex min-w-0 items-center justify-end gap-3 sm:gap-4">
        <LanguageSwitcher />
      </div>
    </header>
  );
}
