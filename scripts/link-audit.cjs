#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

function walk(dir, filelist=[]) {
  const files = fs.readdirSync(dir);
  files.forEach(f => {
    const p = path.join(dir, f);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      walk(p, filelist);
    } else {
      filelist.push(p);
    }
  });
  return filelist;
}

function extractLinksFromFile(content) {
  const links = new Set();
  // match to="/path" or to='/path' or Link to={"/path"}
  const toRegex = /to\s*=\s*(?:"|')([^"']+)(?:"|')/g;
  const hrefAttrRegex = /href\s*=\s*(?:"|')([^"']+)(?:"|')/g;
  const hrefObjRegex = /href:\s*(?:"|')([^"']+)(?:"|')/g; // object literal
  const canonicalRegex = /canonical\s*=\s*(?:"|')([^"']+)(?:"|')/g;
  const navigateRegex = /navigate\(\s*(?:`|"|')([^"'`]+)(?:`|"|')/g;

  for (const re of [toRegex, hrefAttrRegex, hrefObjRegex, canonicalRegex, navigateRegex]) {
    let m;
    while ((m = re.exec(content)) !== null) {
      const val = m[1];
      if (val && val.startsWith('/')) links.add(val);
    }
  }

  // also detect string literals like '/games/snake' in objects
  // Note: avoid broad string literal scans to reduce false positives. We rely on explicit patterns above.

  return Array.from(links);
}

function extractRoutes(appContent) {
  const routes = new Set();
  const routeRegex = /<Route\s+[^>]*path\s*=\s*(?:"|')([^"']+)(?:"|')/g;
  let m;
  while ((m = routeRegex.exec(appContent)) !== null) {
    routes.add(m[1]);
  }
  return Array.from(routes);
}

// collect files
const files = walk(path.join(root, 'src'));
const jsFiles = files.filter(f => f.endsWith('.jsx') || f.endsWith('.js') || f.endsWith('.ts') || f.endsWith('.tsx'));

const linkMap = {}; // path -> [{file, line}] 

for (const f of jsFiles) {
  const content = fs.readFileSync(f, 'utf8');
  const links = extractLinksFromFile(content);
  for (const l of links) {
    if (!linkMap[l]) linkMap[l] = [];
    // find line number
    const idx = content.indexOf(l);
    const before = content.slice(0, idx);
    const line = before.split('\n').length;
    linkMap[l].push({ file: f, line });
  }
}

// extract routes from src/App.jsx
const appPath = path.join(root, 'src', 'App.jsx');
const appContent = fs.readFileSync(appPath, 'utf8');
const routes = extractRoutes(appContent);

// build route regexes
function routeToRegex(route) {
  // handle leading slash optional since routes use path like 'about' or '/blog'
  let r = route.replace(/\//g, '\\/')
               .replace(/:\w+/g, '[^/]+')
               .replace(/\*$/g, '.*');
  if (!r.startsWith('\\/')) r = '\\/' + r;
  return new RegExp('^' + r + '$');
}

const routeRegexes = routes.map(routeToRegex);

// Also consider static files in public/dist
function isStaticAsset(p) {
  const staticPaths = ['/robots.txt', '/favicon.svg', '/manifest.json', '/sitemap.xml', '/config.json'];
  if (staticPaths.includes(p)) return true;
  // check dist and public_html
  const candidates = [path.join(root, 'dist', p.replace(/^\//, '')), path.join(root, 'public_html', p.replace(/^\//, '')), path.join(root, 'public', p.replace(/^\//, ''))];
  return candidates.some(c => fs.existsSync(c));
}

const report = {
  totalLinks: Object.keys(linkMap).length,
  missing: {},
  ok: {}
};

for (const l of Object.keys(linkMap).sort()) {
  const matched = routeRegexes.some(rx => rx.test(l));
  const staticOk = isStaticAsset(l);
  // Special-case anchors: '/about#contact' -> check '/about'
  const base = l.split('#')[0].split('?')[0];
  const matchedBase = routeRegexes.some(rx => rx.test(base));
  const finalOk = matched || staticOk || matchedBase;
  if (!finalOk) {
    report.missing[l] = linkMap[l];
  } else {
    report.ok[l] = linkMap[l];
  }
}

// print
console.log('Link audit report');
console.log('Total unique internal links found:', report.totalLinks);

console.log('\n== Missing routes (links that may 404) ==\n');
if (Object.keys(report.missing).length === 0) {
  console.log('None — all internal links match routes or static assets.');
} else {
  for (const k of Object.keys(report.missing)) {
    console.log(k);
    for (const loc of report.missing[k]) console.log('  -', loc.file + ':' + loc.line);
  }
}

console.log('\n== Sample OK links ==');
const okKeys = Object.keys(report.ok).slice(0, 30);
for (const k of okKeys) {
  console.log('  ', k);
}

if (Object.keys(report.missing).length > 0) process.exit(2);
else process.exit(0);
