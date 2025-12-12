#!/usr/bin/env node
import { spawn } from 'child_process';
import { chromium } from 'playwright';

async function run() {
  console.log('Building main site...');
  const build = spawn('npm', ['run', 'build'], { stdio: 'inherit' });
  await new Promise((res, rej) => build.on('exit', (code) => (code === 0 ? res() : rej(new Error('build failed')))));

  console.log('Starting preview server...');
  const preview = spawn('npm', ['run', 'preview'], { stdio: 'inherit' });
  try {
    // Simple HTTP poll to wait for preview server
    const http = await import('node:http');
    const waitForServer = async (url, timeout = 30000) => new Promise((resolve, reject) => {
      const startAt = Date.now();
      const interval = setInterval(() => {
        const req = http.request(url, { method: 'GET' }, (res) => { clearInterval(interval); resolve(); });
        req.on('error', () => {
          if (Date.now() - startAt > timeout) { clearInterval(interval); reject(new Error('timeout waiting for server')); }
        });
        req.end();
      }, 500);
    });
    let port = 3000;
    try {
      await waitForServer(`http://localhost:${port}`);
    } catch (err) {
      port = 3001;
      await waitForServer(`http://localhost:${port}`);
    }
    console.log('Preview server up on http://localhost:3000');
    const browser = await chromium.launch();
    const page = await browser.newPage();
  // Opt in to debugger getter before navigation so window.getPhaserGame gets attached
  await page.addInitScript(() => { window.__PHASER_DEBUG__ = true; });
  await page.goto(`http://localhost:${port}/games/snake`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.phaser-container');
    await page.click('button:has-text("Start")');
    // Wait for the scene to be available via debug getter
    await page.waitForFunction(() => !!(window.getPhaserGame && window.getPhaserGame().scene && window.getPhaserGame().scene.getScene('SnakeScene')), { timeout: 5000 });
    const started = await page.evaluate(() => window.getPhaserGame().scene.getScene('SnakeScene').started);
    console.log('Snake scene started?', started);
    await browser.close();
    return started ? 0 : 1;
  } finally {
    // Kill preview server
    try { preview.kill(); } catch (e) {}
  }
}

run().then((code) => process.exit(code)).catch((err) => { console.error(err); process.exit(2); });
