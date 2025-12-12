#!/usr/bin/env node
/* Simple CSP checker for local dev/preview HTTP server.
 * Usage: node ./scripts/check-csp.js [url]
 */
import http from 'http';
import https from 'https';
import { URL } from 'url';

const urlArg = process.argv[2] || process.env.URL || 'http://127.0.0.1:3001';
async function fetchText(url) {
  return new Promise((resolve, reject) => {
    try {
      const u = new URL(url);
      const lib = u.protocol === 'https:' ? https : http;
      lib.get(u, res => {
        const chunks = [];
        res.on('data', c => chunks.push(c));
        res.on('end', () => {
          const body = Buffer.concat(chunks).toString('utf8');
          resolve({ headers: res.headers, body, status: res.statusCode });
        });
      }).on('error', reject);
    } catch (e) { reject(e); }
  });
}

(async function main(){
  try {
    const { headers, body, status } = await fetchText(urlArg);
    console.log(`HTTP ${status} ${urlArg}`);
    const cspHeader = headers['content-security-policy'] || headers['Content-Security-Policy'] || null;
    console.log('CSP Header:', cspHeader || 'none');
    const snippet = body.split('\n').slice(0, 120).join('\n');
    const metaMatch = snippet.match(/<meta[^>]*http-equiv=["']?Content-Security-Policy["']?[^>]*>/i);
    console.log('CSP meta present in HTML:', !!metaMatch);
    if (metaMatch) console.log('CSP meta:', metaMatch[0]);
    process.exit(0);
  } catch (err) {
    console.error('Failed to fetch URL:', err.message || err);
    process.exit(1);
  }
})();
