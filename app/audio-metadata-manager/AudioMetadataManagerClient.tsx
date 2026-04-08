"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { useTranslations } from "next-intl";
import {
  BTMT_ICON_LINK_CLASS,
  BTMT_ICON_LINK_WITH_TEXT_CLASS,
  IconBookOpen,
  socialBrandIconClass,
  TipeeeSocialLink,
} from "@behindthemusictree/assets/components";
import { Link } from "@/i18n/navigation";
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

const introDocNavLinkClassName = `${BTMT_ICON_LINK_CLASS} ${BTMT_ICON_LINK_WITH_TEXT_CLASS}`;

type BooleanLabels = { yes: string; no: string };
type TipeeeCtaPosition = "intro_bottom" | "after_panels" | "near_download";

function IntroIconLookAround({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={true}
    >
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path
        d="m20 20-3.2-3.2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IntroIconTweakTags({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={true}
    >
      <path
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IntroIconSaveCopy({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={true}
    >
      <path
        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function isNestedObject(v: unknown): v is Record<string, unknown> {
  return (
    v !== null &&
    typeof v === "object" &&
    !Array.isArray(v) &&
    Object.getPrototypeOf(v) === Object.prototype &&
    Object.keys(v).length > 0
  );
}

function formatInlineValue(
  key: string,
  val: unknown,
  bools: BooleanLabels,
): ReactNode {
  if (val === null || val === undefined)
    return <span className="text-slate-400">—</span>;
  if (typeof val === "boolean") return val ? bools.yes : bools.no;
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
            {typeof item === "object" &&
            item !== null &&
            !Array.isArray(item) ? (
              <ObjectValue
                value={item as Record<string, unknown>}
                bools={bools}
              />
            ) : (
              String(item)
            )}
          </li>
        ))}
      </ul>
    );
  }
  if (isNestedObject(val)) {
    return <ObjectValue value={val} bools={bools} />;
  }
  if (typeof val === "object" && val !== null && !Array.isArray(val)) {
    return <span className="text-slate-400">—</span>;
  }
  return String(val);
}

function ObjectValue({
  value,
  depth = 0,
  bools,
}: {
  value: Record<string, unknown>;
  depth?: number;
  bools: BooleanLabels;
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
                  <ObjectValue value={v} depth={depth + 1} bools={bools} />
                </div>
              ) : (
                formatInlineValue(k, v, bools)
              )}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

function CellValue({ value, bools }: { value: unknown; bools: BooleanLabels }) {
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
            {typeof item === "object" &&
            item !== null &&
            !Array.isArray(item) ? (
              <ObjectValue
                value={item as Record<string, unknown>}
                bools={bools}
              />
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
    return (
      <ObjectValue value={value as Record<string, unknown>} bools={bools} />
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
  bools,
}: {
  entries: [string, unknown][];
  bools: BooleanLabels;
}) {
  if (entries.length === 0) return null;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[240px] border-collapse text-sm text-slate-700">
        <tbody>
          {entries.map(([key, value]) => (
            <tr key={key} className="border-b border-slate-100 last:border-0">
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
                    <CellValue value={value} bools={bools} />
                  )
                ) : (
                  <CellValue value={value} bools={bools} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type MetadataManagerPageProps = {
  audiometaPythonGithubUrl: string;
};

export default function MetadataManagerPage({
  audiometaPythonGithubUrl,
}: MetadataManagerPageProps) {
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
  const [tipeeeCtaPosition] = useState<TipeeeCtaPosition>(() => {
    if (typeof window === "undefined") return "intro_bottom";
    const stored = window.localStorage.getItem("ab_tipeee_cta_position");
    if (
      stored === "intro_bottom" ||
      stored === "after_panels" ||
      stored === "near_download"
    ) {
      return stored;
    }
    const variants: TipeeeCtaPosition[] = [
      "intro_bottom",
      "after_panels",
      "near_download",
    ];
    return variants[Math.floor(Math.random() * variants.length)];
  });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const impressionSessionTokenRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    createSession,
    downloadTaggedFile,
    isPending,
    isDownloadPending,
    error,
  } = useMetadataSession();

  const t = useTranslations("Tool");
  const tBool = useTranslations("Boolean");
  const bools: BooleanLabels = { yes: tBool("yes"), no: tBool("no") };
  const noMetadataPlaceholder = t("noMetadata");
  const readOnlySectionBoxClass =
    "min-h-[200px] min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition-shadow hover:shadow-md";

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
  const showInFlowTipeeeCta = audioMetadata != null && sessionActive;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("ab_tipeee_cta_position", tipeeeCtaPosition);
  }, [tipeeeCtaPosition]);

  useEffect(() => {
    if (!showInFlowTipeeeCta || !sessionToken) return;
    if (impressionSessionTokenRef.current === sessionToken) return;
    impressionSessionTokenRef.current = sessionToken;
    track("metadata_load_success", {
      cta_position: tipeeeCtaPosition,
      prefers_reduced_motion: prefersReducedMotion,
    });
    track("tipeee_cta_impression", {
      cta_position: tipeeeCtaPosition,
      prefers_reduced_motion: prefersReducedMotion,
    });
  }, [
    prefersReducedMotion,
    showInFlowTipeeeCta,
    sessionToken,
    tipeeeCtaPosition,
  ]);

  function handleTipeeeCtaClickCapture(
    event: React.MouseEvent<HTMLDivElement>,
  ) {
    const target = event.target as HTMLElement;
    if (!target.closest("a")) return;
    track("tipeee_cta_click", {
      cta_position: tipeeeCtaPosition,
      prefers_reduced_motion: prefersReducedMotion,
    });
  }

  const showTipeeeAtIntroBottom =
    showInFlowTipeeeCta && tipeeeCtaPosition === "intro_bottom";
  const showTipeeeAfterPanels =
    showInFlowTipeeeCta && tipeeeCtaPosition === "after_panels";
  const showTipeeeNearDownload =
    showInFlowTipeeeCta && tipeeeCtaPosition === "near_download";

  function renderInFlowTipeeeCta(position: TipeeeCtaPosition) {
    return (
      <div
        className="flex w-fit max-w-full flex-col gap-3 self-start rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-50 to-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-start sm:gap-4"
        data-track="tipeee-cta-container"
        data-analytics-event="tipeee_cta_impression"
        data-state={tipeeeCtaPosition}
        data-position={position}
        onClickCapture={handleTipeeeCtaClickCapture}
      >
        <p className="text-sm font-medium leading-relaxed text-amber-900">
          {t("supportPromptInFlow")}
        </p>
        <div className="w-full sm:w-auto [&_a]:inline-flex [&_a]:items-center [&_a]:justify-center [&_a]:rounded-full [&_a]:border [&_a]:border-amber-200 [&_a]:bg-white [&_a]:px-4 [&_a]:py-2 [&_a]:text-sm [&_a]:font-medium [&_a]:text-amber-900 [&_a]:shadow-sm hover:[&_a]:bg-amber-100/40">
          <TipeeeSocialLink
            text={t("supportOnTipeee")}
            title={t("supportOnTipeee")}
            showText
            iconClassName={socialBrandIconClass}
          />
        </div>
      </div>
    );
  }

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
    <PageLayout
      dataPage="audio-metadata-manager"
      audiometaPythonGithubUrl={audiometaPythonGithubUrl}
    >
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {t("heading")}
        </h1>
        <section
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          aria-labelledby="feature-intro-heading"
        >
          <h2
            id="feature-intro-heading"
            className="text-base font-semibold tracking-tight text-slate-800"
          >
            {t("featureIntroHeading")}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {t("featureIntroBody")}
          </p>
          <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50/90 px-4 py-3">
            <h3 className="sr-only">{t("formatsSrOnly")}</h3>
            <dl className="m-0 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-10">
              <div className="min-w-0">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {t("audioFormatsLabel")}
                </dt>
                <dd className="m-0 mt-1 text-sm font-medium text-slate-700">
                  {t("audioFormatsValue")}
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {t("metadataFormatsLabel")}
                </dt>
                <dd className="m-0 mt-1 text-sm font-medium text-slate-700">
                  {t("metadataFormatsValue")}
                </dd>
              </div>
            </dl>
          </div>
          <ul className="m-0 mt-4 list-none space-y-3 pl-0 text-sm text-slate-600">
            <li className="flex gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-800">
                <IntroIconLookAround className="h-5 w-5" />
              </span>
              <span className="min-w-0 pt-1">
                <span className="font-medium text-slate-700">
                  {t("bulletLookTitle")}
                </span>{" "}
                {t("bulletLookBody")}
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-800">
                <IntroIconTweakTags className="h-5 w-5" />
              </span>
              <span className="min-w-0 pt-1">
                <span className="font-medium text-slate-700">
                  {t("bulletTweakTitle")}
                </span>{" "}
                {t("bulletTweakBody")}
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-800">
                <IntroIconSaveCopy className="h-5 w-5" />
              </span>
              <span className="min-w-0 pt-1">
                <span className="font-medium text-slate-700">
                  {t("bulletSaveTitle")}
                </span>{" "}
                {t("bulletSaveBody")}
              </span>
            </li>
          </ul>
          <nav
            aria-label={t("navLearnAria")}
            className="mt-5 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-1"
          >
            <Link
              href="/docs"
              className={introDocNavLinkClassName}
              title={t("completeDocsTitle")}
            >
              <IconBookOpen className={socialBrandIconClass} />
              <span>{t("completeDocs")}</span>
            </Link>
          </nav>
          {showTipeeeAtIntroBottom ? (
            <div className="mt-4">{renderInFlowTipeeeCta("intro_bottom")}</div>
          ) : null}
        </section>
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:gap-4 sm:p-5">
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleChange}
            className="sr-only"
            aria-label={t("chooseFileAria")}
          />
          <button
            type="button"
            data-analytics-event="metadata-choose-file-click"
            onClick={() => {
              track("metadata_choose_file_click");
              fileInputRef.current?.click();
            }}
            className="flex min-h-11 w-full shrink-0 items-center justify-center rounded-lg bg-indigo-600 px-7 py-3.5 text-base font-semibold text-white shadow transition-all hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 sm:w-auto sm:min-h-12 sm:px-8 sm:py-4"
            disabled={isPending}
          >
            {isPending ? t("loading") : t("chooseFile")}
          </button>
          <span
            className="min-h-11 min-w-0 w-full flex-1 truncate rounded-lg border border-slate-200 bg-slate-50 px-4 py-3.5 text-base text-slate-600 sm:min-h-12 sm:flex-1 sm:py-4"
            aria-live="polite"
          >
            {selectedFileName ?? t("noFileChosen")}
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <section
            className={readOnlySectionBoxClass}
            aria-labelledby="metadata-panel-technical-heading"
          >
            <header className="mb-3 border-b border-slate-100 pb-2">
              <h2
                id="metadata-panel-technical-heading"
                className="text-sm font-semibold uppercase tracking-wide text-slate-600"
              >
                {t("technicalInfo")}
              </h2>
            </header>
            {audioMetadata ? (
              <div className="flex flex-col gap-6">
                {(() => {
                  const info = audioMetadata.technicalInfo;
                  if (
                    info == null ||
                    typeof info !== "object" ||
                    Array.isArray(info)
                  ) {
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
                  return (
                    <MetadataKeyValueTable entries={entries} bools={bools} />
                  );
                })()}
                <div>
                  <h3 className="mb-2 border-b border-slate-100 pb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t("formatPriorities")}
                  </h3>
                  {audioMetadata.formatPriorities != null &&
                  (Array.isArray(audioMetadata.formatPriorities) ||
                    typeof audioMetadata.formatPriorities === "object") ? (
                    isPlainKeyValueObject(
                      audioMetadata.formatPriorities as Record<string, unknown>,
                    ) ? (
                      <MetadataKeyValueTable
                        entries={Object.entries(
                          audioMetadata.formatPriorities as Record<
                            string,
                            unknown
                          >,
                        )}
                        bools={bools}
                      />
                    ) : (
                      <pre className="overflow-x-auto text-sm leading-relaxed text-slate-700">
                        {JSON.stringify(
                          audioMetadata.formatPriorities,
                          null,
                          2,
                        )}
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
                    {t("formatsHeaders")}
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
                        bools={bools}
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
          <section
            className={readOnlySectionBoxClass}
            aria-labelledby="metadata-panel-unified-heading"
          >
            <header className="mb-3 border-b border-slate-100 pb-2">
              <h2
                id="metadata-panel-unified-heading"
                className="text-sm font-semibold uppercase tracking-wide text-slate-600"
              >
                {t("unifiedMetadata")}
              </h2>
            </header>
            {audioMetadata ? (
              (() => {
                const data = audioMetadata.unifiedMetadata;
                if (isPlainKeyValueObject(data)) {
                  const entries = Object.entries(data);
                  if (entries.length > 0) {
                    return (
                      <MetadataKeyValueTable entries={entries} bools={bools} />
                    );
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
          <section
            className={readOnlySectionBoxClass}
            aria-labelledby="metadata-panel-by-format-heading"
          >
            <header className="mb-3 border-b border-slate-100 pb-2">
              <h2
                id="metadata-panel-by-format-heading"
                className="text-sm font-semibold uppercase tracking-wide text-slate-600"
              >
                {t("byMetadataFormat")}
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
                              bools={bools}
                            />
                          ) : (
                            <CellValue value={formatValue} bools={bools} />
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
          <section
            className={readOnlySectionBoxClass}
            aria-labelledby="metadata-panel-raw-heading"
          >
            <header className="mb-3 border-b border-slate-100 pb-2">
              <h2
                id="metadata-panel-raw-heading"
                className="text-sm font-semibold uppercase tracking-wide text-slate-600"
              >
                {t("metadataRaw")}
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
                              bools={bools}
                            />
                          ) : (
                            <CellValue value={formatValue} bools={bools} />
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
        {showTipeeeAfterPanels ? (
          <div className="mt-1">{renderInFlowTipeeeCta("after_panels")}</div>
        ) : null}
        {audioMetadata && (
          <section className="min-w-0 overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
            <header className="mb-4 border-b border-emerald-200/80 pb-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
                {t("editTags")}
              </h2>
              <p className="mt-1 text-sm text-slate-500">{t("editTagsHelp")}</p>
            </header>
            {sessionToken && sessionExpiresAtMs != null && sessionActive && (
              <p className="mb-4 text-sm text-slate-600" aria-live="polite">
                {t("sessionExpires")}{" "}
                <span className="font-medium tabular-nums">
                  {Math.floor(remainingSessionSec / 60)}:
                  {String(remainingSessionSec % 60).padStart(2, "0")}
                </span>
              </p>
            )}
            {sessionToken && remainingSessionSec === 0 && (
              <p className="mb-4 text-sm text-amber-800" role="status">
                {t("sessionExpiredHint")}
              </p>
            )}
            {!sessionToken && (
              <p className="mb-4 text-sm text-amber-800" role="status">
                {t("noSessionHint")}
              </p>
            )}
            <WritableTagsForm
              value={tagForm}
              onChange={setTagForm}
              disabled={!sessionActive}
            />
            {showTipeeeNearDownload ? (
              <div className="mb-4">
                {renderInFlowTipeeeCta("near_download")}
              </div>
            ) : null}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleDownloadTagged}
                disabled={!sessionActive || isDownloadPending}
                className="flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow transition-all hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDownloadPending
                  ? t("preparingDownload")
                  : t("downloadWithTags")}
              </button>
              <button
                type="button"
                onClick={handleResetTags}
                disabled={!sessionActive}
                className="rounded-lg border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t("resetTags")}
              </button>
            </div>
          </section>
        )}
      </div>
    </PageLayout>
  );
}
