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

ASSETS=$(grep -Eo 'src="([^"]+)"|href="([^"]+)"' "$HTML" | sed -E 's/^(src|href)="([^"]+)"$/\2/' | sort -u)

if [ -z "$ASSETS" ]; then
  echo "No asset references found in dist/index.html" >&2
  exit 1
fi

echo "Checking assets referenced in dist/index.html"
MISSING=0
while read -r p; do
  # Skip obvious external or data URLs
  if printf "%s" "$p" | grep -qE '^(https?:|//|data:|mailto:|tel:)'; then
    echo "Skipping external or data URL: $p"
    continue
  fi

  # Normalize path to a local file under dist/
  if [[ "$p" == /* ]]; then
    # Absolute path appended to dist root
    # Skip dev-time source references like /src/...
    if [[ "$p" == /src/* ]]; then
      echo "Skipping dev reference: $p"
      continue
    fi
    localpath="$ROOT/dist${p}"
  else
    # Relative paths (./assets/... or assets/...) should map to dist/
    # Remove leading ./ if present
    cleanp="$p"
    cleanp="${cleanp#./}"
    localpath="$ROOT/dist/$cleanp"
  fi

  if [ ! -f "$localpath" ]; then
    echo "MISSING: $p (expected $localpath)" >&2
    MISSING=1
  else
    echo "OK:     $p -> $localpath"
  fi
done <<< "$ASSETS"

if [ "$MISSING" -ne 0 ]; then
  echo "One or more referenced assets are missing from dist/" >&2
  exit 3
fi

echo "All referenced assets exist in dist/"
