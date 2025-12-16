# DEPRECATED: Vercel deployment runbook

> NOTE: Vercel deployments and related CI workflows have been deprecated for this repository and archived to `.github/disabled-workflows/`.
> The site is now deployed to Hostinger (see `HOSTINGER_DEPLOY.md`) and the Admin (Next.js) app was removed from this repo.

This doc is retained for historical reference only. If you must re-enable or reconfigure Vercel deploys in the future, review the archived workflows in `.github/disabled-workflows/` and proceed cautiously.

---

Status
------

- **Status:** Vercel CI deprecated and archived. Prefer the Hostinger-based deploy flow described in `HOSTINGER_DEPLOY.md`.

Purpose

This doc explains how the GitHub Actions deploy flow works for this repository, what secrets are required, how to find the canonical Vercel project id, and how to configure SSO verification for CI.

Quick summary

- CI prefers to deploy with the Vercel Action using the canonical Vercel project id (the `prj_...` id).
- The workflow writes a `dist/vercel.json` during build to force a static deployment (so Vercel will not attempt a remote Next.js build).
- The smoke-test verifies the deployed site by doing a public GET. If the project is SSO-protected, CI will attempt a GET using the SSO bypass token (secret `VERCEL_SSO_BYPASS_TOKEN`).

Temporary status: Vercel workflows paused
-----------------------------------------

All Vercel-related workflows have been temporarily disabled (archived to `.github/disabled-workflows/`) while we diagnose the issue where index.html references hashed assets that are not present on deployed artifacts. This runbook remains for reference if you later want to re-enable or reconfigure Vercel deploys.
 - After the smoke-test the workflow now also verifies that all assets referenced from the deployed `index.html` (scripts, styles, service worker, favicon, manifest, etc.) are reachable (HTTP 200). If any referenced asset returns non-200 the workflow will fail. This guards against deployments where `index.html` is present but the built assets were not uploaded or are missing on the deployment (the most common cause of a blank page).

Recommendations:
- Prefer uploading a prebuilt deployment (CI should use `vercel deploy --prebuilt --cwd dist`) so the exact build outputs (hashed assets) are uploaded by CI rather than relying on a remote Vercel build. This reduces mismatches between index.html and available assets.
- If you see asset 404s after deploy, the asset verification step will fail the job and print the missing paths; re-deploy using the prebuilt path or investigate remote build logs in the Vercel dashboard.

Playwright smoke test
---------------------

After asset verification passes, the deploy workflow runs a focused Playwright "Homepage smoke test" that verifies the starry background and header/logo render in a real browser and that the primary assets are served. If this fails the workflow will fail and print helpful diagnostic output. If your project is SSO-protected ensure `VERCEL_SSO_BYPASS_TOKEN` is set so CI can validate the public pages directly.

Note about Vercel Live / Preview Feedback script:
- You may notice a small injected script tag like `<script src="https://vercel.live/_next-live/feedback/feedback.js" data-deployment-id="dpl_..."></script>` in deployments. This is Vercel's "Live / Feedback" feature that can be enabled at the project level and injects a feedback widget into preview/production pages. It's benign and unrelated to asset 404s, but if you'd prefer not to have it injected, disable the Live/Feedback toggle in the Vercel project settings.
- For safety the workflow will fail if SSO is detected (HTTP 401) and no `VERCEL_SSO_BYPASS_TOKEN` is present. If desired, you may set `ALLOW_READYSTATE_FALLBACK=true` as a repository secret to allow using the Vercel API "READY" state as a fallback success signal (less strict).

Required repository secrets

- `VERCEL_TOKEN` - a Vercel token with access to the project/org.
- `VERCEL_ORG_ID` - the Vercel team/org id (when applicable).
- `VERCEL_PROJECT_ID` - the canonical project id (format `prj_...`). Do NOT use the project slug.

Optional secrets

- `VERCEL_SSO_BYPASS_TOKEN` - an SSO bypass token generated in the Vercel console (useful if your project is protected by SSO and you want CI to validate the page content).
- `ALLOW_READYSTATE_FALLBACK` - set to `true` (string) if you want to allow the workflow to treat the Vercel API `latestDeployments[0].readyState === 'READY'` as a success when SSO prevents public GETs and you don't have a bypass token.

Why use the canonical project id?

The Vercel Action requires the canonical `prj_...` id for deterministic programmatic deploys. The project slug (e.g. `my-project-123`) is not accepted by the Action in all cases and can result in "project not found" errors. Find the canonical id with one of these approaches.

Finding canonical `prj_...` id

1) Use the `Vercel Debug` workflow in `.github/workflows/vercel-debug.yml` (recommended)
   - Open Actions → run `Vercel Debug` workflow (workflow_dispatch) for the repo.
   - The workflow queries the Vercel API and prints a compact list of projects with `id`, `name`, and `aliases` so you can find the `prj_...` id for the project you want.

2) Use the API directly
   - curl -H "Authorization: Bearer $VERCEL_TOKEN" "https://api.vercel.com/v1/projects?teamId=$VERCEL_ORG_ID"
   - Look for the object with the project name and use its `.id` value (the one that starts with `prj_`).

SSO and CI verification

- If a public GET to the deployed URL returns `401`, the workflow treats this as SSO-protection.
- If `VERCEL_SSO_BYPASS_TOKEN` is present, CI will retry the GET using that token; if it returns `200`, the smoke-test passes.
- If SSO is detected and `VERCEL_SSO_BYPASS_TOKEN` is missing, the workflow will fail early and instruct you to add the bypass token to repository secrets.
- If SSO-bypass GET fails but the Vercel API `latestDeployments[0].readyState === 'READY'`, CI will treat the deployment as "ready" and pass the job but will print an advisory message telling you to verify the bypass token.
- To allow the workflow to treat `READY` as success even when no bypass token exists, set the repository secret `ALLOW_READYSTATE_FALLBACK=true` (less strict, not recommended for secure setups).

Notes and maintenance

- The Vercel Action uses the `zeit-token` input for backward compatibility; it is still populated by the workflow to avoid breaking changes with the current Action release. When the action drops this requirement we should remove the redundant `zeit-token` input from the workflow.
- The action previously used `continue-on-error` for convenience; the workflow now fails fast when the Action misconfigures or lacks access so issues are visible and addressed quickly.

Contact

If you want changes to the verification strategy (for example, always accept `READY` as success or always require a bypass token), tell me which policy to adopt and I will update `.github/workflows/deploy-vercel.yml` accordingly.
