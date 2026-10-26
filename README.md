# Greenring – Der Ring-Check

Statische Website ohne Build-Schritt. Kein Node, kein Next.js nötig. Einfach `index.html` im Browser öffnen oder den Ordner auf einen beliebigen Webspace hochladen.

## Struktur

```
index.html      Startseite: Hero-Ring, Produktübersicht, Erklärung, FAQ, Vorschlagsformular
produkt.html    Detailseite (liest ?id=… aus der Adresse, z. B. produkt.html?id=papiertuete)
js/data.js      DIE PRODUKTE – hier kommen eure echten Daten rein
js/ring.js      Ring-Berechnung, Farbe, SVG-Zeichnung
js/main.js      Navigation, Übersicht und Detailseite füllen
css/style.css   Design, Dark Mode, Responsive-Regeln
.claude/        Lokaler Vorschau-Server (serve.ps1) für die Claude-App
```

## Lokale Vorschau

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .claude/serve.ps1 -Port 8080
```

Danach http://localhost:8080 öffnen.

## Produkt hinzufügen

In `js/data.js` einen neuen Block in die Liste `PRODUKTE` kopieren:

```js
{
  id: "hafermilch",                  // nur Kleinbuchstaben, keine Leerzeichen, eindeutig
  name: "Hafermilch",
  marke: "Oatly",
  kategorie: "Getränke",
  werte: { klima: 70, natur: 65, verpackung: 40 },   // je 0 bis 100
  stufe: 2,                          // 1 = Berechnet, 2 = Geprüft, 3 = Vor Ort geprüft
  geprueftVon: "Kian",
  youtubeId: "dQw4w9WgXcQ",          // Teil nach "v=" in der YouTube-Adresse, "" = Platzhalter
  fazit: "Ein Satz, der alles zusammenfasst.",
  details: {
    klima: "Begründung Klima.",
    natur: "Begründung Natur & Tiere.",
    verpackung: "Begründung Verpackung."
  },
  alternative: { name: "Bessere Alternative", prozent: 85 }
}
```

Die Übersicht und die Detailseite entstehen daraus automatisch.

## Bewertung

Gesamtwert = Klima × 0,4 + Natur × 0,4 + Verpackung × 0,2 (Gewichte in `js/data.js` unter `GEWICHT`).
Farbe: rot bei 0, gelb bei 50, grün ab 75.

## Noch offen

- Das Vorschlagsformular sendet noch nichts (`TODO` in `js/main.js`).
- Impressum und Datenschutz im Footer sind leere Links.
- FAQ-Antworten zu „Wer steckt dahinter“ und „Finanzierung“ sind Platzhalter.
- Plastiktüte und Stoffbeutel in `js/data.js` sind Beispielprodukte.
