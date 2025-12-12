#!/usr/bin/env bash
set -euo pipefail

# Verify local /store page _next assets return 200/304
# Usage: ./scripts/verify-local-assets.sh [base_url]
# Example: ./scripts/verify-local-assets.sh http://localhost:3000

HOST=${1:-http://localhost:3000}
TMPHTML=$(mktemp)
trap 'rm -f "$TMPHTML"' EXIT

echo "Fetching $HOST/store/ (following redirects)"
curl -sSL "$HOST/store/" -o "$TMPHTML"

# Extract assets referencing _next/static (href or src)
ASSETS=$(grep -oE '(href|src)="[^"]*(_next/static[^"]*)"' "$TMPHTML" | sed -E 's/^(href|src)="([^"]*)"$/\2/' | sort -u)

if [[ -z "$ASSETS" ]]; then
  echo "No _next assets found in $HOST/store"
  exit 1
fi

echo "Found assets:"; echo "$ASSETS"

FAILURES=0
while IFS= read -r asset; do
  # If asset is relative path, prefix with host
  if [[ "$asset" =~ ^https?:// ]]; then
    url="$asset"
  elif [[ "$asset" =~ ^// ]]; then
    url="http:${asset}"
  else
    # Ensure absolute path
    if [[ "$asset" =~ ^/ ]]; then
      url="$HOST${asset}"
    else
      url="$HOST/$asset"
    fi
  fi

  status=$(curl -sS -o /dev/null -w "%{http_code}" "$url" || echo "000")
  if [[ "$status" != "200" && "$status" != "304" && "$status" != "301" && "$status" != "302" ]]; then
    echo "FAIL: $url returned $status"
    FAILURES=$((FAILURES+1))
  else
    echo "OK:   $url -> $status"
  fi
done <<< "$ASSETS"

if [[ "$FAILURES" -gt 0 ]]; then
  echo "Some assets returned non-OK status: $FAILURES failures"
  exit 2
fi

echo "All _next assets on $HOST/store returned OK"
