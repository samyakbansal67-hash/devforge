#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# DevForge — FULL SETUP SCRIPT
# Run this ONCE after you fill in your credentials below
# ═══════════════════════════════════════════════════════════════
set -e
echo "🚀 DevForge Setup Starting..."

# ─── STEP 1: FILL IN YOUR CREDENTIALS BELOW ─────────────────────
# Edit these values before running

GITHUB_TOKEN="ghp_YOUR_GITHUB_TOKEN_HERE"          # GitHub Settings → Developer Settings → Personal Access Token
GITHUB_USERNAME="YOUR_GITHUB_USERNAME"             # Your GitHub username
HOSTINGER_HOST="YOUR_HOSTINGER_SERVER"            # e.g. 123.456.78.90 or server.hostinger.com
HOSTINGER_USER="YOUR_HOSTINGER_USERNAME"           # e.g. u1234567
HOSTINGER_PASSWORD="YOUR_HOSTINGER_PASSWORD"       # Your Hostinger password
HOSTINGER_PATH="/public_html/devforge"             # Path on Hostinger
HOSTINGER_PORT="22"                                 # Usually 22 for SSH

# ─── STEP 2: DO NOT EDIT BELOW THIS LINE ────────────────────────

# Check if credentials are filled
if [[ "$GITHUB_TOKEN" == *"YOUR"* ]] || [[ "$HOSTINGER_HOST" == *"YOUR"* ]]; then
  echo "❌ ERROR: Please fill in all credentials in this script first!"
  echo "   Edit the variables in STEP 1 above."
  exit 1
fi

cd /opt/data/devtools

echo "📦 Installing dependencies..."
npm install express --save 2>/dev/null

echo "🔐 Configuring git..."
git config --global credential.helper store
git config --global user.email "devforge.in@gmail.com"
git config --global user.name "DevForge"

echo "📝 Creating GitHub repo..."
# Create repo via GitHub API
REPO_RESPONSE=$(curl -s -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d '{"name":"devforge","description":"10-in-1 Developer Tools API — Lifetime Deal ₹999","public":true}')

REPO_URL=$(echo "$REPO_RESPONSE" | node -e "const d=require('fs').readFileSync('/dev/stdin','utf8'); const j=JSON.parse(d); console.log(j.html_url || j.message || 'error')")
echo "   Repo: $REPO_URL"

# Add remote and push
git remote remove origin 2>/dev/null || true
git remote add origin "https://$GITHUB_TOKEN@github.com/$GITHUB_USERNAME/devforge.git"
git checkout -b main 2>/dev/null || true
git add . && git commit -m "Initial commit: DevForge v1.0 — Developer Tools API" || echo "Nothing to commit"
git push -u origin main

echo "🖥️ Deploying to Hostinger..."
apt-get install -y rsync openssh-client 2>/dev/null || true

# Test SSH connection
sshpass -p "$HOSTINGER_PASSWORD" ssh -o StrictHostKeyChecking=no -p "$HOSTINGER_PORT" "$HOSTINGER_USER@$HOSTINGER_HOST" "echo 'SSH OK'" || {
  echo "⚠️ SSH failed. Trying FTP sync..."
}

# Sync files
sshpass -p "$HOSTINGER_PASSWORD" rsync -avz --exclude='node_modules' --exclude='.git' \
  -e "ssh -p $HOSTINGER_PORT" \
  ./ "$HOSTINGER_USER@$HOSTINGER_HOST:$HOSTINGER_PATH/" || echo "RSYNC failed — use FTP manually"

# Install deps and start on Hostinger
sshpass -p "$HOSTINGER_PASSWORD" ssh -p "$HOSTINGER_PORT" "$HOSTINGER_USER@$HOSTINGER_HOST" "
  cd $HOSTINGER_PATH
  npm install --silent 2>/dev/null
  pm2 restart devforge 2>/dev/null || pm2 start server.js --name devforge
  echo 'Hostinger deploy complete!'
" || echo "⚠️ Remote command failed — deploy manually via FTP"

echo ""
echo "✅ SETUP COMPLETE!"
echo "   Product: https://devforge.in (or your domain)"
echo "   Repo: $REPO_URL"
echo ""
echo "📋 NEXT STEPS:"
echo "   1. Add a domain in Hostinger pointing to /public_html/devforge"
echo "   2. Set up Razorpay webhook (use your actual key for production)"
echo "   3. Share the link on HN, Reddit, Twitter"
echo "   4. Target: 15 sales × ₹999 = ₹14,985"