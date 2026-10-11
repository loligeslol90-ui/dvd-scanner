# Live-Angebote: Anschluss an die Datenbank

Das Laufband oben auf der Seite lädt die aktuellen Angebote aus einer JSON-Quelle. Die Adresse steht in `index.html` am Laufband:

```html
<div class="laufband" data-laufband data-quelle="daten/angebote.json" …>
```

`data-quelle` kann eine Datei auf dem Webspace sein (`daten/angebote.json`, zum Beispiel per Skript aus der Datenbank erzeugt) oder eine Schnittstelle der Datenbank (`https://api.example.de/angebote`). Bei einer fremden Domain muss die Schnittstelle CORS für die Domain der Website erlauben.

Gibt es die Quelle nicht oder ist sie leer, zeigt das Laufband nur die festen Einträge. Die Seite funktioniert also auch ohne Datenbank.

## Format

Entweder eine Liste oder ein Objekt mit `angebote`:

```json
{
  "angebote": [
    {
      "titel": "Titel des Stücks",
      "kategorie": "Filme",
      "preis": 7.99,
      "waehrung": "EUR",
      "url": "https://www.ebay.de/itm/…"
    }
  ]
}
```

| Feld | Pflicht | Bedeutung |
|---|---|---|
| `titel` | ja | Anzeigename |
| `kategorie` | nein | `Filme`, `Musik`, `Games`, `Comics`, `Vinyl` oder `Sammlerstücke`, bestimmt das Pixel-Symbol |
| `preis` | nein | Zahl, wird als Euro-Betrag angezeigt |
| `waehrung` | nein | Standard `EUR` |
| `url` | nein | Link zum Angebot, zum Beispiel bei eBay |

Angezeigt werden höchstens 12 Einträge, in der gelieferten Reihenfolge (neueste zuerst liefern).

## Vorschau

`angebote.beispiel.json` enthält erfundene Beispiel-Einträge. Sie erscheinen nur mit `?demo` in der Adresse (`index.html?demo`) und sind im Laufband als „Beispiel“ markiert. Sie gehen nie live.

## Ankaufsliste

Das Ankaufsformular schickt die Liste als JSON per POST an `data-endpoint` am Formular (`<form … data-endpoint="">`). Ist kein Endpoint gesetzt, aber `data-mail`, öffnet sich das E-Mail-Programm mit der fertigen Liste. Ist beides leer, meldet das Formular, dass der Versand noch nicht eingerichtet ist.

```json
{
  "email": "kunde@example.de",
  "nachricht": "",
  "stuecke": [{ "stueck": "4010232012345", "kategorie": "Filme", "zustand": "sehr gut" }],
  "einwilligung": true,
  "gesendet": "2026-10-11T18:00:00.000Z"
}
```
