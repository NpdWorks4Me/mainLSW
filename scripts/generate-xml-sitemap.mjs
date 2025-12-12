import fs from 'fs';
import path from 'path';
import { sitemapRoutes } from '../src/data/sitemapRoutes.js';

const BASE_URL = 'https://littlespaceworld.com';

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapRoutes.map(route => `  <url>
    <loc>${BASE_URL}${route.path}</loc>
    <changefreq>${route.changefreq || 'weekly'}</changefreq>
    <priority>${route.priority || 0.5}</priority>
  </url>`).join('\n')}
</urlset>`;

const outputPath = path.resolve(process.cwd(), 'public/sitemap.xml');
fs.writeFileSync(outputPath, xml);
console.log(`Generated sitemap.xml at ${outputPath}`);
