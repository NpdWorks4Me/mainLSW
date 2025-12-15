#!/usr/bin/env node
import { chromium } from 'playwright';

const url = process.argv[2] || 'http://localhost:3000/';

try {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on('console', (msg) => {
    try { console.log('PAGE LOG:', msg.text()); } catch(e) {}
  });
  page.on('pageerror', (err) => {
    console.error('PAGE ERROR:', err && err.message ? err.message : err);
  });
  console.log('Navigating to', url);
  // Ensure any existing service workers are unregistered to avoid cache/stale assets
  try { await page.evaluate(async () => { const regs = await navigator.serviceWorker.getRegistrations(); await Promise.all(regs.map(r => r.unregister())); }); } catch (e) { /* ignore */ }
  await page.goto(url, { waitUntil: 'networkidle' });
  // Give the app some extra time to render lazy routes in case of slow CPU
   await page.waitForTimeout(4000);
  // If we landed on /store, try clicking the logo to navigate home (client-side routing)
  if (url.endsWith('/store')) {
    try {
      await page.click('a[aria-label="Go to homepage"]');
      await page.waitForTimeout(500); // small delay after navigation
      console.log('Clicked homepage logo to navigate back');
    } catch (e) {
      // ignore
    }
  }

  // Attempt a programmatic client-side navigation to root (simulate SPA navigation)
  try {
    await page.evaluate(() => {
      history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    console.log('Dispatched popstate to navigate to /');
    await page.waitForTimeout(800);
  } catch (e) {
    // ignore
  }

  // If we are verifying the store page, check the first product image sizing and classes
  if (url.endsWith('/store')) {
    try {
      await page.waitForSelector('.product-card-glow', { timeout: 5000 });
      const imgInfo = await page.evaluate(() => {
          const imgs = Array.from(document.querySelectorAll('.product-card-glow img'));
          return imgs.map(img => {
            const cls = img.className || '';
            const rect = img.getBoundingClientRect();
            return { cls, width: Math.round(rect.width), height: Math.round(rect.height) };
          });
      });
        console.log('Product images info (first 6):', imgInfo.slice(0,6));
    } catch (e) {
      console.warn('Could not inspect product images:', e && e.message ? e.message : e);
    }
  }
  // capture a full page screenshot to inspect what is rendered
  await page.screenshot({ path: './tmp/hero-debug.png', fullPage: true });
  const bodyHtml = await page.evaluate(() => document.body.innerHTML.slice(0, 2000));
  console.log('BODY HTML SNIPPET:\n', bodyHtml.replace(/\s+/g, ' ').slice(0, 1200));
  const mainHtml = await page.evaluate(() => {
    const main = document.querySelector('main');
    return main ? main.innerHTML.slice(0, 2000) : null;
  });
  console.log('MAIN HTML SNIPPET:\n', (mainHtml || '<<no main content>>').replace(/\s+/g, ' ').slice(0, 1200));
  const rootChildren = await page.evaluate(() => Array.from(document.getElementById('root').children).map(n => ({ tag: n.tagName.toLowerCase(), cls: n.className || null })).slice(0,20));
  console.log('ROOT CHILDREN:', JSON.stringify(rootChildren, null, 2));
  const appInner = await page.evaluate(() => {
    const app = document.querySelector('.app-container');
    return app ? app.innerHTML.slice(0, 2000) : null;
  });
  console.log('APP-CONTAINER HTML SNIPPET:\n', (appInner || '<<no app content>>').replace(/\s+/g,' ').slice(0,1200));
  const loadingText = await page.evaluate(() => document.body.innerText.includes('Loading Stardust'));
  console.log('Loading Stardust visible?', loadingText);
  // Try several selectors that indicate the hero and its content
  const selectors = ['.galactic-hero-section', '.glitch-text', 'text=Your Safe Space Among the Stars', 'h1'];
  let found = null;
  for (const sel of selectors) {
    try {
      await page.waitForSelector(sel, { timeout: 4000 });
      found = sel;
      break;
    } catch (err) {
      // try next
    }
  }

  if (!found) throw new Error('Hero selectors not found');

  const visible = await page.isVisible(found);
  console.log(`${found} visible?`, visible);
  const heroText = await page.locator(found).innerText();
  console.log('Hero snippet:', heroText.slice(0, 120).replace(/\n/g, ' '));
    await page.screenshot({ path: './tmp/hero-check.png', fullPage: true });
  await browser.close();
  process.exit(visible ? 0 : 2);
} catch (e) {
  console.error('Error checking hero:', e && e.message ? e.message : e);
  process.exit(1);
}