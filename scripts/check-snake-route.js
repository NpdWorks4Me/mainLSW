#!/usr/bin/env node
import child from 'child_process';
import path from 'path';
import fs from 'fs';
const __dirname = decodeURIComponent(path.dirname(new URL(import.meta.url).pathname));

const port = process.env.PORT || 3006;
const root = path.resolve(__dirname, '..');
async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  // Ensure built
  if (!fs.existsSync(path.join(root, 'dist', 'index.html'))) {
    console.log('No dist found. Building...');
    child.execSync('npm run build', { cwd: root, stdio: 'inherit' });
  }

  console.log('Starting static server (serve -s dist) on port', port);
  const server = child.spawn('npx', ['serve', '-s', 'dist', '-l', String(port)], { cwd: root, stdio: 'inherit' });

  try {
    // Wait and poll a few seconds for the server to start
    const url = `http://localhost:${port}/games/snake`;
    console.log('Checking', url);
    const start = Date.now();
    let res = null;
    while (Date.now() - start < 8000) {
      try { res = await fetch(url, { redirect: 'manual' }); break; } catch (e) { await sleep(250); }
    }
    if (!res) throw new Error('Timed out waiting for server to start');
    console.log('Status:', res.status, res.statusText);
    const text = await res.text();
    if (res.status !== 200) {
      console.error('Failed: /games/snake did not return 200');
      process.exit(2);
    }
    if (!text.includes('Start') && !text.includes('Score:') && !text.includes('<canvas')) {
      console.warn('Note: Response does not contain expected game UI strings; still returns 200 so SPA fallback works.');
    } else {
      console.log('PASS: /games/snake returned index.html and contains game UI');
    }
  } catch (e) {
    console.error('Error checking route:', e.message || e);
    process.exit(3);
  } finally {
    try { server.kill(); } catch (e) {}
  }
}

main();
