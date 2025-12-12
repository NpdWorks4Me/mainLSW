import fs from 'fs';
import path from 'path';

const root = process.cwd();
const appPath = path.join(root, 'src', 'App.jsx');

if (!fs.existsSync(appPath)) {
  console.error('src/App.jsx not found in repository; cannot check route mapping');
  process.exit(1);
}

const content = fs.readFileSync(appPath, 'utf8');
const storeRouteMatch = content.match(/<Route\s+path="\/?store"\s+element=\{([^}]+)\}\s*\/?>/i);
if (!storeRouteMatch) {
  console.warn('No /store route found in src/App.jsx; nothing to validate.');
  process.exit(0);
}

const mappedElement = storeRouteMatch[1].trim();

if (/AdminPage/.test(mappedElement)) {
  console.error('Routing issue detected: /store maps to AdminPage. Please update src/App.jsx to map /store to StorePage.');
  process.exit(2);
}

console.log('/store route mapping looks good — not mapped to AdminPage.');
process.exit(0);
