#!/usr/bin/env node
/* find-invalid-imports: heuristically scan for 'import * as X from' used directly as JSX components
 * Usage: node ./scripts/find-invalid-imports.js
 */
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const files = [];

function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      if (p.includes('node_modules')) continue;
      walk(p);
    } else {
      if (/\.(js|jsx|ts|tsx)$/.test(p)) files.push(p);
    }
  }
}

walk(root);

const patternImportNamespace = /import\s+\*\s+as\s+([A-Za-z0-9_$]+)\s+from\s+['"]([^'"]+)['"]/g;
const patternCJS = /const\s+([A-Za-z0-9_$]+)\s*=\s*require\(\s*['"]([^'"]+)['"]\s*\)/g;

const warnings = [];

function scanContent(file) {
  const content = fs.readFileSync(file, 'utf8');
  let m;
  patternImportNamespace.lastIndex = 0;
  while ((m = patternImportNamespace.exec(content)) !== null) {
    const name = m[1];
    if (new RegExp(`<${name}([ >/])`).test(content) || content.includes(`element: ${name}`) || content.includes(`element={${name}}`)) {
      warnings.push({ file, type: 'namespace-used-as-component', name, importFrom: m[2] });
    }
  }
  patternCJS.lastIndex = 0;
  while ((m = patternCJS.exec(content)) !== null) {
    const name = m[1];
    if (new RegExp(`<${name}([ >/])`).test(content) || content.includes(`React.createElement(${name}`) || content.includes(`element: ${name}`)) {
      warnings.push({ file, type: 'require-used-as-component', name, importFrom: m[2] });
    }
  }
}

for (const f of files) try { scanContent(f); } catch (e) {}

if (warnings.length === 0) {
  console.log('find-invalid-imports: no suspicious import+component patterns found.');
  process.exit(0);
}

console.warn('find-invalid-imports: suspicious patterns:');
for (const w of warnings) {
  console.warn(`${w.file} -> ${w.type} '${w.name}' from '${w.importFrom}'`);
}
process.exit(0);
