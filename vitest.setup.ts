import "@testing-library/jest-dom/vitest";

if (!process.env.NEXT_PUBLIC_DOCS_BUNDLE_URL?.trim()) {
  process.env.NEXT_PUBLIC_DOCS_BUNDLE_URL =
    "https://example.com/docs-bundle.json";
}
