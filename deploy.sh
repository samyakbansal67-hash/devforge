#!/bin/bash
# Deploy DevForge to Hostinger
# Usage: ./deploy.sh

set -e

echo "=== DevForge Deploy Script ==="

# Check if rsync is available
if ! command -v rsync &> /dev/null; then
  echo "Installing rsync..."
  apt-get update && apt-get install -y rsync openssh-client
fi

# Load config
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

HOST="${HOSTINGER_HOST:-your-hostinger.com}"
PORT="${HOSTINGER_PORT:-22}"
USER="${HOSTINGER_USER:-yourusername}"
PASSWORD="${HOSTINGER_PASSWORD}"
REMOTE_PATH="${HOSTINGER_PATH:-/public_html/devforge}"

if [ -z "$PASSWORD" ]; then
  echo "ERROR: HOSTINGER_PASSWORD not set. Create a .env file with:"
  echo "  HOSTINGER_HOST=your-server.hostinger.com"
  echo "  HOSTINGER_USER=your-username"
  echo "  HOSTINGER_PASSWORD=your-password"
  echo "  HOSTINGER_PATH=/public_html/devforge"
  exit 1
fi

echo "Deploying to $USER@$HOST:$REMOTE_PATH ..."

# Install deps locally if needed
npm install --silent 2>/dev/null || true

# Sync files to Hostinger
sshpass -p "$PASSWORD" rsync -avz --exclude='node_modules' --exclude='.git' --exclude='.env' \
  -e "ssh -p $PORT" \
  ./ "$USER@$HOST:$REMOTE_PATH/"

echo "Restarting PM2 service..."
sshpass -p "$PASSWORD" ssh -p $PORT "$USER@$HOST" \
  "cd $REMOTE_PATH && npm install --silent && pm2 restart devforge || pm2 start server.js --name devforge"

echo "✅ Deploy complete!"
echo "Visit https://your-domain.com to verify"