#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
const __dirname = decodeURIComponent(path.dirname(new URL(import.meta.url).pathname));

const distIndexPath = path.resolve(__dirname, '..', 'dist', 'index.html');
if (!fs.existsSync(distIndexPath)) {
  console.error('Error: dist/index.html not found. Run: npm run build');
  process.exit(1);
}
const html = fs.readFileSync(distIndexPath, 'utf8');
const low = html.toLowerCase();

const adminTokens = [
  'access denied. you must be an admin',
  'react-admin',
  'adminpage',
  'admin layout',
  'adminlayout',
];
const mainTokens = [
  'little space shop',
  'handcrafted',
  'product',
  'featured goodies',
  'store',
];

const hasAdmin = adminTokens.some(t => low.includes(t));
const hasMain = mainTokens.some(t => low.includes(t));

console.log('pre-deploy-check: adminTokens:', hasAdmin, 'mainTokens:', hasMain);
if (hasAdmin && !hasMain) {
  console.error('Pre-deploy check FAILED: build appears to be Admin build and not main site. Aborting.');
  process.exit(2);
}
console.log('Pre-deploy check passed.');
process.exit(0);
