export const audioMetadataEndpoints = {
  full: "audio/metadata/full/",
  session: "audio/metadata/session/",
  sessionDownload: "audio/metadata/session-download/",
};

function buildAudioMetadataUrl(pathSegment: string): string {
  const base = (process.env.NEXT_PUBLIC_BACKEND_BASE_URL ?? "")
    .trim()
    .replace(/\/+$/, "");
  const segment = (process.env.NEXT_PUBLIC_HTMT_API_ROOT_SEGMENT ?? "")
    .trim()
    .replace(/^\/+|\/+$/g, "");
  const path = pathSegment.replace(/^\/+/, "");
  if (!base || !segment) {
    throw new Error("Backend base URL and API root segment must be set");
  }
  return `${base}/${segment}/${path}`;
}

export function buildAudioMetadataFullUrl(): string {
  return buildAudioMetadataUrl(audioMetadataEndpoints.full);
}

export function buildAudioMetadataSessionUrl(): string {
  return buildAudioMetadataUrl(audioMetadataEndpoints.session);
}

export function buildAudioMetadataSessionDownloadUrl(): string {
  return buildAudioMetadataUrl(audioMetadataEndpoints.sessionDownload);
}
