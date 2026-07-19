/* ============================================================
   LUCIANO JÚNIOR | EDITOR ESTRATÉGICO — script.js
   V4.4 — GOOGLE DRIVE PLAYER INTEGRATION
   ============================================================ */

'use strict';

const DEFAULTS = {
  price:      'R$30',
  whatsapp:   '+557581385296',
  hero_title: 'Luciano Júnior | Editor Estratégico',
  hero_sub:   'Edição estratégica para YouTube e Redes Sociais. Teste meu trabalho por apenas R$30.'
};

/* ── Utilitários ───────────────────────────────────────────── */
function whatsappLink(number, message = '') {
  const clean = number.replace(/\D/g, '');
  const msg   = encodeURIComponent(message || 'Olá, Luciano! Vi seu site e quero testar a edição estratégica por ' + DEFAULTS.price + '.');
  return `https://wa.me/${clean}?text=${msg}`;
}

function setAllWhatsappLinks(number) {
  const msg = `Olá, Luciano! Vi seu site e quero testar a edição estratégica.`;
  const link = whatsappLink(number, msg);
  const ids = [
    'hero-cta-primary', 'nav-cta', 'mobile-cta',
    'cta-final-btn', 'whatsapp-float',
    'footer-whats'
  ];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.href = link;
  });
}

function updatePriceElements(price) {
  const priceEls = [
    'hero-price-inline', 'hero-price-btn',
    'card-price', 'about-price'
  ];
  priceEls.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = price;
  });
  const ctaTag = document.getElementById('cta-price-tag');
  if (ctaTag) ctaTag.textContent = `Apenas ${price} para testar`;
}

/* ── Fetch de configurações da API ─────────────────────────── */
async function loadSettings() {
  try {
    const res = await fetch('/api/settings', {
      headers: { 'Accept': 'application/json' },
      cache: 'no-cache'
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    applySettings(data);
  } catch (err) {
    console.warn('[Luciano] API indisponível, usando valores padrão.', err.message);
    applySettings(DEFAULTS);
  }
}

function applySettings(s) {
  const price    = s.price     || DEFAULTS.price;
  const whatsapp = s.whatsapp  || DEFAULTS.whatsapp;
  updatePriceElements(price);

  const titleEl = document.getElementById('hero-title-el');
  if (titleEl && s.hero_title) {
    const parts = s.hero_title.split('|');
    if (parts.length >= 2) {
      titleEl.innerHTML = `${parts[0].trim()}<br><span class="gold">${parts[1].trim()}</span>`;
    } else {
      titleEl.textContent = s.hero_title;
    }
  }

  const subEl = document.getElementById('hero-sub-el');
  if (subEl && s.hero_sub) {
    subEl.innerHTML = s.hero_sub.replace(price, `<strong id="hero-price-inline">${price}</strong>`);
  }
  setAllWhatsappLinks(whatsapp);
}

/* ── Animações de scroll (reveal) ──────────────────────────── */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => obs.observe(el));
  } else {
    els.forEach(el => el.classList.add('visible'));
  }
}

/* ── Navbar: hamburger + scroll effect ─────────────────────── */
function initNavbar() {
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobile-menu');
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
      navbar.style.background = window.scrollY > 40
        ? 'rgba(10,10,10,.97)'
        : 'rgba(10,10,10,.85)';
    }
  }, { passive: true });
}

/* ── Loader ─────────────────────────────────────────────────── */
function hideLoader() {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.classList.add('hidden');
    setTimeout(() => loader.remove(), 600);
  }
}

/* ── Video Player Logic ─────────────────────────────────────── */
function initVideoPlayer() {
  const container = document.getElementById('video-container');
  const video     = document.getElementById('main-video');
  const overlay   = document.getElementById('video-overlay');

  if (container && video && overlay) {
    // Se o vídeo já começou via autoplay, garantir que o overlay suma se o usuário interagir
    const handleStart = () => {
      video.muted = false; // Ativa o som no primeiro clique
      video.play();
      video.controls = true;
      overlay.classList.add('playing');
    };

    overlay.addEventListener('click', handleStart);

    // Se o vídeo estiver tocando (autoplay), o overlay fica visível até o primeiro clique
    // para indicar que o usuário pode ativar o som/interagir.
    video.addEventListener('playing', () => {
      // Opcional: manter o overlay até o clique para ativar som
    });
  }
}

/* ── Init ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  initNavbar();
  await loadSettings();
  initScrollReveal();
  initVideoPlayer();
  hideLoader();
});
