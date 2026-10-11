# Website-Status

Diese Datei hält fest, wo das Projekt steht. Der Skill `website-bauen` liest sie bei jedem Aufruf und macht dort weiter.

Status: ✅ erledigt · 🔄 läuft · ⬜ offen

| Phase | Name | Status | Datum |
|---|---|---|---|
| 0 | Einrichten | ✅ | 11.10.2026 |
| 1 | Fundament | 🔄 Markenprofil und PRODUCT.md fertig, Bestätigung offen | 11.10.2026 |
| 2 | Recherche | ⏭ vorerst übersprungen | 11.10.2026 |
| 3 | Texte | 🔄 Entwurf 2 in `texte.md` | 11.10.2026 |
| 4 | Design-Richtung | ⬜ | |
| 5 | Bauen | 🔄 Grundstruktur steht (`index.html`) | 11.10.2026 |
| 6 | Prüfen und Feinschliff | ⬜ | |
| 7 | Livegang | ⬜ | |
| 8 | Danach | ⬜ | |

## Ausgangslage

- Bestehende Website oder Marke: Marke **Bonuslife** vorhanden (Logo, Banner, Profilbilder in `../brand/`, DVD-Cover in `../cover/`). Keine Website. Verkauf bisher über eBay-Shop https://www.ebay.de/usr/bonuslife-shop
- Hauptziel der Seite: **Ankauf.** Besucher stellen eine Liste zusammen und schicken sie. Laufband oben mit aktiven Angeboten (live aus der Datenbank), Jobwerbung, Neuigkeiten. Später eventuell Direktkauf (Shopify-artig).
- Hosting: offen, wird in Phase 7 entschieden
- Projektordner: `website/` im Repo `dvd-scanner`, damit die App-Dateien `index.html` und `map.html` im Hauptordner unberührt bleiben
- Werkzeuge: impeccable 🔶 (Anleitungen im Projekt unter `.claude/skills/impeccable/`; das Hilfsprogramm mit den automatischen Prüfungen läuft in der Cloud nicht, lokal am Rechner vorhanden) · Playwright ✅ (Python, Version 1.56 passend zum vorinstallierten Chromium) · DataForSEO ⏭ (vorerst nicht, erst wenn der Ankauf über Google gefunden werden soll) · Hosting-MCP ⬜ · Formular-Ziel ⬜

## Marke

Gemessen aus den Logo-SVGs (`../brand/export/*.svg`) und den CSS-Variablen von Cover und Brand-Assets.

| Rolle | Wert |
|---|---|
| Hauptfarbe | Navy `#13204a` |
| Akzent | Rot `#9c1b2b` |
| helle Fläche | Creme `#f4ead2`, dunkleres Creme `#e8dcbc` für Felder |
| Text | Navy `#13204a`, gedämpft `#5b6380` |
| Überschriften | Press Start 2P (Pixel-Schrift), Gewicht 400, Großbuchstaben |
| Fließtext | Inter 400, Hervorhebung 600 und 800 |
| Merkmale | Pixel-Herz mit „+1“ im Ring (Extraleben aus Videospielen), Wortmarke BONUS (navy) + LIFE (rot), Slogan „USED ONCE. LOVED TWICE.“, Pixel-Dithering-Kanten, gestuftes rotes Band, Pixel-Icons, abgerundete Rahmen wie bei einer DVD-Hülle |

## Entscheidungen

- 11.10.2026: Die Seite übernimmt den Stil der Bonuslife-DVD-Hülle.
- 11.10.2026: Erst eine Grundstruktur bauen und ansehen, Inhalte liefert die Person nach und nach. Recherche (Phase 2) und eigene Design-Richtung (Phase 4) dafür vorerst übersprungen: Die Richtung ist die DVD-Hülle.
- 11.10.2026: Planänderung: Die Seite ist eine Ankaufsseite (Vorbild momox, rebuy). Oben ein Laufband mit Angeboten, Jobwerbung und Neuigkeiten.
- 11.10.2026: Betreiber bleiben anonym, Ansprache mit „du“.
- 11.10.2026: Live-Angebote kommen aus einer JSON-Quelle (`daten/README.md`), damit die Datenbank des Kumpels angeschlossen werden kann.

## Offene Fragen an die Person

- Wie läuft der Ankauf genau (Versand, Bezahlung, Fristen)? Bis dahin sagt die Seite nur „wir melden uns mit einem Angebot“.
- Wohin geht die Ankaufsliste: E-Mail-Adresse oder Schnittstelle der Datenbank?
- Text für die Jobwerbung im Laufband
- Instagram-Adresse und weitere Kanäle
- Impressum: Wer ist rechtlich verantwortlich? Eine gewerbliche Seite braucht ein Impressum mit Name und ladungsfähiger Anschrift, ganz anonym geht es nicht.
- Adresse der Datenbank-Schnittstelle für die Live-Angebote

## Update-Ablauf nach dem Livegang

1. Änderung in der Seite und in `texte.md`
2. `python deploy/build.py`
3. Upload:
4. Cache leeren:
5. Live prüfen
