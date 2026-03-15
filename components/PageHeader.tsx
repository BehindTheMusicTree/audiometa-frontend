import Image from "next/image";

interface PageHeaderProps {
  title: string;
}

export default function PageHeader({ title }: PageHeaderProps) {
  const btmtLink = process.env.NEXT_PUBLIC_BTMT_GITHUB_LINK ?? "";

  return (
    <header className="flex flex-none flex-col items-center justify-center gap-3 border-b border-slate-200 bg-white/80 px-6 py-5 backdrop-blur-sm">
      <Image
        src="/logo-round.png"
        alt=""
        width={48}
        height={48}
        className="h-12 w-12 shrink-0"
      />
      <div className="flex flex-col items-center gap-0.5 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
          {title}
        </h1>
        <p className="text-sm font-normal text-slate-600">
          by{" "}
          <a
            href={btmtLink}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-slate-400 underline-offset-2 hover:text-slate-800 hover:decoration-slate-600"
          >
            BehindTheMusicTree
          </a>
        </p>
      </div>
    </header>
  );
}
