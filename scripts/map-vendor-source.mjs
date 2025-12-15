#!/usr/bin/env node
import fetch from 'node-fetch';
import { SourceMapConsumer } from 'source-map';

const url = process.argv[2] || 'http://localhost:3000/assets/vendor-e78f9c58.js';
const line = parseInt(process.argv[3] || '9', 10);
const column = parseInt(process.argv[4] || '13037', 10);

async function run() {
  console.log('Fetching', url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const text = await res.text();

  let json = null;
  // Try inline source map first
  const smMatch = text.match(/sourceMappingURL=data:application\/json;base64,([^\n\r]+)/);
  if (smMatch) {
    const base64 = smMatch[1];
    json = JSON.parse(Buffer.from(base64, 'base64').toString('utf8'));
  } else {
    // Try external .map reference
    const refMatch = text.match(/sourceMappingURL=([^\n\r]+)/);
    if (!refMatch) {
      console.error('No source map reference found in fetched file.');
      process.exit(2);
    }
    const mapUrl = new URL(refMatch[1], url).toString();
    console.log('Fetching source map from', mapUrl);
    const smRes = await fetch(mapUrl);
    if (!smRes.ok) throw new Error(`Failed to fetch source map ${mapUrl}: ${smRes.status}`);
    json = await smRes.json();
  }

  console.log('Loaded source map. Mapping', line, column);
  await SourceMapConsumer.with(json, null, consumer => {
    const pos = consumer.originalPositionFor({ line, column });
    console.log('Mapped to:', pos);
    if (pos.source) {
      const src = consumer.sourceContentFor(pos.source, true);
      if (src) {
        const lines = src.split(/\n/);
        const start = Math.max(0, (pos.line || 1) - 4);
        const end = Math.min(lines.length, (pos.line || 1) + 3);
        console.log('\n--- Source excerpt (' + pos.source + ':' + pos.line + ':' + pos.column + ') ---\n');
        for (let i = start; i < end; i++) {
          const mark = (i + 1) === pos.line ? '>>' : '  ';
          console.log(`${mark} ${String(i + 1).padStart(4)} | ${lines[i]}`);
        }
        console.log('\n--- End excerpt ---\n');
      }
    }
  });
}

run().catch(err => { console.error(err); process.exit(1); });
