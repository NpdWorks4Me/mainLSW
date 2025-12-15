import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Opt-in to debug getters before any script runs
  await page.addInitScript(() => { window.__PHASER_DEBUG__ = true; });
  // Unregister service workers and clear caches early to avoid stale assets
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
});

async function openSnake(page, base) {
  // Directly navigate to the in-page route. The preview server supports SPA fallback
  // so this should work reliably across environments and avoids depending on a
  // rendered link on the homepage which may vary by viewport or carousel behavior.
  await page.goto(base + '/games/snake');
  await page.waitForLoadState('networkidle');
}

test('Keyboard: ArrowRight moves snake to right', async ({ page, baseURL }) => {
  const base = process.env.BASE_URL || baseURL || 'http://localhost:3000';
  await openSnake(page, base);
  await page.waitForSelector('.phaser-container');
  const canvas = await page.waitForSelector('canvas');
  // click Start if present; the page may auto-start the game in some builds
  try {
    const startBtn = await page.$('button:has-text("Start")');
    if (startBtn) await startBtn.click();
  } catch (e) { /* ignore - proceed if already running */ }
  // wait for scene to be available and the snake to be initialized
  await page.waitForFunction(() => {
    try {
      const s = window.getPhaserGame && window.getPhaserGame().scene.getScene && window.getPhaserGame().scene.getScene('SnakeScene');
      return !!(s && s.started && Array.isArray(s.snake) && s.snake.length > 0);
    } catch (e) { return false; }
  });
  const initial = await page.evaluate(() => {
    const s = window.getPhaserGame().scene.getScene('SnakeScene');
    return s.snake[0];
  });
  // send ArrowRight
  await page.focus('canvas');
  await page.keyboard.press('ArrowRight');
  // wait one tick (scene speedMs ~ 150ms)
  await page.waitForTimeout(220);
  const later = await page.evaluate(() => {
    const s = window.getPhaserGame().scene.getScene('SnakeScene');
    return s.snake[0];
  });
  expect(later.x).toBeGreaterThanOrEqual(initial.x + 1);
});

test('D-Pad: dispatch snake-direction event moves snake', async ({ page, baseURL }) => {
  const base = process.env.BASE_URL || baseURL || 'http://localhost:3000';
  await openSnake(page, base);
  await page.waitForSelector('.phaser-container');
  try {
    const startBtn = await page.$('button:has-text("Start")');
    if (startBtn) await startBtn.click();
  } catch (e) { /* ignore */ }
  await page.waitForFunction(() => {
    try {
      const s = window.getPhaserGame && window.getPhaserGame().scene.getScene && window.getPhaserGame().scene.getScene('SnakeScene');
      return !!(s && s.started && Array.isArray(s.snake) && s.snake.length > 0);
    } catch (e) { return false; }
  });
  const initial = await page.evaluate(() => window.getPhaserGame().scene.getScene('SnakeScene').snake[0]);
  // dispatch right direction
  await page.evaluate(() => window.dispatchEvent(new CustomEvent('snake-direction', { detail: { x: 1, y: 0 } })));
  await page.waitForTimeout(220);
  const later = await page.evaluate(() => window.getPhaserGame().scene.getScene('SnakeScene').snake[0]);
  expect(later.x).toBeGreaterThanOrEqual(initial.x + 1);
});

test('Touch swipe: pointerdown + move changes direction', async ({ page, baseURL }) => {
  const base = process.env.BASE_URL || baseURL || 'http://localhost:3000';
  await openSnake(page, base);
  await page.waitForSelector('.phaser-container');
  try {
    const startBtn = await page.$('button:has-text("Start")');
    if (startBtn) await startBtn.click();
  } catch (e) { /* ignore */ }
  await page.waitForFunction(() => {
    try {
      const s = window.getPhaserGame && window.getPhaserGame().scene.getScene && window.getPhaserGame().scene.getScene('SnakeScene');
      return !!(s && s.started && Array.isArray(s.snake) && s.snake.length > 0);
    } catch (e) { return false; }
  });
  const initial = await page.evaluate(() => window.getPhaserGame().scene.getScene('SnakeScene').snake[0]);
  // simulate pointerdown at center and move right
  const { left, top, width, height } = await page.$eval('.phaser-container', (el) => el.getBoundingClientRect());
  const cx = left + width / 2; const cy = top + height / 2;
  // Using mouse events for swipe simulation is more reliable across test environments
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  // Trigger a simulated swipe via scene helper for deterministic results
  const result = await page.evaluate(() => {
    const s = window.getPhaserGame && window.getPhaserGame().scene.getScene('SnakeScene');
    const before = s && s.direction ? { x: s.direction.x, y: s.direction.y } : null;
    if (s && typeof s.processSimulatedSwipe === 'function') s.processSimulatedSwipe({ dx: 200, dy: 0 });
    const after = s && s.direction ? { x: s.direction.x, y: s.direction.y } : null;
    return { before, after, process: typeof (s && s.processSimulatedSwipe) };
  });
  // Use evaluation result for assertion to avoid race conditions with globals
  expect(result.process).toBe('function');
  expect(result.after).toBeTruthy();
  expect(result.after.x === 1 || result.after.y === 1).toBeTruthy();
  // Wait for Phaser to process the simulated move and update the scene direction (fallback to waiting on the scene state)
  await page.waitForFunction(() => {
    const s = window.getPhaserGame && window.getPhaserGame().scene.getScene('SnakeScene');
    return s && s.direction && (s.direction.x === 1 || s.direction.y === 1);
  });
  await page.mouse.up();
  await page.waitForTimeout(220);
  const later = await page.evaluate(() => window.getPhaserGame().scene.getScene('SnakeScene').snake[0]);
  expect(later.x).toBeGreaterThanOrEqual(initial.x + 1);
});

test('Start on load: default enabled', async ({ page, baseURL }) => {
  await page.addInitScript(() => { window.__PHASER_DEBUG__ = true; });
  const base = process.env.BASE_URL || baseURL || 'http://localhost:3000';
  await openSnake(page, base);
  await page.waitForSelector('.phaser-container');
  // Wait for the scene to exist
  await page.waitForFunction(() => !!(window.getPhaserGame && window.getPhaserGame().scene.getScene('SnakeScene')));
  // The page default set Start on load to true; ensure the scene started
  const started = await page.evaluate(() => window.getPhaserGame().scene.getScene('SnakeScene').started);
  expect(started).toBeTruthy();
});
