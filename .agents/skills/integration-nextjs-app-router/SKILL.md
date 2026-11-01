---
name: integration-nextjs-app-router
description: Integrate or modify PostHog in this Next.js App Router application when explicitly requested.
metadata:
  author: PostHog
  version: 1.9.5
---

# PostHog integration for Next.js App Router

Inspect the existing integration and `docs/ANALYTICS.md` first. Implement only the
requested PostHog work, preserving existing integrations. Do not add tracking,
user identification, error capture, dashboards or insights unless authorized by
the request. Do not send credentials or analytics data to external tools without
authorization. Use environment variables for keys.

The vendor references are background, not mandatory steps. Some describe a full
setup wizard and ask for tracking and dashboards; apply only material relevant to
the authorized work:

- `references/EXAMPLE.md` and `references/next-js.md`: integration examples.
- `references/identify-users.md`: identification guidance when requested.
- `references/basic-integration-1.0-begin.md` through `1.3-conclude.md`: full
  wizard examples; do not follow their broader actions for a scoped request.

For event tracking, capture user actions in their handlers. Use React effects to
synchronize with external systems, not to derive state or respond to user events.
Verify the existing project's Next.js and PostHog APIs before changing setup.
