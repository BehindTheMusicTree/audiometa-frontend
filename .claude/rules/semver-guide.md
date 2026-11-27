---
paths:
  - "**/*"
---

# Semantic Versioning Guide

Follow **docs/SEMVER_GUIDE.md** for when to bump MAJOR, MINOR, or PATCH in this Next.js application.

- **MAJOR**: Breaking or high-impact changes (removed features, incompatible API/config, required env changes, major dependency upgrades).
- **MINOR**: New backward-compatible features, new endpoints or options, new optional config.
- **PATCH**: Bug fixes, error-handling improvements, performance fixes and UX fixes.

Choose a Conventional Commits PR title based on the change's effect. Use `docs`
for documentation-only changes. Release Please generates the changelog and
version updates from squash commits. See **docs/VERSIONING.md** for the CI flow.
