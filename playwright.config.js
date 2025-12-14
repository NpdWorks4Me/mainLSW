// Playwright config for admin E2E smoke test (ESM)
import { devices } from '@playwright/test';
export default {
  testDir: 'tests',
  timeout: 120 * 1000,
  expect: { timeout: 10 * 1000 },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    actionTimeout: 30 * 1000,
    navigationTimeout: 60 * 1000,
    baseURL: process.env.ADMIN_URL || 'http://localhost:3001',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // The admin test suite builds & previews the admin dist automatically via the
  // webServer setting. For local main-site testing we frequently prefer to start
  // the preview server manually (or use the main preview), so allow skipping the
  // admin webServer by setting PLAYWRIGHT_SKIP_ADMIN_WEB_SERVER=true in the
  // environment. When skipped, reuseExistingServer=true lets tests use an already
  // running preview on the expected port(s).
  webServer: process.env.PLAYWRIGHT_SKIP_ADMIN_WEB_SERVER === 'true' ? undefined : {
    // Build admin and serve the production preview; this avoids dev-only plugin injections and inline scripts which cause test flakiness.
    // Use build:admin rather than build:admin:hostinger so the preview serves the dist-admin output which "vite preview" expects.
    command: 'npm run build:admin && npm run preview:admin',
    // The preview server will default to the admin preview port configured above.
    port: 3001,
    timeout: 5 * 60 * 1000, // increase timeout to allow build to finish
    reuseExistingServer: true,
  },
};
