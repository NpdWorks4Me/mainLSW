#!/usr/bin/env node
/*
  scripts/migrate-hostinger-orders.js
  Attempts to migrate legacy Hostinger orders into the Supabase 'orders' table.
  Usage examples:
    node ./scripts/migrate-hostinger-orders.js --file hostinger-orders.json --dry-run
    node ./scripts/migrate-hostinger-orders.js --file hostinger-orders.json --apply
    node ./scripts/migrate-hostinger-orders.js --api --hostinger-key <key> --dry-run
  Safe defaults: --dry-run unless --apply is passed; aborts when missing SUPABASE env.
*/
import minimist from 'minimist';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const argv = minimist(process.argv.slice(2), { boolean: ['dry-run', 'apply', 'api'] });
const DRY = argv['dry-run'] || !argv['apply'];
const FILE_PATH = argv.file || argv.f || null;
const API_MODE = argv.api || false;

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SV_SUPABASE_SERVICE_ROLE_KEY;

if (!FILE_PATH && !API_MODE) {
  console.error('Provide --file <path> or --api (and Hostinger key via --hostinger-key)');
  process.exit(2);
}

async function run() {
  let orders = [];
  if (FILE_PATH) {
    const full = path.resolve(FILE_PATH);
    if (!fs.existsSync(full)) { console.error('File not found:', full); process.exit(3); }
    const raw = fs.readFileSync(full, 'utf8');
    orders = JSON.parse(raw);
    if (!Array.isArray(orders)) orders = [orders];
    console.log(`Loaded ${orders.length} orders from ${full}`);
  } else if (API_MODE) {
    const HOSTINGER_KEY = argv['hostinger-key'] || process.env.HOSTINGER_API_KEY;
    if (!HOSTINGER_KEY) { console.error('Missing Hostinger API key (pass --hostinger-key or set HOSTINGER_API_KEY)'); process.exit(4); }
    console.log('Fetching orders from Hostinger API — NOT IMPLEMENTED by default. Provide a file instead.');
    process.exit(5);
  }

  if (DRY) {
    console.log('[DRY] Would map first 3 orders:', orders.slice(0, 3));
    console.log('Run with --apply to actually write to Supabase (requires SUPABASE_URL & SERVICE_ROLE_KEY)');
    return;
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in env. Aborting.');
    process.exit(6);
  }

  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });

  for (const order of orders) {
    try {
      const mapping = {
        legacy_id: order.id || null,
        customer_email: order.customer?.email || order.email || null,
        total: Number(order.total || order.amount || 0),
        provider: order.provider || 'hostinger',
        raw: order,
      };
      // Upsert by legacy_id to avoid duplicates
      const res = await supabaseAdmin.from('orders').upsert({ legacy_id: mapping.legacy_id, customer_email: mapping.customer_email, total: mapping.total, provider: mapping.provider, raw: mapping.raw }, { onConflict: 'legacy_id' }).select();
      if (res.error) {
        console.error('Failed to write order', mapping.legacy_id, res.error.message || res.error);
      } else {
        console.log('Inserted/updated order', mapping.legacy_id || '(no id)');
      }
    } catch (e) {
      console.error('Error migrating order', e.message || e);
    }
  }
  console.log('Migration completed.');
}

run().catch(e => { console.error('Fatal', (e && e.message) || e); process.exit(1); });
