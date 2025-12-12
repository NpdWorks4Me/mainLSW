#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const repoRoot = path.resolve(__dirname, '..');
const inPath = path.join(repoRoot, 'SITE_MAP.md');
const cleanPath = path.join(repoRoot, 'SITE_MAP_CLEAN.md');
const outPath = path.join(repoRoot, 'SITE_MAP_FINAL.md');
if (!fs.existsSync(inPath)) { console.error('SITE_MAP.md not found'); process.exit(1); }
const content = fs.readFileSync(inPath, 'utf8');
// We'll parse sections and output only routes with files that are inside app/ or src/ but not src/node_modules
const lines = content.split('\n');
let section = '';
const sections = {};
for (let line of lines) {
  if (line.startsWith('## ')) section = line.trim();
  if (line.startsWith('- /')) {
    // parse route and file; format: - /route — `path`
    const match = line.match(/^-\s*(\/\S*.*?)\s+—\s+`([^`]+)`/);
    if (match) {
      const [_, route, file] = match;
      // filter out node_modules and files outside app/ and src/
      if (file.includes('node_modules')) continue;
      if (!(file.startsWith('app/') || file.startsWith('src/'))) continue;
      if (!sections[section]) sections[section] = [];
      sections[section].push({ route, file });
    }
  }
}
let out = `# SITE_MAP_FINAL\n\nGenerated: ${new Date().toISOString()}\n\n`;
for (const sec of Object.keys(sections)) {
  out += `${sec}\n\n`;
  sections[sec].sort((a,b)=>a.route.localeCompare(b.route));
  for (const r of sections[sec]) {
    out += `- ${r.route} — '${r.file}'\n`;
  }
  out += '\n';
}
fs.writeFileSync(outPath, out);
console.log('SITE_MAP_FINAL.md generated at', outPath);
