#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const maybe = (v) => (v === undefined || v === null || String(v).trim() === '' ? undefined : String(v));
const cfg = {};
if (maybe(process.env.NEXT_PUBLIC_SUPABASE_URL)) cfg.NEXT_PUBLIC_SUPABASE_URL = maybe(process.env.NEXT_PUBLIC_SUPABASE_URL);
if (maybe(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) cfg.NEXT_PUBLIC_SUPABASE_ANON_KEY = maybe(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
if (maybe(process.env.NEXT_PUBLIC_ADMIN_HOST)) cfg.NEXT_PUBLIC_ADMIN_HOST = maybe(process.env.NEXT_PUBLIC_ADMIN_HOST);
if (maybe(process.env.NEXT_PUBLIC_MAIN_HOST)) cfg.NEXT_PUBLIC_MAIN_HOST = maybe(process.env.NEXT_PUBLIC_MAIN_HOST);

const data = JSON.stringify(cfg, null, 2);
const outPath = path.join(process.cwd(), 'public', 'config.json');

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, data);
console.log('Wrote', outPath);
