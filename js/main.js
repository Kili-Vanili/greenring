// ============================================================
//  Greenring – Seitenlogik (Navigation, Übersicht, Detailseite)
// ============================================================
(function () {
  "use strict";

  /* ---------- Hilfsfunktionen ---------- */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /* ---------- Mobile-Navigation ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", open ? "Menü öffnen" : "Menü schließen");
      nav.classList.toggle("is-open", !open);
    });
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      });
    });
  }

  /* ---------- Formular (Platzhalter) ---------- */
  const form = document.querySelector(".cta-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("input");
      const btn = form.querySelector("button");
      if (!input.checkValidity()) { input.reportValidity(); return; }
      btn.textContent = "Danke!";
      btn.disabled = true;
      input.disabled = true;
      // TODO: Hier echten Versand anbinden (z. B. Formspree, Netlify Forms oder eigenes Backend).
    });
  }

  /* ---------- Startseite: Hero-Ring + Produktübersicht ---------- */
  const heroRing = document.getElementById("hero-ring");
  if (heroRing && typeof PRODUKTE !== "undefined" && PRODUKTE.length) {
    zeichneRing(heroRing, PRODUKTE[0].werte, { size: 320 });
  }

  const grid = document.getElementById("product-grid");
  if (grid && typeof PRODUKTE !== "undefined") {
    grid.innerHTML = PRODUKTE.map((p) => {
      const total = gesamtwert(p.werte);
      return `
        <a class="product-card" href="produkt.html?id=${encodeURIComponent(p.id)}">
          <div class="product-ring" data-id="${esc(p.id)}"></div>
          <div class="product-info">
            <span class="product-cat">${esc(p.kategorie || "")}</span>
            <h3>${esc(p.name)}</h3>
            <p class="muted">${esc(p.marke || "")}</p>
            <span class="rating" style="color:${farbe(total)}">${bewertung(total)}</span>
            <span class="stufe-tag stufe-${p.stufe}">${esc(STUFEN[p.stufe] || "")}</span>
          </div>
        </a>`;
    }).join("");

    grid.querySelectorAll(".product-ring").forEach((el) => {
      const p = PRODUKTE.find((x) => x.id === el.dataset.id);
      if (p) zeichneRing(el, p.werte, { size: 140 });
    });
  }

  /* ---------- Detailseite ---------- */
  const detail = document.getElementById("product-detail");
  if (detail && typeof PRODUKTE !== "undefined") {
    const id = new URLSearchParams(location.search).get("id");
    const p = PRODUKTE.find((x) => x.id === id) || PRODUKTE[0];

    if (!p) {
      detail.innerHTML = `<p class="muted">Produkt nicht gefunden. <a href="index.html#produkte">Zurück zur Übersicht</a></p>`;
      return;
    }

    document.title = `${p.name} – Greenring`;
    const total = gesamtwert(p.werte);
    const keys = Object.keys(GEWICHT);

    const video = p.youtubeId
      ? `<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(p.youtubeId)}" title="Ring-Check Video: ${esc(p.name)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`
      : `<div class="video video-placeholder"><span>▶</span><p>Video folgt</p></div>`;

    const details = keys.map((k) => `
      <div class="detail-row">
        <div class="detail-head">
          <span class="legend-dot" style="background:${farbe(p.werte[k])}"></span>
          <strong>${esc(LABELS[k])}</strong>
          <span class="detail-weight muted">${Math.round(GEWICHT[k] * 100)} % Gewicht</span>
          <span class="detail-val" style="color:${farbe(p.werte[k])}">${p.werte[k]}</span>
        </div>
        <div class="bar"><div class="bar-fill" style="width:${p.werte[k]}%;background:${farbe(p.werte[k])}"></div></div>
        ${p.details && p.details[k] ? `<p class="muted">${esc(p.details[k])}</p>` : ""}
      </div>`).join("");

    const alt = p.alternative ? `
      <aside class="alt-card">
        <p class="eyebrow">Bessere Alternative</p>
        <div class="alt-inner">
          <div class="alt-ring" id="alt-ring"></div>
          <div>
            <h3>${esc(p.alternative.name)}</h3>
            <p class="muted">Erreicht <strong style="color:${farbe(p.alternative.prozent)}">${p.alternative.prozent} von 100</strong> Punkten.</p>
          </div>
        </div>
      </aside>` : "";

    detail.innerHTML = `
      <div class="product-hero">
        <div class="product-ring-big" id="detail-ring"></div>
        <div class="product-hero-text">
          <span class="product-cat">${esc(p.kategorie || "")}</span>
          <h1>${esc(p.name)}</h1>
          <p class="lead">${esc(p.marke || "")}</p>
          <p class="rating rating-big" style="color:${farbe(total)}">${bewertung(total)}</p>
          <ul class="legend">${legendeHTML(p.werte)}</ul>
          <div class="check-line">
            <span class="stufe-tag stufe-${p.stufe}">${esc(STUFEN[p.stufe] || "")}</span>
            ${p.geprueftVon ? `<span class="muted">Geprüft von ${esc(p.geprueftVon)}</span>` : ""}
          </div>
        </div>
      </div>

      <div class="product-body">
        <div>
          <section class="block">
            <h2>Unser Fazit</h2>
            <p class="fazit">${esc(p.fazit || "")}</p>
          </section>
          <section class="block">
            <h2>Die Bewertung im Detail</h2>
            ${details}
          </section>
        </div>
        <div>
          <section class="block">
            <h2>Der Ring-Check im Video</h2>
            ${video}
          </section>
          ${alt}
        </div>
      </div>`;

    zeichneRing(document.getElementById("detail-ring"), p.werte, { size: 300 });

    const altRing = document.getElementById("alt-ring");
    if (altRing && p.alternative) {
      const v = p.alternative.prozent;
      zeichneRing(altRing, { klima: v, natur: v, verpackung: v }, { size: 110 });
    }
  }
})();
