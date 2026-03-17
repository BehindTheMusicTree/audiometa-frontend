# Vercel deployment (staging and production)

This guide covers deploying the app to Vercel with **develop → staging** and **main → production**. Branch flow matches [CONTRIBUTING.md](../CONTRIBUTING.md) and [.github/workflows/validate.yml](../.github/workflows/validate.yml).

## 1. Connect the repo to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (e.g. with GitHub).
2. **Add New… → Project** and import your `audiometa-frontend` repository.
3. Leave framework preset as **Next.js** and root directory as **./**.
4. Deploy. The first deployment will use your default branch.

After this, configure production and staging as below so that **main** deploys to production and **develop** to staging.

## 2. Vercel project configuration

### 2.1 Production branch

1. Open the project on Vercel → **Settings**.
2. In the left sidebar, go to **Environments** (or **Git** → production branch, depending on UI).
3. Set **Production Branch** to `main`. Save.
4. Every push (or merge) to `main` will trigger a **Production** deployment and update your production domain.

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

Result:

| Environment | Branch    | Deploys when       | URL example                            |
| ----------- | --------- | ------------------ | -------------------------------------- |
| Production  | `main`    | Push/merge to main | `app.audiometa.com`                    |
| Staging     | `develop` | Push to develop    | `staging.audiometa.com` or preview URL |
| PR previews | any       | Open PR            | `…-git-branch-…vercel.app`             |

## 3. Environment variables

For **local** runs (`npm run dev`, `npm run launch`): copy `.env.example` to `.env` and set every variable listed there. The build fails if any required env var is missing (see `requiredEnv` in next.config.ts).

On **Vercel**:

1. **Settings → Environment Variables**.
2. For each variable, choose:
   - **Production** – only for production deployments (branch `main`).
   - **Preview** – for all non-production deployments (staging, PR previews). Use this for staging.
   - **Development** – for `vercel dev` (local).

Recommended:

- **Production**: `NEXT_PUBLIC_APP_URL` = production URL (e.g. `https://app.audiometa.com`), `NEXT_PUBLIC_API_URL` = production API, production API keys.
- **Preview**: `NEXT_PUBLIC_APP_URL` = staging URL (e.g. `https://staging.audiometa.com`), `NEXT_PUBLIC_API_URL` = staging API, staging API keys.

Save after editing; redeploy if needed for changes to apply.

### 3.1 Automating env vars

You can push environment variables to Vercel from GitHub Actions so they stay in sync with GitHub Secrets.

Use the workflow [`.github/workflows/sync-vercel-env.yml`](../.github/workflows/sync-vercel-env.yml). It runs manually (**Actions → Sync Vercel env → Run workflow**) and syncs variables from GitHub Secrets to Vercel using the [Vercel REST API](https://vercel.com/docs/rest-api/reference/endpoints/projects/create-one-or-more-environment-variables).

**Required** GitHub Secrets:

- `VERCEL_TOKEN` – [Vercel token](https://vercel.com/account/tokens) with access to the project.
- `VERCEL_PROJECT_ID` – Project id or name (e.g. `audiometa-frontend`).

**How to get them**

- **VERCEL_TOKEN**: Go to [vercel.com/account/tokens](https://vercel.com/account/tokens), click **Create Token**, give it a name (e.g. “GitHub Actions env sync”), and optionally limit it to the project. Copy the token once (it is shown only once) and store it as a GitHub secret.
- **VERCEL_PROJECT_ID**: Open your project on Vercel → **Settings** → **General**. The **Project ID** is in the “Project ID” or “Project Name” field (you can use either the id or the project name, e.g. `audiometa-frontend`). For a team project, use the project name/slug as shown in the project URL.

**How the sync works:** The workflow has two jobs. Each job runs in a **GitHub Environment** (production or staging), so it sees that environment’s variables. It syncs only to the matching Vercel target.

| Source | → Vercel env |
|--------|----------------|
| **Repo variables** (Settings → Secrets and variables → Actions → Variables) – same value for both targets: |
| `CONTACT_EMAIL` | `NEXT_PUBLIC_CONTACT_EMAIL` |
| `MASTODON_URL` | `NEXT_PUBLIC_MASTODON_URL` |
| `DEVELOPER_GITHUB_URL` | `NEXT_PUBLIC_GITHUB_URL` |
| `LINKEDIN_URL` | `NEXT_PUBLIC_LINKEDIN_URL` |
| `DEVELOPER` | `NEXT_PUBLIC_DEVELOPER` |
| `AUDIOMETA_DOCS_BUNDLE_URL` | `NEXT_PUBLIC_DOCS_BUNDLE_URL` |
| `BTMT_GITHUB_LINK` | `NEXT_PUBLIC_BTMT_GITHUB_LINK` |
| **GitHub Environment variables** (Settings → Environments → production / staging) – can differ per environment: |
| `BACKEND_BASE_URL` (in production env) | `NEXT_PUBLIC_BACKEND_BASE_URL` on Vercel **production** |
| `BACKEND_BASE_URL` (in staging env) | `NEXT_PUBLIC_BACKEND_BASE_URL` on Vercel **preview** |

So e.g. Production can use `https://hear-api.themusictree.org/` and Staging `https://hear-api-test.themusictree.org/` by setting `BACKEND_BASE_URL` in each GitHub Environment.

The workflow uses `upsert` so it creates or updates each variable. After it runs, trigger a redeploy in Vercel if you want the new values on the next build.

## 4. Troubleshooting: Vercel shows old version

If production or staging shows an old version after you pushed to `main` or `develop`:

1. **Production branch** – Vercel → Project → **Settings → Git**. Ensure **Production Branch** is `main`. If it is `master` or something else, change it to `main` and save; the next push to `main` will deploy to production.
2. **Which URL you’re opening** – Confirm you’re on the right URL. Production domain goes to the latest `main` deployment; preview URLs (e.g. `…-git-develop-….vercel.app`) are tied to a specific branch/commit. If you use a custom staging domain, check **Settings → Domains** and confirm which branch it’s assigned to.
3. **Builds failing** – In Vercel → **Deployments**, check the latest deployment for your branch. If it’s **Failed**, fix the build (e.g. env vars, Node version, `npm run build` locally). Only successful builds update the live site.
4. **Redeploy** – **Deployments** → open the latest deployment for `main` (or your branch) → **⋯** → **Redeploy** to force a fresh build from the same commit.
5. **Cache** – Try a hard refresh (e.g. Ctrl+Shift+R / Cmd+Shift+R) or an incognito window to rule out browser cache.
6. **Git connection** – **Settings → Git** should show the correct repository. If you renamed the repo or moved it, re-import the project or reconnect the Git integration.

## 5. Summary

- **Deploy**: Push to `develop` → staging; push/merge to `main` → production. Vercel builds and deploys automatically via Git.
- **Domains**: **Settings → Domains**; assign production domain to production, staging domain to branch `develop`.
- **Env vars**: **Settings → Environment Variables**; use Production for prod, Preview for staging and PR previews.
- **Releases**: Tagging (e.g. `v0.2.0`) is independent; see [VERSIONING.md](VERSIONING.md). Vercel does not deploy on tag push; it deploys on branch push.
- **Old version showing**: See [§4 Troubleshooting](#4-troubleshooting-vercel-shows-old-version).
