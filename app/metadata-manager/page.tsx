"use client";

import { useRef, useState } from "react";
import Page from "@/components/Page";
import { useGetFullMetadata } from "@/hooks/useGetFullMetadata";
import type { AudioMetadataDetailed } from "@/schemas/audio-metadata";

export default function MetadataManagerPage() {
  const [audioMetadata, setAudioMetadata] = useState<AudioMetadataDetailed | undefined>();
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { getMetadata, isPending, error } = useGetFullMetadata();

  const noMetadataPlaceholder = "No metadata";
  const sectionBoxClass =
    "min-h-[200px] min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md";

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target?.files?.[0] ?? null;
    if (!file) return;
    setSelectedFileName(file.name);
    try {
      const data = await getMetadata(file);
      setAudioMetadata(data);
    } catch {
      // error state is set in hook
    }
  }

  return (
    <Page title="Metadata Manager" dataPage="metadata-manager">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleChange}
            className="sr-only"
            aria-label="Choose an audio file"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex shrink-0 items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow transition-all hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={isPending}
          >
            {isPending ? "Loading…" : "Choose file"}
          </button>
          <span
            className="min-w-0 flex-1 truncate rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-600"
            aria-live="polite"
          >
            {selectedFileName ?? "No file chosen"}
          </span>
        </div>
        {error && (
          <p
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {error.message}
          </p>
        )}
        <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
          <section className={sectionBoxClass}>
            <header className="mb-3 border-b border-slate-100 pb-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
                Technical information
              </h2>
            </header>
            {audioMetadata ? (
              <pre className="overflow-x-auto text-sm leading-relaxed text-slate-700">
                {JSON.stringify(audioMetadata.technicalInfo, null, 2)}
              </pre>
            ) : (
              <p className="text-sm italic text-slate-400">{noMetadataPlaceholder}</p>
            )}
          </section>
          <section className={sectionBoxClass}>
            <header className="mb-3 border-b border-slate-100 pb-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
                Unified metadata
              </h2>
            </header>
            {audioMetadata ? (
              <pre className="overflow-x-auto text-sm leading-relaxed text-slate-700">
                {JSON.stringify(audioMetadata.unifiedMetadata, null, 2)}
              </pre>
            ) : (
              <p className="text-sm italic text-slate-400">{noMetadataPlaceholder}</p>
            )}
          </section>
          <section className={sectionBoxClass}>
            <header className="mb-3 border-b border-slate-100 pb-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
                By metadata format
              </h2>
            </header>
            {audioMetadata ? (
              <pre className="overflow-x-auto text-sm leading-relaxed text-slate-700">
                {JSON.stringify(audioMetadata.metadataFormat, null, 2)}
              </pre>
            ) : (
              <p className="text-sm italic text-slate-400">{noMetadataPlaceholder}</p>
            )}
          </section>
          <section className={sectionBoxClass}>
            <header className="mb-3 border-b border-slate-100 pb-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
                Format priorities
              </h2>
            </header>
            {audioMetadata ? (
              <pre className="overflow-x-auto text-sm leading-relaxed text-slate-700">
                {JSON.stringify(audioMetadata.formatPriorities, null, 2)}
              </pre>
            ) : (
              <p className="text-sm italic text-slate-400">{noMetadataPlaceholder}</p>
            )}
          </section>
          <section className={sectionBoxClass}>
            <header className="mb-3 border-b border-slate-100 pb-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
                Formats headers
              </h2>
            </header>
            {audioMetadata ? (
              <pre className="overflow-x-auto text-sm leading-relaxed text-slate-700">
                {JSON.stringify(audioMetadata.headers, null, 2)}
              </pre>
            ) : (
              <p className="text-sm italic text-slate-400">{noMetadataPlaceholder}</p>
            )}
          </section>
          <section className={sectionBoxClass}>
            <header className="mb-3 border-b border-slate-100 pb-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
                Metadata raw
              </h2>
            </header>
            {audioMetadata ? (
              <pre className="overflow-x-auto text-sm leading-relaxed text-slate-700">
                {JSON.stringify(audioMetadata.rawMetadata, null, 2)}
              </pre>
            ) : (
              <p className="text-sm italic text-slate-400">{noMetadataPlaceholder}</p>
            )}
          </section>
        </div>
      </div>
    </Page>
  );
}
