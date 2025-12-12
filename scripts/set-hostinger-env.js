#!/usr/bin/env node
/*
  scripts/set-hostinger-env.js
  Generic helper script to set Hostinger environment variables via an HTTP API.
  This script is intentionally flexible: many hosts (and Hostinger's internal APIs)
  use different paths/payloads. Provide an API base or full URL and an API token.

  Usage examples:
    node ./scripts/set-hostinger-env.js --site 12345 --token $HOSTINGER_TOKEN --vars "STRIPE_SECRET_KEY=sk_live_xxx,NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx" --api-url https://api.hostinger.com/v1/sites/12345/env

    node ./scripts/set-hostinger-env.js --site 12345 --token $HOSTINGER_TOKEN --var STRIPE_SECRET_KEY=sk_live_xxx --var STRIPE_WEBHOOK_SECRET=whsec_xxx --dry-run

  Notes:
  - You must supply a valid token with permissions to update the site settings.
  - If the script fails, try providing the exact API URL and `--method` override.
  - This file does not include Hostinger-specific endpoints by default; use the
    `--api-url` argument to point to your Hostinger API endpoint if it differs.
*/
import { argv } from 'process';
// Node 18+ has a global `fetch` — no dependency needed.

function parseArgs() {
  const args = { vars: {}, varList: [], dryRun: false, site: '', token: '', apiUrl: '', method: '', bodyFormat: '', hostinger: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') { args.dryRun = true; continue; }
    if (a.startsWith('--site=')) { args.site = a.split('=')[1]; continue; }
    if (a === '--site') { args.site = argv[++i]; continue; }
    if (a.startsWith('--token=')) { args.token = a.split('=')[1]; continue; }
    if (a === '--token') { args.token = argv[++i]; continue; }
    if (a.startsWith('--api-url=')) { args.apiUrl = a.split('=')[1]; continue; }
    if (a === '--api-url') { args.apiUrl = argv[++i]; continue; }
    if (a.startsWith('--method=')) { args.method = a.split('=')[1].toUpperCase(); continue; }
    if (a === '--method') { args.method = argv[++i].toUpperCase(); continue; }
    if (a.startsWith('--body-format=')) { args.bodyFormat = a.split('=')[1]; continue; }
    if (a === '--body-format') { args.bodyFormat = argv[++i]; continue; }
    if (a.startsWith('--vars=')) {
      const raw = a.split('=')[1];
      raw.split(',').forEach(pair => {
        const [k, v] = pair.split('='); if (k && v) { args.vars[k] = v; args.varList.push(`${k}=${mask(v)}`); }
      });
      continue;
    }
    if (a === '--vars') {
      const raw = argv[++i];
      raw.split(',').forEach(pair => {
        const [k, v] = pair.split('='); if (k && v) { args.vars[k] = v; args.varList.push(`${k}=${mask(v)}`); }
      });
      continue;
    }
    if (a.startsWith('--var=')) { const [k, v] = a.split('=')[1].split('='); if (k && v) { args.vars[k] = v; args.varList.push(`${k}=${mask(v)}`); } continue; }
    if (a === '--var') { const kv = argv[++i]; const [k, v] = kv.split('='); if (k && v) { args.vars[k] = v; args.varList.push(`${k}=${mask(v)}`); } continue; }
    if (a === '--hostinger') { args.hostinger = true; continue; }
  }
  return args;
}

function mask(value) { if (!value) return ''; if (value.length <= 6) return '--masked--'; return value.slice(0, 4) + '...' + value.slice(-4); }

async function tryUpdate(apiUrl, token, method, payload) {
  if (typeof fetch === 'undefined') {
    console.error('Global fetch is not available. Please run this script on Node 18+ or install node-fetch and import it.');
    process.exit(2);
  }
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  try {
    const res = await fetch(apiUrl, { method, body: JSON.stringify(payload), headers });
    const text = await res.text();
    return { ok: res.ok, status: res.status, body: text };
  } catch (err) {
    return { ok: false, status: 0, body: String(err) };
  }
}

async function main() {
  const args = parseArgs();
  if (!args.site) {
    console.error('Missing --site <siteId>'); process.exit(2);
  }

  // If using Hostinger, default to their hosting websites endpoint
  const candidateApi = args.apiUrl || (args.hostinger
    ? `https://developers.hostinger.com/api/hosting/v1/websites/${args.site}`
    : `https://api.hostinger.com/v1/sites/${args.site}/env`);
  const apiUrl = candidateApi;
  const method = args.method || 'PATCH';
  const payloads = [];

  // Build a couple of common payload formats
  // 1) { env: { KEY: 'VAL' } }
  if (Object.keys(args.vars).length) {
    payloads.push({ env: args.vars });
    // 2) { variables: [{ name, value }] }
    payloads.push({ variables: Object.entries(args.vars).map(([name, value]) => ({ name, value })) });
    // 3) { data: { env: { ... } } }
    payloads.push({ data: { env: args.vars } });
  }

  console.log('Hostinger env set helper — dry-run:', args.dryRun);
  console.log('API URL:', apiUrl);
  console.log('Site:', args.site);
  console.log('Masking variable list:', args.varList.join(', '));

  if (args.dryRun) {
    console.log('DRY RUN — Payload candidates prepared:');
    payloads.forEach((p, idx) => console.log(`#${idx+1}:`, JSON.stringify(p)));
    process.exit(0);
  }

  // If Hostinger API requested, try a specific 'build_options' payload
  if (args.hostinger) {
    // If running dry-run, print candidate
    if (args.dryRun) {
      console.log('Hostinger payload:');
      const hPayload = { build_options: { env: args.vars } };
      console.log(JSON.stringify(hPayload, null, 2));
      process.exit(0);
    }

    // Attempt to GET the existing website object and merge env
    try {
      const headers = { 'Authorization': args.token ? `Bearer ${args.token}` : undefined };
      const getRes = await fetch(candidateApi, { method: 'GET', headers });
      if (!getRes.ok) {
        console.warn('Hostinger GET website failed', getRes.status, await getRes.text().catch(() => 'no body'));
      } else {
        const siteObj = await getRes.json();
        const existingEnv = (siteObj?.build_options?.env) || {};
        const mergedEnv = { ...existingEnv, ...args.vars };
        const hPayload = { build_options: { ...(siteObj.build_options || {}), env: mergedEnv } };
        console.log('Attempting Hostinger PATCH with merged env (masked):', Object.keys(mergedEnv).map(k => `${k}=${mask(mergedEnv[k])}`).join(', '));
        const patchRes = await tryUpdate(candidateApi, args.token, method, hPayload);
        console.log('→ status=', patchRes.status, 'ok=', patchRes.ok);
        if (patchRes.ok) { console.log('Hostinger website env updated successfully'); return process.exit(0); }
        console.warn('Hostinger PATCH failed; response:', patchRes.body);
      }
    } catch (getErr) {
      console.error('Hostinger GET/PATCH attempt failed:', getErr);
    }
    console.error('Hostinger-specific attempts failed — falling back to generic payloads');
  }

  let tried = 0;
  for (const payload of payloads) {
    tried++;
    console.log(`Trying payload #${tried} (method=${method})`);
    const res = await tryUpdate(apiUrl, args.token, method, payload);
    console.log(`→ status=${res.status} ok=${res.ok}`);
    if (res.ok) {
      console.log('Success!');
      return process.exit(0);
    } else {
      console.warn('Attempt failed, response body:', res.body ? res.body : '(empty)');
    }
  }

  console.error('All attempts failed. Try running with --dry-run and passing a specific --api-url and --method override.');
  process.exit(1);
}

main().catch((e) => { console.error('Fatal', e); process.exit(1); });
