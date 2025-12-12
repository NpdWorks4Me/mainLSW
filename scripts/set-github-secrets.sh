#!/usr/bin/env bash
set -euo pipefail

# Script to set the repository secrets using GitHub CLI (gh)
# Requires: gh (https://cli.github.com/) and 'gh auth login' configured for your account

REPO=${1:-}
if [[ -z "$REPO" ]]; then
  # try to detect from git
  if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    origin=$(git remote get-url origin || true)
    if [[ -n "$origin" ]]; then
      # convert git@github.com:owner/repo.git to owner/repo
      if [[ "$origin" =~ github.com[:/](.+) ]]; then
        REPO=${BASH_REMATCH[1]}
      fi
    fi
  fi
fi

if [[ -z "$REPO" ]]; then
  echo "Usage: $0 [owner/repo]"
  echo "Either pass the repo path or run within the repo with a valid origin remote."
  exit 1
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI not found. Install from https://cli.github.com/."
  exit 1
fi

declare -a secrets=(
  "VITE_SUPABASE_URL"
  "VITE_SUPABASE_ANON_KEY"
  "SUPABASE_URL"
  "SUPABASE_ANON_KEY"
  "SUPABASE_SERVICE_ROLE_KEY"
  "HOSTINGER_SSH_HOST"
  "HOSTINGER_SSH_USERNAME"
  "HOSTINGER_SSH_PRIVATE_KEY"
  "HOSTINGER_SSH_PORT"
  "HOSTINGER_FTP_HOST"
  "HOSTINGER_FTP_USERNAME"
  "HOSTINGER_FTP_PASSWORD"
  "HOSTINGER_FTP_PORT"
  "HOSTINGER_TARGET_DIR_MAIN"
  # Hostinger admin target is deprecated - admin UI removed from this repo
  "HOSTINGER_API_TOKEN"
  "HOSTINGER_SITE_ID"
  "HOSTINGER_SITE_URL"
  "STRIPE_SECRET_KEY"
  "STRIPE_WEBHOOK_SECRET"
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
  "WEBHOOK_SSH_HOST"
  "WEBHOOK_SSH_USER"
  "WEBHOOK_SSH_PRIVATE_KEY"
  "WEBHOOK_DEST_DIR"
  "SUPABASE_DB_URL"
  "SUPABASE_TOKEN"
  "SUPABASE_PROJECT_REF"
)

echo "Setting repository secrets for: $REPO"

for name in "${secrets[@]}"; do
  envvar_val="${!name:-}" || envvar_val=""
  if [[ -z "$envvar_val" ]]; then
    read -rp "Enter secret value for $name (leave blank to skip): " envvar_val
  fi
  if [[ -n "$envvar_val" ]]; then
    # if value looks like a path to a file, and file exists, read it
    if [[ -f "$envvar_val" ]]; then
      val=$(<"$envvar_val")
    else
      val="$envvar_val"
    fi
    echo "Setting secret $name..."
    printf '%s' "$val" | gh secret set "$name" --repo "$REPO" --body -
  else
    echo "Skipped $name"
  fi
done

echo "All done. Secrets have been set (for those you provided)."
