import {
  HTMT_API_SUBDOMAIN,
  ORG_DOMAIN,
} from "@behindthemusictree/assets/components";

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

function apiBaseUrl(): string {
  const override = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
  if (override) {
    return override.replace(/\/+$/, "");
  }
  const domain = orgHostForApi();
  const subdomain = apiHostSubdomain();
  if (!subdomain || !domain || domain === "ORG_DOMAIN") {
    throw new Error(
      "HTMT API subdomain, org domain, and API root segment must be set",
    );
  }
  return `https://${subdomain}.${domain}`.replace(/\/+$/, "");
}

function buildAudioMetadataUrl(pathSegment: string): string {
  const base = apiBaseUrl();
  const segment = (process.env.NEXT_PUBLIC_BACKEND_ROOT_SEGMENT ?? "")
    .trim()
    .replace(/^\/+|\/+$/g, "");
  const path = pathSegment.replace(/^\/+/, "");
  if (!segment) {
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
