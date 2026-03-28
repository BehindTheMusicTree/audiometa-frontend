export const audioMetadataEndpoints = {
  full: "audio/metadata/full/",
};

export function buildAudioMetadataFullUrl(): string {
  const base = (process.env.NEXT_PUBLIC_BACKEND_BASE_URL ?? "")
    .trim()
    .replace(/\/+$/, "");
  const segment = (process.env.NEXT_PUBLIC_HTMT_API_ROOT_SEGMENT ?? "")
    .trim()
    .replace(/^\/+|\/+$/g, "");
  const path = audioMetadataEndpoints.full.replace(/^\/+/, "");
  if (!base || !segment) {
    throw new Error("Backend base URL and API root segment must be set");
  }
  return `${base}/${segment}/${path}`;
}
