# DJ Mix Console

## Deutsch

### 🚨 Ziel
Erstelle eine vollständig clientseitige React-App (TypeScript), die zwei Pioneer **CDJ‑3000** Player und einen **DJM‑A9** Mixer funktional und visuell nachbildet. Die Anwendung läuft komplett im Browser – ohne Backend, ohne KI und ohne API-Schlüssel.

### 📦 Installation auf Ubuntu Server
Führe auf deinem Server folgenden Befehl aus:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/meinzeug/djmixconsole2/main/install.sh)
```

Das Skript fragt nach deiner Domain und installiert anschließend:

- **Nginx** als Webserver
- **Node.js 22** mit dem Paketmanager **npm**
- **Git** zum Klonen des Repository
- **Certbot** samt `python3-certbot-nginx` für ein automatisches Let's Encrypt Zertifikat
- **rsync** und **curl**
- das globale npm-Paket **vite**

Danach wird der Quellcode geladen, gebaut und unter `/var/www/<domain>` abgelegt. Nginx wird für deine Domain konfiguriert, inklusive HTTPS via Let's Encrypt.

### 🎟 Features
- MP3-Import direkt beim Start – lokale Dateien bleiben lokal
- Zwei virtuelle **CDJ‑3000** oder wahlweise **SL‑1200** Player
- Vollwertiger **DJM‑A9** Mixer mit 4 Kanälen und Beat FX
- Jogwheel-Steuerung, Hot Cues, Loops, Beat/Key Sync
- Tastatursteuerung für alle wichtigen Funktionen
- Offline nutzbar, alle Daten im Browser gespeichert

### 📢 Entwicklung
1. `npm ci`
2. `npm run dev`
3. Achte darauf, dass optionale Abhängigkeiten wie `zustand` und `immer` installiert sind.

---

## English

### 🚀 Goal
This project recreates two Pioneer **CDJ‑3000** players and a **DJM‑A9** mixer entirely in the browser using React and TypeScript. No backend, no AI, no API keys.

### 🛠 Install on Ubuntu Server
Run the command below on your server:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/meinzeug/djmixconsole2/main/install.sh)
```

The script will ask for your domain and then install:

- **Nginx** web server
- **Node.js 22** and **npm**
- **Git** for cloning the repository
- **Certbot** with `python3-certbot-nginx` to obtain a Let's Encrypt certificate
- **rsync** and **curl**
- global npm package **vite**

Afterwards the source is copied to `/var/www/<domain>`, built and served via Nginx. HTTPS is automatically configured for your domain.

### 🎟 Features
- Import local MP3s when the app starts – files never leave your browser
- Two virtual **CDJ‑3000** (or **SL‑1200**) players
- Full **DJM‑A9** mixer with four channels and Beat FX
- Jog wheel control, hot cues, loops, beat/key sync
- Keyboard shortcuts for every important action
- Works offline with all data stored in the browser

### 📝 Development
1. `npm ci`
2. `npm run dev`
3. Ensure optional dependencies like `zustand` and `immer` are installed.
