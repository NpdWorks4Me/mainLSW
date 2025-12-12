#!/usr/bin/env bash
set -euo pipefail

# Verify deployed host has functional _next assets on both root and /admin pages
# Usage: ./scripts/verify-hosting-deploy.sh <host>
# Example: ./scripts/verify-hosting-deploy.sh https://littlespaceworld.com

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <host>"
  exit 1
fi

HOST=$1
TMPHTML=$(mktemp)
trap 'rm -f "$TMPHTML"' EXIT

check_page() {
  local path=$1
  echo "Checking $HOST$path"
  curl -sSL "$HOST$path" -o "$TMPHTML" || { echo "Failed to fetch $HOST$path"; return 2; }
  ASSETS=$(grep -oE '(href|src)="[^"]*(_next/static[^"]*)"' "$TMPHTML" | sed -E 's/^(href|src)="([^"]*)"$/\2/' | sort -u)
  # If no _next assets found, also accept assets under /assets/ used by Hostinger builds
  if [[ -z "$ASSETS" ]]; then
    ASSETS=$(grep -oE '(href|src)="[^"]*(/assets/[^"]*)"' "$TMPHTML" | sed -E 's/^(href|src)="([^"]*)"$/\2/' | sort -u)
  fi
  if [[ -z "$ASSETS" ]]; then
    echo "WARN: No _next assets found on $HOST$path"
    return 1
  fi
  FAILS=0
  while IFS= read -r asset; do
    if [[ "$asset" =~ ^https?:// ]]; then
      url="$asset"
    elif [[ "$asset" =~ ^// ]]; then
      url="http:${asset}"
    else
      if [[ "$asset" =~ ^/ ]]; then
        url="$HOST${asset}"
      else
        url="$HOST/$asset"
      fi
    fi
    status=$(curl -sS -o /dev/null -w "%{http_code}" "$url" || echo "000")
    if [[ "$status" != "200" && "$status" != "304" && "$status" != "301" && "$status" != "302" ]]; then
      echo "FAIL: $url returned $status"
      FAILS=$((FAILS+1))
    else
      echo "OK:   $url -> $status"
    fi
  done <<< "$ASSETS"
  return $FAILS
}

TOTAL_FAILS=0
check_page "/" || TOTAL_FAILS=$((TOTAL_FAILS+$?))
# If second param is 'subdomain', skip checking /admin. Useful for admin subdomain hosting.
if [[ "${2:-}" != "subdomain" ]]; then
  check_page "/admin" || TOTAL_FAILS=$((TOTAL_FAILS+$?))
fi

if [[ "$TOTAL_FAILS" -gt 0 ]]; then
  echo "Total failures: $TOTAL_FAILS"
  exit 2
fi
echo "All check(s) passed; _next assets exist and respond for / and /admin on $HOST"
