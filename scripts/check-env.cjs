#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');
const raw = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';

if (raw.match(/^SUPABASE_SERVICE_ROLE_KEY=|^STRIPE_SECRET_KEY=|^STRIPE_WEBHOOK_SECRET=/m)) {
  console.error('ERROR: Found server-only keys in .env.local. Remove them before building/deploying.');
  process.exit(1);
}
console.log('env check passed');
