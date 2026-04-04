import Image from "next/image";
import Link from "next/link";
import MusicTreeHorizontalLockup from "@/components/MusicTreeHorizontalLockup";

export default function PageHeader() {
  return (
    <header className="relative flex flex-none flex-row flex-wrap items-center justify-between gap-4 border-b border-amber-500/20 bg-linear-to-b from-slate-900 to-slate-800 px-6 py-4 shadow-lg">
      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-amber-500/40 to-transparent" />
      <Link
        href="/audio-metadata-manager"
        className="flex min-w-0 flex-1 items-center gap-3 text-white rounded-sm outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400/80"
        aria-label="Audiometa — Audio Metadata Manager"
      >
        <Image
          src="/logo-round.png"
          alt=""
          width={52}
          height={52}
          className="h-[52px] w-[52px] shrink-0 rounded-full ring-2 ring-amber-500/30"
        />
        <span className="min-w-0 truncate text-2xl font-semibold tracking-tight">
          Audiometa
        </span>
      </Link>
      <MusicTreeHorizontalLockup
        variant="onDark"
        className="shrink-0 border border-amber-500/25 bg-slate-900/60 p-2 transition-colors hover:border-amber-400/40 hover:bg-slate-900/80"
      />
    </header>
  );
}
