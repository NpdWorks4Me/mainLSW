#!/usr/bin/env node
import { firefox } from 'playwright';

const url = process.argv[2] || 'http://localhost:3000/';

(async () => {
  const browser = await firefox.launch();
  const page = await browser.newPage();
  page.on('console', (msg) => { try { console.log('PAGE LOG:', msg.type(), msg.text()); } catch (e){} });
  page.on('pageerror', (err) => { console.error('PAGE ERROR:', err && err.message ? err.message : err); console.error(err && err.stack); });
  page.on('requestfailed', (req) => { console.error('REQ FAILED:', req.url(), req.failure() && req.failure().errorText); });
  console.log('goto', url, '(firefox)');
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);
  const html = await page.content();
  console.log('ROOT HTML SNIPPET:\n', html.slice(0, 3000));
  const heroExists = await page.$('.galactic-hero-section');
  console.log('heroExists?', !!heroExists);
  await page.screenshot({ path: './tmp/inspect-hero-firefox.png', fullPage: true });
  await browser.close();
})().catch(e => { console.error('ERROR', e); process.exit(2); });
