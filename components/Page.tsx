import { ReactNode } from "react";

interface PageProps {
  title: string;
  children: ReactNode;
  /** Route or feature id for E2E/analytics (e.g. "metadata-manager"). See docs/DATA_ATTRIBUTES.md. */
  dataPage: string;
}

export default function Page({ title, children, dataPage }: PageProps) {
  return (
    <div
      className="flex min-h-0 flex-1 flex-col bg-gradient-to-b from-slate-50 to-slate-100"
      data-page={dataPage}
    >
      <header className="flex-none border-b border-slate-200 bg-white/80 px-6 py-5 backdrop-blur-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
          {title}
        </h1>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">{children}</div>
    </div>
  );
}
