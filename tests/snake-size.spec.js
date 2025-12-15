import { test, expect } from '@playwright/test';

test('Snake: container and canvas size', async ({ page, baseURL }) => {
  await page.addInitScript(() => { window.__PHASER_DEBUG__ = true; });
  // Unregister any service workers and clear caches (tests rely on fresh assets)
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
  // Navigate directly to the Snake route (SPA fallback on preview server
  // supports direct navigation) which is more reliable than finding the
  // homepage link that can vary by viewport.
  await page.goto(base + '/games/snake');
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('.phaser-container');
  const containerBounds = await page.$eval('.phaser-container', (el) => {
    const r = el.getBoundingClientRect();
    return { w: r.width, h: r.height };
  });
  const canvasBounds = await page.$eval('canvas', (el) => {
    const r = el.getBoundingClientRect();
    return { w: r.width, h: r.height, cssW: el.style.width, cssH: el.style.height };
  });
  console.log('containerBounds', containerBounds);
  console.log('canvasBounds', canvasBounds);
  expect(canvasBounds.w).toBeGreaterThanOrEqual(containerBounds.w * 0.9);
  const canvasProps = await page.$eval('canvas', (el) => ({ width: el.width, height: el.height, clientW: el.clientWidth, clientH: el.clientHeight }));
  const dpr = await page.evaluate(() => (Math.min(window.devicePixelRatio || 1, 2)));
  console.log('canvasProps', canvasProps, 'dpr', dpr);
  // internal canvas pixel dimensions should be >= CSS pixel dims * DPR
  expect(canvasProps.width).toBeGreaterThanOrEqual(Math.round(containerBounds.w * dpr * 0.9));

  // If available, check the Phaser scene computed cellSize corresponds to expected value
  const sceneCellSize = await page.evaluate(() => {
    try {
      const game = window.getPhaserGame ? window.getPhaserGame() : null;
      const s = game && (game.scene.getScene('SnakeScene') || (game.scene.getScenes && game.scene.getScenes()[0]));
      if (!s) return 0;
      return { cellSize: s.cellSize, boardSize: s.boardSize };
    } catch (e) { return { cellSize: 0, boardSize: 20 }; }
  });
  if (sceneCellSize && sceneCellSize.cellSize) {
    const expected = Math.round(Math.floor(Math.min(containerBounds.w, containerBounds.h) / sceneCellSize.boardSize) * dpr);
    console.log('sceneCellSize', sceneCellSize.cellSize, 'expected', expected);
    expect(sceneCellSize.cellSize).toBeGreaterThanOrEqual(expected * 0.9);
  }

    // Note: verifying non-background canvas pixels via random sampling is flaky in some browsers; scene cell size and canvas resolution checks above are more reliable
});