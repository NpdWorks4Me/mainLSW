#!/usr/bin/env bash
set -euo pipefail

echo "Supabase migration runner"

SUPABASE_DB_URL=${SUPABASE_DB_URL:-}
SUPABASE_TOKEN=${SUPABASE_TOKEN:-}
SUPABASE_PROJECT_REF=${SUPABASE_PROJECT_REF:-}

if [[ -n "$SUPABASE_TOKEN" && -n "$SUPABASE_PROJECT_REF" ]]; then
  echo "Using supabase CLI to apply migrations to project: $SUPABASE_PROJECT_REF"
  if ! command -v supabase >/dev/null 2>&1; then
    echo "supabase CLI not found, installing..."
    npm install -g supabase
  fi
  echo "supabase cli version: $(supabase --version)"
  echo "Logging into supabase CLI"
  supabase login --token "$SUPABASE_TOKEN" || true
  echo "Pushing database migrations via supabase db push --project $SUPABASE_PROJECT_REF"
  supabase db push --project "$SUPABASE_PROJECT_REF"
  exit 0
fi

if [[ -n "$SUPABASE_DB_URL" ]]; then
  echo "Applying SQL migrations from supabase/migrations using psql to $SUPABASE_DB_URL"
  if ! command -v psql >/dev/null 2>&1; then
    echo "psql not found. Please install the PostgreSQL client (psql) in your CI environment."
    exit 1
  fi
  for f in supabase/migrations/*.sql; do
    if [[ -f "$f" ]]; then
      echo "Applying $f"
      psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f "$f"
    fi
  done
  exit 0
fi

echo "No SUPABASE_TOKEN+PROJECT_REF or SUPABASE_DB_URL provided. Nothing to apply."
exit 0
