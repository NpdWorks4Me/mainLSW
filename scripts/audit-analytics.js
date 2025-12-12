#!/usr/bin/env node
import { execSync } from 'child_process';
try {
  console.log('Scanning repo for analytics/gtag/ga/gtm/doubleclick indicators...');
  const pattern = 'googletagmanager\\.com|doubleclick\\.net|google-analytics\\.com|analytics\\.js|gtag\\(';
  const cmd = `grep -R --line-number -E "${pattern}" src public_html || true`;
  const out = execSync(cmd, { encoding: 'utf-8' });
  if (!out) {
    console.log('No analytics references found in src or public_html.');
  } else {
    console.log('Found potentially analytics-related references:\n', out);
  }
} catch (err) {
  console.error('Audit failed:', err.message || err);
  process.exit(1);
}
