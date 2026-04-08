import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { routing } from "./i18n/routing";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const localePathSegment = routing.locales.join("|");

const requiredEnv = [
  "NEXT_PUBLIC_BACKEND_BASE_URL",
  "NEXT_PUBLIC_HTMT_API_ROOT_SEGMENT",
  "NEXT_PUBLIC_DOCS_BUNDLE_URL",
  "NEXT_PUBLIC_SITE_URL",
  "AUDIOMETA_PYTHON_GITHUB_REPO_URL",
  "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN",
  "NEXT_PUBLIC_POSTHOG_HOST",
] as const;
const missing = requiredEnv.filter((key) => !process.env[key]?.trim());
if (missing.length > 0) {
  const msg = `Missing required env: ${missing.join(", ")}. Copy .env.example to .env and set values (or configure them in Vercel).`;
  console.error(`\n[audiometa-frontend] ${msg}\n`);
  throw new Error(msg);
}

const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST!.trim();

const deploymentEnv =
  process.env.VERCEL_ENV?.trim() || "development";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_DEPLOYMENT_ENV: deploymentEnv,
  },
  transpilePackages: ["@behindthemusictree/assets"],
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: `${posthogHost}/static/:path*`,
      },
      {
        source: `/:locale(${localePathSegment})/ingest/static/:path*`,
        destination: `${posthogHost}/static/:path*`,
      },
      {
        source: "/ingest/:path*",
        destination: `${posthogHost}/:path*`,
      },
      {
        source: `/:locale(${localePathSegment})/ingest/:path*`,
        destination: `${posthogHost}/:path*`,
      },
    ];
  },
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.shields.io",
        pathname: "/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
