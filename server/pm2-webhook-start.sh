#!/usr/bin/env bash
set -euo pipefail

# Start the webhook Node app with pm2 in production
export NODE_ENV=production
PM2_NAME=${PM2_NAME:-webhook}
WEBHOOK_DIR=${WEBHOOK_DIR:-$(pwd)}

cd "$WEBHOOK_DIR"
if ! command -v pm2 >/dev/null 2>&1; then
  echo "pm2 not found; installing globally"
  npm install -g pm2
fi

echo "Starting webhook with pm2 as $PM2_NAME"
pm2 start server/webhook.js --name "$PM2_NAME" --update-env --restart-delay 3000 || pm2 restart "$PM2_NAME"
pm2 save
