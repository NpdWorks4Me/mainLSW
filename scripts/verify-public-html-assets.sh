#!/usr/bin/env bash
set -euo pipefail

# Verify that every local asset referenced from public_html/index.html exists under public_html/
# Usage: ./scripts/verify-public-html-assets.sh

ROOT=$(pwd)
HTML="$ROOT/public_html/index.html"

if [ ! -f "$HTML" ]; then
  echo "public_html/index.html not found; run scripts/redeploy-main.js first" >&2
  exit 2
fi

ASSETS=$(grep -Eo 'src="(/[^"]+)"|href="(/[^"]+)"' "$HTML" | sed -E 's/^(src|href)="([^"]+)"$/\2/' | sort -u)

if [ -z "$ASSETS" ]; then
  echo "No local assets referenced by public_html/index.html" >&2
  exit 1
fi

echo "Checking assets referenced in public_html/index.html"
MISSING=0
while read -r p; do
  case "$p" in
    /*)
      # Skip dev-time source references like /src/... which are not expected in dist/public_html
      if [[ "$p" == /src/* ]]; then
        echo "Skipping dev reference: $p"
        continue
      fi
      # Map absolute URL paths to files under public_html/ when verifying deployed build.
      localpath="$ROOT/public_html${p}"
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
  echo "One or more referenced assets are missing from public_html/" >&2
  exit 3
fi

echo "All referenced assets exist in public_html/"
