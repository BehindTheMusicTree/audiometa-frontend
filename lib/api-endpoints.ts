import {
  HTMT_API_SUBDOMAIN,
  ORG_DOMAIN,
  readOrgDomain,
} from "@behindthemusictree/assets/components";

export const audioMetadataEndpoints = {
  full: "audio/metadata/full/",
  session: "audio/metadata/session/",
  sessionDownload: "audio/metadata/session-download/",
};

function buildAudioMetadataUrl(pathSegment: string): string {
  const domain = readOrgDomain() ?? ORG_DOMAIN;
  const base = `https://${HTMT_API_SUBDOMAIN}.${domain}`.replace(/\/+$/, "");
  const segment = (process.env.NEXT_PUBLIC_HTMT_API_ROOT_SEGMENT ?? "")
    .trim()
    .replace(/^\/+|\/+$/g, "");
  const path = pathSegment.replace(/^\/+/, "");
  if (!HTMT_API_SUBDOMAIN || !domain || domain === "ORG_DOMAIN" || !segment) {
    throw new Error(
      "HTMT API subdomain, org domain, and API root segment must be set",
    );
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
