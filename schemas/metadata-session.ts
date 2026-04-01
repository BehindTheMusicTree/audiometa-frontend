import {
  AudioMetadataDetailedSchema,
  type AudioMetadataDetailed,
} from "@/schemas/audio-metadata";

export class SessionExpiredError extends Error {
  constructor(message = "Session expired. Upload the file again.") {
    super(message);
    this.name = "SessionExpiredError";
  }
}

const SESSION_ROOT_KEYS = new Set([
  "sessionToken",
  "session_token",
  "sessionExpiresInSeconds",
  "session_expires_in_seconds",
]);

function stripSessionRootFields(
  raw: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...raw };
  for (const k of SESSION_ROOT_KEYS) {
    delete out[k];
  }
  return out;
}

export type MetadataSessionResult = {
  metadata: AudioMetadataDetailed;
  sessionToken: string;
  sessionExpiresInSeconds: number;
  rawResponse: Record<string, unknown>;
};

export function parseMetadataSessionResponse(data: unknown): MetadataSessionResult {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("Invalid response from server");
  }
  const raw = data as Record<string, unknown>;
  const token = raw.sessionToken ?? raw.session_token;
  const exp = raw.sessionExpiresInSeconds ?? raw.session_expires_in_seconds;
  if (typeof token !== "string" || !token.trim()) {
    throw new Error("Invalid response from server");
  }
  if (typeof exp !== "number" || !Number.isFinite(exp) || exp < 0) {
    throw new Error("Invalid response from server");
  }
  const stripped = stripSessionRootFields(raw);
  const parsed = AudioMetadataDetailedSchema.safeParse(stripped);
  if (!parsed.success) {
    throw new Error("Invalid response from server");
  }
  return {
    metadata: parsed.data,
    sessionToken: token.trim(),
    sessionExpiresInSeconds: exp,
    rawResponse: raw,
  };
}
