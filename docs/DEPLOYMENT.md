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

| Environment | Branch   | Deploys when      | URL example              |
|-------------|----------|-------------------|--------------------------|
| Production  | `main`   | Push/merge to main| `app.audiometa.com`      |
| Staging     | `develop`| Push to develop   | `staging.audiometa.com` or preview URL |
| PR previews | any      | Open PR           | `…-git-branch-…vercel.app` |

## 3. Environment variables

1. **Settings → Environment Variables**.
2. For each variable, choose:
   - **Production** – only for production deployments (branch `main`).
   - **Preview** – for all non-production deployments (staging, PR previews). Use this for staging.
   - **Development** – for `vercel dev` (local).

Recommended:

- **Production**: `NEXT_PUBLIC_APP_URL` = production URL (e.g. `https://app.audiometa.com`), `NEXT_PUBLIC_API_URL` = production API, production API keys.
- **Preview**: `NEXT_PUBLIC_APP_URL` = staging URL (e.g. `https://staging.audiometa.com`), `NEXT_PUBLIC_API_URL` = staging API, staging API keys.

Save after editing; redeploy if needed for changes to apply.

## 4. Summary

- **Deploy**: Push to `develop` → staging; push/merge to `main` → production. Vercel builds and deploys automatically via Git.
- **Domains**: **Settings → Domains**; assign production domain to production, staging domain to branch `develop`.
- **Env vars**: **Settings → Environment Variables**; use Production for prod, Preview for staging and PR previews.
- **Releases**: Tagging (e.g. `v0.2.0`) is independent; see [VERSIONING.md](VERSIONING.md). Vercel does not deploy on tag push; it deploys on branch push.
