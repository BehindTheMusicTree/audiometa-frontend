<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 16 App Router project. Here is a summary of all changes made across both wizard runs:

- **`instrumentation-client.ts`**: PostHog initialized using the Next.js 15.3+ `instrumentation-client.ts` pattern, with `capture_exceptions: true` for automatic error tracking, a reverse-proxy `api_host` (`/ingest`), and debug mode in development.
- **`components/PostHogProvider.tsx`**: Wraps the app with `PHProvider` and handles pageview tracking via `PostHogPageView`.
- **`next.config.ts`**: `/ingest` reverse-proxy rewrites pointing to the EU PostHog host and `skipTrailingSlashRedirect: true`, routing PostHog traffic through the app's own domain.
- **`app/audio-metadata-manager/AudioMetadataManagerClient.tsx`**: Core conversion funnel events plus `posthog.captureException` calls at error boundaries.
- **`components/LanguageSwitcher.tsx`**: Added `language_switched` event with `from_locale` and `to_locale` properties.
- **`components/PageHeader.tsx`**: Added `header_docs_click` event on the docs navigation link.
- **`components/PageFooter.tsx`**: Added `footer_tipeee_click` and `footer_github_click` events.
- **`.env.local`**: `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` set via the wizard-tools MCP.

## Events

| Event | Description | File |
|---|---|---|
| `metadata_choose_file_click` | User clicks the "Choose file" button — top of the conversion funnel | `app/audio-metadata-manager/AudioMetadataManagerClient.tsx` |
| `metadata_load_success` | File processed successfully; metadata session created (includes `cta_position`, `prefers_reduced_motion`) | `app/audio-metadata-manager/AudioMetadataManagerClient.tsx` |
| `metadata_load_error` | File upload or session creation failed (includes `error_message`); also sends `captureException` | `app/audio-metadata-manager/AudioMetadataManagerClient.tsx` |
| `metadata_download_click` | User clicks "Download with tags" — signals download intent | `app/audio-metadata-manager/AudioMetadataManagerClient.tsx` |
| `metadata_download_success` | Tagged file downloaded successfully (includes `filename`) | `app/audio-metadata-manager/AudioMetadataManagerClient.tsx` |
| `metadata_download_error` | Download failed (includes `error_message`, `session_expired`); sends `captureException` for non-session errors | `app/audio-metadata-manager/AudioMetadataManagerClient.tsx` |
| `metadata_tags_reset` | User resets tag edits back to original values | `app/audio-metadata-manager/AudioMetadataManagerClient.tsx` |
| `tipeee_cta_impression` | Tipeee support CTA shown to user (includes `cta_position`, `prefers_reduced_motion`) | `app/audio-metadata-manager/AudioMetadataManagerClient.tsx` |
| `tipeee_cta_click` | User clicks the in-flow Tipeee support CTA (includes `cta_position`, `prefers_reduced_motion`) | `app/audio-metadata-manager/AudioMetadataManagerClient.tsx` |
| `language_switched` | User switches the UI language (includes `from_locale`, `to_locale`) | `components/LanguageSwitcher.tsx` |
| `header_docs_click` | User clicks the Docs link in the page header | `components/PageHeader.tsx` |
| `footer_tipeee_click` | User clicks the Tipeee support link in the page footer | `components/PageFooter.tsx` |
| `footer_github_click` | User clicks the GitHub link for the audiometa-python library in the footer | `components/PageFooter.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://eu.posthog.com/project/155697/dashboard/610655
- **File-to-download conversion funnel**: https://eu.posthog.com/project/155697/insights/SvCgCTok
- **Metadata load success vs error**: https://eu.posthog.com/project/155697/insights/DtCVh155
- **Tipeee CTA performance**: https://eu.posthog.com/project/155697/insights/ILOwfiXy
- **Language switcher usage by locale**: https://eu.posthog.com/project/155697/insights/9PVWqy7o
- **Download success vs error rate**: https://eu.posthog.com/project/155697/insights/gEEhoRL5

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
