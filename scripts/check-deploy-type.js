#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import child from 'child_process';
const __dirname = decodeURIComponent(path.dirname(new URL(import.meta.url).pathname));

function usage() {
  console.log('Usage: node ./scripts/check-deploy-type.js --dir <path> | --url <http://...>');
}

async function fetchUrl(url) {
  try {
    const res = await fetch(url);
    const text = await res.text();
    return text;
  } catch (e) {
    console.error('Fetch failed:', e.message || e);
    process.exit(2);
  }
}

function checkContentType(html) {
  const lower = html.toLowerCase();
  const checks = {
    isAdmin: /adminpage|react-admin|adminlayout|admin-/i.test(html) || lower.includes('admin') && lower.includes('dashboard'),
    isMain: /homepage|homepage|home page|storepage|store|homepage|products|productlist/i.test(html) || lower.includes('store') && lower.includes('products'),
  };
  return checks;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) { usage(); process.exit(1); }
  let html = '';
  if (args[0] === '--dir') {
    const dir = args[1];
    const index = path.join(dir, 'index.html');
    if (!fs.existsSync(index)) { console.error('index.html not found in', dir); process.exit(3); }
    html = fs.readFileSync(index, 'utf8');
  } else if (args[0] === '--url') {
    const url = args[1];
    html = await fetchUrl(url);
  } else { usage(); process.exit(1); }

  const c = checkContentType(html);
  console.log('Detected (isAdmin, isMain):', c);
  if (c.isAdmin && !c.isMain) {
    console.error('This site appears to be the Admin UI (admin index) — not the main storefront.');
    process.exit(2);
  }
  if (c.isMain && !c.isAdmin) {
    console.log('This appears to be the main site.');
    process.exit(0);
  }
  console.warn('Could not determine site type conclusively — inspect index.html manually or provide a URL/dir directly.');
  process.exit(4);
}

main();
