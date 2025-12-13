#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const cfgPath = path.join(process.cwd(), 'public', 'config.json');
if (!fs.existsSync(cfgPath)) {
  console.log('No public/config.json present. Skipping config checks.');
  process.exit(0);
}

const raw = fs.readFileSync(cfgPath, 'utf8');
let cfg = {};
try {
  cfg = JSON.parse(raw);
} catch (e) {
  console.error('Failed to parse public/config.json:', e.message || e);
  process.exit(2);
}

const offenders = Object.keys(cfg).filter(k => cfg[k] === '');
if (offenders.length) {
  console.error('ERROR: public/config.json contains keys with empty string values:', offenders);
  console.error('This can cause runtime code to attempt to initialize client libraries with invalid values. Remove or set valid values.');
  process.exit(1);
}

console.log('public/config.json config check: OK');
process.exit(0);
