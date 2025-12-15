import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const messages = [];
  page.on('console', msg => messages.push(msg.text()));
  page.on('pageerror', err => messages.push('pageerror:' + err.message));
  const base = process.env.BASE_URL || 'http://localhost:3000';
  // Unregister service workers and clear caches to avoid stale assets
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
  await page.goto(base + '/');
  try {
    await page.click('a[href="/games/snake"]', { timeout: 2000 });
  } catch (e) {
    await page.goto(base + '/games/snake');
  }
  await page.waitForTimeout(2000);
  // Also test another route to compare behavior (quizzes)
  // Try a few other routes to validate routing
  try { await page.click('a[href="/quizzes/super-you"]'); await page.waitForTimeout(1000); } catch(e){}
  try { await page.click('a[href="/storytime"]'); await page.waitForTimeout(1000); } catch(e){}
  await page.waitForTimeout(2000);
  const quizPath = await page.evaluate(() => document.location.pathname);
  const hasQuizText = await page.evaluate(() => !![...document.body.querySelectorAll('*')].some(el => el.textContent && el.textContent.includes('Super-You')));
  console.log('After clicking quizzes, pathname:', quizPath, 'has quiz text?', hasQuizText);
  const pathname = await page.evaluate(() => document.location.pathname);
  const bodyHtml = await page.evaluate(() => document.body.innerHTML.slice(0, 800));
  console.log('Current pathname:', pathname);
  console.log('Body snippet:', bodyHtml);
  const hasScoreText = await page.evaluate(() => !![...document.body.querySelectorAll('*')].some(el => el.textContent && el.textContent.includes('Score:')));
  console.log('Has score text?', hasScoreText);
  const rootChildren = await page.evaluate(() => {
    const root = document.querySelector('#root');
    if (!root) return null;
    return Array.from(root.children).map(c => ({ tag: c.tagName, class: c.className, id: c.id, inner: c.innerText.slice(0, 40) }));
  });
  console.log('Root children:', rootChildren?.slice(0, 8));
  const canvasPresent = await page.evaluate(() => !!document.querySelector('canvas'));
  console.log('Canvas present?', canvasPresent);
  const containerHtml = await page.evaluate(() => {
    const el = document.querySelector('.phaser-container');
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return { innerHTML: el.innerHTML, rect: { width: rect.width, height: rect.height } };
  });
  console.log('Phaser container:', containerHtml);
  await page.screenshot({ path: 'test-snake-page.png', fullPage: true });
  console.log('Captured screenshot as test-snake-page.png');
  console.log('Console messages:', messages.slice(0, 20));
  await browser.close();
}

run().catch(e => { console.error(e); process.exit(1); });
