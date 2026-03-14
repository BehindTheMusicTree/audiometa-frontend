"use client";

import { useRef, useState } from "react";
import PageLayout from "@/components/PageLayout";
import { useGetFullMetadata } from "@/hooks/useGetFullMetadata";
import { camelToLabel } from "@/lib/format-key";
import type { AudioMetadataDetailed } from "@/schemas/audio-metadata";

function CellValue({ value }: { value: unknown }) {
  if (value === null || value === undefined) {
    return <span className="text-slate-400">—</span>;
  }
  if (Array.isArray(value)) {
    const items = value.filter(
      (v) => v !== null && v !== undefined && v !== "",
    );
    if (items.length === 0) return <span className="text-slate-400">—</span>;
    return (
      <ul className="m-0 list-none space-y-1 pl-0 text-slate-700">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-center gap-2 border-l-2 border-slate-200 py-0.5 pl-2 text-sm"
          >
            {typeof item === "object" ? (
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">
                {JSON.stringify(item)}
              </code>
            ) : (
              String(item)
            )}
          </li>
        ))}
      </ul>
    );
  }
  if (typeof value === "object") {
    return (
      <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">
        {JSON.stringify(value)}
      </code>
    );
  }
  return <span>{String(value)}</span>;
}

function isPlainKeyValueObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

function MetadataKeyValueTable({
  entries,
}: {
  entries: [string, unknown][];
}) {
  if (entries.length === 0) return null;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[240px] border-collapse text-sm text-slate-700">
        <tbody>
          {entries.map(([key, value]) => (
            <tr
              key={key}
              className="border-b border-slate-100 last:border-0"
            >
              <td className="py-2 pr-4 font-medium text-slate-600">
                {camelToLabel(key)}
              </td>
              <td className="min-w-0 py-2 wrap-break-word">
                <CellValue value={value} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function MetadataManagerPage() {
  const [audioMetadata, setAudioMetadata] = useState<
    AudioMetadataDetailed | undefined
  >();
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
    <PageLayout title="Audio Metadata Manager" dataPage="audio-metadata-manager">
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
              (() => {
                const info = audioMetadata.technicalInfo;
                if (info == null || typeof info !== "object" || Array.isArray(info)) {
                  return (
                    <p className="text-sm italic text-slate-400">
                      {noMetadataPlaceholder}
                    </p>
                  );
                }
                const entries = Object.entries(info);
                if (entries.length === 0) {
                  return (
                    <p className="text-sm italic text-slate-400">
                      {noMetadataPlaceholder}
                    </p>
                  );
                }
                return <MetadataKeyValueTable entries={entries} />;
              })()
            ) : (
              <p className="text-sm italic text-slate-400">
                {noMetadataPlaceholder}
              </p>
            )}
          </section>
          <section className={sectionBoxClass}>
            <header className="mb-3 border-b border-slate-100 pb-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
                Unified metadata
              </h2>
            </header>
            {audioMetadata ? (
              (() => {
                const data = audioMetadata.unifiedMetadata;
                if (isPlainKeyValueObject(data)) {
                  const entries = Object.entries(data);
                  if (entries.length > 0) {
                    return <MetadataKeyValueTable entries={entries} />;
                  }
                }
                return (
                  <pre className="overflow-x-auto text-sm leading-relaxed text-slate-700">
                    {JSON.stringify(audioMetadata.unifiedMetadata, null, 2)}
                  </pre>
                );
              })()
            ) : (
              <p className="text-sm italic text-slate-400">
                {noMetadataPlaceholder}
              </p>
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
              <p className="text-sm italic text-slate-400">
                {noMetadataPlaceholder}
              </p>
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
              <p className="text-sm italic text-slate-400">
                {noMetadataPlaceholder}
              </p>
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
              <p className="text-sm italic text-slate-400">
                {noMetadataPlaceholder}
              </p>
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
              <p className="text-sm italic text-slate-400">
                {noMetadataPlaceholder}
              </p>
            )}
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
