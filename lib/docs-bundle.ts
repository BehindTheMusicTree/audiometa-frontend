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

let cached: DocsBundle | undefined = undefined;

export async function getDocsBundle(): Promise<DocsBundle> {
  if (cached !== undefined) return cached;
  const bundleUrl = getBundleUrl();
  const res = await fetch(bundleUrl, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    throw new Error(
      `Docs bundle fetch failed (${res.status} ${res.statusText}): ${bundleUrl}`,
    );
  }
  let data: DocsBundle;
  try {
    data = (await res.json()) as DocsBundle;
  } catch (e) {
    throw new Error(`Docs bundle is not valid JSON: ${bundleUrl}`, {
      cause: e,
    });
  }
  cached = data;
  return data;
}

export function getDocSlugs(bundle: DocsBundle): string[] {
  return Object.keys(bundle);
}
