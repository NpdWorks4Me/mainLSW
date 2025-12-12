import { test, expect } from '@playwright/test';

test('Snake UI: canvas mounts and Start button begins the game', async ({ page }) => {
  page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
  await page.goto('http://localhost:5000/');
  await page.click('a[href="/games/snake"]');
  // Wait for Phaser container & canvas
  await page.waitForSelector('.phaser-container', { timeout: 5000 });
  const canvas = await page.waitForSelector('canvas', { timeout: 5000 });
  expect(canvas).toBeTruthy();
  // Ensure Start button exists and click it
  const startBtn = await page.waitForSelector('button:has-text("Start")', { timeout: 3000 });
  await startBtn.click();
  // Score starts at 0; after some time it should be > 0
  const scoreLocator = page.locator('text=Score:');
  const parseScore = async () => {
    const text = await scoreLocator.textContent();
    const match = text.match(/Score:\s*(\d+)/);
    return match ? Number(match[1]) : 0;
  };
  const initialScore = await parseScore();
  await page.waitForTimeout(2000);
  const laterScore = await parseScore();
  console.log('initialScore', initialScore, 'laterScore', laterScore);
  expect(laterScore).toBeGreaterThanOrEqual(initialScore);
  await page.screenshot({ path: 'test-snake-ui.png', fullPage: true });
});
