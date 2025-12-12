#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const repoRoot = path.resolve(__dirname, '..');
const inPath = path.join(repoRoot, 'SITE_MAP.md');
const outPath = path.join(repoRoot, 'SITE_MAP_CLEAN.md');
if (!fs.existsSync(inPath)) {
  console.error('SITE_MAP.md not found. Run scripts/generate-site-map.js first.');
  process.exit(1);
}
const lines = fs.readFileSync(inPath, 'utf8').split('\n');
const out = [];
let section = '';
for (let line of lines) {
  if (line.startsWith('## ')) section = line.trim();
  if (line.startsWith('- /')) {
    out.push(`${section} ${line.replace(/^\-\s*/, '')}`);
  }
}
fs.writeFileSync(outPath, out.join('\n'));
console.log('SITE_MAP_CLEAN.md generated at', outPath);
