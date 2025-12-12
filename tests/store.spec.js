import { test, expect } from '@playwright/test';

const ADMIN_ROOT = process.env.ADMIN_URL || 'http://localhost:3001';

test.describe('Store smoke tests', () => {
  test('Store page loads and shows products', async ({ page, baseURL }) => {
    const base = process.env.BASE_URL || baseURL || 'http://localhost:3000';
    // Try both default ports for preview
    const candidates = [`${base}/store`, `${base.replace(/:3000/, ':3001')}/store`, `${base.replace(/:3001/, ':3000')}/store`];
    let loadedUrl = null;
    for (const c of candidates) {
      const resp = await page.goto(c, { waitUntil: 'networkidle' });
      if (resp && resp.status() !== 404) { loadedUrl = c; break; }
    }
    expect(loadedUrl, 'should load /store from one of the preview servers').toBeTruthy();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=LITTLE SPACE SHOP')).toBeVisible({ timeout: 20000 });
  // verify at least one product link exists (product card / product page link)
  const productLink = page.locator('a[href^="/product/"]').first();
  await expect(productLink).toBeVisible({ timeout: 20000 });
  });
});
  
test('store is public storefront (not admin)', async ({ page, baseURL }) => {
  const target = (baseURL || 'http://localhost:3000') + '/store';
  await page.goto(target);
  // Check the page header has SHOP text
  const header = await page.locator('h1').first().innerText();
  expect(header.toLowerCase()).toContain('shop');
  // Ensure admin-specific message is not shown
  const body = await page.content();
  expect(body).not.toContain('Access denied. You must be an admin to view this page');
  // Ensure some store-specific text is present
  expect(body.toLowerCase()).toContain('handcrafted');
});
