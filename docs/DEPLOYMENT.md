# Vercel deployment (production and previews)

This guide covers deploying the app to Vercel: **main → production**, and a **preview deployment for each pull request**. There is no permanent staging environment. Branch flow matches [CONTRIBUTING.md](../CONTRIBUTING.md) and [.github/workflows/validate.yml](../.github/workflows/validate.yml).

## 1. Connect the repo to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (e.g. with GitHub).
2. **Add New… → Project** and import your `audiometa-frontend` repository.
3. Leave framework preset as **Next.js** and root directory as **./**.
4. Deploy. The first deployment will use your default branch.

After this, configure production as below. Production (`main`) and pull request previews deploy through Vercel's Git integration on push; a production **Deploy Hook** is also triggered by [Sync Vercel env](../.github/workflows/sync-vercel-env.yml) (see [§2.4](#24-deploy-hooks-and-sync-vercel-env)).

## 2. Vercel project configuration

### 2.1 Production branch

1. Open the project on Vercel → **Settings**.
2. In the left sidebar, go to **Environments** (or **Git** → production branch, depending on UI).
3. Set **Production Branch** to `main`. Save.
4. The repo has no `vercel.json`: a push to `main` deploys production through the Git integration. A `vX.Y.Z` tag does not trigger a deployment (see [VERSIONING.md](VERSIONING.md)).

### 2.2 Production domain

1. **Settings → Domains**.
2. Click **Add** and enter your production domain (e.g. `app.audiometa.com` or `audiometa.com`).
3. Leave it assigned to the production branch (`main`) or the default “Production” environment.
4. Add the DNS records Vercel shows at your DNS provider (A/CNAME, etc.).

### 2.3 Pull request previews

Every push to a pull request branch gets a Vercel preview URL (e.g. `audiometa-frontend-git-<branch>-<team>.vercel.app`), linked from the PR's `Vercel` check. No extra config. Previews build with the Vercel **Preview** environment variables.

### 2.4 Deploy Hooks and Sync Vercel env

[Sync Vercel env](../.github/workflows/sync-vercel-env.yml) pushes the variables of [§3.1](#31-automating-env-vars) to Vercel, then POSTs the production **`VERCEL_DEPLOY_HOOK`** so the next production build bakes them in. Previews pick up new Preview values on the next push to their pull request.

**On Vercel**

1. Open the project → **Settings → Git → Deploy Hooks**.
2. Create one hook for **`main`** (production) and copy its full URL.

**On GitHub**

1. **Settings → Environments → `PROD`** → **Environment secrets**.
2. Add **`VERCEL_DEPLOY_HOOK`** = the hook URL.
3. Repository secrets **`VERCEL_TOKEN`** and **`VERCEL_PROJECT_ID`** are shared by both environments.

## 3. Environment variables

For **local** runs (`pnpm run dev`, `pnpm run launch`): copy `.env.example` to `.env` and set every variable listed there. The build fails if any required env var is missing (see `requiredEnv` in next.config.ts).

On **Vercel**:

PostHog keys (`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`) are required at build time; see [.env.example](../.env.example) and [docs/ANALYTICS.md](./ANALYTICS.md).

1. **Settings → Environment Variables**.
2. For each variable, choose:
   - **Production** – only for production deployments (branch `main`).
   - **Preview** – for pull request previews.
   - **Development** – for `vercel dev` (local).

### `@behindthemusictree/*` packages

The packages are public on npmjs.com, so installs need no token, no `.npmrc` and no Vercel `NPM_TOKEN`.

Recommended:

- **Production**: `NEXT_PUBLIC_APP_URL` = production URL (e.g. `https://app.audiometa.com`), `NEXT_PUBLIC_API_URL` = production API, production API keys.
- **Preview**: `NEXT_PUBLIC_APP_URL` = preview URL, `NEXT_PUBLIC_API_URL` = staging API, staging API keys.

Save after editing; redeploy if needed for changes to apply.

### 3.1 Automating env vars

You can push environment variables to Vercel from GitHub Actions so they stay in sync with GitHub Secrets.

Use the workflow [`.github/workflows/sync-vercel-env.yml`](../.github/workflows/sync-vercel-env.yml). It runs manually (**Actions → Sync Vercel env → Run workflow**) and syncs variables from GitHub Secrets to Vercel using the [Vercel REST API](https://vercel.com/docs/rest-api/reference/endpoints/projects/create-one-or-more-environment-variables).

**Required** GitHub Secrets (repository):

- `VERCEL_TOKEN` – [Vercel token](https://vercel.com/account/tokens) with access to the project.
- `VERCEL_PROJECT_ID` – Project id or name (e.g. `audiometa-frontend`).

**Required** environment secret on the **`PROD`** GitHub Environment:

- `VERCEL_DEPLOY_HOOK` – Full URL of a [Vercel Deploy Hook](https://vercel.com/docs/deploy-hooks) tied to branch `main` (Vercel Production). After env vars are synced, the workflow `POST`s this URL to start a new production deployment so `NEXT_PUBLIC_*` changes are picked up.

**How to get them**

- **VERCEL_TOKEN**: Go to [vercel.com/account/tokens](https://vercel.com/account/tokens), click **Create Token**, give it a name (e.g. “GitHub Actions env sync”), and optionally limit it to the project. Copy the token once (it is shown only once) and store it as a GitHub secret.
- **VERCEL_PROJECT_ID**: Open your project on Vercel → **Settings** → **General**. The **Project ID** is in the “Project ID” or “Project Name” field (you can use either the id or the project name, e.g. `audiometa-frontend`). For a team project, use the project name/slug as shown in the project URL.

**How the sync works:** The workflow has two jobs. Each job runs in a **GitHub Environment** (`PROD` → Vercel Production, `STAGING` → Vercel Preview), so it sees that environment’s variables. It syncs only to the matching Vercel target.

| Source                                                                                                     | → Vercel env                                                                                        |
| ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **Repo variables** (Settings → Secrets and variables → Actions → Variables) – same value for both targets: |
| `AUDIOMETA_DOCS_BUNDLE_URL`                                                                                | `NEXT_PUBLIC_DOCS_BUNDLE_URL`                                                                       |
| `AUDIOMETA_PYTHON_GITHUB_REPO_URL`                                                                         | `AUDIOMETA_PYTHON_GITHUB_REPO_URL` (AudioMeta Python repo URL for footer / docs; no trailing slash) |
| `POSTHOG_API_HOST`                                                                                         | `NEXT_PUBLIC_POSTHOG_HOST` (PostHog ingest API origin, e.g. `https://eu.i.posthog.com`)             |

_(Organization site, social defaults, and contact targets for footer / intro links come from **`@behindthemusictree/brand`** at package build time; this app does not set other `NEXT*PUBLIC*_` vars for those.)\*

| **Repository secret** (PostHog; required to run [Sync Vercel env](../.github/workflows/sync-vercel-env.yml)): |
| `POSTHOG_PROJECT_TOKEN` | `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` |

| **GitHub Environment variables** (Settings → Environments → `PROD` / `STAGING`) – can differ per environment: |
| `HTMT_API_ROOT_SEGMENT` | `NEXT_PUBLIC_BACKEND_ROOT_SEGMENT` (path segment before `audio/…`, no slashes) |
| _(none for site origin)_ | Canonical site origin is resolved from **`@behindthemusictree/brand`** (`resolveOrgSiteHref()`), not from an app-level `NEXT_PUBLIC_SITE_URL` variable. |
| _(none for API host)_ | API host is resolved from **`@behindthemusictree/brand`** constants (`HTMT_API_SUBDOMAIN` + **`ORG_DOMAIN`**, baked in at package build time) rather than app-level env. |

Set `HTMT_API_ROOT_SEGMENT` to the path prefix where the API is mounted (e.g. `htmt` if routes live at `https://hear-api.themusictree.org/htmt/audio/metadata/full/`).

The workflow uses `upsert` so it creates or updates each variable, then triggers a production deployment via the `PROD` `VERCEL_DEPLOY_HOOK` so the new values are baked into the next build.

Run **Sync Vercel env** manually (Actions → Sync Vercel env → Run workflow) whenever one of these variables changes.

## 4. Troubleshooting: Vercel shows old version

If production or a preview shows an old version after you merged or pushed:

1. **Production branch** – Vercel → **Settings → Git**. Ensure **Production Branch** is `main`. Every `main` push deploys production; otherwise **Redeploy** the latest production deployment or POST the Deploy Hook ([§2.4](#24-deploy-hooks-and-sync-vercel-env)).
2. **Which URL you’re opening** – Confirm you’re on the right URL. Production domain goes to the latest **production** deployment; preview URLs (e.g. `…-git-<branch>-….vercel.app`) are tied to a specific branch/commit.
3. **Builds failing** – In Vercel → **Deployments**, check the latest deployment for your branch. If it’s **Failed**, fix the build (e.g. env vars, Node version, `pnpm run build` locally). Only successful builds update the live site.
4. **Redeploy** – **Deployments** → open the latest production deployment → **⋯** → **Redeploy**, or run **Actions → Sync Vercel env** / POST the Deploy Hook again.
5. **Cache** – Try a hard refresh (e.g. Ctrl+Shift+R / Cmd+Shift+R) or an incognito window to rule out browser cache.
6. **Git connection** – **Settings → Git** should show the correct repository. If you renamed the repo or moved it, re-import the project or reconnect the Git integration.

## 5. Summary

- **Deploy**: Push to `main` → production (Git). Push to a pull request branch → preview (Git). [Sync Vercel env](../.github/workflows/sync-vercel-env.yml) also triggers the production [Deploy Hook](https://vercel.com/docs/deploy-hooks)—see [§2.4](#24-deploy-hooks-and-sync-vercel-env).
- **Domains**: **Settings → Domains**; assign the production domain to production.
- **Env vars**: **Settings → Environment Variables**; use Production for prod, Preview for PR previews. Sync from GitHub via [sync-vercel-env.yml](../.github/workflows/sync-vercel-env.yml).
- **Releases**: Every merge into `main` deploys production, including the release-please PR; the `vX.Y.Z` tag does not trigger a deployment. See [VERSIONING.md](VERSIONING.md).
- **Old version showing**: See [§4 Troubleshooting](#4-troubleshooting-vercel-shows-old-version).
