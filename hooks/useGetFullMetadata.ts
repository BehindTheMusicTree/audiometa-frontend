"use client";

import { useCallback, useState } from "react";
import {
  AudioMetadataDetailedSchema,
  type AudioMetadataDetailed,
} from "@/schemas/audio-metadata";
import { buildAudioMetadataFullUrl } from "@/lib/api-endpoints";

export function useGetFullMetadata() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getMetadata = useCallback(
    async (file: File): Promise<AudioMetadataDetailed> => {
      setIsPending(true);
      setError(null);
      try {
        const url = buildAudioMetadataFullUrl();
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch(url, { method: "POST", body: formData });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || res.statusText);
        }
        const data = await res.json();
        const parsed = AudioMetadataDetailedSchema.safeParse(data);
        if (!parsed.success) {
          throw new Error("Invalid response from server");
        }
        return parsed.data;
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

  return { getMetadata, isPending, error };
}
