#!/usr/bin/env node
import { chromium } from 'playwright';
import fs from 'fs';

const url = process.argv[2] || 'http://localhost:3000/';

try {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', (msg) => { try { console.log('PAGE LOG:', msg.text()); } catch (e) {} });
  const pageErrors = [];
  const pageConsole = [];
  page.on('console', (msg) => { try { const text = msg.text(); console.log('PAGE LOG:', text); pageConsole.push(`${msg.type()}: ${text}`); } catch (e) {} });
  page.on('pageerror', (err) => { const m = err && err.message ? err.message : String(err); console.error('PAGE ERROR:', m); pageErrors.push(m); });
  console.log('Navigating to', url, '(waitUntil: load)');
  // Unregister service workers to reduce interference
  try { await page.evaluate(async () => { if (navigator.serviceWorker && navigator.serviceWorker.getRegistrations) { const regs = await navigator.serviceWorker.getRegistrations(); await Promise.all(regs.map(r => r.unregister())); } }); } catch (e) {}
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  // Give the app some time to hydrate
  await page.waitForTimeout(1500);

  // Wait for hero selector
  try {
    await page.waitForSelector('.galactic-hero-section', { timeout: 10000 });
    console.log('galactic-hero-section found and visible');
    await page.screenshot({ path: './tmp/hero-clean.png', fullPage: true });
    await browser.close();
    process.exit(0);
  } catch (e) {
    const msg = e && e.message ? e.message : String(e);
    console.error('Hero selector not found:', msg);
    await page.screenshot({ path: './tmp/hero-clean-fail.png', fullPage: true });
  try { const html = await page.content(); fs.writeFileSync('./tmp/hero-clean-fail.html', html); } catch (err) {}
  try { fs.writeFileSync('./tmp/hero-clean-error.log', pageErrors.join('\n') + '\n\nCONSOLE:\n' + pageConsole.join('\n')); } catch (err) {}
    await browser.close();
    process.exit(2);
  }

} catch (e) {
  console.error('Error in check-hero-fast:', e && e.message ? e.message : e);
  process.exit(1);
}
