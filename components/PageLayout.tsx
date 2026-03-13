import { ReactNode } from "react";
import PageFooter from "@/components/PageFooter";
import PageHeader from "@/components/PageHeader";

interface PageLayoutProps {
  title: string;
  children: ReactNode;
  /** Route or feature id for E2E/analytics (e.g. "audio-metadata-manager"). See docs/DATA_ATTRIBUTES.md. */
  dataPage: string;
}

export default function PageLayout({ title, children, dataPage }: PageLayoutProps) {
  return (
    <div
      className="flex min-h-screen min-w-0 flex-1 flex-col bg-gradient-to-b from-slate-50 to-slate-100"
      data-page={dataPage}
    >
      <PageHeader title={title} />
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">{children}</div>
      <PageFooter />
    </div>
  );
}
