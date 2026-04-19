export const audioMetadataEndpoints = {
  full: "audio/metadata/full/",
  session: "audio/metadata/session/",
  sessionDownload: "audio/metadata/session-download/",
};

function buildBackendUrl(pathSegment: string): string {
  const base = (process.env.NEXT_PUBLIC_BACKEND_BASE_URL ?? "")
    .trim()
    .replace(/\/+$/, "");
  const segment = (process.env.NEXT_PUBLIC_BACKEND_ROOT_SEGMENT ?? "")
    .trim()
    .replace(/^\/+|\/+$/g, "");
  const path = pathSegment.replace(/^\/+/, "");
  if (!base || !segment) {
    throw new Error(
      "NEXT_PUBLIC_BACKEND_BASE_URL and NEXT_PUBLIC_BACKEND_ROOT_SEGMENT must be set (non-empty)",
    );
  }
  return `${base}/${segment}/${path}`;
}

export function buildAudioMetadataFullUrl(): string {
  return buildBackendUrl(audioMetadataEndpoints.full);
}

export function buildAudioMetadataSessionUrl(): string {
  return buildBackendUrl(audioMetadataEndpoints.session);
}

export function buildAudioMetadataSessionDownloadUrl(): string {
  return buildBackendUrl(audioMetadataEndpoints.sessionDownload);
}
