"use client";

import { useCallback, useState } from "react";
import {
  buildAudioMetadataSessionDownloadUrl,
  buildAudioMetadataSessionUrl,
} from "@/lib/api-endpoints";
import { parseContentDispositionFilename } from "@/lib/content-disposition-filename";
import {
  parseMetadataSessionResponse,
  SessionExpiredError,
  type MetadataSessionResult,
} from "@/schemas/metadata-session";

export type DownloadTaggedFileResult = {
  blob: Blob;
  filename: string;
};

export function useMetadataSession() {
  const [isPending, setIsPending] = useState(false);
  const [isDownloadPending, setIsDownloadPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createSession = useCallback(
    async (
      file: File,
      options?: { includeMusicbrainzAnalysis?: boolean },
    ): Promise<MetadataSessionResult> => {
      setIsPending(true);
      setError(null);
      try {
        const url = buildAudioMetadataSessionUrl();
        const formData = new FormData();
        formData.append("file", file);
        if (options?.includeMusicbrainzAnalysis) {
          formData.append("include_musicbrainz_analysis", "true");
        }
        const res = await fetch(url, { method: "POST", body: formData });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || res.statusText);
        }
        const data: unknown = await res.json();
        return parseMetadataSessionResponse(data);
      } catch (e) {
        const err = e instanceof Error ? e : new Error(String(e));
        setError(err);
        throw e;
      } finally {
        setIsPending(false);
      }
    },
    [],
  );

  const downloadTaggedFile = useCallback(
    async (
      sessionToken: string,
      body: Record<string, unknown>,
    ): Promise<DownloadTaggedFileResult> => {
      setIsDownloadPending(true);
      setError(null);
      try {
        const url = buildAudioMetadataSessionDownloadUrl();
        // Token in JSON body (not X-Session-Token) so browser CORS preflight
        // does not require that header in Access-Control-Allow-Headers.
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...body,
            sessionToken,
          }),
        });
        if (res.status === 410) {
          const err = new SessionExpiredError();
          setError(err);
          throw err;
        }
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || res.statusText);
        }
        const blob = await res.blob();
        const filename =
          parseContentDispositionFilename(
            res.headers.get("Content-Disposition"),
          ) ?? "download.mp3";
        return { blob, filename };
      } catch (e) {
        if (e instanceof SessionExpiredError) throw e;
        const err = e instanceof Error ? e : new Error(String(e));
        setError(err);
        throw e;
      } finally {
        setIsDownloadPending(false);
      }
    },
    [],
  );

  return {
    createSession,
    downloadTaggedFile,
    isPending,
    isDownloadPending,
    error,
  };
}
