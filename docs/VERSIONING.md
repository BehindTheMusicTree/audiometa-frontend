# Versioning Strategy

This document describes how application versioning is handled in CI/CD workflows.

**When to bump MAJOR, MINOR, or PATCH:** See [Semantic Versioning Guide](SEMVER_GUIDE.md) for how SemVer applies to this Next.js application.

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

**Version extraction:** Prefer extracting from `github.ref` in GitHub Actions (e.g. `GITHUB_REF#refs/tags/v`) rather than hardcoding versions. See `.cursor/rules/versioning.mdc` for extraction logic examples.

## Usage Examples

### Using npm version

```bash
npm version patch   # 0.1.0 → 0.1.1
npm version minor   # 0.1.0 → 0.2.0
npm version major   # 0.1.0 → 1.0.0
npm version 1.3.0 --no-git-tag-version   # set exact version (no commit/tag)
```

Use `--no-git-tag-version` when you only want to change `package.json` without creating a commit or tag.

### Creating a Release

```bash
# 1. Create release branch
git checkout -b release/v0.2.0

# 2. Merge to main (or default branch)
git checkout main
git merge release/v0.2.0

# 3. On main: bump version and tag
npm version minor
git push origin v0.2.0
```

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
