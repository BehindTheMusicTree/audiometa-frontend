import { HTMT_API_SUBDOMAIN, ORG_DOMAIN } from "@behindthemusictree/assets/components";

export const audioMetadataEndpoints = {
  full: "audio/metadata/full/",
  session: "audio/metadata/session/",
  sessionDownload: "audio/metadata/session-download/",
};

function orgHostForApi(): string {
  const raw = ORG_DOMAIN?.trim();
  if (!raw || raw === "ORG_DOMAIN") {
    throw new Error(
      "HTMT API subdomain, org domain, and API root segment must be set",
    );
  }
  return raw.replace(/^https?:\/\//i, "").replace(/\/+$/, "");
}

function apiHostSubdomain(): string {
  if (!HTMT_API_SUBDOMAIN) {
    return "";
  }
  if (process.env.NEXT_PUBLIC_DEPLOYMENT_ENV?.trim() === "production") {
    return HTMT_API_SUBDOMAIN;
  }
  return `staging.${HTMT_API_SUBDOMAIN}`;
}

function buildAudioMetadataUrl(pathSegment: string): string {
  const domain = orgHostForApi();
  const subdomain = apiHostSubdomain();
  const base = `https://${subdomain}.${domain}`.replace(/\/+$/, "");
  const segment = (process.env.NEXT_PUBLIC_HTMT_API_ROOT_SEGMENT ?? "")
    .trim()
    .replace(/^\/+|\/+$/g, "");
  const path = pathSegment.replace(/^\/+/, "");
  if (!subdomain || !domain || domain === "ORG_DOMAIN" || !segment) {
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
