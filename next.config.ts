import type { NextConfig } from "next";

const requiredEnv = ["PORT", "NEXT_PUBLIC_API_BASE_URL"] as const;
for (const key of requiredEnv) {
  if (!process.env[key]?.trim()) {
    throw new Error(`Missing required env: ${key}. Copy .env.example to .env and set values.`);
  }
}

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
