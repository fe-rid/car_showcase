/* ═══════════════════════════════════════════════════════
   APEX MOTORS — script.js  (shared on every page)
   ═══════════════════════════════════════════════════════ */

const TICKER_WORDS = [
  'Lamborghini Miura SV','Transverse V12','385 HP','0–60 in 6.7s',
  'Rolls-Royce Ghost','Black Badge Edition','563 HP','6.75L Twin-Turbo V12',
  'Ferrari 812 Superfast','Naturally Aspirated V12','789 HP','0–60 in 2.9s',
  'Spirit of Ecstasy','Pantheon Grille','Pure Automotive Art'
];

document.addEventListener('DOMContentLoaded', () => {
  buildTicker();
  initCursor();
});

/* ── TICKER ──────────────────────────────────────────── */
function buildTicker() {
  const ti = document.getElementById('ticker-inner');
  if (!ti) return;
  const all = [...TICKER_WORDS, ...TICKER_WORDS];
  ti.innerHTML = all.map(t =>
    `<span class="ticker-item"><span class="ticker-dot"></span>${t}</span>`
  ).join('');
}

/* ── CURSOR ──────────────────────────────────────────── */
function initCursor() {
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursor-ring');
  if (!cursor || !ring) return;

  let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;

  document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });

  (function anim() {
    cx += (tx - cx) * 0.12;
    cy += (ty - cy) * 0.12;
    cursor.style.left = tx + 'px'; cursor.style.top = ty + 'px';
    ring.style.left   = cx + 'px'; ring.style.top  = cy + 'px';
    requestAnimationFrame(anim);
  })();

  function bindHover() {
    document.querySelectorAll('a, button, .dot, .arrow-btn, .model-card, .dealer-card, .config-color-swatch, .config-model-btn, .dealer-pin').forEach(el => {
      if (el._cursorBound) return;
      el._cursorBound = true;
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(2.2)';
        ring.style.transform   = 'translate(-50%,-50%) scale(0.5)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(1)';
        ring.style.transform   = 'translate(-50%,-50%) scale(1)';
      });
    });
  }
  bindHover();
  new MutationObserver(bindHover).observe(document.body, { childList: true, subtree: true });
}
