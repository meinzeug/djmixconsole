#!/bin/bash

# This script sets up nginx with Let's Encrypt and deploys the djmixconsole
# on a fresh Ubuntu server for the domain meinzeug.cloud.

set -e

if [ "$(id -u)" -ne 0 ]; then
  echo "Please run as root" >&2
  exit 1
fi

DOMAIN="meinzeug.cloud"
EMAIL="admin@meinzeug.cloud"
REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
TARGET_DIR="/var/www/djmixconsole"

apt update && apt upgrade -y
apt install -y nginx git nodejs npm certbot python3-certbot-nginx

mkdir -p "$TARGET_DIR"
rsync -a --exclude=".git" "$REPO_DIR/" "$TARGET_DIR/"
cd "$TARGET_DIR"
npm install
npm run build

NGINX_CONF="/etc/nginx/sites-available/djmixconsole"
cat > "$NGINX_CONF" <<NGINX
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    root $TARGET_DIR/dist;
    index index.html;
    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
NGINX

ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/djmixconsole
rm -f /etc/nginx/sites-enabled/default

systemctl reload nginx
certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" \
    --non-interactive --agree-tos -m "$EMAIL" --redirect

systemctl reload nginx

echo "Installation complete. Visit https://$DOMAIN"
