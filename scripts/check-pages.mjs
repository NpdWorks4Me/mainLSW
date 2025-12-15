#!/usr/bin/env node
import { chromium } from 'playwright';
import fs from 'fs';

const PAGES = ['/', '/store', '/about', '/blog', '/privacy', '/contact', '/login'];
// Normalize BASE: strip trailing slashes to avoid accidental double-slash paths
const rawBase = process.argv[2] || 'http://localhost:3000';
const BASE = rawBase.replace(/\/+$/, '');
const OUT = './tmp/page-checks';

async function ensureOut() { if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true }); }

async function capture(page, route, idx) {
  const errors = [];
  const ignoredConsolePatterns = [/Failed to fetch/i, /Failed to load resource: the server responded with a status of 404/i];
  page.on('pageerror', e => errors.push({ type: 'pageerror', text: String(e) }));
  page.on('console', m => {
    if (m.type() !== 'error') return;
    const text = m.text();
    const ignored = ignoredConsolePatterns.some((rx) => rx.test(text));
    if (!ignored) errors.push({ type: 'console', text });
  });

  await page.goto(`${BASE}${route}`, { waitUntil: 'load', timeout: 30000 });
  const html = await page.content();
  const screenshot = `${OUT}/${route.replace(/[^a-z0-9]/gi,'_') || 'home'}-${idx}.png`;
  await page.screenshot({ path: screenshot, fullPage: true });
  fs.writeFileSync(`${OUT}/${route.replace(/[^a-z0-9]/gi,'_') || 'home'}-${idx}.html`, html);
  return { route, screenshot, errors };
}

async function run() {
  await ensureOut();
  const browser = await chromium.launch();
  // Control service worker behavior via env var ALLOW_SWS=1 to allow testing with SW enabled.
  const swSetting = process.env.ALLOW_SWS === '1' ? 'allow' : 'block';
  // Use a common desktop user-agent to avoid blocking by some CDNs or bot filters
  // while keeping service-worker behavior configurable for CI.
  const userAgent = process.env.USER_AGENT || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  const context = await browser.newContext({ serviceWorkers: swSetting, userAgent });
  const page = await context.newPage();

  const results = [];
  for (let i = 0; i < PAGES.length; i++) {
    const route = PAGES[i];
    try {
      // Try direct navigation first (may 404 on simple static server). If 404, fall back to client-side navigation.
      let res = null;
      try {
        res = await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded', timeout: 5000 });
      } catch (e) {
        // ignore network errors, we'll fallback
      }
      if (!res || res.status() === 404) {
        // Navigate to base then pushState
        await page.goto(BASE, { waitUntil: 'load' });
        await page.evaluate((r) => { window.history.pushState({}, '', r); window.dispatchEvent(new PopStateEvent('popstate')); }, route);
        await page.waitForTimeout(600);
      }
      const r = await capture(page, route, i);
      results.push(r);
      console.log('OK:', route, 'errors:', r.errors.length);
    } catch (e) {
      console.error('ERR visiting', route, e.message);
      results.push({ route, error: e.message });
    }
  }

  // Visit store and capture first N product pages
  try {
    await page.goto(`${BASE}/store`, { waitUntil: 'load' });
    const links = await page.$$eval('a[href^="/product/"]', els => Array.from(els).map(a => a.getAttribute('href')));
    const uniques = [...new Set(links)].slice(0, 6);
    for (let i = 0; i < uniques.length; i++) {
      const r = await capture(page, uniques[i], `product-${i}`);
      results.push(r);
      console.log('OK product:', uniques[i], 'errors:', r.errors.length);
    }
  } catch (e) {
    console.error('ERR store products crawl', e.message);
  }

  await browser.close();
  fs.writeFileSync(`${OUT}/results.json`, JSON.stringify(results, null, 2));
  console.log('Saved results to', `${OUT}/results.json`);
  // Only count actual runtime errors (pageerror) and non-ignored console errors as failures
  const totalErrors = results.reduce((acc, r) => acc + (r.errors ? r.errors.filter(e => e.type === 'pageerror' || e.type === 'console').length : 0), 0);
  process.exit(totalErrors > 0 ? 2 : 0);
}

run().catch(e => { console.error(e); process.exit(3); });
