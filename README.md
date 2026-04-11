# Audiometa Frontend

Next.js frontend for audio metadata editing and management.

## Ecosystem

Built inside the **[BehindTheMusicTree](https://github.com/BehindTheMusicTree)** ecosystem.

Want the big picture? Explore the full project universe on **[themusictree.org](https://themusictree.org)**, and see where this app fits on **[AudioMeta Webapp](https://themusictree.org/projects/audiometa-webapp)**.

The portfolio website content lives in **[the-music-tree-frontend](https://github.com/BehindTheMusicTree/the-music-tree-frontend)**; this README focuses on building, testing, deploying, and contributing to this app.

## Table of Contents

- [Ecosystem](#ecosystem)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [CI](#ci)
- [Documentation](#documentation)
- [License](#license)

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Testing:** Vitest, Testing Library
- **CI:** GitHub Actions

## Project Structure

```
.
├── src/
│   ├── app/           # Next.js App Router pages and layouts
│   ├── components/    # React components (features/, ui/)
│   ├── contexts/      # React Context providers
│   ├── hooks/         # Custom hooks
│   ├── lib/           # Utilities and helpers
│   ├── models/        # Types and interfaces
│   └── utils/         # General utilities
├── demo/              # Demo recordings: video guide + sample media
├── docs/              # Style guide, testing, versioning
├── .cursor/rules/     # Cursor AI / editor rules
├── .github/
│   ├── workflows/     # CI (validate, branch-protection)
│   └── pull_request_template.md
├── playwright.config.ts  # Playwright (demo screen recordings)
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm (or yarn/pnpm)

### Install and run

```bash
git clone https://github.com/BehindTheMusicTree/audiometa-frontend.git
cd audiometa-frontend
npm install
cp .env.example .env.local   # if present; set variables as needed
npm run dev
```

App runs at `http://localhost:3001`.

### Environment variables

Create `.env.local` from `.env.example` (when available) and set any required `NEXT_PUBLIC_*` or API URLs. Do not commit `.env.local`.

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Production build         |
| `npm run start` | Start production server  |
| `npm run lint`  | Run ESLint               |
| `npm run test`  | Run tests                |
| `npm run demo:assets` | Regenerate demo sample MP3 ([demo/assets/](demo/assets/); needs ffmpeg) |
| `npm run demo:record` | Playwright hero demo → WebM under [demo/output/](demo/output/) (needs dev server + `npx playwright install chromium`; see [demo/README.md](demo/README.md)) |
| `npm run demo:record:mp4` | Same as above, then **ffmpeg** → `demo/output/hero-demo.mp4` |

## CI

- **Validate** – On push/PR to `main` and `develop`: lint, test, build. [.github/workflows/validate.yml](.github/workflows/validate.yml)
- **Branch protection** – PRs to `main` must be from `hotfix/` or `release/`; PRs to `develop` from `feature/`, `chore/`, or `dependabot/`. [.github/workflows/branch-protection.yml](.github/workflows/branch-protection.yml)

## Documentation

- **[CHANGELOG.md](CHANGELOG.md)** – Version history and notable changes
- **[CONTRIBUTING.md](CONTRIBUTING.md)** – Git Flow, commits, PRs, releasing
- **[docs/STYLE_GUIDE.md](docs/STYLE_GUIDE.md)** – TypeScript, React, Tailwind, naming
- **[docs/SEMANTIC_HTML.md](docs/SEMANTIC_HTML.md)** – Semantic layout elements
- **[docs/DATA_ATTRIBUTES.md](docs/DATA_ATTRIBUTES.md)** – `data-testid`, `data-page`, etc.
- **[docs/testing.md](docs/testing.md)** – Testing strategy and structure
- **[docs/VERSIONING.md](docs/VERSIONING.md)** – Tags and version format
- **[docs/SEMVER_GUIDE.md](docs/SEMVER_GUIDE.md)** – When to bump MAJOR/MINOR/PATCH
- **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** – Vercel staging and production setup
- **[docs/SEO_AND_AEO.md](docs/SEO_AND_AEO.md)** – SEO and AEO strategy and opportunities
- **[demo/README.md](demo/README.md)** – demo hub (video guide, sample media)
- **[demo/WEB_VIDEO_DEMOS.md](demo/WEB_VIDEO_DEMOS.md)** – formats, capture, ffmpeg, embeds

The app has a **Docs** section at `/docs` that loads documentation from a published `docs-bundle.json`. Set **`NEXT_PUBLIC_DOCS_BUNDLE_URL`** in `.env` (see `.env.example`). The bundle is produced by the metadata docs publishing pipeline (e.g. **audiometa-python** / **audiometa-python-publish-docs**).

## License

See [LICENSE](LICENSE) for details.
