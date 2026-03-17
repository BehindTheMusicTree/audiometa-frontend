export type DocEntry = { title: string; content: string };
export type DocsBundle = Record<string, DocEntry>;

function getBundleUrl(): string {
  const url = process.env.NEXT_PUBLIC_DOCS_BUNDLE_URL?.trim();
  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_DOCS_BUNDLE_URL is required. Set it in .env or Vercel.",
    );
  }
  return url;
}

let cached: DocsBundle | null | undefined = undefined;

export async function getDocsBundle(): Promise<DocsBundle | null> {
  if (cached !== undefined) return cached;
  const bundleUrl = getBundleUrl();
  try {
    const res = await fetch(bundleUrl, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      cached = null;
      return null;
    }
    const data = (await res.json()) as DocsBundle;
    cached = data;
    return data;
  } catch {
    cached = null;
    return null;
  }
}

export function getDocSlugs(bundle: DocsBundle): string[] {
  return Object.keys(bundle);
}
