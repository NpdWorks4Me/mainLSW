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
