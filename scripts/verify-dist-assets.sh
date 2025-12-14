#!/usr/bin/env bash
set -euo pipefail

# Verify that every local asset referenced from dist/index.html exists under dist/
# Usage: ./scripts/verify-dist-assets.sh

ROOT=$(pwd)
HTML="$ROOT/dist/index.html"

if [ ! -f "$HTML" ]; then
  echo "dist/index.html not found; run npm run build first" >&2
  exit 2
fi

ASSETS=$(grep -Eo 'src="(/[^"]+)"|href="(/[^"]+)"' "$HTML" | sed -E 's/^(src|href)="([^"]+)"$/\2/' | sort -u)

if [ -z "$ASSETS" ]; then
  echo "No local assets referenced by dist/index.html" >&2
  exit 1
fi

echo "Checking assets referenced in dist/index.html"
MISSING=0
while read -r p; do
  case "$p" in
    /*)
      # Skip dev-time source references like /src/... which are not expected in dist
      if [[ "$p" == /src/* ]]; then
        echo "Skipping dev reference: $p"
        continue
      fi
      # Map absolute URL paths to files under dist/ when verifying local build.
      localpath="$ROOT/dist${p}"
      if [ ! -f "$localpath" ]; then
        echo "MISSING: $p (expected $localpath)" >&2
        MISSING=1
      else
        echo "OK:     $p"
      fi
      ;;
    *)
      echo "Skipping non-local asset: $p"
      ;;
  esac
done <<< "$ASSETS"

if [ "$MISSING" -ne 0 ]; then
  echo "One or more referenced assets are missing from dist/" >&2
  exit 3
fi

echo "All referenced assets exist in dist/"
