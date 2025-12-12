#!/usr/bin/env bash
set -euo pipefail

# Deploy webhook server to a remote host and configure systemd service
# Usage: ./scripts/deploy-webhook-systemd.sh <ssh_user> <ssh_host> <dest_dir> [service_user]

SSH_USER=${1:-}
SSH_HOST=${2:-}
DEST_DIR=${3:-/var/www/webhook}
SERVICE_USER=${4:-webhook}

if [[ -z "$SSH_USER" || -z "$SSH_HOST" ]]; then
  echo "Usage: $0 <ssh_user> <ssh_host> <dest_dir> [service_user]"
  exit 1
fi

echo "Deploying webhook to $SSH_USER@$SSH_HOST:$DEST_DIR as service user $SERVICE_USER"

# Rsync files (exclude node_modules)
rsync -avz --delete --exclude node_modules server/ "$SSH_USER@$SSH_HOST:$DEST_DIR/"

# Copy systemd unit template and create env file with secrets (remote will need sudo)
REMOTE_SVC=/etc/systemd/system/webhook.service
ssh "$SSH_USER@$SSH_HOST" "sudo mkdir -p $(dirname $REMOTE_SVC)"

# Push env file.
echo "Create remote env file at /etc/webhook/env (requires sudo)"
ssh "$SSH_USER@$SSH_HOST" "sudo mkdir -p /etc/webhook && sudo chown $SSH_USER /etc/webhook"
cat > /tmp/webhook.env <<EOF
STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY:-}
STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET:-}
SUPABASE_URL=${SUPABASE_URL:-}
SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY:-}
PORT=${WEBHOOK_PORT:-4000}
EOF
scp /tmp/webhook.env "$SSH_USER@$SSH_HOST:/tmp/webhook.env"
ssh "$SSH_USER@$SSH_HOST" "sudo mv /tmp/webhook.env /etc/webhook/env && sudo chown root:root /etc/webhook/env && sudo chmod 600 /etc/webhook/env"
rm /tmp/webhook.env

# Upload service file (replace WorkingDirectory and user)
SERVICE_TEMPLATE=$(cat deploy/webhook.service)
SERVICE_CONTENT=$(echo "$SERVICE_TEMPLATE" | sed "s|WorkingDirectory=/var/www/webhook|WorkingDirectory=$DEST_DIR|g" | sed "s|User=webhook|User=$SERVICE_USER|g")
echo "$SERVICE_CONTENT" > /tmp/webhook.service
scp /tmp/webhook.service "$SSH_USER@$SSH_HOST:/tmp/webhook.service"
ssh "$SSH_USER@$SSH_HOST" "sudo mv /tmp/webhook.service /etc/systemd/system/webhook.service"
rm /tmp/webhook.service

# Ensure Node (>=18) is present, install pm2 optionally
ssh "$SSH_USER@$SSH_HOST" "sudo apt-get update && sudo apt-get install -y nodejs npm || true"
ssh "$SSH_USER@$SSH_HOST" "sudo npm install -g pm2 || true"

ssh "$SSH_USER@$SSH_HOST" "sudo systemctl daemon-reload && sudo systemctl enable --now webhook.service"

echo "Webhook service deployed and started"
