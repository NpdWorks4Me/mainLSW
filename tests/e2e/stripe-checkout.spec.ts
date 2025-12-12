import { test, expect } from '@playwright/test';
// Use global fetch (node >=18 or Playwright provides fetch)
import { execSync } from 'child_process';

test('Stripe checkout flow and webhook creates order', async ({ page }) => {
  const adminUrl = process.env.ADMIN_URL || 'http://localhost:3001';
  const storeUrl = process.env.STORE_URL || 'http://localhost:3000';
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    test.skip(!(supabaseUrl && supabaseKey), 'Missing supabase env for test');
    return;
  }

  // Create a product via supabase Admin API
  const createRes = await fetch(`${supabaseUrl}/rest/v1/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${supabaseKey}`, Prefer: 'return=representation' },
    body: JSON.stringify({ title: `Test Product ${Date.now()}`, status: 'active' }),
  });
  const product = await createRes.json().catch(() => null);
  // Create a variant
  const variantRes = await fetch(`${supabaseUrl}/rest/v1/product_variants`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${supabaseKey}`, Prefer: 'return=representation' },
    body: JSON.stringify({ product_id: product.id, sku: `TST-${Date.now()}`, price: 15.00, inventory: 5 }),
  });
  const variant = await variantRes.json().catch(() => null);

  // Create a checkout session via our server route
  const resp = await fetch(`${storeUrl}/api/checkout/stripe/session`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: [{ variant_id: variant.id, quantity: 1 }], success_url: `${storeUrl}/shop/checkout/success?session_id={CHECKOUT_SESSION_ID}`, cancel_url: `${storeUrl}/shop/checkout/cancel` }) });
  const json = await resp.json();
  expect(json.url).toBeTruthy();
  const sessionId = json.id;

  // Trigger a webhook via Stripe CLI (requires stripe CLI & login configured)
  try {
    execSync('stripe trigger checkout.session.completed', { stdio: 'inherit' });
  } catch (e) {
    console.warn('Failed to call stripe trigger; ensure stripe CLI is installed and logged in');
  }

  // Open admin orders page and check for session id appearing in the list
  await page.goto(`${adminUrl}/admin/orders`);
  await expect(page.locator(`text=${sessionId}`).first()).toBeVisible({ timeout: 10000 });
});
