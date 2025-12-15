# CI Workflows

This directory contains CI workflow documentation and archived workflows.

- Vercel-related workflows (deploy/vercel-debug) have been archived and disabled in `.github/disabled-workflows/`.
- Hostinger deploy workflows are the active path for production deploys.

> Status: Vercel CI Disabled / Deprecated — archives retained for reference. Prefer the Hostinger deploy workflow in `.github/workflows/hostinger-deploy.yml` and the Hostinger runbooks in `HOSTINGER_DEPLOY.md`.

Secrets required:
- `VERCEL_TOKEN` — Vercel personal token (required). Add it in the GitHub repository Settings → Secrets.

Optional:
- `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` — if you prefer to run a specific project context. The `vercel` CLI can also autodetect the project configuration.

To trigger a manual deploy from the Actions tab, open the "Deploy to Vercel" workflow and click "Run workflow".

More: Use either the CLI approach (current workflow) or the Vercel GitHub action if you want to provide explicit org/project IDs.

Playwright smoke tests
----------------------

After a successful asset verification, the `deploy-vercel.yml` workflow now runs a focused Playwright "Homepage smoke test" which:

- Verifies the starry background and header/logo are visible in a real browser.
- Confirms the `/assets/*` files referenced in `index.html` respond with HTTP 200.

If the Playwright test fails the workflow will fail and print diagnostic output. To run the test locally:

```bash
# Install dev deps and browsers once
npm ci
npx playwright install --with-deps

# Start a preview server (or serve `dist/`)
# Use an SPA-capable server so client-side routes (e.g. /store) fall back to index.html
npx serve -s dist -l 3000 &

# Run the specific test
BASE_URL=http://localhost:3000 PLAYWRIGHT_SKIP_ADMIN_WEB_SERVER=true npm run test:e2e -- tests/homepage.spec.js -g "Homepage smoke tests"
```

