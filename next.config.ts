import type { NextConfig } from "next";

const requiredEnv = [
  "NEXT_PUBLIC_BACKEND_BASE_URL",
  "NEXT_PUBLIC_DEVELOPER",
  "NEXT_PUBLIC_GITHUB_URL",
  "NEXT_PUBLIC_LINKEDIN_URL",
  "NEXT_PUBLIC_MASTODON_URL",
  "NEXT_PUBLIC_CONTACT_EMAIL",
] as const;
for (const key of requiredEnv) {
  if (!process.env[key]?.trim()) {
    throw new Error(
      `Missing required env: ${key}. Copy .env.example to .env and set values.`,
    );
  }
}

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
