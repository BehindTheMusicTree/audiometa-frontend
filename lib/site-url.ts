import {
  AUDIOMETA_FRONT_SUBDOMAIN,
  resolveOrgSiteHref,
} from "@behindthemusictree/brand/components";

export function getSiteUrl(): string {
  const orgHost = new URL(resolveOrgSiteHref()).hostname;
  return `https://${AUDIOMETA_FRONT_SUBDOMAIN}.${orgHost}`;
}
