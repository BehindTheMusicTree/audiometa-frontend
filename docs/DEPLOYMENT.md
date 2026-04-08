# Vercel deployment (staging and production)

This guide covers deploying the app to Vercel with **develop → staging** and **main → production**. Branch flow matches [CONTRIBUTING.md](../CONTRIBUTING.md) and [.github/workflows/validate.yml](../.github/workflows/validate.yml).

## 1. Connect the repo to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (e.g. with GitHub).
2. **Add New… → Project** and import your `audiometa-frontend` repository.
3. Leave framework preset as **Next.js** and root directory as **./**.
4. Deploy. The first deployment will use your default branch.

After this, configure production and staging as below. **Production** updates use a **Deploy Hook** (see [§2.4](#24-production-deploy-hook-and-vercel-deploy-workflow)); **develop** still deploys via Git as preview/staging.

## 2. Vercel project configuration

### 2.1 Production branch

1. Open the project on Vercel → **Settings**.
2. In the left sidebar, go to **Environments** (or **Git** → production branch, depending on UI).
3. Set **Production Branch** to `main`. Save.
4. The repo includes [vercel.json](../vercel.json) with **`main` Git deployments disabled** for production, matching the “hook-only production” flow: pushes to `main` do **not** auto-deploy production. Production is built when the [**Vercel deploy**](../.github/workflows/vercel-deploy.yml) workflow runs (release tag or manual) and **POSTs your Deploy Hook** (see [§2.4](#24-production-deploy-hook-and-vercel-deploy-workflow)).

### 2.2 Production domain

1. **Settings → Domains**.
2. Click **Add** and enter your production domain (e.g. `app.audiometa.com` or `audiometa.com`).
3. Leave it assigned to the production branch (`main`) or the default “Production” environment.
4. Add the DNS records Vercel shows at your DNS provider (A/CNAME, etc.).

### 2.3 Staging (develop branch)

Staging works on the **free (Hobby) plan**: use **Domains** to assign a custom URL to the `develop` branch. You do **not** need “Create Pre-production Environment” (that’s a Pro feature).

- **Preview URL only**: Every push to `develop` gets a preview URL (e.g. `audiometa-frontend-git-develop-username.vercel.app`). No extra config.
- **Staging custom domain** (recommended):
  1. **Settings → Domains** (not “Environments” / “Pre-production Environment”).
  2. Click **Add** and enter your staging domain (e.g. `staging.audiometa.themusictree.org`).
  3. When adding the domain, set **Git Branch** to `develop`. Only deployments from `develop` will be served on this domain.
  4. Add the CNAME record (and any other DNS) Vercel shows at your DNS provider.

### 2.4 Production Deploy Hook and **Vercel deploy** workflow

Production builds are triggered by a **[Deploy Hook](https://vercel.com/docs/deploy-hooks)** (not by a plain push to `main`), so `NEXT_PUBLIC_APP_VERSION` can be set from the release tag before the build.

**On Vercel**

1. Open the project → **Settings → Git → Deploy Hooks** (or **Settings → Deploy Hooks**, depending on UI).
2. Create a hook: name e.g. `production-main`, set branch to **`main`**, create, and copy the **full hook URL**.

**On GitHub (environment `PROD`)**

1. **Settings → Environments → `PROD`** → **Environment secrets**.
2. Add **`VERCEL_DEPLOY_HOOK`** = the hook URL from step 2 (use a **separate** hook URL for `STAGING` if you use one for preview sync).

The workflow [`.github/workflows/vercel-deploy.yml`](../.github/workflows/vercel-deploy.yml) runs when you push a **semver release tag** `vMAJOR.MINOR.PATCH` (e.g. `v0.2.0`) or on **manual** “Run workflow”. It:

1. Upserts **`NEXT_PUBLIC_APP_VERSION`** on Vercel **production** to match `package.json`, and requires the tag (if any) to match that version.
2. **POSTs** `VERCEL_DEPLOY_HOOK` so Vercel runs a production build from `main`.

Repository secrets (same as sync workflow): **`VERCEL_TOKEN`**, **`VERCEL_PROJECT_ID`** on the repo; **`VERCEL_DEPLOY_HOOK`** on the **PROD** environment.

**Optional env for UI:** add `NEXT_PUBLIC_APP_VERSION` to Vercel manually or rely on the workflow; the app does not require it in `next.config.ts` until you read it in code.

**If you want Git to deploy production on every `main` push again**, remove or edit [vercel.json](../vercel.json) (`git.deploymentEnabled.main`) and rely on Vercel’s default behavior; you can still run **Vercel deploy** for version bumps only.

Result:

| Environment | Branch    | Deploys when                                      | URL example                            |
| ----------- | --------- | ------------------------------------------------- | -------------------------------------- |
| Production  | `main`    | **Deploy Hook** (release tag workflow or manual) | `app.audiometa.com`                    |
| Staging     | `develop` | Push to develop                                   | `staging.audiometa.com` or preview URL |
| PR previews | any       | Open PR                                           | `…-git-branch-…vercel.app`             |

## 3. Environment variables

For **local** runs (`npm run dev`, `npm run launch`): copy `.env.example` to `.env` and set every variable listed there. The build fails if any required env var is missing (see `requiredEnv` in next.config.ts).

On **Vercel**:

1. **Settings → Environment Variables**.
2. For each variable, choose:
   - **Production** – only for production deployments (branch `main`).
   - **Preview** – for all non-production deployments (staging, PR previews). Use this for staging.
   - **Development** – for `vercel dev` (local).

### GitHub Packages (`@behindthemusictree/*`)

The repo includes a root [`.npmrc`](../.npmrc) that points `@behindthemusictree` at `npm.pkg.github.com` and uses **`${NPM_TOKEN}`** during install. **Vercel** must have a variable named **`NPM_TOKEN`** (mark it **Sensitive**) on **Production**, **Preview**, and **Development** if you use `vercel dev`. Use a GitHub **personal access token** (classic: `read:packages`; or fine-grained: **Packages → Read** for the org that owns the package). The same token works for install only; it is not read by Next.js at runtime.

**Local:** export the token before install, e.g. `export NPM_TOKEN=ghp_…` then `npm ci`, or rely on your machine’s GitHub CLI / credential helper if you use one.

**Optional:** Add repository secret **`GH_PACKAGES_TOKEN`** with the same PAT. The [Sync Vercel env](../.github/workflows/sync-vercel-env.yml) workflow pushes it to Vercel as **`NPM_TOKEN`** (sensitive) when that secret is set (skips if empty).

Recommended:

- **Production**: `NEXT_PUBLIC_APP_URL` = production URL (e.g. `https://app.audiometa.com`), `NEXT_PUBLIC_API_URL` = production API, production API keys.
- **Preview**: `NEXT_PUBLIC_APP_URL` = staging URL (e.g. `https://staging.audiometa.com`), `NEXT_PUBLIC_API_URL` = staging API, staging API keys.

Save after editing; redeploy if needed for changes to apply.

### 3.1 Automating env vars

You can push environment variables to Vercel from GitHub Actions so they stay in sync with GitHub Secrets.

Use the workflow [`.github/workflows/sync-vercel-env.yml`](../.github/workflows/sync-vercel-env.yml). It runs manually (**Actions → Sync Vercel env → Run workflow**) and syncs variables from GitHub Secrets to Vercel using the [Vercel REST API](https://vercel.com/docs/rest-api/reference/endpoints/projects/create-one-or-more-environment-variables).

**Required** GitHub Secrets (repository):

- `VERCEL_TOKEN` – [Vercel token](https://vercel.com/account/tokens) with access to the project.
- `VERCEL_PROJECT_ID` – Project id or name (e.g. `audiometa-frontend`).

**Required** secret on **each** GitHub Environment (`PROD` and `STAGING`) — use **environment secrets** so each job gets the correct hook, not a single repo-wide value unless it is intentional:

- `VERCEL_DEPLOY_HOOK` – Full URL of a [Vercel Deploy Hook](https://vercel.com/docs/deploy-hooks) for that target (e.g. one hook tied to branch `main` / Vercel Production in the **PROD** environment, and one tied to `develop` / Preview in the **STAGING** environment). After env vars are synced, the workflow `POST`s this URL to start a new deployment so `NEXT_PUBLIC_*` changes are picked up.

**How to get them**

- **VERCEL_TOKEN**: Go to [vercel.com/account/tokens](https://vercel.com/account/tokens), click **Create Token**, give it a name (e.g. “GitHub Actions env sync”), and optionally limit it to the project. Copy the token once (it is shown only once) and store it as a GitHub secret.
- **VERCEL_PROJECT_ID**: Open your project on Vercel → **Settings** → **General**. The **Project ID** is in the “Project ID” or “Project Name” field (you can use either the id or the project name, e.g. `audiometa-frontend`). For a team project, use the project name/slug as shown in the project URL.

**How the sync works:** The workflow has two jobs. Each job runs in a **GitHub Environment** (`PROD` or `STAGING`), so it sees that environment’s variables. It syncs only to the matching Vercel target.

| Source | → Vercel env |
|--------|----------------|
| **Repo variables** (Settings → Secrets and variables → Actions → Variables) – same value for both targets: |
| `AUDIOMETA_DOCS_BUNDLE_URL` | `NEXT_PUBLIC_DOCS_BUNDLE_URL` |
| `AUDIOMETA_PYTHON_GITHUB_REPO_URL` | `AUDIOMETA_PYTHON_GITHUB_REPO_URL` (AudioMeta Python repo URL for footer / docs; no trailing slash) |

*(Organization site, social defaults, and contact targets for footer / intro links come from **`@behindthemusictree/assets`** at package build time; this app does not set other `NEXT_PUBLIC_*` vars for those.)*

| **Repository secret** (optional; used to sync GitHub Packages auth to Vercel): |
| `GH_PACKAGES_TOKEN` | `NPM_TOKEN` on Vercel (**sensitive**), for `npm install` of `@behindthemusictree/*` |

| **GitHub Environment variables** (Settings → Environments → `PROD` / `STAGING`) – can differ per environment: |
| `BACKEND_BASE_URL` (in **PROD** env) | `NEXT_PUBLIC_BACKEND_BASE_URL` on Vercel **production** |
| `BACKEND_BASE_URL` (in **STAGING** env) | `NEXT_PUBLIC_BACKEND_BASE_URL` on Vercel **preview** |
| `HTMT_API_ROOT_SEGMENT` | `NEXT_PUBLIC_HTMT_API_ROOT_SEGMENT` (path segment before `audio/…`, no slashes) |
| `AUDIOMETA_SUBDOMAIN`, `DOMAIN_NAME` (host label + registrable domain, no `https://`, no slashes) | `NEXT_PUBLIC_SITE_URL` = `https://<AUDIOMETA_SUBDOMAIN>.<DOMAIN_NAME>` (trailing slash stripped if present) |

`DOMAIN_NAME` can be a **repository** variable instead if it is the same for production and staging (e.g. `example.org`); set `AUDIOMETA_SUBDOMAIN` per environment (e.g. `app` vs `staging`) so each target gets the correct public origin.

Set `BACKEND_BASE_URL` to the API host only (no trailing slash), e.g. `https://hear-api.themusictree.org`, and `HTMT_API_ROOT_SEGMENT` to the path prefix where the API is mounted (e.g. `htmt` if routes live at `https://hear-api.themusictree.org/htmt/audio/metadata/full/`). Production and Staging can use different hosts and/or segments per environment.

The workflow uses `upsert` so it creates or updates each variable, then triggers a deployment via each environment’s `VERCEL_DEPLOY_HOOK` so the new values are baked into the next build.

**Relation to [vercel-deploy.yml](../.github/workflows/vercel-deploy.yml):** **Sync Vercel env** pushes the variables in the table above to Vercel and redeploys. **Vercel deploy** only updates **`NEXT_PUBLIC_APP_VERSION`** and redeploys—use it on every **release tag** (or manually) so production shows the correct version.

## 4. Troubleshooting: Vercel shows old version

If production or staging shows an old version after you released or pushed to `develop`:

1. **Production branch** – Vercel → **Settings → Git**. Ensure **Production Branch** is `main`. With [vercel.json](../vercel.json), production does not deploy on every `main` push; trigger a build via your **Deploy Hook** ([§2.4](#24-production-deploy-hook-and-vercel-deploy-workflow)) or **Redeploy** the latest production deployment.
2. **Which URL you’re opening** – Confirm you’re on the right URL. Production domain goes to the latest **production** deployment; preview URLs (e.g. `…-git-develop-….vercel.app`) are tied to a specific branch/commit. If you use a custom staging domain, check **Settings → Domains** and confirm which branch it’s assigned to.
3. **Builds failing** – In Vercel → **Deployments**, check the latest deployment for your branch. If it’s **Failed**, fix the build (e.g. env vars, Node version, `npm run build` locally). Only successful builds update the live site.
4. **Redeploy** – **Deployments** → open the latest production deployment → **⋯** → **Redeploy**, or run **Actions → Vercel deploy** / POST the Deploy Hook again.
5. **Cache** – Try a hard refresh (e.g. Ctrl+Shift+R / Cmd+Shift+R) or an incognito window to rule out browser cache.
6. **Git connection** – **Settings → Git** should show the correct repository. If you renamed the repo or moved it, re-import the project or reconnect the Git integration.

## 5. Summary

- **Deploy**: Push to `develop` → staging (Git). **Production**: [Deploy Hook](https://vercel.com/docs/deploy-hooks) on branch `main`, triggered by [vercel-deploy.yml](../.github/workflows/vercel-deploy.yml) after a **release tag** `vX.Y.Z` (or manual run)—see [§2.4](#24-production-deploy-hook-and-vercel-deploy-workflow). [vercel.json](../vercel.json) disables automatic production Git deploys from `main` so hooks control prod builds.
- **Domains**: **Settings → Domains**; assign production domain to production, staging domain to branch `develop`.
- **Env vars**: **Settings → Environment Variables**; use Production for prod, Preview for staging and PR previews. Sync from GitHub via [sync-vercel-env.yml](../.github/workflows/sync-vercel-env.yml).
- **Releases**: Bump `package.json`, tag `vX.Y.Z` on that commit, push the tag → **Vercel deploy** sets `NEXT_PUBLIC_APP_VERSION` and triggers production. See [VERSIONING.md](VERSIONING.md).
- **Old version showing**: See [§4 Troubleshooting](#4-troubleshooting-vercel-shows-old-version).
