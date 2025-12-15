#!/usr/bin/env bash
set -euo pipefail

# Verify deployed host has functional _next or /assets assets on both root and /admin pages
# Usage: ./scripts/verify-hosting-deploy.sh <host> [hostHeader] [subdomain]
# Example (normal): ./scripts/verify-hosting-deploy.sh https://littlespaceworld.com
# Example (IP with Host header): ./scripts/verify-hosting-deploy.sh https://212.85.28.200 littlespaceworld.com

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <host> [hostHeader] [subdomain]"
  exit 1
fi

HOST=$1
HOST_HEADER_PARAM=${2:-}
TMPHTML=$(mktemp)
trap 'rm -f "$TMPHTML"' EXIT

# Extract hostname portion to detect IP vs domain
HOST_ONLY=$(echo "$HOST" | sed -E 's#^https?://([^/:]+).*#\1#')
IS_IPV4=0
if [[ "$HOST_ONLY" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  IS_IPV4=1
fi

# If IP is used, prefer an explicit host header passed as second arg or env VERIFY_HOST_HEADER
HOST_HEADER=""
if [[ "$IS_IPV4" -eq 1 ]]; then
  if [[ -n "${VERIFY_HOST_HEADER:-}" ]]; then
    HOST_HEADER="$VERIFY_HOST_HEADER"
  elif [[ -n "$HOST_HEADER_PARAM" && "$HOST_HEADER_PARAM" != "subdomain" ]]; then
    HOST_HEADER="$HOST_HEADER_PARAM"
  else
    echo "ERROR: Host is an IP address ($HOST_ONLY) but no Host header provided."
    echo "       Call: $0 $HOST <hostHeader>  OR set VERIFY_HOST_HEADER env var."
    exit 2
  fi
fi

# Default curl options (silent + follow)
CURL_OPTS=(-sSL)
# If hitting an IP with HTTPS use -k to ignore cert hostname mismatch and add Host header
if [[ "$IS_IPV4" -eq 1 ]]; then
  CURL_OPTS+=( -k )
fi

check_page() {
  local path=$1
  echo "Checking $HOST$path"

  # Fetch page
  if [[ -n "$HOST_HEADER" ]]; then
    curl "${CURL_OPTS[@]}" -H "Host: $HOST_HEADER" "$HOST$path" -o "$TMPHTML" || { echo "Failed to fetch $HOST$path"; return 2; }
  else
    curl "${CURL_OPTS[@]}" "$HOST$path" -o "$TMPHTML" || { echo "Failed to fetch $HOST$path"; return 2; }
  fi

  # Detect old/dev-like references that indicate an unbuilt/dev site is being served
  DEV_REFS=$(grep -oE '(src|href)="[^"]*/src/[^"]*"' "$TMPHTML" || true)
  if [[ -n "$DEV_REFS" ]]; then
    echo "ERROR: Dev-like references found on $HOST$path:" 
    echo "$DEV_REFS" | sed -n '1,20p'
    echo "This indicates the site is serving unbuilt source files (e.g., /src/...)."
    return 3
  fi

  # Find assets. Prioritize _next/static (legacy Next.js) then /assets (Vite/Hostinger) then ./assets
  ASSETS=$(grep -oE '(href|src)="[^"]*(_next/static[^"]*)"' "$TMPHTML" | sed -E 's/^(href|src)="([^"]*)"$/\2/' | sort -u || true)
  if [[ -z "$ASSETS" ]]; then
    ASSETS=$(grep -oE '(href|src)="[^"]*(/assets/[^" ]*)"' "$TMPHTML" | sed -E 's/^(href|src)="([^"]*)"$/\2/' | sort -u || true)
  fi
  if [[ -z "$ASSETS" ]]; then
    ASSETS=$(grep -oE '(href|src)="[^"]*(\./assets/[^" ]*)"' "$TMPHTML" | sed -E 's/^(href|src)="([^"]*)"$/\2/' | sort -u || true)
  fi

  if [[ -z "$ASSETS" ]]; then
    echo "WARN: No _next or /assets assets found on $HOST$path"
    return 1
  fi

  FAILS=0
  while IFS= read -r asset; do
    if [[ -z "$asset" ]]; then
      continue
    fi
    if [[ "$asset" =~ ^https?:// ]]; then
      url="$asset"
      extra_opts=()
    elif [[ "$asset" =~ ^// ]]; then
      url="https:${asset}"
      extra_opts=()
    else
      # Normalize leading ./
      clean_asset="$asset"
      clean_asset="${clean_asset#./}"
      # If asset is absolute (/assets/...), just join with host
      if [[ "$clean_asset" =~ ^/ ]]; then
        url="$HOST${clean_asset}"
      else
        url="$HOST/${clean_asset}"
      fi
      extra_opts=()
    fi

    # Use Host header and -k if needed
    if [[ -n "$HOST_HEADER" ]]; then
      if [[ "$url" =~ ^https:// ]]; then
        status=$(curl -sS -o /dev/null -w "%{http_code}" -k -H "Host: $HOST_HEADER" "$url" || echo "000")
      else
        status=$(curl -sS -o /dev/null -w "%{http_code}" -H "Host: $HOST_HEADER" "$url" || echo "000")
      fi
    else
      status=$(curl -sS -o /dev/null -w "%{http_code}" "$url" || echo "000")
    fi

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
check_page "/" "$HOST_HEADER" || TOTAL_FAILS=$((TOTAL_FAILS+$?))
# If second param is 'subdomain', skip checking /admin. Useful for admin subdomain hosting.
if [[ "${3:-}" != "subdomain" ]]; then
  check_page "/admin" "$HOST_HEADER" || TOTAL_FAILS=$((TOTAL_FAILS+$?))
fi

if [[ "$TOTAL_FAILS" -gt 0 ]]; then
  echo "Total failures: $TOTAL_FAILS"
  exit 2
fi
echo "All check(s) passed; assets exist and respond for / and /admin on $HOST"
