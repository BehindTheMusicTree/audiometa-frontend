import Image from "next/image";
import { TheMusicTreeHorizontalLink } from "@behindthemusictree/assets/components";

interface PageHeaderProps {
  title: string;
}

const THEMUSICTREE_URL = process.env.NEXT_PUBLIC_ORG_URL!;

export default function PageHeader({ title }: PageHeaderProps) {
  return (
    <header className="relative flex flex-none flex-row flex-wrap items-center justify-between gap-4 border-b border-amber-500/20 bg-linear-to-b from-slate-900 to-slate-800 px-6 py-4 shadow-lg">
      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-amber-500/40 to-transparent" />
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Image
          src="/logo-round.png"
          alt=""
          width={52}
          height={52}
          className="h-[52px] w-[52px] shrink-0 rounded-full ring-2 ring-amber-500/30"
        />
        <h1 className="min-w-0 truncate text-2xl font-semibold tracking-tight text-white">
          {title}
        </h1>
      </div>
      <TheMusicTreeHorizontalLink
        href={THEMUSICTREE_URL}
        variant="onDark"
        className="shrink-0 border border-amber-500/25 bg-slate-900/60 p-2 transition-colors hover:border-amber-400/40 hover:bg-slate-900/80"
      />
    </header>
  );
}
