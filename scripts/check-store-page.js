#!/usr/bin/env node
// Use global fetch in Node>=18; avoid importing node:fetch for compatibility
import process from 'process';
const url = process.argv[2] || 'https://littlespaceworld.com/store';
async function main() {
  try {
    const res = await fetch(url);
    const text = await res.text();
    if (text.includes('Access denied. You must be an admin to view this page') || text.toLowerCase().includes('admin')) {
      console.error('Warning: /store appears to be returning admin UI or an admin-only message.');
      process.exit(2);
    } else {
      console.log('/store appears to be the storefront (no admin message found).');
      process.exit(0);
    }
  } catch (e) {
    console.error('Failed fetching url', url, e.message || e);
    process.exit(1);
  }
}
main();
