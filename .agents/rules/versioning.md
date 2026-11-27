# Versioning and Tagging

This rule defines how versioning and git tagging should be handled in this project. All versioning follows the strategy documented in `docs/VERSIONING.md`.

## Core Principles

1. **Git tags are the single source of truth** for versioning
2. **Version is extracted from tags** in CI/CD workflows, not from variables or manual configuration
3. **Semantic versioning** with `v` prefix: `v<major>.<minor>.<patch>`
4. **The `v` prefix is stripped** when used in workflows (e.g., `v0.2.0` → `0.2.0`)

## Release Tag Format

The release workflow creates `v<major>.<minor>.<patch>` tags, for example `v0.2.0`.

## Version Extraction in Workflows

When creating or updating GitHub Actions workflows that need version information:

1. **Extract version from git tag ref** (when triggered by tag push):

   ```yaml
   - name: Extract version from tag
     id: version
     run: |
       if [[ "${{ github.ref }}" == refs/tags/* ]]; then
         VERSION="${GITHUB_REF#refs/tags/v}"
         echo "Using version from tag ref: $VERSION"
       else
         git fetch --tags --force
         LATEST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
         if [ -z "$LATEST_TAG" ]; then
           echo "Error: Cannot determine version. No tag provided."
           exit 1
         fi
         VERSION="${LATEST_TAG#v}"
         echo "Using latest tag version: $VERSION (from tag: $LATEST_TAG)"
       fi
       echo "version=$VERSION" >> "$GITHUB_OUTPUT"
   ```

2. **Use extracted version** throughout the workflow (Docker tags, job outputs, etc.).
3. **Never hardcode versions** or use GitHub variables for `APP_VERSION` in workflows

## When Working with Versions

- **Workflows**: Extract the released version from Git tags.
- **PR titles**: Follow `docs/SEMVER_GUIDE.md`. Squash merges carry the title into `main`.
- **Release files**: Leave `CHANGELOG.md`, `package.json` version and `.release-please-manifest.json` to Release Please. CI auto-merges the release PR and creates the tag. See `docs/VERSIONING.md`.
