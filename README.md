# Little Space World - Deployment Guide
![CI](https://github.com/NpdWorks4Me/little/actions/workflows/hostinger-deploy.yml/badge.svg)

This repository contains the main site. This README provides quick steps to:
- Push the repo to GitHub
- Configure Hostinger for automatic pulls and builds for the main site

## Create a GitHub repository and push your project
1. Follow GitHub to create a new empty repository under your GitHub account (e.g. `little-space-world`).
2. Setup the project locally (replace remote-url below with the GitHub repo URL):

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your_username>/<repo>.git
git push -u origin main
```

## Hostinger deployment (main site)
1. In Hostinger hPanel → Websites → littlespaceworld.com → Deployments
2. Click **Connect Git** → Choose **GitHub** → Authorize Hostinger → select your repository → choose branch **main**
3. Set options:
   - Deploy folder: `/` (root)
   - Build command: `npm install && npm run build`
   - Output folder: `dist`
4. Save. Hostinger will pull from GitHub on push and run the build command → Output folder `dist` will be published.

If you prefer Hostinger to build directly from GitHub (recommended), choose the 'Connect Git' workflow in Hostinger's panel and set the Build command (the default recommended below). Hostinger will automatically build and publish on push.

Vercel deployments
------------------
This repository also contains GitHub Actions workflows to deploy to Vercel. See `docs/vercel-deploy.md` for details on the Vercel Action, required secrets, and SSO/bypass-token configuration.

Hostinger Build (direct Git):
 - Build command: npm install && npm run build
 - Output folder: dist
 - Node version: 18 (set via Site Preferences if available)
 - Environment variables: Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the Hostinger panel

If you already use the GitHub Action in `.github/workflows/hostinger-deploy.yml`, you can either have GitHub deploy via SFTP using the action (requires secrets) or keep Hostinger's Git connected deploy; pick one to avoid duplicate deployments.

Optional: Protect branch and require CI checks
-------------------------------------------
We recommend setting up branch protection rules on `main` and requiring the 'Build and Test' workflow (or an equivalent E2E workflow) to pass before merging changes. This avoids deploying broken builds to Hostinger.

Add GitHub repository secrets (recommended)
-----------------------------------------
We recommend adding the following secrets to your repository (Settings → Secrets & variables → Actions):
- SUPABASE_URL
- SUPABASE_ANON_KEY (optional)
- SUPABASE_SERVICE_ROLE_KEY (optional; for CI to provision a test user)
 - SUPABASE_DB_URL (optional; use to apply SQL migrations in the CI workflow)
 - SUPABASE_TOKEN and SUPABASE_PROJECT_REF (optional; for supabase CLI deployments)
<!-- Removed admin E2E test secrets -->
- HOSTINGER_SSH_HOST (if you use SFTP)
- HOSTINGER_SSH_USERNAME
- HOSTINGER_SSH_PRIVATE_KEY
- HOSTINGER_SSH_PORT (optional)
- HOSTINGER_FTP_HOST (fallback)
- HOSTINGER_FTP_USERNAME
- HOSTINGER_FTP_PASSWORD
- HOSTINGER_FTP_PORT (optional)
 - HOSTINGER_TARGET_DIR_MAIN (default: public_html)
Use the helper script to add secrets with the GitHub CLI:

```bash
# 'gh' must be installed and you must be logged in (gh auth login)
gh auth status
# Run the script; replace '<owner/repo>' if not using remote origin
npm run set:github-secrets -- <owner/repo>
```

The script will prompt for values for the listed secrets and call `gh secret set` for each value you provide. You can also set them manually in the GitHub UI if you prefer.

If you prefer a short mapping, see `HOSTINGER_DEPLOY.md` for a concise reference to main deployment options and recommended settings.

Deploy webhook server to VPS
---------------------------
If you host a small VPS and want to deploy the `server/webhook.js` Node app there and run it via systemd, there are helper scripts included:

- `scripts/deploy-webhook-systemd.sh` — rsyncs the `server/` folder to the remote host and configures a `webhook.service` (see `deploy/webhook.service` template). Usage:
   ```bash
      STRIPE_SECRET_KEY=sk_live_... SUPABASE_URL=https://xxx.supabase.co SUPABASE_SERVICE_ROLE_KEY=... ./scripts/deploy-webhook-systemd.sh <ssh_user> <ssh_host> <dest_dir> [service_user]
      # e.g. STRIPE_SECRET_KEY=sk_live_... SUPABASE_URL=https://xxx.supabase.co SUPABASE_SERVICE_ROLE_KEY=... ./scripts/deploy-webhook-systemd.sh ubuntu 1.2.3.4 /var/www/webhook webhook
   ```

- The systemd unit template is `deploy/webhook.service`. The script copies it and populates `WorkingDirectory` and `User` with passed values and enables the service using `sudo`.

If you don't want systemd, use `server/pm2-webhook-start.sh` to control the webhook using `pm2` instead.

<!-- Admin UI and related hosting guidance removed from this repository. If you require an admin UI again, consider creating a dedicated repository for it. -->

## Quick commands summary
```bash
# Build main site (outputs to dist)
npm run build

# Run dev for main site
npm run dev

# Manual deploy (copy dist to public_html)
npm run deploy:main

# Quick Hostinger publish+verify (build, copy to public_html, verify assets)
npm run deploy:hostinger

# Serve public_html locally on :3000
npm run preview:public
```

Note: If you are previewing the main site's built `dist` folder and want to test direct navigation to nested routes such as `/games/snake`, run a static server that supports SPA fallback (rewriting unknown routes to `index.html`). `python -m http.server` does not do this and will return 404 for nested routes. Use either `vite preview` or `npx serve -s dist` (or the new `npm run preview:spa`) to validate direct navigation to nested routes.

## Checklist before pushing to GitHub
- Ensure any sensitive keys (Supabase service role keys, etc.) are not committed in `.env` files
 - Add any build files you want to keep to `.gitignore` (this repo excludes `dist*` by default)
 - If your site interacts with Supabase, configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables in the Hostinger panel.
 - Run `npm run check:env` locally to validate that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are available for local builds. Hostinger will also read environment variables supplied in the panel during the build.

## Troubleshooting common Hostinger build issues
- If Hostinger build fails with `node`/`npm` errors, check the Node version in Hostinger's Site settings and set it to Node 18 to match the repo's `.nvmrc` and `package.json` engines.
 - If Hostinger fails to find the build output because the Build command doesn't produce the correct output folder, confirm your Build command produces `dist` (for the main site) and update the Hostinger 'Output folder' to `dist`.
- If your build runs out of memory or times out on Hostinger, consider building via GitHub Actions to a static bucket and then sync to Hostinger, or build and upload via SFTP (Hostinger also provides SFTP/FTP upload).
- If CSP blocks API calls (Supabase) in production, ensure `VITE_SUPABASE_URL` is set in Hostinger environment variables; the deploy script includes the Supabase origin in the CSP if configured.

## GitHub Actions automated deploy to Hostinger (optional)
If you want CI to build the site and push artifacts to Hostinger automatically, add the following secrets in your GitHub repository settings (Settings → Secrets → Actions):

- `HOSTINGER_SSH_HOST` — Hostname for SFTP (server) if using SSH key
- `HOSTINGER_SSH_USERNAME` — Username for SFTP if using SSH key
- `HOSTINGER_SSH_PRIVATE_KEY` — Private key content for SSH upload (use only for SSH-based deploys)
- `HOSTINGER_SSH_PORT` — Optional; defaults to 22
- `HOSTINGER_FTP_HOST` — Hostinger FTP host (used for non-SFTP deploys)
- `HOSTINGER_FTP_USERNAME` — FTP username
- `HOSTINGER_FTP_PASSWORD` — FTP password
- `HOSTINGER_FTP_PORT` — Optional; default 21
 - `HOSTINGER_TARGET_DIR_MAIN` — Optional; default `public_html`
 - `WEBHOOK_SSH_HOST` — Optional; host for webhook server SSH deploy
 - `WEBHOOK_SSH_USER` — Optional; user for webhook server SSH deploy
 - `WEBHOOK_SSH_PRIVATE_KEY` — Optional; private key to SSH to webhook server for deploy
 - `WEBHOOK_DEST_DIR` — Optional; destination path on webhook server to deploy webhook app
- `HOSTINGER_SITE_URL` — Optional; used by the workflow to test the site after deploy
- `VITE_SUPABASE_URL` — Build-time env for creating proper CSP and runtime API origin
 - `VITE_SUPABASE_ANON_KEY` — Optional; used during build

We added a workflow `.github/workflows/hostinger-deploy.yml` that attempts SFTP upload if `HOSTINGER_SSH_PRIVATE_KEY` is present, otherwise uses FTP (via lftp) as a fallback.

*** End Patch

<!-- Admin build automation suggestion removed: admin UI has been deleted from this repository. -->
