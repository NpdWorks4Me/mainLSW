#!/usr/bin/env node
/* eslint-env node */
/*
 Generates SITE_MAP.md by scanning:
  - App Router files under app/ (legacy Next.js App Router if present)
  - App API routes under app/api/
  - Vite/React route definitions under src/ (searches for <Route path= or path: patterns)

 Usage: node scripts/generate-site-map.js
*/
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const appDir = path.join(repoRoot, 'app');
const srcDir = path.join(repoRoot, 'src');

function normalizeSegment(seg) {
  // Convert [id] -> :id, [...rest] -> *rest
  if (/^\.\.\./.test(seg)) return `*${seg.replace(/^\.\.\./, '')}`;
  if (/^\[.*\]$/.test(seg)) return `:${seg.replace(/^[\[]|[\]]$/g, '')}`;
  return seg;
}

function inferRouteFromAppFile(filePath) {
  const rel = path.relative(appDir, filePath);
  const parts = rel.split(path.sep);
  // remove file at top
  parts.pop(); // remove page.js|page.tsx|route.js etc
  const dirs = parts;
  if (dirs.length === 0) return '/';
  const route = '/' + dirs.map(d => (d.startsWith('[') ? normalizeSegment(d) : d)).filter(Boolean).join('/');
  return route;
}

function collectAppRoutes() {
  const pages = [];
  if (!fs.existsSync(appDir)) return pages;
  const walker = (dir) => {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const it of items) {
      const full = path.join(dir, it.name);
      if (it.isDirectory()) walker(full);
      else {
        const name = it.name.toLowerCase();
        if (name.startsWith('page.') || name.startsWith('route.') || name.startsWith('layout.') ) {
          const route = inferRouteFromAppFile(full);
          pages.push({ file: path.relative(repoRoot, full), route });
        }
      }
    }
  };
  walker(appDir);
  // dedupe by file (some routes might appear multiple times)
  const map = new Map();
  pages.forEach(p => map.set(p.file, p));
  return Array.from(map.values());
}

function collectAppApiRoutes() {
  const routes = [];
  const apiDir = path.join(appDir, 'api');
  if (!fs.existsSync(apiDir)) return routes;
  const walker = (dir) => {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const it of items) {
      const full = path.join(dir, it.name);
      if (it.isDirectory()) walker(full);
      else {
        const rel = path.relative(apiDir, full);
        const route = '/api/' + rel.split(path.sep).map(p => p.replace(/\.(js|ts|tsx|jsx)$/, '')).join('/');
        routes.push({ file: path.relative(repoRoot, full), route });
      }
    }
  };
  walker(apiDir);
  return routes;
}

function collectSrcRoutes() {
  const list = [];
  if (!fs.existsSync(srcDir)) return list;
  const walker = (dir) => {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const it of items) {
      const full = path.join(dir, it.name);
      if (it.isDirectory()) walker(full);
      else {
        try {
          const content = fs.readFileSync(full, 'utf8');
          const regexes = [
            /<Route\s+[^>]*path=(?:\{|)?(["'`])([^"'`\}]+)\1/g,
            /path:\s*(["'`])([^"'`]+)\1/g,
            /createBrowserRouter\([\s\S]*?\{[\s\S]*?path:\s*(["'`])([^"'`]+)\1/g
          ];
          regexes.forEach(rx => {
            let m;
            while ((m = rx.exec(content)) !== null) {
              list.push({ file: path.relative(repoRoot, full), route: m[2] });
            }
          });
        } catch (e) {
          // ignore unreadable files
        }
      }
    }
  };
  walker(srcDir);
  // dedupe by route
  const map = new Map();
  list.forEach(l => { map.set(l.route + '|' + l.file, l); });
  return Array.from(map.values());
}

function generateSiteMap() {
  const appRoutes = collectAppRoutes();
  const apiRoutes = collectAppApiRoutes();
  const srcRoutes = collectSrcRoutes();

  let md = `# SITE_MAP\n\nGenerated: ${new Date().toISOString()}\n\n## App Router (app/) — (legacy Next.js App Router if present)\n\n`;
  if (appRoutes.length === 0) md += '_No app/ routes detected._\n\n';
  else {
    appRoutes.sort((a,b)=>a.route.localeCompare(b.route));
    appRoutes.forEach(p => { md += `- ${p.route} — \`${p.file}\`\n`; });
    md += '\n';
  }

  md += '## App API Routes (app/api/)\n\n';
  if (apiRoutes.length === 0) md += '_No API routes detected._\n\n';
  else {
    apiRoutes.sort((a,b)=>a.route.localeCompare(b.route));
    apiRoutes.forEach(p => md += `- ${p.route} — \`${p.file}\`\n`);
    md += '\n';
  }

  md += '## Vite / React (src/) — Parsed route definitions\n\n';
  if (srcRoutes.length === 0) md += '_No src routes detected via code-scan._\n\n';
  else {
    srcRoutes.sort((a,b)=>a.route.localeCompare(b.route));
    srcRoutes.forEach(p => md += `- ${p.route} — \`${p.file}\`\n`);
    md += '\n';
  }

  const outPath = path.join(repoRoot, 'SITE_MAP.md');
  fs.writeFileSync(outPath, md);
  console.log('SITE_MAP.md generated at', outPath);
}

generateSiteMap();
