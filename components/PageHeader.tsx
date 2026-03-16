import Image from "next/image";

interface PageHeaderProps {
  title: string;
}

export default function PageHeader({ title }: PageHeaderProps) {
  const btmtLink = process.env.NEXT_PUBLIC_BTMT_GITHUB_LINK ?? "";

  return (
    <header className="relative flex flex-none flex-col items-center justify-center gap-3 border-b border-amber-500/20 bg-linear-to-b from-slate-900 to-slate-800 px-6 py-6 shadow-lg">
      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-amber-500/40 to-transparent" />
      <Image
        src="/logo-round.png"
        alt=""
        width={52}
        height={52}
        className="h-[52px] w-[52px] shrink-0 rounded-full ring-2 ring-amber-500/30"
      />
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          {title}
        </h1>
        <p className="text-sm font-normal text-slate-400">
          by{" "}
          <a
            href={btmtLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 underline decoration-amber-500/50 underline-offset-2 transition-colors hover:text-amber-300 hover:decoration-amber-400"
          >
            BehindTheMusicTree
          </a>
        </p>
      </div>
    </header>
  );
}
