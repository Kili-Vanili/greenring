// ============================================================
//  Greenring – Ring-Logik (Berechnung, Farbe, SVG-Zeichnung)
// ============================================================

/** Gesamtwert aus gewichteten Einzelwerten, gerundet. */
function gesamtwert(werte) {
  return Math.round(
    Object.keys(werte).reduce((sum, k) => sum + werte[k] * (GEWICHT[k] || 0), 0)
  );
}

/** Farbe nach Prozent: rot (0) → gelb (50) → grün (ab 75). */
function farbe(p) {
  const h = p >= 75 ? 120 : p <= 50 ? (p / 50) * 60 : 60 + ((p - 50) / 25) * 60;
  return `hsl(${h}, 70%, 42%)`;
}

/** Kurze Einordnung des Gesamtwerts. */
function bewertung(p) {
  if (p >= 75) return "Gute Wahl";
  if (p >= 50) return "Geht so";
  if (p >= 25) return "Eher nicht";
  return "Lieber nicht";
}

/** SVG-Namensraum-Helfer */
function svgEl(tag, attrs) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}

/**
 * Zeichnet einen Ring in ein Container-Element.
 * @param {HTMLElement} container
 * @param {{klima:number, natur:number, verpackung:number}} werte
 * @param {{size?:number, animate?:boolean, showTotal?:boolean, showLabels?:boolean}} opts
 */
function zeichneRing(container, werte, opts = {}) {
  const size = opts.size || 200;
  const animate = opts.animate !== false && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const showTotal = opts.showTotal !== false;
  const strokeW = 18;
  const r = 80;
  const U = 2 * Math.PI * r;
  const gap = 6;
  const keys = Object.keys(GEWICHT);
  const total = gesamtwert(werte);

  const svg = svgEl("svg", { viewBox: "0 0 200 200", width: size, height: size, class: "ring", role: "img" });
  svg.setAttribute("aria-label", `Gesamtwert ${total} von 100`);

  const segs = [];
  let offset = 0;
  keys.forEach((k) => {
    const len = U * GEWICHT[k] - gap;
    const rot = (offset / U) * 360 - 90;
    const g = svgEl("g", { transform: `rotate(${rot} 100 100)` });

    const track = svgEl("circle", {
      cx: 100, cy: 100, r, fill: "none", stroke: "var(--ring-track)",
      "stroke-width": strokeW, "stroke-dasharray": `${len} ${U}`, "stroke-linecap": "butt"
    });
    const fill = svgEl("circle", {
      cx: 100, cy: 100, r, fill: "none", stroke: farbe(werte[k]),
      "stroke-width": strokeW, "stroke-dasharray": `0 ${U}`, "stroke-linecap": "butt"
    });
    const title = svgEl("title", {});
    title.textContent = `${LABELS[k]}: ${werte[k]} / 100`;
    g.appendChild(title);
    g.appendChild(track);
    g.appendChild(fill);
    svg.appendChild(g);
    segs.push({ fill, len, value: werte[k] });
    offset += U * GEWICHT[k];
  });

  let numEl, labelEl;
  if (showTotal) {
    numEl = svgEl("text", { x: 100, y: 108, "text-anchor": "middle", class: "ring-num" });
    numEl.textContent = "0";
    svg.appendChild(numEl);
    labelEl = svgEl("text", { x: 100, y: 130, "text-anchor": "middle", class: "ring-sub" });
    labelEl.textContent = "von 100";
    svg.appendChild(labelEl);
    numEl.style.fill = farbe(total);
  }

  container.innerHTML = "";
  container.appendChild(svg);

  function apply(t) {
    segs.forEach((s) => {
      const voll = (s.len * s.value * t) / 100;
      s.fill.setAttribute("stroke-dasharray", `${voll} ${U}`);
    });
    if (numEl) numEl.textContent = Math.round(total * t);
  }

  if (!animate) {
    apply(1);
    return;
  }

  const dur = 1600;
  let start = null;
  function frame(now) {
    if (start === null) start = now;
    const x = Math.min(1, (now - start) / dur);
    apply(1 - Math.pow(1 - x, 3));
    if (x < 1) requestAnimationFrame(frame);
  }

  // Erst starten, wenn der Ring sichtbar ist
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries, obs) => {
      if (entries.some((e) => e.isIntersecting)) {
        requestAnimationFrame(frame);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    io.observe(container);
  } else {
    requestAnimationFrame(frame);
  }
}

/** Legende für die drei Bereiche als HTML-String. */
function legendeHTML(werte) {
  return Object.keys(GEWICHT).map((k) => `
    <li class="legend-item">
      <span class="legend-dot" style="background:${farbe(werte[k])}"></span>
      <span class="legend-label">${LABELS[k]}</span>
      <span class="legend-val">${werte[k]}</span>
    </li>`).join("");
}
