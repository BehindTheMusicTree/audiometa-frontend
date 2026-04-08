import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const requiredEnv = [
  "NEXT_PUBLIC_BACKEND_BASE_URL",
  "NEXT_PUBLIC_HTMT_API_ROOT_SEGMENT",
  "NEXT_PUBLIC_DOCS_BUNDLE_URL",
  "NEXT_PUBLIC_SITE_URL",
  "AUDIOMETA_GITHUB_REPO_URL",
] as const;
const missing = requiredEnv.filter((key) => !process.env[key]?.trim());
if (missing.length > 0) {
  throw new Error(
    `Missing required env: ${missing.join(", ")}. Copy .env.example to .env and set values (or configure them in Vercel).`,
  );
}

const nextConfig: NextConfig = {
  transpilePackages: ["@behindthemusictree/assets"],
  turbopack: {
    root: __dirname,
  },
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
