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
  // Copy to a temporary directory first, then atomically move it into place.
  // This avoids transient partial states where a server might observe a
  // partially-copied `dist/` and return 404s for some assets.
  const tmpDest = `${dest}.tmp`;
  if (fs.existsSync(tmpDest)) fse.removeSync(tmpDest);
  fse.copySync(srcDist, tmpDest);
  // Remove the old dist atomically and replace it with the new one.
  if (fs.existsSync(dest)) fse.removeSync(dest);
  fse.moveSync(tmpDest, dest, { overwrite: true });
  console.log('Copied src/dist to root dist (atomic move)');
} catch (e) {
  console.error('Failed to copy src/dist -> dist', e.message || e);
  process.exit(1);
}
