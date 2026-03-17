import type { NextConfig } from "next";

const requiredEnv = [
  "NEXT_PUBLIC_BACKEND_BASE_URL",
  "NEXT_PUBLIC_BTMT_GITHUB_LINK",
  "NEXT_PUBLIC_CONTACT_EMAIL",
  "NEXT_PUBLIC_DEVELOPER",
  "NEXT_PUBLIC_DOCS_BUNDLE_URL",
  "NEXT_PUBLIC_GITHUB_URL",
  "NEXT_PUBLIC_LINKEDIN_URL",
  "NEXT_PUBLIC_MASTODON_URL",
] as const;
const missing = requiredEnv.filter((key) => !process.env[key]?.trim());
if (missing.length > 0) {
  throw new Error(
    `Missing required env: ${missing.join(", ")}. Copy .env.example to .env and set values (or configure them in Vercel).`,
  );
}

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
