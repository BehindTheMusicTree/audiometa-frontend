# Audiometa Frontend

Next.js frontend for audio metadata editing and management.

## Table of Contents

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
├── docs/              # Style guide, testing, versioning
├── .cursor/rules/     # Cursor AI / editor rules
├── .github/
│   ├── workflows/     # CI (validate, branch-protection, publish)
│   └── pull_request_template.md
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm (or yarn/pnpm)

### Install and run

```bash
git clone https://github.com/YOUR-ORG/audiometa-frontend.git
cd audiometa-frontend
npm install
cp .env.example .env.local   # if present; set variables as needed
npm run dev
```

App runs at `http://localhost:3000`.

### Environment variables

Create `.env.local` from `.env.example` (when available) and set any required `NEXT_PUBLIC_*` or API URLs. Do not commit `.env.local`.

## Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Production build         |
| `npm run start`   | Start production server  |
| `npm run lint`    | Run ESLint               |
| `npm run test`    | Run tests                |

Add `test` in `package.json` if missing (e.g. `"test": "vitest run"`).

## CI

- **Validate** – On push/PR to `main` and `develop`: lint, test, build. [.github/workflows/validate.yml](.github/workflows/validate.yml)
- **Branch protection** – PRs to `main` must be from `hotfix/` or `release/`; PRs to `develop` from `feature/`, `chore/`, or `dependabot/`. [.github/workflows/branch-protection.yml](.github/workflows/branch-protection.yml)
- **Publish** – On tag push `v*`: checks tag is on `main`, runs build. [.github/workflows/publish.yml](.github/workflows/publish.yml). Extend with Docker/deploy when ready.

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

## License

See [LICENSE](LICENSE) for details.
