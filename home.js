/* ═══════════════════════════════════════════════════════
   APEX MOTORS — home.js  (index.html only)
   ═══════════════════════════════════════════════════════ */

/* ── PALETTE DATA ────────────────────────────────────── */
const PALETTES = [
  { accent: '#e8c97a', accent2: '#ff6b35', bracket: 'rgba(232,201,122,0.5)' },
  { accent: '#7ab8e8', accent2: '#b06fe8', bracket: 'rgba(122,184,232,0.5)' },
  { accent: '#ff4f4f', accent2: '#ff9a3c', bracket: 'rgba(255,79,79,0.5)'   }
];

/* ── VIDEO DATA — your YouTube links ─────────────────── */
const VIDEOS = [
  {
    title : 'Lamborghini Miura SV',
    sub   : 'Heritage Film — 1966 V12 Icon',
    id    : 'pXHXlI9yU0w',
    watch : 'https://youtu.be/pXHXlI9yU0w?si=DFsgLMf3ZFD8XQSH'
  },
  {
    title : 'Rolls-Royce Ghost Black Badge',
    sub   : 'Official Film — The Dark Side of Luxury',
    id    : 'w2yFwbYITMg',
    watch : 'https://youtu.be/w2yFwbYITMg?si=TT4Y0M8x0CctbouX'
  },
  {
    title : 'Ferrari 812 Superfast',
    sub   : 'Official Film — The V12 Masterpiece',
    id    : 'gEuR6DmGZcA',
    watch : 'https://youtu.be/gEuR6DmGZcA'
  }
];

/* ── CAROUSEL STATE ──────────────────────────────────── */
let current   = 0;
let animating = false;
const TOTAL   = 3;

const bgTrack   = document.getElementById('bg-track');
const scEls     = [document.getElementById('sc0'), document.getElementById('sc1'), document.getElementById('sc2')];
const dots      = document.querySelectorAll('.dot');
const counter   = document.getElementById('counter-cur');
const progress  = document.getElementById('progress-line');
const bgImgs    = [document.getElementById('bg0'), document.getElementById('bg1'), document.getElementById('bg2')];

/* ── INIT ────────────────────────────────────────────── */
scEls.forEach((el, i) => {
  el.classList.toggle('active', i === 0);
  el.style.transition = 'none';
  el.style.transform  = i === 0 ? 'translateY(0)' : 'translateY(60px)';
  el.style.opacity    = i === 0 ? '1'             : '0';
});
setPalette(0);
setProgress(0);
setDots(0);

/* ── PALETTE ─────────────────────────────────────────── */
function setPalette(idx) {
  const p = PALETTES[idx];
  document.documentElement.style.setProperty('--accent',  p.accent);
  document.documentElement.style.setProperty('--accent2', p.accent2);
  document.documentElement.style.setProperty('--bracket', p.bracket);
  const g = document.querySelector(`#sc${idx} .hl-gradient`);
  if (g) g.style.backgroundImage = `linear-gradient(90deg,${p.accent},${p.accent2})`;
  progress.style.backgroundImage  = `linear-gradient(90deg,${p.accent},${p.accent2})`;
}

function setProgress(idx) {
  progress.style.width = ((idx + 1) / TOTAL * 100) + '%';
}

function setDots(idx) {
  dots.forEach((d, i) => d.classList.toggle('active', i === idx));
}

/* ── NAVIGATE ────────────────────────────────────────── */
function goTo(idx) {
  if (animating || idx === current || idx < 0 || idx >= TOTAL) return;
  animating = true;
  const prev = current;
  current = idx;

  bgTrack.style.transform = `translateX(${-idx * 100}vw)`;
  setPalette(idx);
  setProgress(idx);
  setDots(idx);
  scEls.forEach((el, i) => el.classList.toggle('active', i === idx));
  counter.textContent = String(idx + 1).padStart(2, '0');

  const out = scEls[prev];
  out.style.transition = 'transform 700ms cubic-bezier(0.77,0,.18,1), opacity 500ms ease';
  void out.offsetWidth;
  out.style.transform = 'translateY(-50px)';
  out.style.opacity   = '0';

  const inn = scEls[idx];
  inn.style.transition = 'none'; void inn.offsetWidth;
  inn.style.transform  = 'translateY(60px)'; inn.style.opacity = '0'; void inn.offsetWidth;
  inn.style.transition = 'transform 750ms cubic-bezier(0.22,1,0.36,1), opacity 600ms ease'; void inn.offsetWidth;
  inn.style.transform  = 'translateY(0)'; inn.style.opacity = '1';

  setTimeout(() => { animating = false; out.style.transform = 'translateY(60px)'; }, 800);
}

document.getElementById('btn-next').onclick = () => goTo(current + 1);
document.getElementById('btn-prev').onclick = () => goTo(current - 1);
dots.forEach(d => d.addEventListener('click', () => goTo(parseInt(d.dataset.idx))));

document.addEventListener('keydown', e => {
  if (isModalOpen()) return;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(current + 1);
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goTo(current - 1);
  if (e.key === 'Escape') closeVideo();
});

let wc = false;
document.addEventListener('wheel', e => {
  if (isModalOpen() || wc) return;
  if (Math.abs(e.deltaY) < 20) return; // ignore small scrolls
  wc = true;
  goTo(e.deltaY > 0 ? current + 1 : current - 1);
  setTimeout(() => wc = false, 800);
}, { passive: false });

let sx = 0, sy = 0;
document.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
document.addEventListener('touchend', e => {
  if (isModalOpen()) return;
  const dx = sx - e.changedTouches[0].clientX;
  const dy = sy - e.changedTouches[0].clientY;
  if (Math.abs(dx) > Math.abs(dy)) { if (dx > 50) goTo(current + 1); if (dx < -50) goTo(current - 1); }
  else { if (dy > 50) goTo(current + 1); if (dy < -50) goTo(current - 1); }
}, { passive: true });

/* ── MOUSE PARALLAX ──────────────────────────────────── */
document.addEventListener('mousemove', e => {
  if (isModalOpen()) return;
  const px = ((e.clientX / innerWidth)  - 0.5) * 18;
  const py = ((e.clientY / innerHeight) - 0.5) * 10;
  bgImgs.forEach(bg => {
    bg.style.backgroundPosition = `calc(50% + ${px}px) calc(50% + ${py}px)`;
  });
});

/* ══════════════════════════════════════════════════════
   VIDEO MODAL
══════════════════════════════════════════════════════ */
const modal    = document.getElementById('video-modal');
const iframe   = document.getElementById('vm-iframe');
const vmTitle  = document.getElementById('vm-title');
const vmSub    = document.getElementById('vm-sub');
const vmFall   = document.getElementById('vm-fallback');
const vmYtLink = document.getElementById('vm-yt-link');

function isModalOpen() { return modal.classList.contains('open'); }

function openVideo(idx) {
  const v = VIDEOS[idx];
  vmTitle.textContent  = v.title;
  vmSub.textContent    = v.sub;
  vmYtLink.href        = v.watch;
  vmFall.classList.remove('show');

  const embedUrl = `https://www.youtube.com/embed/${v.id}?autoplay=1&rel=0`;
  iframe.src = embedUrl;
  modal.classList.add('open');

  // Detect embedding blocked — YouTube sends X-Frame-Options or CSP that we
  // can't read directly, so we wait 3s and check if iframe has loaded anything
  iframe.onload = () => { /* loaded OK — hide fallback */ vmFall.classList.remove('show'); };
  // Fallback timer: if no load event fires in 4s the video is blocked
  clearTimeout(window._vmTimer);
  window._vmTimer = setTimeout(() => {
    try {
      // Try accessing iframe content — will throw if blocked cross-origin (that's normal)
      // If the iframe src contains an error page, YouTube redirects to a blank load
      if (!iframe.contentWindow) {
        showFallback();
      }
    } catch(e) {
      // Can't read contentWindow — cross origin, which means it DID load (good)
    }
  }, 5000);
}

function showFallback() {
  iframe.src = '';
  vmFall.classList.add('show');
}

function closeVideo() {
  if (!isModalOpen()) return;
  modal.classList.remove('open');
  clearTimeout(window._vmTimer);
  setTimeout(() => { iframe.src = ''; vmFall.classList.remove('show'); }, 420);
}

document.getElementById('vm-close') && document.getElementById('vm-close').addEventListener('click', closeVideo);
