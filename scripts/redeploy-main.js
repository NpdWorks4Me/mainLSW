#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
const __dirname = decodeURIComponent(path.dirname(new URL(import.meta.url).pathname));

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) throw new Error('Source does not exist: ' + src);
  const st = fs.statSync(src);
  if (st.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const name of fs.readdirSync(src)) {
      copyRecursive(path.join(src, name), path.join(dest, name));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

async function main() {
  const repoRoot = path.resolve(__dirname, '..');
  const dist = path.join(repoRoot, 'dist');
  const publicHtml = path.resolve(repoRoot, 'public_html');
  if (!fs.existsSync(dist)) {
    console.error('dist not found. Run: npm run build');
    process.exit(1);
  }
  console.log('Copying dist -> public_html (local)');
  copyRecursive(dist, publicHtml);
  console.log('Copy finished. Verify the store page at http://localhost:3000/store after serving public_html.');
}

main();
