# SEO and AEO

Strategy and opportunities for search visibility and AI engine visibility on the Audiometa site. This doc covers both SEO (search engines) and AEO (AI engines) and how to apply them from day one on a new website.

## Table of Contents

- [SEO — Search Engine Optimization](#seo--search-engine-optimization)
- [AEO — AI Engine Optimization](#aeo--ai-engine-optimization)
- [Strategy for Audiometa](#strategy-for-audiometa)
- [Opportunities](#opportunities)
- [Implementation checklist](#implementation-checklist)
- [Further reading](#further-reading)

## SEO — Search Engine Optimization

SEO is still essential for long-term traffic, though it typically ramps up more slowly than paid or social channels.

**What it includes:**

- **Technical SEO** – Crawlability, speed, mobile-friendliness, clean URLs, sitemaps, robots.
- **On-page SEO** – Page titles, meta descriptions, headings (H1–H6), semantic structure, internal links.
- **Backlinks** – Quality links from other sites; builds authority and trust.
- **Content SEO** – Useful, keyword-aware content that answers what people search for.
- **Local SEO** – Relevant if you have a physical presence or local intent (e.g. “audio metadata tool near me”); otherwise can be deprioritized.

**Why it matters:** SEO drives free, compounding, long-term traffic. A well-optimized site can rank for terms like “audio metadata editor”, “edit ID3 tags”, or “metadata manager” and keep delivering visits over time.

## AEO — AI Engine Optimization

AEO is the newer frontier: optimizing content so AI assistants (e.g. ChatGPT, Perplexity, Copilot, Claude) surface your site when answering user questions.

**How to optimize:**

- **Clear, factual content** – Direct answers and definitions that AIs can quote or summarize.
- **Structured data** – Tables, FAQs, lists, and schema.org markup so models can parse and cite accurately.
- **Strong authority signals** – Accurate information, consistent terminology, and a clear “about” / purpose.
- **Clean, unambiguous explanations** – Short definitions (e.g. “Audio metadata is…”, “ID3 is…”), no jargon without explanation.

**Why it matters:** As more users ask AIs “how do I edit audio metadata?” or “what’s a good ID3 tag editor?”, being cited in those answers is becoming as important as ranking in traditional search. AEO and SEO reinforce each other when content is clear and well-structured.

## Strategy for Audiometa

**Goals:**

- Visibility for queries like “audio metadata”, “edit ID3”, “metadata manager”, “view audio tags”.
- Trust and clarity for a new brand so both users and AI systems understand what Audiometa is and what it does.

**Audience:**

- Creators, podcasters, librarians, and developers who need to view or edit audio metadata (ID3, Vorbis, etc.).

**Priorities:**

1. **Quick** – Technical and on-page foundations: unique page titles and meta descriptions, semantic HTML, clean URLs. See [SEMANTIC_HTML.md](SEMANTIC_HTML.md) for layout conventions.
2. **Next** – One clear “about” or landing copy that explains what Audiometa is and what audio metadata is. This helps both SEO and AEO.
3. **Later** – Backlinks, deeper content (e.g. glossary, short guides), and richer structured data (WebApplication, FAQPage, HowTo).

## Opportunities

**SEO**

- Add per-page `metadata` (title, description) for `/` and `/audio-metadata-manager` in the App Router.
- Add a sitemap and robots.txt (e.g. Next.js `sitemap.ts` and `robots.ts`) so crawlers discover and respect your routes.
- Keep using semantic HTML (already encouraged in [SEMANTIC_HTML.md](SEMANTIC_HTML.md)) for headings and sections.
- Optionally add a small amount of editorial content: e.g. FAQ or “What is audio metadata?” to target informational queries.

**AEO**

- Reuse the same content as above; clarity and structure help both crawlers and AI models.
- Add definitions and short explanations in copy (e.g. “Audiometa is a web app for viewing and editing audio file metadata such as ID3 and Vorbis tags.”).
- Add structured data where it fits: e.g. `WebApplication` for the app, `FAQPage` or `HowTo` if you add FAQ or how-to content.
- Use tables or lists for formats (ID3, Vorbis, etc.) and keep terminology consistent so AIs can cite you accurately.

The app’s existing clarity (unified metadata view, “By metadata format” section) is a good base for both SEO and AEO; build on that with explicit copy and structure.

**Docs section (`/docs`)**

The `/docs` section surfaces metadata documentation (formats, field support, writing, audio technical info) fetched at build time from a published docs bundle. The content comes from the audiometa-python (or audiometa-python-publish-docs) repo. Each doc page has its own title and description for SEO and AEO; the content uses semantic HTML (`<article>`, headings, tables). Set `NEXT_PUBLIC_DOCS_BUNDLE_URL` to the URL of `docs-bundle.json` to enable the docs; see `.env.example`.

## Implementation checklist

Use this as a reference for follow-up work (no code in this doc):

- Export `metadata` (title, description) from each page route (`app/page.tsx`, `app/audio-metadata-manager/page.tsx`) or via layout; keep root defaults in `app/layout.tsx`.
- Add `app/sitemap.ts` (and optionally `app/robots.ts`) using the Next.js App Router conventions so production has a sitemap and robots file.
- Consider JSON-LD for `WebApplication` on the main app page and, if you add FAQ or how-to content, `FAQPage` or `HowTo`.
- Ensure production URL and canonical behavior are correct; see [DEPLOYMENT.md](DEPLOYMENT.md) for Vercel and env configuration.
- Include `/docs` and `/docs/[slug]` in the sitemap when docs are enabled.
- Optional: add JSON-LD `Article` for each doc page (headline, description).

## Further reading

- [Next.js Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata) – Built-in metadata and Open Graph.
- [schema.org](https://schema.org/) – Structured data types (WebApplication, FAQPage, HowTo).
- [Next.js Sitemap and robots](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) – Generating sitemap and robots in the App Router.
