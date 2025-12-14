This directory contains CI workflows related to deployment.

deploy-vercel.yml
- Builds the project using Node 20 and `npm run build` (root) which creates `dist/`.
- Deploys the content of `dist/` to Vercel using the Vercel CLI.

Secrets required:
- `VERCEL_TOKEN` — Vercel personal token (required). Add it in the GitHub repository Settings → Secrets.

Optional:
- `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` — if you prefer to run a specific project context. The `vercel` CLI can also autodetect the project configuration.

To trigger a manual deploy from the Actions tab, open the "Deploy to Vercel" workflow and click "Run workflow".

More: Use either the CLI approach (current workflow) or the Vercel GitHub action if you want to provide explicit org/project IDs.

Status: Vercel CI Disabled
---------------------------------

We have temporarily disabled all Vercel-related workflows (deploy/debug) to pause automatic and manual Vercel activity while we investigate deployment issues. The workflows have been archived to `.github/disabled-workflows/` and will not run. To re-enable, review the archived copy and restore the workflow to `.github/workflows/` (or remove the `if: false` guard after confirming it's safe).

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
npx http-server dist -p 3000 -c-1 &

# Run the specific test
BASE_URL=http://localhost:3000 PLAYWRIGHT_SKIP_ADMIN_WEB_SERVER=true npm run test:e2e -- tests/homepage.spec.js -g "Homepage smoke tests"
```

