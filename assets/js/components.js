/* ============================================================
   LUCIANO EDITOR — Shared Components
   ============================================================ */

/* ── Navbar ─────────────────────────────────────────────────── */
function renderNavbar(activePage) {
  const pages = [
    { href: 'index.html',     label: 'Home' },
    { href: 'sobre.html',     label: 'Sobre' },
    { href: 'servicos.html',  label: 'Serviços' },
    { href: 'portfolio.html', label: 'Portfólio' },
    { href: 'blog.html',      label: 'Blog' },
    { href: 'recursos.html',  label: 'Recursos' },
    { href: 'contato.html',   label: 'Contato' },
  ];

  const links = pages.map(p =>
    `<a href="${p.href}" class="${activePage === p.href ? 'active' : ''}">${p.label}</a>`
  ).join('');

  const mobileLinks = pages.map(p =>
    `<a href="${p.href}">${p.label}</a>`
  ).join('');

  document.getElementById('navbar-placeholder').innerHTML = `
    <nav class="navbar" id="navbar">
      <div class="container navbar-inner">
        <a href="index.html" class="navbar-brand">
          <img src="assets/img/luciano-photo.jpg" alt="Luciano" class="navbar-avatar">
          <span class="navbar-name">Luciano <span>Editor</span></span>
        </a>
        <div class="navbar-nav">${links}</div>
        <div class="navbar-actions">
          <a href="contato.html" class="btn btn-primary navbar-cta">Falar com Especialista</a>
        </div>
        <button class="nav-toggle" id="navToggle" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
    <div class="mobile-menu" id="mobileMenu">
      <div class="mobile-menu-panel">
        ${mobileLinks}
        <a href="contato.html" class="btn btn-primary">Falar com Especialista</a>
      </div>
    </div>
  `;

  // Scroll effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });

  // Mobile toggle
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('mobileMenu');
  toggle.addEventListener('click', () => menu.classList.toggle('open'));
  menu.addEventListener('click', e => { if (e.target === menu) menu.classList.remove('open'); });
}

/* ── Footer ─────────────────────────────────────────────────── */
function renderFooter() {
  document.getElementById('footer-placeholder').innerHTML = `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="navbar-brand" style="margin-bottom:16px">
              <img src="assets/img/luciano-photo.jpg" alt="Luciano" class="navbar-avatar">
              <span class="navbar-name" style="color:white">Luciano <span>Editor</span></span>
            </div>
            <p>Transformamos gravações e roteiros em vídeos que prendem atenção e geram resultados reais para o seu negócio.</p>
            <div class="footer-social" style="margin-top:24px">
              <a href="#" title="Instagram">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" title="YouTube">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>
              </a>
              <a href="#" title="LinkedIn">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>
          <div class="footer-col">
            <h4>Serviços</h4>
            <ul>
              <li><a href="servico-youtube.html">Edição YouTube</a></li>
              <li><a href="servico-reels.html">Reels & Shorts</a></li>
              <li><a href="servico-vsl.html">VSL</a></li>
              <li><a href="servico-podcast.html">Podcasts</a></li>
              <li><a href="servico-documentarios.html">Documentários</a></li>
              <li><a href="servico-corporativos.html">Vídeos Corporativos</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Empresa</h4>
            <ul>
              <li><a href="sobre.html">Sobre</a></li>
              <li><a href="portfolio.html">Portfólio</a></li>
              <li><a href="blog.html">Blog</a></li>
              <li><a href="recursos.html">Recursos</a></li>
              <li><a href="contato.html">Contato</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Contato</h4>
            <ul>
              <li><a href="mailto:contato@lucianoeditor.com">contato@lucianoeditor.com</a></li>
              <li><a href="https://wa.me/5511999999999">WhatsApp</a></li>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">YouTube</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© ${new Date().getFullYear()} Luciano Editor. Todos os direitos reservados.</p>
          <p>Feito com estratégia e precisão.</p>
        </div>
      </div>
    </footer>
  `;
}

/* ── Reveal on scroll ────────────────────────────────────────── */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
}

/* ── Counter animation ───────────────────────────────────────── */
function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const duration = 1800;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = Math.floor(current) + suffix;
          if (current >= target) clearInterval(timer);
        }, 16);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => obs.observe(el));
}

/* ── FAQ ─────────────────────────────────────────────────────── */
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ── Filter buttons ──────────────────────────────────────────── */
function initFilters(containerSelector, itemSelector, attr) {
  const btns = document.querySelectorAll('.filter-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll(itemSelector).forEach(item => {
        if (filter === 'all' || item.dataset[attr] === filter) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* ── Init all ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  animateCounters();
  initFAQ();
});
