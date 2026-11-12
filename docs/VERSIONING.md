# Versioning Strategy

This document describes how application versioning is handled in CI/CD workflows.

**When to bump MAJOR, MINOR, or PATCH:** See [Semantic Versioning Guide](SEMVER_GUIDE.md) for how SemVer applies to this Next.js application.

**Changelog:** Update [CHANGELOG.md](../CHANGELOG.md) when releasing: move `[Unreleased]` entries into a new versioned section (e.g. `## [0.2.0] - YYYY-MM-DD`).

## Table of Contents

- [Overview](#overview)
- [Version Format](#version-format)
- [Pre-Release Versions](#pre-release-versions)
  - [Development Tags (`-dev`)](#development-tags--dev-)
  - [Release Candidate Tags (`-rc`, `-beta`, `-alpha`)](#release-candidate-tags--rc--beta--alpha-)
- [How Versioning Works](#how-versioning-works)
- [Usage Examples](#usage-examples)

## Overview

The application version is derived from **git tags**. Git tags (e.g., `v0.2.0`) serve as the single source of truth for versioning. Workflows extract the version number (e.g., `0.2.0`) from the tag name.

## Version Format

Versions follow semantic versioning with a `v` prefix:

- Format: `v<major>.<minor>.<patch>` (e.g., `v0.2.0`)
- The `v` prefix is stripped when used in workflows (e.g., `v0.2.0` → `0.2.0`)

## Pre-Release Versions

### Development Tags (`-dev`)

Used to test builds and deployments from **feature and hotfix branches** during active development.

- Format: `v<version>-dev-<branch-name>` (e.g., `v0.3.0-dev-improve-ui`)
- Use the branch name **without** the type prefix (`feature/`, `hotfix/`, etc.)
- Example: Branch `feature/improve-ui` → Tag `v0.3.0-dev-improve-ui`

Version selection:

- **Feature branches**: Typically minor version (e.g., `v0.3.0-dev-*` or `v0.4.0-dev-*`)
- **Hotfix branches**: Typically patch version (e.g., `v0.3.0-dev-*`)
- **Breaking changes**: Major version (e.g., `v1.0.0-dev-*`)

### Release Candidate Tags (`-rc`, `-beta`, `-alpha`)

Used to test builds from **release branches** before final release.

- **Release Candidate**: `v0.2.0-rc1`, `v0.2.0-rc2`
- **Beta**: `v0.2.0-beta1`, `v0.2.0-beta2`
- **Alpha**: `v0.2.0-alpha1`, `v0.2.0-alpha2`

### Release Tags

- Final release versions: `v0.2.0`, `v1.0.0`
- Created after merging release branch to `main` (or your default branch)
- Triggers production deployment when CI/CD is configured

## How Versioning Works

When a version tag is pushed, the workflow (when configured):

1. Extracts the version number from the git tag (e.g., `refs/tags/v0.2.0` → `0.2.0`)
2. Builds the application
3. Uses the version for Docker image tags, artifacts, or deployment as configured

**Version extraction:** Prefer extracting from `github.ref` in GitHub Actions (e.g. `GITHUB_REF#refs/tags/v`) rather than hardcoding versions. See `.claude/rules/versioning.md` for extraction logic examples.

## Usage Examples

### Setting the version

The git tag is the source of truth; `package.json` `version` mirrors it and is set by the release PR, never by `npm version` (which would create a local commit and tag).

```bash
npm pkg set version=0.2.0   # edit package.json only: no commit, no tag
```

### Creating a Release

1. Branch `release/0.2.0` from `develop`.
2. In one commit (`chore(release): prepare 0.2.0`), set `package.json` `version` and move the `[Unreleased]` entries of [CHANGELOG.md](../CHANGELOG.md) into a dated `## [0.2.0]` section.
3. Open a PR into `main` and merge it.
4. Tag the merge commit on `main` and push the tag:

```bash
git fetch origin main
git tag v0.2.0 origin/main
git push origin v0.2.0
```

5. Merge `main` back into `develop` through a PR.

### Development Version Tag Testing

```bash
git checkout feature/improve-ui
git tag v0.3.0-dev-improve-ui
git push origin v0.3.0-dev-improve-ui
```

### Pre-Release Version Tag Testing

```bash
git tag v0.2.0-rc1
git push origin v0.2.0-rc1
```
