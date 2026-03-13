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
    "min-h-[200px] min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-6";

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
        <div className="flex flex-wrap items-center gap-3">
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
            className="flex shrink-0 items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={isPending}
          >
            {isPending ? "Loading…" : "Choose file"}
          </button>
          <span
            className="min-w-0 flex-1 truncate rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600"
            aria-live="polite"
          >
            {selectedFileName ?? "No file chosen"}
          </span>
        </div>
        {error && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
            {error.message}
          </p>
        )}
        <div className="flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-3">
          <section className={sectionBoxClass}>
            <header>
              <h2>Technical information</h2>
            </header>
            {audioMetadata ? (
              <pre>{JSON.stringify(audioMetadata.technicalInfo, null, 2)}</pre>
            ) : (
              noMetadataPlaceholder
            )}
          </section>
          <section className={sectionBoxClass}>
            <header>
              <h2>Unified metadata</h2>
            </header>
            {audioMetadata ? (
              <pre>{JSON.stringify(audioMetadata.unifiedMetadata, null, 2)}</pre>
            ) : (
              noMetadataPlaceholder
            )}
          </section>
          <section className={sectionBoxClass}>
            <header>
              <h2>By metadata format</h2>
            </header>
            <pre>
              {audioMetadata ? JSON.stringify(audioMetadata.metadataFormat, null, 2) : noMetadataPlaceholder}
            </pre>
          </section>
          <section className={sectionBoxClass}>
            <header>
              <h2>Format priorities</h2>
            </header>
            <pre>
              {audioMetadata ? JSON.stringify(audioMetadata.formatPriorities, null, 2) : noMetadataPlaceholder}
            </pre>
          </section>
          <section className={sectionBoxClass}>
            <header>
              <h2>Formats headers</h2>
            </header>
            {audioMetadata ? (
              <pre>{JSON.stringify(audioMetadata.headers, null, 2)}</pre>
            ) : (
              noMetadataPlaceholder
            )}
          </section>
          <section className={sectionBoxClass}>
            <header>
              <h2>Metadata raw</h2>
            </header>
            {audioMetadata ? (
              <pre>{JSON.stringify(audioMetadata.rawMetadata, null, 2)}</pre>
            ) : (
              noMetadataPlaceholder
            )}
          </section>
        </div>
      </div>
    </Page>
  );
}
