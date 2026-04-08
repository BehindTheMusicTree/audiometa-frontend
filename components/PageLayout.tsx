import { ReactNode } from "react";
import PageFooter from "@/components/PageFooter";
import PageHeader from "@/components/PageHeader";

interface PageLayoutProps {
  children: ReactNode;
  /** Route or feature id for E2E/analytics (e.g. "audio-metadata-manager"). See docs/DATA_ATTRIBUTES.md. */
  dataPage: string;
  /** `AUDIOMETA_GITHUB_REPO_URL` — AudioMeta Python on GitHub (footer). */
  audiometaPythonGithubUrl: string;
}

export default function PageLayout({
  children,
  dataPage,
  audiometaPythonGithubUrl,
}: PageLayoutProps) {
  return (
    <div
      className="flex min-h-screen min-w-0 flex-1 flex-col bg-linear-to-b from-slate-100 via-slate-50 to-slate-200"
      data-page={dataPage}
    >
      <PageHeader />
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">{children}</div>
      <PageFooter audiometaPythonGithubUrl={audiometaPythonGithubUrl} />
    </div>
  );
}
