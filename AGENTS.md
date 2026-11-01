# Project guidance

AudioMeta is a Next.js App Router frontend. Read `README.md` for setup and
`CONTRIBUTING.md` for branching, validation and releases. Feature work targets
`develop`; use the project’s documented rules for releases and hotfixes.

Before the relevant work, read the shared project rules below. Paths are relative
to the repository root; `**/` includes files at the root. Claude `paths:` metadata
is not a Codex loading mechanism. Apply each rule only within its scope.

- For `**/*`, read `.agents/rules/commit-message-format.md`.
- For `demo/**`, read `.agents/rules/demo-video.md`.
- For `**/*`, read `.agents/rules/env-vars.md`.
- For `**/*`, read `.agents/rules/i18n-alignment.md`.
- For `**/*`, read `.agents/rules/no-useless-comments.md`.
- For `**/*`, read `.agents/rules/pr-description-workflow.md`.
- For `**/*`, read `.agents/rules/semver-guide.md`.
- For `**/*`, read `.agents/rules/style-guide.md`.
- For `**/*`, read `.agents/rules/testing.md`.
- For `**/*`, read `.agents/rules/versioning.md`.

Also consult the applicable rules for the associated activity (such as committing,
reviewing, releasing or managing environment variables), even if no file is edited.
Edit sources under `.agents/rules/` and regenerate Claude adapters with the
`render-project-rules.py` script from the [public agent-config repository](https://github.com/BehindTheMusicTree/agent-config) at v1.1.0. From a checkout of that repository, run
`python3 /path/to/agent-config/scripts/render-project-rules.py . --apply` from
this project root. Do not edit generated `.claude/rules/` files directly.

The PostHog skill lives in `.agents/skills/integration-nextjs-app-router/` and is
shared with Claude. Use it only for authorized PostHog work.

Graphify is optional when installed and useful; do not assume it is available.
