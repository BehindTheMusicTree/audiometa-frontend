export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL is required. Set it in .env or Vercel (no trailing slash).",
    );
  }
  return raw.replace(/\/$/, "");
}
