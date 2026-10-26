// ============================================================
//  Greenring – Produktdaten
//  Hier kommen eure echten Produkte rein. Pro Produkt ein Block.
//  Werte: 0 bis 100 (100 = bestmöglich)
//  stufe: 1 = Berechnet, 2 = Ring-Check: Geprüft, 3 = Ring-Check: Vor Ort geprüft
//  youtubeId: der Teil nach "v=" in der YouTube-Adresse, leer = Platzhalter
// ============================================================

const GEWICHT = { klima: 0.4, natur: 0.4, verpackung: 0.2 };

const LABELS = { klima: "Klima", natur: "Natur & Tiere", verpackung: "Verpackung" };

const STUFEN = ["", "Berechnet", "Ring-Check: Geprüft", "Ring-Check: Vor Ort geprüft"];

const PRODUKTE = [
  {
    id: "papiertuete",
    name: "Papiertüte",
    marke: "Supermarkt-Standard",
    kategorie: "Tüten & Beutel",
    werte: { klima: 40, natur: 60, verpackung: 80 },
    stufe: 2,
    geprueftVon: "Kian",
    youtubeId: "",
    fazit: "Muss mehrmals benutzt werden, um besser als Plastik zu sein.",
    details: {
      klima: "Die Herstellung von Papier braucht viel Energie und Wasser. Eine Papiertüte verursacht in der Produktion mehr CO₂ als eine dünne Plastiktüte.",
      natur: "Papier verrottet und landet nicht als Mikroplastik im Meer. Holz stammt aber oft aus Monokulturen.",
      verpackung: "Kein Kunststoff, gut recycelbar, meist ohne Beschichtung."
    },
    alternative: { name: "Tüte, die du schon zu Hause hast", prozent: 95 }
  },

  // ---------- Beispiele, bitte ersetzen oder löschen ----------
  {
    id: "plastiktuete",
    name: "Plastiktüte",
    marke: "Supermarkt-Standard",
    kategorie: "Tüten & Beutel",
    werte: { klima: 55, natur: 15, verpackung: 20 },
    stufe: 1,
    geprueftVon: "",
    youtubeId: "",
    fazit: "In der Herstellung sparsam, aber am Ende ein Problem für Natur und Tiere.",
    details: {
      klima: "Dünn und leicht, daher wenig Material und Transportgewicht.",
      natur: "Zerfällt zu Mikroplastik, gefährlich für Tiere im Wasser und an Land.",
      verpackung: "Nur selten recycelt, meist verbrannt oder in der Umwelt."
    },
    alternative: { name: "Stoffbeutel, oft benutzt", prozent: 90 }
  },
  {
    id: "stoffbeutel",
    name: "Stoffbeutel aus Baumwolle",
    marke: "Bio-Baumwolle",
    kategorie: "Tüten & Beutel",
    werte: { klima: 30, natur: 70, verpackung: 90 },
    stufe: 3,
    geprueftVon: "Kian",
    youtubeId: "",
    fazit: "Lohnt sich nur, wenn du ihn wirklich lange und oft benutzt.",
    details: {
      klima: "Baumwollanbau und Weben kosten viel Energie und Wasser. Erst nach vielen Einsätzen besser als Plastik.",
      natur: "Bio-Anbau ohne Pestizide, aber hoher Wasserbedarf in trockenen Regionen.",
      verpackung: "Kommt meist ohne Verpackung, langlebig, waschbar."
    },
    alternative: { name: "Beutel, den du schon hast", prozent: 95 }
  }
];
