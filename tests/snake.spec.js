import { test, expect } from '@playwright/test';

test('visit snake page and report console', async ({ page }) => {
  const messages = [];
  page.on('console', msg => messages.push(msg.text()));
  page.on('pageerror', err => messages.push('pageerror:' + err.message));
  await page.goto('http://localhost:5000/');
  // Click the /games/snake link to navigate SPA and avoid server 404s
  await page.click('a[href="/games/snake"]');
  await page.waitForTimeout(2000); // wait for scripts to run
  console.log('Console messages during page load:', messages);
  // Check canvas presence
  const canvasPresent = await page.evaluate(() => !!document.querySelector('canvas'));
  console.log('Canvas present?', canvasPresent);
  // Take screenshot to inspect white page
  await page.screenshot({ path: 'test-snake-page.png', fullPage: true });
  expect(canvasPresent).toBeTruthy();
});
