import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const __dirname = decodeURIComponent(path.dirname(new URL(import.meta.url).pathname));
const root = path.resolve(__dirname, '..');

function run(cmd) {
  console.log('$', cmd);
  execSync(cmd, { stdio: 'inherit' });
}

const publicHtml = process.env.PUBLIC_HTML_DIR || path.resolve(root, 'public_html');
const distDir = path.resolve(root, 'dist');

if (!fs.existsSync(distDir)) {
  console.log('Main build not found; running npm run build');
  run('npm run build');
}

if (!fs.existsSync(publicHtml)) {
  console.log('Creating Hostinger folder:', publicHtml);
  fs.mkdirSync(publicHtml, { recursive: true });
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const name of fs.readdirSync(src)) {
      copyRecursive(path.join(src, name), path.join(dest, name));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('Copying site files from', distDir, 'to', publicHtml);
copyRecursive(distDir, publicHtml);

// Write a simple .htaccess for SPA fallback and security headers
const envSupabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseOrigin = (() => {
  if (!envSupabaseUrl) return null;
  try { return new URL(envSupabaseUrl).origin; } catch (e) { return envSupabaseUrl.startsWith('http') ? envSupabaseUrl : `https://${envSupabaseUrl}`; }
})();

const cspConnect = supabaseOrigin ? `'self' ${supabaseOrigin}` : "'self'";
const htaccess = `RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^.*$ index.html [L,QSA]
Options -Indexes
Header set X-Frame-Options "DENY"
Header set X-Content-Type-Options "nosniff"
Header set Referrer-Policy "no-referrer-when-downgrade"
DirectoryIndex index.html
Require all granted
Header set Content-Security-Policy "default-src 'none'; script-src 'self'; connect-src ${cspConnect}; img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src 'self'; frame-src 'none'; object-src 'none'"
`;
fs.writeFileSync(path.join(publicHtml, '.htaccess'), htaccess);

// Copy any public assets (favicon, sitemap, etc)
const publicRoot = path.resolve(root, 'public');
if (fs.existsSync(publicRoot)) {
  try { copyRecursive(publicRoot, publicHtml); } catch (e) { console.warn('Failed to copy public root:', e.message || e); }
}

console.log('Site deployed to', publicHtml);

// set permissions on files to be world-readable
function chmodRecursive(dir) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    try { const stat = fs.statSync(full); if (stat.isDirectory()) { try { fs.chmodSync(full, 0o755); } catch (e) {} chmodRecursive(full); } else { try { fs.chmodSync(full, 0o644); } catch (e) {} } } catch (e) {}
  }
}
try {
  chmodRecursive(publicHtml);
} catch (e) { console.warn('Failed to chmod files:', e.message || e); }

// Emit a simple deploy report
const deployedFiles = [];
function collectFiles(dir, base = '') { if (!fs.existsSync(dir)) return; for (const name of fs.readdirSync(dir)) { const full = path.join(dir, name); const stat = fs.statSync(full); if (stat.isDirectory()) collectFiles(full, path.join(base, name)); else deployedFiles.push({ path: path.join(base, name), size: stat.size }); } }
collectFiles(publicHtml);
fs.writeFileSync(path.join(publicHtml, 'deploy-report.json'), JSON.stringify({ deployedAt: new Date().toISOString(), files: deployedFiles }, null, 2));
console.log('Write deploy-report.json to', publicHtml);
