Hostinger Deployment Configuration
================================

This document summarizes the recommended Hostinger Deploy settings for the main site. The repository's build scripts are configured to run from the repo root; this is the simplest setup for Hostinger's Git integration.

Main site (root domain)
-----------------------
- Deploy folder (what Hostinger runs the build from): `/` (root)
- Build command: `npm install && npm run build`
- Output folder (what Hostinger publishes): `dist`
- Node version: Choose Node 18 (LTS) in Hostinger if available to match `.nvmrc` and `package.json` engines
- Environment variables: Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Hostinger site settings if your site needs Supabase. Hostinger will inject these values when running the build command.
- Stripe: For server-side Stripe usage (e.g. webhook server), set the server-side secrets in Hostinger or your webhook host environment (do NOT commit these to the repo):
	 - `STRIPE_SECRET_KEY` — your live Stripe secret key (sk_live_...)
	 - `STRIPE_WEBHOOK_SECRET` — the signing secret for Stripe webhooks (whsec_...)
	 - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — publishable key for client-side Stripe uses (pk_live_...)
	 These can be configured under the Hostinger 'Environment Variables' or 'Node.js' app settings for the site. Make sure `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` are only accessible to the server process (do not embed them into a client-side build).

### Admin subdomain (legacy)
The Next.js admin app has been removed from the repository. There is no longer an admin build to deploy from this repository. If you need to reintroduce an admin dashboard in the future, create a dedicated admin project or a new repository and follow Hostinger (or Vercel) docs for publishing a static admin build.

Notes and examples
- If your Hostinger 'Deploy folder' must point to a directory with a `package.json` (some hosters require it), keep `Deploy folder` set to `/` and use the 'Build command' described above since the admin build commands expect to run from the repo root.
 - The `admin-build` folder was an output folder used for admin publish steps; it is no longer produced by this repository. If you manage a separate admin repository, handle its deploy settings independently.
 - The `prepare-hostinger-admin-build.js` script is deprecated and now prints a deprecation notice; it previously copied a built admin into `admin-build/dist` for specialized Hostinger deploy setups.

GitHub Actions and secrets
--------------------------
- If you set up the `.github/workflows/hostinger-deploy.yml` workflow, add the appropriate secrets to your GitHub repository under Settings → Secrets → Actions.
 - This repo includes a ready-to-use GitHub Action at `.github/workflows/hostinger-deploy-main.yml` that builds, tests, and deploys the main `dist/` site to Hostinger (it will use SSH/SFTP when `HOSTINGER_SSH_PRIVATE_KEY` is present, otherwise it falls back to FTP). Add the secrets listed below to enable automated deploys from CI.

Triggering a manual deploy from the command line
-----------------------------------------------
You can trigger the deploy from your machine using the GitHub CLI (`gh`) once you've added the secrets to the repository:

```bash
# Trigger a manual deploy and pass a preview URL to verify against (optional)
gh workflow run hostinger-deploy-main.yml --ref main --field site_url=https://littlespaceworld.com
```

Or open the repository → Actions → "Build, Test, and Deploy to Hostinger (main only)" and click "Run workflow" and optionally supply `site_url`.

If a step fails, check the job logs and the `dist-listing` artifact (uploaded by the workflow) to validate the files that were built. The workflow will also report whether SSH or FTP secrets were used.

Secret report artifact
----------------------
The workflow now uploads a small `secrets-report` artifact that lists which deployment/build-related secrets are present or missing. If you see missing entries there, add the corresponding secrets in the GitHub repo settings (Settings → Secrets & variables → Actions) and re-run the workflow.
 - If you set up the `.github/workflows/hostinger-deploy.yml` workflow, add the appropriate secrets to your GitHub repository under Settings → Secrets → Actions. To automate runtime env updates via our script in CI, add the following secrets too:
	 - `HOSTINGER_API_TOKEN` — API token with permission to update site settings (optional if using SFTP/SSH).
 	 - `HOSTINGER_SITE_ID` — the internal site identifier in Hostinger for your site (use the main site ID for automations).
	- Add the Stripe secrets to GitHub repo secrets as well (for CI):
		- `STRIPE_SECRET_KEY` — used by server-side test steps (Playwright or test webhook server)
		- `STRIPE_WEBHOOK_SECRET` — used for verifying webhook signatures in CI tests
		- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — build-time client key to embed in the front-end
- Preferred method is SFTP (SSH): `HOSTINGER_SSH_HOST`, `HOSTINGER_SSH_USERNAME`, `HOSTINGER_SSH_PRIVATE_KEY` (private key value). Set `HOSTINGER_SSH_PORT` if needed.
- Fallback is FTP: `HOSTINGER_FTP_HOST`, `HOSTINGER_FTP_USERNAME`, `HOSTINGER_FTP_PASSWORD` (and optionally `HOSTINGER_FTP_PORT`).
- You can configure the GitHub secret `HOSTINGER_SITE_URL` to enable a basic post-deploy verification step (curl the site's URL).

Apply Supabase migrations via CI
--------------------------------
- This workflow also supports applying SQL migrations stored under `supabase/migrations/` using a secure `SUPABASE_DB_URL` secret.
- Add the `SUPABASE_DB_URL` secret to GitHub Actions for the project (value should be a PostgreSQL connection string, e.g. `postgresql://postgres:password@db.host:5432/postgres`). The workflow uses `psql` in CI to apply SQL files in alphabetical order.

Local migration via supabase CLI
--------------------------------
The repo also includes a helper script `scripts/apply-supabase-migrations.sh` that will attempt to run:
 - `supabase db push` when `SUPABASE_TOKEN` & `SUPABASE_PROJECT_REF` are set
 - or `psql` against your `SUPABASE_DB_URL` otherwise

This is safer than directly calling the SQL files in some environments as it attempts to use the Supabase migration flow when available.

VPS / Webhook deploy (optional)
--------------------------------
- If you want the webhook server (the `server/webhook.js` Express app) to be deployed to a small VPS, add the following secrets to your repository:
	- `WEBHOOK_SSH_HOST` — host (IP or domain) of the VPS
	- `WEBHOOK_SSH_USER` — username for SSH (e.g. ubuntu)
	- `WEBHOOK_SSH_PRIVATE_KEY` — the private key that can connect to the VPS (no passphrase recommended for CI)
	- `WEBHOOK_DEST_DIR` — deploy destination directory on the VPS (e.g. `/var/www/webhook`)
- The workflow will copy the `server/` folder via rsync and attempt to restart the webhook using `pm2` when available; otherwise it falls back to starting via `nohup`.


Recommended GitHub settings
---------------------------
- Protect the `main` branch and require the 'Build and Test' workflow (or the Playwright checks) to pass before merging. This prevents the main branch from receiving a broken build.
- Optionally require reviews or approvals for production deploys.

Troubleshooting
- Build fails on Hostinger with `npm` errors: set Node 18 in site settings; if Hostinger does not allow Node 18, use a GitHub Actions-based build to produce `dist` and upload via FTP.
- Build succeeds but assets 404: make sure the Build command is correct and Hostinger's Output folder is set to `dist` (for the main site). Admin build outputs are legacy and not applicable to this repository.
- CSP blocking Supabase requests: ensure `VITE_SUPABASE_URL` is set in Hostinger environment variables so the build includes the Supabase origin in meta and `.htaccess` CSP.


Quick local deploy & verification
---------------------------------
If you want to quickly publish the current local build to the `public_html/` folder and verify assets, run from the repo root:

```bash
# Build, copy dist -> public_html, then verify that every asset referenced by public_html/index.html exists
npm run deploy:hostinger
```

After this completes, the site is ready to be served from `public_html/`. You can preview it locally with a simple static server (Python, http-server, or `npx serve`) and run the Playwright smoke test against your preview URL.

Troubleshooting: assets 404
---------------------------
If the published site loads `index.html` but assets (under `/assets/`) 404, the most common causes are:

- The build output wasn't copied into `public_html/` (run `npm run deploy:hostinger` to republish).
- Hostinger's 'Output folder' setting is not pointed at `dist` (if you let Hostinger build during deployment).
- A CDN, proxy, or SSO protection is blocking public GETs to assets. In this case run the Playwright smoke test with a bypass token or test against a preview URL.

The `scripts/verify-public-html-assets.sh` script will detect missing files referenced directly from `public_html/index.html` and return a non-zero exit status; use this script within CI or locally to fail fast.

Using the Hostinger API (script)
--------------------------------
If you want to automatically update Hostinger environment variables via an API, this repository includes a helper script: `scripts/set-hostinger-env.js`.

Usage example (recommended):

1. Create an API token in Hostinger (if available in your account) or get the token from your Hostinger support/admin console.
2. Confirm you have the site id for the site you want to update (Hostinger's Deploy or site list may include siteId). Use the main site id when updating main site settings.
3. Run the script (replace placeholders):

```bash
export HOSTINGER_API_TOKEN="<your-token>"
node scripts/set-hostinger-env.js --site 12345 --token "$HOSTINGER_API_TOKEN" --vars "STRIPE_SECRET_KEY=sk_... ,STRIPE_WEBHOOK_SECRET=whsec_... ,NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_..." --api-url https://api.hostinger.com/v1/sites/12345/env --method PATCH
```

Notes:
- If the Hostinger API endpoint differs, pass the exact `--api-url` to the script.
- The script attempts several common JSON payload shapes; if one fails, try sending a `--dry-run` to inspect the payloads and then provide `--api-url` + `--method` to match your API.
- Always mask or rotate secrets if they are inadvertently exposed.
