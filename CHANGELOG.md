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
- Group changes under: **Added**, **Changed**, **Fixed**, **Removed**, **Documentation**, **CI**, etc.
- Use ISO 8601 dates: YYYY-MM-DD.
- Mention tests within the related feature or fix entry when relevant.
- During releases, move `[Unreleased]` content into a new versioned section. See [docs/VERSIONING.md](docs/VERSIONING.md).

## [Unreleased]

### Added

- (Nothing yet)

## [0.1.0] - 2025-03-12

### Added

- **Metadata Manager page** at `/audio-metadata-manager`: file picker to choose an audio file, POST to `NEXT_PUBLIC_API_BASE_URL/audio/metadata/full/`, display full metadata in six sections (Technical information, Unified metadata, By metadata format, Format priorities, Formats headers, Metadata raw). Inline loading and error display; no popup. Includes unit tests.
- **Project setup**: Cursor rules (style, Tailwind, testing, SemVer, versioning, commit format, PR workflow), docs (STYLE_GUIDE, SEMANTIC_HTML, DATA_ATTRIBUTES, testing, SEMVER_GUIDE, VERSIONING), GitHub workflows (validate, branch-protection, publish), CONTRIBUTING.md, README, PR template, `.gitignore`. Vitest + Testing Library for tests. Reusable `Page` component and `useGetFullMetadata` hook with Zod schema for response validation.

[Unreleased]: https://github.com/your-org/audiometa-frontend/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/your-org/audiometa-frontend/releases/tag/v0.1.0
