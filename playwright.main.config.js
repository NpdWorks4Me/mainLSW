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
    baseURL: process.env.BASE_URL || 'http://127.0.0.1:3000',
    headless: true,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    // Use a simple static server for deterministic preview with SPA fallback
    command: 'npm run build && npx serve -s dist -l 3000',
    port: 3000,
    timeout: 5 * 60 * 1000,
    reuseExistingServer: true,
  },
};
