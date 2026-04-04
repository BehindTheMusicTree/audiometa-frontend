import Link from "next/link";
import PageLayout from "@/components/PageLayout";

export const metadata = {
  title: "Docs | Audiometa",
  description:
    "Documentation on audio metadata formats, field support, and how Audiometa handles ID3, Vorbis, and RIFF.",
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageLayout dataPage="docs">
      <div className="flex min-h-0 flex-1 gap-8">
        <nav
          className="hidden w-48 shrink-0 flex-col border-r border-slate-200 pr-4 md:flex"
          aria-label="Docs"
        >
          <Link
            href="/audio-metadata-manager"
            className="mb-2 text-sm font-medium text-amber-600 underline decoration-amber-500/50 underline-offset-2 hover:text-amber-700"
          >
            Audio Metadata Manager
          </Link>
          <Link
            href="/docs"
            className="mb-2 text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            Overview
          </Link>
          <Link
            href="/docs/metadata-formats"
            className="mb-2 text-sm text-slate-600 hover:text-slate-900"
          >
            Metadata formats
          </Link>
          <Link
            href="/docs/field-support"
            className="mb-2 text-sm text-slate-600 hover:text-slate-900"
          >
            Field support
          </Link>
          <Link
            href="/docs/audio-technical-info"
            className="mb-2 text-sm text-slate-600 hover:text-slate-900"
          >
            Audio technical info
          </Link>
          <Link
            href="/docs/writing-metadata"
            className="mb-2 text-sm text-slate-600 hover:text-slate-900"
          >
            Writing metadata
          </Link>
        </nav>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </PageLayout>
  );
}
