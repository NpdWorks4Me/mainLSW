#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const ADMIN_INDICATORS = [
  '/admin/',
  '/admin.',
  ' admin ',
  'adminpage',
  'react-admin',
  'admin-',
  'admin_',
  'dist-admin',
  'admin.html',
  '_next/admin',
];

function usage() {
  console.log('Usage: node ./scripts/check-dist-no-admin.js --dir <path>');
}

function scanDir(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    const rel = path.relative(process.cwd(), full);
    // check file/dir name for admin indicators
    const nameLower = ent.name.toLowerCase();
    if (ADMIN_INDICATORS.some(i => nameLower.includes(i.replace('/', '').replace('.', '').replace(' ', '')))) {
      results.push(rel);
    }
    if (ent.isDirectory()) {
      results.push(...scanDir(full));
    } else if (ent.isFile()) {
      // also check file text for admin-like content for index.html and main bundles
      try {
        const txt = fs.readFileSync(full, 'utf8');
        const lower = txt.toLowerCase();
        if (ADMIN_INDICATORS.some(i => lower.includes(i.replace('/', '').replace(' ', '')))) {
          results.push(rel);
        }
      } catch (e) {
        // ignore binary files or read errors
      }
    }
  }
  return results;
}

function main() {
  const args = process.argv.slice(2);
  if (args.length !== 2 || args[0] !== '--dir') { usage(); process.exit(1); }
  const dir = args[1];
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) { console.error('Directory not found:', dir); process.exit(2); }

  const findings = scanDir(dir);
  // Deduplicate and filter out benign matches (very short matches)
  const unique = [...new Set(findings)];
  const offenders = unique.filter(x => x && x.length > 0 && /admin/i.test(x) || /admin/i.test(fs.readFileSync(path.join(process.cwd(), x)).toString()))
    .slice(0, 100);

  if (offenders.length > 0) {
    console.error('Admin artifacts detected in build output!');
    console.error('Offending files (excerpt):');
    offenders.forEach(f => console.error('  -', f));
    console.error('\nIf this is unexpected, remove admin build outputs or change the build to exclude admin.');
    process.exit(3);
  }

  console.log('No admin artifacts found in', dir);
  process.exit(0);
}

main();
