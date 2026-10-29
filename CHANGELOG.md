# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). See [docs/SEMVER_GUIDE.md](docs/SEMVER_GUIDE.md) for when to bump MAJOR, MINOR, or PATCH.

## Table of Contents

- [Changelog Best Practices](#changelog-best-practices)
- [Unreleased](#unreleased)
- [0.1.0 - 2025-03-12](#010---2025-03-12)

## Changelog Best Practices

- Add entries to the **`[Unreleased]`** section when opening or updating a PR.
- Group changes under: **Security**, **Added**, **Changed**, **Fixed**, **Removed**, **Documentation**, **CI**, etc. (Use **Security** for dependency or supply-chain advisories, not only app code fixes.)
- Use ISO 8601 dates: YYYY-MM-DD.
- Mention tests within the related feature or fix entry when relevant.
- During releases, move `[Unreleased]` content into a new versioned section. See [docs/VERSIONING.md](docs/VERSIONING.md).

## [Unreleased]

### CI

- **Node.js**: Pinned Node 24 (the Vercel runtime) via `.nvmrc` and `engines.node`; CI reads `.nvmrc` instead of hard-coding Node 20 (EOL).

### Security

- **Dependencies**: Bumped `next`/`eslint-config-next` to 16.3.8, `vitest` to ^4.1.11 and `vite` to ~6.4.4, and added scoped `pnpm.overrides` for transitive `undici`, `postcss`, `nanoid`, `dompurify`, `protobufjs`, `js-yaml`, `brace-expansion`, `browserslist`, `baseline-browser-mapping` and `@babel/core` to clear open Dependabot alerts. Added `.github/dependabot.yml` targeting `develop`.
- **Dependencies**: Bumped `next` and `eslint-config-next` to 16.2.3 to address [GHSA-q4gf-8mx6-v5v3](https://github.com/advisories/GHSA-q4gf-8mx6-v5v3) (denial of service with Server Components). Updated `next-temp/package-lock.json` to the same Next line and added `next-temp/package.json` so that lockfile can be regenerated with npm.
- **Dependencies**: Bumped `@playwright/test` to ^1.55.1 (Playwright 1.59.x) to address [GHSA-7mvr-c777-76hp](https://github.com/advisories/GHSA-7mvr-c777-76hp) (TLS verification when downloading browsers).

### Added

- **Analytics**: PostHog (`posthog-js`) with `/ingest` rewrites in `next.config.ts`, `instrumentation-client.ts` init (including `NEXT_PUBLIC_DEPLOYMENT_ENV` from `VERCEL_ENV`), `PostHogProvider` for `$pageview`, choose-file click tracking on the metadata manager, and client-side exception capture on metadata errors.
- **Demo recordings**: Playwright config for `demo/e2e`, hero flow spec, reference MP3 under `demo/assets`, and shell scripts to regenerate the asset and record MP4 output.

### Changed

- **Tests**: `vitest.setup.ts` stubs `localStorage` per test, so the suite no longer depends on the Node version (Node ≥25's built-in `localStorage` shadowed jsdom's). Test files import messages via the `@/` alias. Added a footer test pinning the AudioMeta Python GitHub and PyPI link names.
- **Tipeee and footer link tracking**: Upgraded `@behindthemusictree/brand` to ^12.8.0 (12.0.0 only removed the unused `Button`). The footer Tipeee/GitHub links and the in-flow Tipeee CTA now attach `onClick` directly to the link instead of wrapping it in a `<span onClick>` or a capture listener; events (`footer_tipeee_click`, `footer_github_click`, `tipeee_cta_click`) are unchanged. Added `PageFooter` click-tracking tests.
- **Agent rules**: Moved `.cursor/rules/*.mdc` to `.claude/rules/*.md` so Claude Code loads them natively
  (`globs` → `paths`). Dropped `use-tailwind` and `tailwind-order`, which duplicated the `style-guide` rule and
  `docs/STYLE_GUIDE.md`.
- **Env / deploy**: Removed app-level `NEXT_PUBLIC_*` vars for developer credit and org URL; header/footer use **`@behindthemusictree/assets`**. Build now requires `AUDIOMETA_PYTHON_GITHUB_REPO_URL`, `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, and `NEXT_PUBLIC_POSTHOG_HOST`, plus existing `NEXT_PUBLIC_BACKEND_ROOT_SEGMENT` and `NEXT_PUBLIC_DOCS_BUNDLE_URL` (see `docs/DEPLOYMENT.md` and `.env.example`).
- **i18n / App Router**: `[locale]` layout uses `hasLocale` / `notFound()`, `setRequestLocale`, `HtmlLangSync`, and `WebSiteJsonLd`; routing configuration and related types updated for the current `next-intl` setup.
- **Metadata Manager**: Layout and spacing adjustments; stable `id` attributes on writable tag fields for demos and automation.
- **Vitest**: Load `NEXT_PUBLIC_*` from `.env*` in `test` mode; exclude `demo/e2e` (Playwright) from Vitest file discovery.
- **Repository**: `.gitignore` ignores generated Playwright output and demo video artifacts under `demo/output/`.

### Fixed

- **Footer link labels**: The AudioMeta Python GitHub and PyPI footer links now announce their own labels ("AudioMeta Python on GitHub", PyPI label) instead of the generic brand default, which made them indistinguishable from the org GitHub link for screen readers.
- **Sitemap**: `/sitemap.xml` no longer fails entirely when the docs bundle cannot be fetched; core URLs are still emitted and per-doc URLs are omitted until the bundle loads.

### Documentation

- README: ecosystem links to themusictree.org, AudioMeta Webapp project page, and the-music-tree-frontend portfolio source.
- Demo video workflow: `docs/WEB_VIDEO_DEMOS.md`, `demo/WEB_VIDEO_DEMOS.md`, and README files under `demo/` (assets, output, e2e); `.cursor/rules/demo-video.mdc` for the same workflow in-editor.

## [0.1.0] - 2025-03-12

### Added

- **Metadata Manager page** at `/audio-metadata-manager`: file picker to choose an audio file, POST to `NEXT_PUBLIC_BACKEND_BASE_URL/audio/metadata/full/`, display full metadata in six sections (Technical information, Unified metadata, By metadata format, Format priorities, Formats headers, Metadata raw). Inline loading and error display; no popup. Includes unit tests.
- **Project setup**: Cursor rules (style, Tailwind, testing, SemVer, versioning, commit format, PR workflow), docs (STYLE_GUIDE, SEMANTIC_HTML, DATA_ATTRIBUTES, testing, SEMVER_GUIDE, VERSIONING), GitHub workflows (validate, branch-protection, publish), CONTRIBUTING.md, README, PR template, `.gitignore`. Vitest + Testing Library for tests. Reusable `PageLayout` component and `useGetFullMetadata` hook with Zod schema for response validation.

[Unreleased]: https://github.com/your-org/audiometa-frontend/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/your-org/audiometa-frontend/releases/tag/v0.1.0
