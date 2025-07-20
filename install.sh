#!/bin/bash

# This script manages the deployment of the djmixconsole.
# It can install, update, deinstall or reinstall the application and its
# dependencies. Existing Let's Encrypt certificates are kept during
# deinstallation so that they can be reused on the next installation.

set -e

if [ "$(id -u)" -ne 0 ]; then
  echo "Please run as root" >&2
  exit 1
fi

echo "Select mode:"
echo "  (i)nstall"
echo "  (u)pdate"
echo "  (d)einstall"
echo "  (r)einstall"
read -rp "Choice: " MODE
MODE=$(echo "$MODE" | tr '[:upper:]' '[:lower:]')

case "$MODE" in
  i|install)
    MODE="install"
    ;;
  u|update)
    MODE="update"
    ;;
  d|deinstall)
    MODE="deinstall"
    ;;
  r|reinstall)
    MODE="reinstall"
    ;;
  *)
    echo "Invalid mode" >&2
    exit 1
    ;;
esac

case "$MODE" in
  install|reinstall)
    read -rp "Enter your domain (e.g., example.com): " DOMAIN
    read -rp "Enter your email address for Let's Encrypt: " EMAIL
    read -rp "Enter your name: " NAME
    ;;
  update|deinstall)
    read -rp "Enter your domain (e.g., example.com): " DOMAIN
    ;;
esac

REPO_URL="https://github.com/meinzeug/djmixconsole.git"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
if [ -d "$SCRIPT_DIR/.git" ] || [ -f "$SCRIPT_DIR/package.json" ]; then
  REPO_DIR="$SCRIPT_DIR"
else
  REPO_DIR="/tmp/djmixconsole"
  if ! command -v git >/dev/null; then
    apt-get update
    apt-get install -y git
  fi
  if [ -d "$REPO_DIR/.git" ]; then
    git -C "$REPO_DIR" pull --ff-only
  else
    git clone --depth 1 "$REPO_URL" "$REPO_DIR"
  fi
fi
TARGET_DIR="/var/www/${DOMAIN}"

install_pkg() {
  dpkg -s "$1" >/dev/null 2>&1 || apt-get install -y "$1"
}

install_node() {
  if ! command -v node >/dev/null || ! node --version | grep -q '^v22'; then
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    apt-get install -y nodejs
  fi
}

install_vite() {
  if ! command -v vite >/dev/null; then
    npm install -g vite
  fi
}

remove_installed() {
  apt-get remove -y nginx git nodejs rsync >/dev/null 2>&1 || true
  apt-get autoremove -y
  rm -rf "$TARGET_DIR"
  rm -f "/etc/nginx/sites-enabled/${DOMAIN}"
  rm -f "/etc/nginx/sites-available/${DOMAIN}"
  systemctl reload nginx || true
}

do_install() {
  apt-get update
  apt-get upgrade -y

  install_pkg nginx
  install_pkg git
  install_pkg rsync
  install_pkg certbot
  install_pkg python3-certbot-nginx

  install_node
  install_vite

  mkdir -p "$TARGET_DIR"
  rsync -a --exclude=".git" "$REPO_DIR/" "$TARGET_DIR/"
  cd "$TARGET_DIR"
  npm install
  npm run build

  NGINX_CONF="/etc/nginx/sites-available/${DOMAIN}"
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

  ln -sf "$NGINX_CONF" "/etc/nginx/sites-enabled/${DOMAIN}"
  rm -f /etc/nginx/sites-enabled/default

  systemctl reload nginx

  CERT_EXIST=no
  if [ -d "/etc/letsencrypt/live/${DOMAIN}" ]; then
    read -rp "Use existing certificate? (y/n): " CERT_CHOICE
    CERT_CHOICE=$(echo "$CERT_CHOICE" | tr '[:upper:]' '[:lower:]')
    case "$CERT_CHOICE" in
      y|yes|"" ) CERT_EXIST=yes ;;
      n|no) CERT_EXIST=no ;;
    esac
  fi

  if [ "$CERT_EXIST" = "no" ]; then
    certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" \
      --non-interactive --agree-tos -m "$EMAIL" --redirect
  fi

  systemctl reload nginx
  echo "Installation complete, $NAME. Visit https://$DOMAIN"
}

do_update() {
  if [ ! -d "$TARGET_DIR" ]; then
    echo "Target directory $TARGET_DIR does not exist." >&2
    exit 1
  fi
  apt-get update
  apt-get upgrade -y
  install_pkg nginx
  install_pkg git
  install_pkg rsync
  install_pkg certbot
  install_pkg python3-certbot-nginx
  install_node
  install_vite
  rsync -a --exclude=".git" "$REPO_DIR/" "$TARGET_DIR/"
  cd "$TARGET_DIR"
  npm install
  npm run build
  systemctl reload nginx
  echo "Update complete for $DOMAIN"
}

do_deinstall() {
  remove_installed
  echo "Deinstallation complete for $DOMAIN"
}

case "$MODE" in
  install)
    do_install
    ;;
  update)
    do_update
    ;;
  deinstall)
    do_deinstall
    ;;
  reinstall)
    remove_installed
    do_install
    ;;
esac

