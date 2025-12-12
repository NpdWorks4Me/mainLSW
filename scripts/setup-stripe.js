#!/usr/bin/env node
/*
  scripts/setup-stripe.js
  Small helper to validate a Stripe key and optionally create a few starter resources.
  Usage: node ./scripts/setup-stripe.js --dry-run
         node ./scripts/setup-stripe.js --apply
  It requires STRIPE_SECRET_KEY in the environment or pass --key <your_key>
*/
import minimist from 'minimist';
import Stripe from 'stripe';

const argv = minimist(process.argv.slice(2), { boolean: ['dry-run', 'apply'] });
const DRY = argv['dry-run'] || !argv['apply'];
const key = argv.key || process.env.STRIPE_SECRET_KEY || '';

if (!key) {
  console.error('Please set STRIPE_SECRET_KEY in env or pass --key');
  process.exit(1);
}

const stripe = new Stripe(key, { apiVersion: '2024-08-01' });

async function main() {
  console.log('Stripe Key provided. Running health check...');
  try {
    const acct = await stripe.accounts.retrieve();
    console.log('Account:', acct.id, acct.email || '(no email)');
  } catch (e) {
    console.error('Stripe health check failed:', e && e.message ? e.message : e);
    process.exit(2);
  }

  if (DRY) {
    console.log('[DRY] Would create a test product and webhook if not present. Nothing changed.');
    return;
  }

  console.log('[APPLY] Creating sample product and price (safe to run multiple times).');
  const product = await stripe.products.create({ name: 'CUSTOM-BUNDLE-SLOT', description: 'Custom bundle placeholder product (platform-only)' });
  const price = await stripe.prices.create({ product: product.id, unit_amount: 1000, currency: 'usd' });
  console.log('Created product:', product.id, 'price:', price.id);
  console.log('Next steps: create webhook endpoints for payment events and attach it to your server (see README).');
}

main().catch(e => { console.error('Fatal', e); process.exit(10); });
