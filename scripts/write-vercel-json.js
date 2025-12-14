#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const out = {
  version: 2,
  builds: [{ src: 'index.html', use: '@vercel/static' }],
  routes: [
    { src: '^/assets/(.*)$', dest: '/assets/$1' },
    { src: '^/icons/(.*)$', dest: '/icons/$1' },
    { src: '^/sw.js$', dest: '/sw.js' },
    { src: '^/favicon.svg$', dest: '/favicon.svg' },
    { src: '^/manifest.json$', dest: '/manifest.json' },
    { src: '^/sitemap.xml$', dest: '/sitemap.xml' },
    { src: '^/(.*)$', dest: '/index.html' }
  ]
};

const outDir = path.resolve(process.cwd(), 'dist');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'vercel.json'), JSON.stringify(out, null, 2), 'utf8');
console.log('Written dist/vercel.json');
