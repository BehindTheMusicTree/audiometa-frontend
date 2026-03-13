# Semantic Versioning Guide for This Next.js Application

This document defines how semantic versioning (SemVer) applies to this Next.js application.  
Version format: **MAJOR.MINOR.PATCH**

---

## Table of Contents

1. [Overview](#overview)
2. [MAJOR Version Changes](#major-version-changes)
3. [MINOR Version Changes](#minor-version-changes)
4. [PATCH Version Changes](#patch-version-changes)
5. [Examples](#examples)
6. [Notes for Deployments](#notes-for-deployments)

---

## Overview

Semantic Versioning (SemVer) is used to communicate the impact of changes in this application.  
A version number is structured as:

- **MAJOR**: Breaking or high-impact changes (e.g., removed features, incompatible API or config)
- **MINOR**: New backward-compatible features or notable improvements
- **PATCH**: Backward-compatible bug fixes and small improvements

When updating [CHANGELOG.md](../CHANGELOG.md) or choosing a release version, use this guide to decide whether to bump MAJOR, MINOR, or PATCH. For tag format and CI/CD behavior, see [VERSIONING.md](VERSIONING.md).

---

## MAJOR Version Changes

Bump **MAJOR** when the change is breaking or has high impact:

- **Breaking API or contract changes**: Backend API contract changes that require frontend or client updates
- **Removed features or routes**: Removing a page, feature, or public capability that users or integrations rely on
- **Environment or config breaking changes**: Required env var renames, removal of config options, or deployment requirements that are not backward compatible
- **Authentication or security model changes**: Changes that invalidate existing sessions, tokens, or auth flows
- **Dependency or Node/Next.js major upgrades**: Upgrading to a new major version of Next.js or key dependencies that require code or deployment changes

When in doubt, prefer MAJOR if existing deployments or integrations could break without explicit migration steps.

---

## MINOR Version Changes

Bump **MINOR** when adding new functionality in a backward-compatible way:

- **New features**: New pages, components, or user-facing capabilities
- **New API usage or endpoints**: Frontend starts using new backend endpoints or options without removing support for existing behavior
- **New configuration or env vars**: Optional new env vars or config; existing config still valid
- **Improvements that expand behavior**: New optional parameters, new routes, new UI flows that do not remove or change existing behavior in a breaking way
- **Dependency minor updates**: Upgrading to a new minor version of Next.js or dependencies when the upgrade is backward compatible

---

## PATCH Version Changes

Bump **PATCH** when fixing issues or making small, safe improvements:

- **Bug fixes**: Fixing incorrect behavior, UI bugs, or API usage bugs
- **Error handling improvements**: Better validation, error messages, or recovery without changing success behavior
- **Performance fixes**: Fixing memory leaks, unnecessary re-renders, or redundant requests
- **Accessibility or UX polish**: Fixes that do not change feature set
- **Documentation or comments**: Doc-only or comment-only changes that do not affect runtime behavior
- **Dependency patch updates**: Security or patch-level dependency updates that do not change public behavior

---

## Examples

| Change | Bump | Reason |
|--------|------|--------|
| Fix API endpoint path | PATCH | Bug fix, no API contract change |
| Add new "Export" action on metadata page | MINOR | New feature, backward compatible |
| Require new required env var for build | MAJOR | Breaking for deployments |
| Session restore so users don't reconnect on refresh | PATCH | Bug fix / behavior fix |
| Drop support for an old API response shape | MAJOR | Breaking contract change |
| Next.js major upgrade with no breaking code changes | MAJOR | Major dependency upgrade |

---

## Notes for Deployments

- **Build or config changes**: Changing `output: 'export'`, route behavior, or prerender assumptions can affect how the app is built and deployed. Document any new requirements; breaking deployment assumptions should be MAJOR.
- **Environment variables**: Adding optional env vars is MINOR. Removing or renaming required env vars is MAJOR.

When documenting a release, mention any deployment or environment changes so hosting can be updated accordingly.
