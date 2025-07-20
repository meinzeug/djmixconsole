# 🎧 Browserbasierte DJ Mix App – CDJ-3000 & DJM-A9 Nachbildung (ohne KI, ohne Anhang)

## 🚀 Installation auf Ubuntu
Führe im Terminal den folgenden Befehl aus, um die Anwendung und alle Abhängigkeiten zu installieren:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/meinzeug/djmixconsole/main/install.sh)
```

## 🛠️ Ziel
Erstelle eine vollständig clientseitige React-App (TypeScript), die zwei Pioneer **CDJ‑3000** Player und einen **DJM‑A9** Mixer funktional und visuell nachbildet. Die Anwendung soll **offlinefähig im Browser laufen** – ohne Backend, ohne KI, ohne API-Schlüssel.

---

## 📂 MP3-Import beim App-Start
Beim Start der App öffnet sich ein Dateiauswahl-Dialog, mit dem der Nutzer **lokale MP3-Dateien** von seinem Gerät auswählt.  
Diese Tracks werden in eine persönliche **Musikkollektion im Speicher (localStorage)** geladen.  
Von dort aus kann der User sie in die beiden virtuellen Decks (Player 1/2) laden und frei mixen.  
Dateiverwaltung erfolgt ausschließlich im Browser – kein Upload oder Serverkontakt.
Jedes Deck kann zwischen CDJ‑3000 und SL‑1200 umgeschaltet werden; die Auswahl wird im localStorage gespeichert.

---

## 🎚️ CDJ-3000 Funktionen (pro Player)

### 🔹 Oberfläche:
- 9″ Touchscreen mit Wellenformanzeige, Track-Info, Hot Cues, Loops, Timecode
- Jogwheel (beleuchtet, mit Track-Cover, Slip, Vinyl-Modus)
- 8 Hot Cue Buttons (RGB), CUE/PLAY Buttons
- Loop In/Out, Auto Loop, Loop Exit, Beat Jump ±
- Slip Mode, Reverse
- Tempo-Fader (mit ±6/10/16/WIDE), Key Sync, Master Tempo

### 🔹 Hauptfunktionen:
- MP3/WAV/FLAC-Audio über FileReader API laden
- Track-Scrubbing per Touch oder Tastatur
- Hot Cue setzen, löschen, triggern
- Loop setzen, editieren, verlassen
- Beat Sync & Key Sync
- Visualisierung: Waveform (z. B. wavesurfer.js), Cue- & Loop-Overlays
- Touch- oder Tastatursteuerung (CapsLock-Modus)

---

## 🎛️ DJM-A9 Mixer

### 🔹 Oberfläche:
- 4 Kanäle mit: Gain, 3-Band EQ (HI/MID/LOW), Color FX, Kanal-Fader
- Crossfader mit A/B-Zuweisung + 3 Curve-Modi
- 14 Beat FX (Reverb, Delay, Mobius, Spiral, Echo usw.)
- X-Pad Steuerung (Wet/Dry)
- Mic: 2 Eingänge mit EQ, Push-To-Talk, Talkover
- Booth Out & Master Out Pegelanzeige
- Kopfhörer-Monitoring mit CUE A/B, Mono Split, Mix-Regler

### 🔹 Hauptfunktionen:
- Audio-Routing: 2 CDJs auf CH1/CH2 → Master Out
- FX-Routing auf Kanäle und/oder Master
- Pegelanzeigen, EQ-Isolator-Modi, Center-Lock für Color FX
- Mic-Handling mit Reverb/Echo + Volume/Talkover
- Booth Out mit eigenem EQ

---

## 🎹 Tastatursteuerung (CapsLock aktiviert)
- Player 1: Q–I für Hot Cues, A–F für Loops, ←/→ Jog, SPACE = Play
- Player 2: U–L für Hot Cues, V–M für Loops, ,/. Jog, ENTER = Play
- Mixer: 1–4 = Kanalwahl, ↑/↓ Gain, R/F/V = EQ, TAB = Crossfader, M = Mic Push

---

## 📦 Technisches Setup
- React (TypeScript)
- Tailwind CSS
- Zustand oder Context API
- Web Audio API (FX, Volume, Routing)
- Canvas oder SVG für visuelle Bedienelemente
- Speicherung: localStorage (temporäre Kollektion), keine Datenbank

---

✅ Ziel: Eine portable, realitätsgetreue DJ-Demo-App, die sich komplett im Browser bedienen lässt – ohne Cloud, ohne Server, ohne KI. Nur du, deine Tracks und zwei virtuelle High-End-Player.

## Development
1. npm install
2. npm run dev
3. Falls die Build-Phase auf "immer" Bezug nimmt, stelle sicher, dass sowohl
   `zustand` als auch `immer` installiert sind (bereits in `package.json`
   hinterlegt).

