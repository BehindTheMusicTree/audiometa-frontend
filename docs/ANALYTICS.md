# Analytics (PostHog)

Product analytics and client-side exception reporting use [PostHog](https://posthog.com/). This document is the **source of truth** for env vars, custom event names, and where code lives. Official SDK and Next.js guides: [PostHog docs](https://posthog.com/docs), [Next.js integration](https://posthog.com/docs/libraries/next-js).

## What we use it for

- **Custom events** — conversion funnel and UI actions (`trackEvent` / `posthog.capture`).
- **Page views** — `$pageview` is sent from the React provider (not automatic pageview on init).
- **Exceptions** — `posthog.captureException` on selected error paths where `capture_exceptions` in init is not enough or we want explicit context.

## Architecture

| Piece | Role |
|-------|------|
| [`instrumentation-client.ts`](../instrumentation-client.ts) | Initializes `posthog-js` with `api_host: "/ingest"`, `ui_host` from `NEXT_PUBLIC_POSTHOG_HOST`, `capture_pageview: false`, `capture_pageleave: true`, `capture_exceptions: true`, debug in development. Registers super property `environment` from `NEXT_PUBLIC_DEPLOYMENT_ENV` (set at build time from `VERCEL_ENV` in [`next.config.ts`](../next.config.ts), default `development` locally). |
| [`next.config.ts`](../next.config.ts) | Rewrites `/ingest` (and locale-prefixed paths) to `NEXT_PUBLIC_POSTHOG_HOST` so requests go through the app origin. |
| [`components/PostHogProvider.tsx`](../components/PostHogProvider.tsx) | Wraps the app with `PostHogProvider` and sends `$pageview` on navigation. |
| [`lib/track-event.ts`](../lib/track-event.ts) | Thin wrapper around `posthog.capture` for consistent imports. |

Client event handlers → `trackEvent` / `posthog.capture` → `/ingest` → PostHog ingest host.

## Environment variables

Required at **build time** (see `requiredEnv` in [`next.config.ts`](../next.config.ts) and [`.env.example`](../.env.example)):

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` | Project API key from PostHog → Project settings. |
| `NEXT_PUBLIC_POSTHOG_HOST` | Ingest API origin (no path). EU: `https://eu.i.posthog.com`. US: `https://us.i.posthog.com`. |

`NEXT_PUBLIC_DEPLOYMENT_ENV` is **not** set in `.env`; it is injected via `next.config.ts` `env` from `VERCEL_ENV` on Vercel (`production` / `preview`) or `development` locally.

## Custom events

Update this table when you add or rename events.

| Event | Description | Main properties | File |
|-------|-------------|-----------------|------|
| `$pageview` | Page view (PostHog reserved name) | Path / URL as sent by provider | [`components/PostHogProvider.tsx`](../components/PostHogProvider.tsx) |
| `metadata_choose_file_click` | User clicks “Choose file” (funnel start) | — | [`app/audio-metadata-manager/AudioMetadataManagerClient.tsx`](../app/audio-metadata-manager/AudioMetadataManagerClient.tsx) |
| `metadata_load_success` | File processed; metadata session created | `cta_position`, `prefers_reduced_motion` | same |
| `metadata_load_error` | Upload or session creation failed | `error_message`; also `captureException` | same |
| `metadata_download_click` | User clicks “Download with tags” | — | same |
| `metadata_download_success` | Tagged file downloaded | `filename` | same |
| `metadata_download_error` | Download failed | `error_message`, `session_expired`; `captureException` when not session expiry | same |
| `metadata_tags_reset` | User resets tag edits to originals | — | same |
| `tipeee_cta_impression` | In-flow Tipeee CTA shown | `cta_position`, `prefers_reduced_motion` | same |
| `tipeee_cta_click` | User clicks in-flow Tipeee CTA | `cta_position`, `prefers_reduced_motion` | same |
| `language_switched` | Locale changed | `from_locale`, `to_locale` | [`components/LanguageSwitcher.tsx`](../components/LanguageSwitcher.tsx) |
| `header_docs_click` | Docs link in header | — | [`components/PageHeader.tsx`](../components/PageHeader.tsx) |
| `footer_tipeee_click` | Footer Tipeee link | — | [`components/PageFooter.tsx`](../components/PageFooter.tsx) |
| `footer_github_click` | Footer GitHub link (Python library) | — | same |

## Adding instrumentation

1. Prefer **`trackEvent`** from [`lib/track-event.ts`](../lib/track-event.ts) so tests can mock one module.
2. Call from **event handlers** (clicks, submit, etc.), not from `useEffect` in response to user actions.
3. Use **snake_case** event names consistent with the table above.
4. Keep property payloads small; avoid PII and large blobs.
5. Update the **Custom events** table in this file.

For deeper integration patterns (e.g. feature flags), see [`.claude/skills/integration-nextjs-app-router/SKILL.md`](../.claude/skills/integration-nextjs-app-router/SKILL.md) (agent-oriented reference).

## Deployment and CI

Vercel must have `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` for each environment that builds the app.

The [Sync Vercel env](../.github/workflows/sync-vercel-env.yml) workflow maps GitHub **secret** `POSTHOG_PROJECT_TOKEN` and **variable** `POSTHOG_API_HOST` to those Vercel keys. See [DEPLOYMENT.md §3.1](./DEPLOYMENT.md#31-automating-env-vars).

## PostHog workspace (maintainers)

Dashboards and insights for this project (EU cloud):

- [Analytics basics](https://eu.posthog.com/project/155697/dashboard/610655)
- [File-to-download funnel](https://eu.posthog.com/project/155697/insights/SvCgCTok)
- [Metadata load success vs error](https://eu.posthog.com/project/155697/insights/DtCVh155)
- [Tipeee CTA performance](https://eu.posthog.com/project/155697/insights/ILOwfiXy)
- [Language switcher by locale](https://eu.posthog.com/project/155697/insights/9PVWqy7o)
- [Download success vs error rate](https://eu.posthog.com/project/155697/insights/gEEhoRL5)

## Integration history

Initial PostHog wiring was generated with the PostHog wizard; behavior and the event catalog are maintained here and in code.
