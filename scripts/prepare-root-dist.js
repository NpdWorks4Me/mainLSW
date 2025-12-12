#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import fse from 'fs-extra';

const root = path.resolve(process.cwd());
const srcDist = path.join(root, 'src', 'dist');
const dest = path.join(root, 'dist');

if (!fs.existsSync(srcDist)) {
  console.warn('No src/dist found; skipping copy to root dist');
  process.exit(0);
}

try {
  if (fs.existsSync(dest)) fse.removeSync(dest);
  fse.copySync(srcDist, dest);
  console.log('Copied src/dist to root dist');
} catch (e) {
  console.error('Failed to copy src/dist -> dist', e.message || e);
  process.exit(1);
}
