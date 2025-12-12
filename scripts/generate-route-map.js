import fs from 'fs';
import path from 'path';

const __dirname = decodeURIComponent(path.dirname(new URL(import.meta.url).pathname));
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const OUT = path.join(__dirname, 'route-map.json');

const JS_EXTS = ['.js', '.jsx', '.ts', '.tsx'];

function listFiles(dir, out = []) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const it of items) {
    const full = path.join(dir, it.name);
    if (it.isDirectory()) {
      listFiles(full, out);
    } else if (JS_EXTS.includes(path.extname(it.name))) {
      out.push(full);
    }
  }
  return out;
}

// Regex patterns
const pathAttrRegex = /<Route\b[^>]*\bpath\s*=\s*(?:\{|)\s*(['\"`])((?:(?!\1).)*)\1/gs;
const elementComponentRegex = /<Route\b[^>]*\belement\s*=\s*{\s*<\s*([A-Za-z0-9_$.]+)\b/gs;
const componentAttrRegex = /<Route\b[^>]*\bcomponent\s*=\s*{?\s*([A-Za-z0-9_$.]+)\s*}?/gs;
const importRegex = /^\s*import\s+([A-Za-z0-9_,{}\s*\n]+)\s+from\s+(['\"])([^'\"]+)\2/gm;
const lazyImportRegex = /const\s+([A-Za-z0-9_]+)\s*=\s*lazy\s*\(\s*\(\s*\)\s*=>\s*import\s*\(\s*(['\"])([^'\"]+)\2\s*\)\s*\)\s*/g;
const linkToRegex = /<(?:Link|NavLink|a)\b[^>]*\bto\s*=\s*(['\"`])((?:(?!\1).)*)\1/gs;
const directHrefRegex = /<a[^>]*\bhref\s*=\s*(['\"`])((?:(?!\1).)*)\1/gs;
const navigateCallRegex = /\b(?:navigate|history\.push|history\.replace)\s*\(\s*(['\"`])([^'\"]+)\1\s*\)/g;

function parseImports(fileContent) {
  const imports = {};
  let m;
  importRegex.lastIndex = 0;
  while ((m = importRegex.exec(fileContent)) !== null) {
    const spec = m[1].trim();
    const importPath = m[3].trim();
    const parts = spec.split(',').map(s => s.trim()).filter(Boolean);
    parts.forEach(p => {
      if (p.startsWith('{')) {
        const names = p.replace(/[{}]/g, '').split(',').map(n => n.trim());
        names.forEach(n => {
          const name = n.includes(' as ') ? n.split(' as ')[1].trim() : n.split(' as ')[0].trim();
          imports[name] = importPath;
        });
      } else {
        const name = p.replace(/as\s+/, '').split(' ')[0].trim();
        imports[name] = importPath;
      }
    });
  }

  lazyImportRegex.lastIndex = 0;
  while ((m = lazyImportRegex.exec(fileContent)) !== null) {
    const varName = m[1].trim();
    const importPath = m[3].trim();
    imports[varName] = importPath;
  }

  return imports;
}

function findRouteComponents(fileContent) {
  const routes = [];
  pathAttrRegex.lastIndex = 0;
  let pathMatch;
  while ((pathMatch = pathAttrRegex.exec(fileContent)) !== null) {
    const pathVal = pathMatch[2].trim();
    const afterIndex = pathMatch.index + pathMatch[0].length;
    const scanText = fileContent.slice(afterIndex, afterIndex + 1000);
    let elementMatch = null;
    elementComponentRegex.lastIndex = afterIndex;
    const eMatch = elementComponentRegex.exec(fileContent);
    if (eMatch && eMatch.index >= pathMatch.index && eMatch.index < afterIndex + 1000) {
      elementMatch = eMatch[1];
    }
    if (!elementMatch) {
      componentAttrRegex.lastIndex = afterIndex;
      const cMatch = componentAttrRegex.exec(fileContent);
      if (cMatch && cMatch.index >= pathMatch.index && cMatch.index < afterIndex + 1000) {
        elementMatch = cMatch[1];
      }
    }
    routes.push({ path: pathVal, component: elementMatch || null, matchIndex: pathMatch.index });
  }

  elementComponentRegex.lastIndex = 0;
  let em;
  while ((em = elementComponentRegex.exec(fileContent)) !== null) {
    const elemIndex = em.index;
    const backScan = fileContent.slice(Math.max(0, elemIndex - 300), elemIndex);
    const pm = backScan.match(/path\s*=\s*(['\"`])((?:(?!\1).)*)\1/);
    const pathVal = pm ? pm[2] : null;
    if (pathVal) routes.push({ path: pathVal, component: em[1], matchIndex: elemIndex });
  }

  return routes;
}

function findToLinks(fileContent) {
  const links = [];
  linkToRegex.lastIndex = 0;
  let m;
  while ((m = linkToRegex.exec(fileContent)) !== null) {
    links.push({ to: m[2], line: fileContent.slice(0, m.index).split('\n').length, snippet: m[0] });
  }
  directHrefRegex.lastIndex = 0;
  while ((m = directHrefRegex.exec(fileContent)) !== null) {
    const href = m[2];
    if (href && href.startsWith('/')) {
      links.push({ to: href, line: fileContent.slice(0, m.index).split('\n').length, snippet: m[0] });
    }
  }
  navigateCallRegex.lastIndex = 0;
  while ((m = navigateCallRegex.exec(fileContent)) !== null) {
    links.push({ to: m[2], line: fileContent.slice(0, m.index).split('\n').length, snippet: m[0], navigate: true });
  }
  const unique = {};
  links.forEach(l => { if (!unique[l.to]) unique[l.to] = l; });
  return Object.values(unique);
}

function mapComponentToImport(componentName, importsMap) {
  if (!componentName || !importsMap) return null;
  const clean = componentName.replace(/[^A-Za-z0-9_$.]/g, '');
  return importsMap[clean] || null;
}

function main(){
  const files = listFiles(SRC);
  const results = { routes: [], links: [], components: {}, filesScanned: files.length };
  files.forEach(file => {
    const rel = path.relative(ROOT, file);
    let content = '';
    try { content = fs.readFileSync(file, 'utf8'); } catch(e){ console.error('Error reading', file, e.message); return; }

    const importsMap = parseImports(content);
    const routes = findRouteComponents(content);
    routes.forEach(r => {
      const compImport = mapComponentToImport(r.component, importsMap);
      results.routes.push({ path: r.path, component: r.component, componentImport: compImport, file: rel });
      if (compImport && !results.components[compImport]) {
        results.components[compImport] = { files: [], inferredComponentNames: [] };
      }
      if (compImport) {
        results.components[compImport].files.push(rel);
        if (r.component) results.components[compImport].inferredComponentNames.push(r.component);
      }
    });

    const links = findToLinks(content);
    links.forEach(l => {
      results.links.push({ to: l.to, file: rel, line: l.line || null, snippet: (l.snippet||'').replace(/\s+/g, ' ').slice(0,200) });
    });
  });

  // Dedup routes
  const uniqueRoutes = {};
  results.routes.forEach(r => {
    const key = typeof r.path === 'string' ? r.path.trim() : r.path;
    if (!key) return;
    if (!uniqueRoutes[key]) uniqueRoutes[key] = { path: key, files: [], components: new Set() };
    uniqueRoutes[key].files.push(r.file);
    if (r.component) uniqueRoutes[key].components.add(r.component);
  });
  results.routes = Object.values(uniqueRoutes).map(r => ({ path: r.path, files: Array.from(new Set(r.files)), components: Array.from(r.components) }));

  const linkMap = {};
  results.links.forEach(l => { const key = `${l.to}::${l.file}`; if (!linkMap[key]) linkMap[key] = l; });
  results.links = Object.values(linkMap);

  const outJson = { generatedAt: new Date().toISOString(), projectRoot: ROOT, filesScanned: results.filesScanned, routesFound: results.routes.length, linksFound: results.links.length, routes: results.routes, links: results.links, components: results.components };
  fs.writeFileSync(OUT, JSON.stringify(outJson, null, 2), 'utf8');
  console.log(`Route map saved to ${OUT}`);
  console.log(`Scanned ${results.filesScanned} files, found ${results.routes.length} unique route paths, ${results.links.length} internal links.`);
  console.log('\n=== Routes (unique) ===');
  results.routes.slice(0,200).forEach(r => console.log(' ', r.path, ' — ', r.files.join(', ')));
  console.log('\n=== Some Links ===');
  results.links.slice(0,50).forEach(l => console.log(' ', l.to, ' — ', l.file, l.line ? `line:${l.line}` : ''));
}

main();

export {};
