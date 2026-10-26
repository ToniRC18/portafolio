/* Portafolio · Antonio Rosas Castillo
   Vanilla JS, sin dependencias. Todo vive dentro de una IIFE. */
(function () {
  'use strict';

  // ── Configuración: links de repos y demos ─────────────────────────────
  // Pega aquí la URL; mientras esté vacía, el botón se queda oculto.
  const LINKS = {
    "umiforms.repo": "",
    "umiforms.demo": "",
    "umievangelismo.repo": "",
    "umievangelismo.demo": "",
    "rca.repo": "",
    "rca.demo": ""
  };

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Ejecuta fn(el) una sola vez cuando el elemento entra en pantalla
  function onEnter(els, fn, opts) {
    if (!('IntersectionObserver' in window)) { els.forEach(fn); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        fn(e.target);
      });
    }, opts);
    els.forEach((el) => io.observe(el));
  }

  // ── 1. Links de repos/demos ───────────────────────────────────────────
  $$('a[data-link]').forEach((a) => {
    const url = LINKS[a.dataset.link];
    if (!url) return;
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.removeAttribute('hidden');
  });

  // ── 3. Lightbox (se crea una sola vez, bajo demanda) ──────────────────
  let lb, lbImg, lbOpener;
  function openLightbox(src, alt, opener) {
    if (!lb) {
      lb = document.createElement('dialog');
      lb.className = 'lightbox';
      const close = document.createElement('button');
      close.className = 'lb-close';
      close.type = 'button';
      close.textContent = 'Cerrar ✕';
      lbImg = document.createElement('img');
      lb.append(close, lbImg);
      close.addEventListener('click', () => lb.close());
      // Click en el fondo (el <dialog> mismo, no su contenido)
      lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });
      // Escape ya cierra el <dialog>; al cerrar devolvemos el foco
      lb.addEventListener('close', () => { if (lbOpener) lbOpener.focus(); });
      document.body.appendChild(lb);
    }
    lbOpener = opener;
    lbImg.src = src;
    lbImg.alt = alt;
    lb.showModal();
  }

  // ── 2. Imágenes con data-src (capturas y avatar) ──────────────────────
  $$('figure.shot[data-src], div.avatar[data-src]').forEach((el) => {
    const probe = new Image();
    probe.onload = () => {
      const alt = el.dataset.alt || '';
      const img = document.createElement('img');
      img.src = el.dataset.src;
      img.alt = alt;
      if (el.classList.contains('shot')) {
        img.loading = 'lazy';
        img.decoding = 'async';
        el.classList.add('has-img');
        el.appendChild(img);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'shot-open';
        btn.setAttribute('aria-label', 'Ampliar captura');
        btn.addEventListener('click', () => openLightbox(img.src, alt, btn));
        el.appendChild(btn);
      } else {
        const initials = $('span', el);
        if (initials) initials.hidden = true;
        el.appendChild(img);
      }
    };
    probe.onerror = () => {}; // sin imagen: se queda el placeholder
    probe.src = el.dataset.src;
  });

  // ── 4. Reveal al scroll ───────────────────────────────────────────────
  // Stagger: --d incremental dentro de cada grupo
  ['.skills', '.shots', '.metrics'].forEach((sel) => {
    $$(sel).forEach((group) => {
      Array.from(group.children).forEach((child, i) => {
        child.style.setProperty('--d', (i * 0.07) + 's');
      });
    });
  });

  const revealEls = $$('.reveal, .speed');
  if (reduceMotion) {
    revealEls.forEach((el) => el.classList.add('is-in'));
  } else {
    onEnter(revealEls, (el) => el.classList.add('is-in'),
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  }

  // ── 5. Count-up ───────────────────────────────────────────────────────
  const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
  function countUp(el) {
    const to = parseFloat(el.dataset.to);
    const dec = parseInt(el.dataset.dec || '0', 10);
    if (isNaN(to)) return;
    const fmt = (v) => v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
    const dur = 1400;
    const t0 = performance.now();
    (function tick(now) {
      const t = Math.min((now - t0) / dur, 1);
      el.textContent = fmt(to * easeOutExpo(t));
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = fmt(to);
    })(t0);
  }
  if (!reduceMotion) onEnter($$('.count'), countUp, { threshold: 0.15 });

  // ── 6. Terminales ─────────────────────────────────────────────────────
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  async function typeTerminal(body) {
    const lines = $$('.cli-line', body);
    for (const line of lines) {
      line.classList.remove('is-pending');
      const cmd = $('.cmd', line);
      if (cmd) {
        const text = cmd.textContent;
        cmd.textContent = '';
        for (const ch of text) { cmd.textContent += ch; await sleep(28); }
      }
      await sleep(320);
    }
  }
  const terminals = $$('.cli-body[data-type]');
  if (!reduceMotion) {
    // Oculta las líneas antes de observar; sin JS se ve todo completo
    terminals.forEach((t) => $$('.cli-line', t).forEach((l) => l.classList.add('is-pending')));
    onEnter(terminals, typeTerminal, { threshold: 0.3 });
  }

  // ── 7. Header con sombra al hacer scroll ──────────────────────────────
  const header = $('#site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── 8. Nav activa según la sección en pantalla ────────────────────────
  const navLinks = $$('.nav a[href^="#"]');
  const sections = ['#proyectos', '#sobre-mi', '#habilidades', '#devops']
    .map((id) => $(id)).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        navLinks.forEach((a) => {
          if (a.getAttribute('href') === '#' + e.target.id) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-40% 0px -50% 0px' });
    sections.forEach((s) => spy.observe(s));
  }

  // ── 9. Botones de CV: se ocultan si el PDF no existe ──────────────────
  fetch('cv/Antonio_Rosas_CV.pdf', { method: 'HEAD' })
    .then((res) => {
      if (res.status !== 200) $$('a[href$=".pdf"]').forEach((a) => a.setAttribute('hidden', ''));
    })
    .catch(() => {}); // sin red: no hacer nada
})();
