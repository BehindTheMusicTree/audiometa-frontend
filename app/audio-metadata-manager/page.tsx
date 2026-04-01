"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import PageLayout from "@/components/PageLayout";
import WritableTagsForm from "@/components/WritableTagsForm";
import { useMetadataSession } from "@/hooks/useMetadataSession";
import { formatDurationSeconds } from "@/lib/format-duration";
import {
  formatBitrateBps,
  formatFileSizeBytes,
  formatSampleRateHz,
} from "@/lib/format-number";
import { camelToLabel } from "@/lib/format-key";
import {
  buildWritableMetadataDownloadBody,
  cloneWritableTagFormState,
  emptyWritableTagFormState,
  writableTagsFromSessionJson,
  type WritableTagFormState,
} from "@/lib/metadata-writable-tags";
import type { AudioMetadataDetailed } from "@/schemas/audio-metadata";
import { SessionExpiredError } from "@/schemas/metadata-session";

function isNestedObject(
  v: unknown,
): v is Record<string, unknown> {
  return (
    v !== null &&
    typeof v === "object" &&
    !Array.isArray(v) &&
    Object.getPrototypeOf(v) === Object.prototype &&
    Object.keys(v).length > 0
  );
}

function formatInlineValue(key: string, val: unknown): ReactNode {
  if (val === null || val === undefined) return <span className="text-slate-400">—</span>;
  if (typeof val === "boolean") return val ? "Yes" : "No";
  if (typeof val === "number" && Number.isFinite(val)) {
    if (key === "headerSizeBytes") return formatFileSizeBytes(val);
    if (key === "durationSeconds") return formatDurationSeconds(val);
    if (key === "bitrateBps") return formatBitrateBps(val);
    if (key === "sampleRateHz") return formatSampleRateHz(val);
    if (key === "fileSizeBytes") return formatFileSizeBytes(val);
    return String(val);
  }
  if (typeof val === "string") return val;
  if (Array.isArray(val)) {
    const items = val.filter((v) => v !== null && v !== undefined && v !== "");
    if (items.length === 0) return <span className="text-slate-400">—</span>;
    return (
      <ul className="m-0 list-none space-y-0.5 pl-0 text-slate-700">
        {items.map((item, i) => (
          <li
            key={i}
            className="border-l-2 border-slate-200 py-0.5 pl-2 text-xs"
          >
            {typeof item === "object" && item !== null && !Array.isArray(item) ? (
              <ObjectValue value={item as Record<string, unknown>} />
            ) : (
              String(item)
            )}
          </li>
        ))}
      </ul>
    );
  }
  if (isNestedObject(val)) {
    return <ObjectValue value={val} />;
  }
  if (typeof val === "object" && val !== null && !Array.isArray(val)) {
    return <span className="text-slate-400">—</span>;
  }
  return String(val);
}

function ObjectValue({
  value,
  depth = 0,
}: {
  value: Record<string, unknown>;
  depth?: number;
}) {
  const entries = Object.entries(value);
  if (entries.length === 0) {
    return <span className="text-slate-400">—</span>;
  }
  const indent = depth > 0;
  return (
    <dl
      className={`m-0 flex flex-col gap-y-1 text-xs text-slate-700 ${indent ? "border-l-2 border-slate-200 pl-3" : ""}`}
    >
      {entries.map(([k, v]) => {
        const isEmptyObj =
          v !== null &&
          typeof v === "object" &&
          !Array.isArray(v) &&
          Object.keys(v).length === 0;
        const nested = isNestedObject(v);
        return (
          <div
            key={k}
            className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 sm:gap-y-0"
          >
            <dt className="font-medium text-slate-600">{camelToLabel(k)}</dt>
            <dd className="min-w-0">
              {isEmptyObj ? (
                <span className="text-slate-400">—</span>
              ) : nested ? (
                <div className="mt-1">
                  <ObjectValue value={v} depth={depth + 1} />
                </div>
              ) : (
                formatInlineValue(k, v)
              )}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

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
            {typeof item === "object" && item !== null && !Array.isArray(item) ? (
              <ObjectValue value={item as Record<string, unknown>} />
            ) : typeof item === "object" ? (
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
    return <ObjectValue value={value as Record<string, unknown>} />;
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
                {typeof value === "number" && Number.isFinite(value) ? (
                  key === "durationSeconds" ? (
                    formatDurationSeconds(value)
                  ) : key === "bitrateBps" ? (
                    formatBitrateBps(value)
                  ) : key === "sampleRateHz" ? (
                    formatSampleRateHz(value)
                  ) : key === "fileSizeBytes" ? (
                    formatFileSizeBytes(value)
                  ) : (
                    <CellValue value={value} />
                  )
                ) : (
                  <CellValue value={value} />
                )}
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
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [sessionExpiresAtMs, setSessionExpiresAtMs] = useState<number | null>(
    null,
  );
  const [remainingSessionSec, setRemainingSessionSec] = useState<number | null>(
    null,
  );
  const [tagForm, setTagForm] = useState<WritableTagFormState>(() =>
    emptyWritableTagFormState(),
  );
  const [initialTagForm, setInitialTagForm] = useState<WritableTagFormState>(
    () => emptyWritableTagFormState(),
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    createSession,
    downloadTaggedFile,
    isPending,
    isDownloadPending,
    error,
  } = useMetadataSession();

  const noMetadataPlaceholder = "No metadata";
  const sectionBoxClass =
    "min-h-[200px] min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md";

  useEffect(() => {
    if (sessionExpiresAtMs == null) return;
    const deadlineMs = sessionExpiresAtMs;
    function tick() {
      setRemainingSessionSec(
        Math.max(0, Math.ceil((deadlineMs - Date.now()) / 1000)),
      );
    }
    const id = setInterval(tick, 1000);
    const immediate = window.setTimeout(tick, 0);
    return () => {
      clearInterval(id);
      window.clearTimeout(immediate);
    };
  }, [sessionExpiresAtMs]);

  const sessionActive =
    sessionToken != null &&
    sessionExpiresAtMs != null &&
    remainingSessionSec != null &&
    remainingSessionSec > 0;

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target?.files?.[0] ?? null;
    if (!file) return;
    setSelectedFileName(file.name);
    setSessionToken(null);
    setSessionExpiresAtMs(null);
    setRemainingSessionSec(null);
    try {
      const result = await createSession(file);
      setAudioMetadata(result.metadata);
      setSessionToken(result.sessionToken);
      const expiresAt = Date.now() + result.sessionExpiresInSeconds * 1000;
      setSessionExpiresAtMs(expiresAt);
      setRemainingSessionSec(
        Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000)),
      );
      const tags = writableTagsFromSessionJson(result.rawResponse);
      setTagForm(tags);
      setInitialTagForm(cloneWritableTagFormState(tags));
    } catch {
      setAudioMetadata(undefined);
    }
  }

  function handleResetTags() {
    setTagForm(cloneWritableTagFormState(initialTagForm));
  }

  async function handleDownloadTagged() {
    if (!sessionToken || !sessionActive) return;
    try {
      const body = buildWritableMetadataDownloadBody(tagForm);
      const { blob, filename } = await downloadTaggedFile(sessionToken, body);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      if (e instanceof SessionExpiredError) {
        setSessionToken(null);
        setSessionExpiresAtMs(null);
        setRemainingSessionSec(null);
      }
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
        {error && !(error instanceof SessionExpiredError) && (
          <p
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {error.message}
          </p>
        )}
        {error instanceof SessionExpiredError && (
          <p
            className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
            role="alert"
          >
            {error.message}
          </p>
        )}
        {audioMetadata && (
          <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <header className="mb-4 border-b border-slate-100 pb-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
                Edit tags
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Values here are written to the file when you download. Other
                sections below are read-only reference.
              </p>
            </header>
            {sessionToken && sessionExpiresAtMs != null && sessionActive && (
              <p
                className="mb-4 text-sm text-slate-600"
                aria-live="polite"
              >
                Session expires in{" "}
                <span className="font-medium tabular-nums">
                  {Math.floor(remainingSessionSec / 60)}:
                  {String(remainingSessionSec % 60).padStart(2, "0")}
                </span>
              </p>
            )}
            {sessionToken && remainingSessionSec === 0 && (
              <p className="mb-4 text-sm text-amber-800" role="status">
                This session may have expired. Try downloading; if it fails,
                upload the file again.
              </p>
            )}
            {!sessionToken && (
              <p className="mb-4 text-sm text-amber-800" role="status">
                No active session. Upload a file again to download with tags.
              </p>
            )}
            <WritableTagsForm
              value={tagForm}
              onChange={setTagForm}
              disabled={!sessionActive}
            />
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleDownloadTagged}
                disabled={!sessionActive || isDownloadPending}
                className="flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow transition-all hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDownloadPending ? "Preparing download…" : "Download with these tags"}
              </button>
              <button
                type="button"
                onClick={handleResetTags}
                disabled={!sessionActive}
                className="rounded-lg border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Reset to loaded file
              </button>
            </div>
          </section>
        )}
        <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
          <section className={sectionBoxClass}>
            <header className="mb-3 border-b border-slate-100 pb-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
                Technical information
              </h2>
            </header>
            {audioMetadata ? (
              <div className="flex flex-col gap-6">
                {(() => {
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
                })()}
                <div>
                  <h3 className="mb-2 border-b border-slate-100 pb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Format priorities
                  </h3>
                  {audioMetadata.formatPriorities != null &&
                  (Array.isArray(audioMetadata.formatPriorities) ||
                    typeof audioMetadata.formatPriorities === "object") ? (
                    isPlainKeyValueObject(
                      audioMetadata.formatPriorities as Record<string, unknown>,
                    ) ? (
                      <MetadataKeyValueTable
                        entries={Object.entries(
                          audioMetadata.formatPriorities as Record<string, unknown>,
                        )}
                      />
                    ) : (
                      <pre className="overflow-x-auto text-sm leading-relaxed text-slate-700">
                        {JSON.stringify(audioMetadata.formatPriorities, null, 2)}
                      </pre>
                    )
                  ) : (
                    <p className="text-sm italic text-slate-400">
                      {noMetadataPlaceholder}
                    </p>
                  )}
                </div>
                <div>
                  <h3 className="mb-2 border-b border-slate-100 pb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Formats headers
                  </h3>
                  {audioMetadata.headers != null &&
                  (Array.isArray(audioMetadata.headers) ||
                    typeof audioMetadata.headers === "object") ? (
                    isPlainKeyValueObject(
                      audioMetadata.headers as Record<string, unknown>,
                    ) ? (
                      <MetadataKeyValueTable
                        entries={Object.entries(
                          audioMetadata.headers as Record<string, unknown>,
                        )}
                      />
                    ) : (
                      <pre className="overflow-x-auto text-sm leading-relaxed text-slate-700">
                        {JSON.stringify(audioMetadata.headers, null, 2)}
                      </pre>
                    )
                  ) : (
                    <p className="text-sm italic text-slate-400">
                      {noMetadataPlaceholder}
                    </p>
                  )}
                </div>
              </div>
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
              (() => {
                const data = audioMetadata.metadataFormat;
                if (
                  data != null &&
                  typeof data === "object" &&
                  !Array.isArray(data) &&
                  Object.getPrototypeOf(data) === Object.prototype
                ) {
                  const entries = Object.entries(data);
                  if (entries.length === 0) {
                    return (
                      <p className="text-sm italic text-slate-400">
                        {noMetadataPlaceholder}
                      </p>
                    );
                  }
                  return (
                    <div className="flex flex-col gap-4">
                      {entries.map(([formatKey, formatValue]) => (
                        <div key={formatKey}>
                          <h3 className="mb-2 border-b border-slate-100 pb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-600">
                            {formatKey}
                          </h3>
                          {formatValue !== null &&
                          typeof formatValue === "object" &&
                          !Array.isArray(formatValue) ? (
                            <ObjectValue
                              value={formatValue as Record<string, unknown>}
                            />
                          ) : (
                            <CellValue value={formatValue} />
                          )}
                        </div>
                      ))}
                    </div>
                  );
                }
                return (
                  <pre className="overflow-x-auto text-sm leading-relaxed text-slate-700">
                    {JSON.stringify(audioMetadata.metadataFormat, null, 2)}
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
                Metadata raw
              </h2>
            </header>
            {audioMetadata ? (
              (() => {
                const data = audioMetadata.rawMetadata;
                if (
                  data != null &&
                  typeof data === "object" &&
                  !Array.isArray(data) &&
                  Object.getPrototypeOf(data) === Object.prototype
                ) {
                  const entries = Object.entries(data);
                  if (entries.length === 0) {
                    return (
                      <p className="text-sm italic text-slate-400">
                        {noMetadataPlaceholder}
                      </p>
                    );
                  }
                  return (
                    <div className="flex flex-col gap-4">
                      {entries.map(([formatKey, formatValue]) => (
                        <div key={formatKey}>
                          <h3 className="mb-2 border-b border-slate-100 pb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-600">
                            {formatKey}
                          </h3>
                          {formatValue !== null &&
                          typeof formatValue === "object" &&
                          !Array.isArray(formatValue) ? (
                            <ObjectValue
                              value={formatValue as Record<string, unknown>}
                            />
                          ) : (
                            <CellValue value={formatValue} />
                          )}
                        </div>
                      ))}
                    </div>
                  );
                }
                return (
                  <pre className="overflow-x-auto text-sm leading-relaxed text-slate-700">
                    {JSON.stringify(audioMetadata.rawMetadata, null, 2)}
                  </pre>
                );
              })()
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
