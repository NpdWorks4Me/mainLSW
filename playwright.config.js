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
  webServer: {
    // Build admin and serve the production preview; this avoids dev-only plugin injections and inline scripts which cause test flakiness.
    // Use build:admin rather than build:admin:hostinger so the preview serves the dist-admin output which "vite preview" expects.
    command: 'npm run build:admin && npm run preview:admin',
    // The preview server will default to the admin preview port configured above.
    port: 3001,
  timeout: 5 * 60 * 1000, // increase timeout to allow build to finish
  reuseExistingServer: true,
  },
};
