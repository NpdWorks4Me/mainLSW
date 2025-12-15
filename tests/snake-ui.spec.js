import { test, expect } from '@playwright/test';

test('Snake UI: canvas mounts and Start button begins the game', async ({ page, baseURL }) => {
  page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
  // Opt-in to debug getters and clear SW caches before navigation
  await page.addInitScript(() => { window.__PHASER_DEBUG__ = true; });
  await page.addInitScript(() => {
    try {
      if (navigator && navigator.serviceWorker && navigator.serviceWorker.getRegistrations) {
        navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(r => r.unregister())).catch(() => {});
      }
      if (window.caches && caches.keys) {
        caches.keys().then(keys => keys.forEach(k => caches.delete(k))).catch(() => {});
      }
    } catch (e) {}
  });
  const base = process.env.BASE_URL || baseURL || 'http://localhost:3000';
  await page.goto(base + '/games/snake');
  await page.waitForLoadState('networkidle');
  // Wait for Phaser container & canvas
  await page.waitForSelector('.phaser-container', { timeout: 10000 });
  const canvas = await page.waitForSelector('canvas', { timeout: 10000 });
  expect(canvas).toBeTruthy();
  // Ensure Start button exists and click it if it is present. The page may
  // auto-start the game (in which case the button will read 'Pause').
  const startBtn = await page.$('button:has-text("Start")');
  if (startBtn) await startBtn.click();
  // Inspect the Phaser scene score directly (more reliable than DOM text)
  await page.waitForFunction(() => {
    try {
      const s = window.getPhaserGame && window.getPhaserGame().scene.getScene && window.getPhaserGame().scene.getScene('SnakeScene');
      return !!(s && s.started && Array.isArray(s.snake) && s.snake.length > 0);
    } catch (e) { return false; }
  });
  const initialScore = await page.evaluate(() => window.getPhaserGame().scene.getScene('SnakeScene').score);
  await page.waitForTimeout(1200);
  const laterScore = await page.evaluate(() => window.getPhaserGame().scene.getScene('SnakeScene').score);
  console.log('initialScore', initialScore, 'laterScore', laterScore);
  expect(typeof laterScore).toBe('number');
  expect(laterScore).toBeGreaterThanOrEqual(initialScore);
  await page.screenshot({ path: 'test-snake-ui.png', fullPage: true });
});
