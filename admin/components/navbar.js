window.AdminComponents = window.AdminComponents || {};
window.AdminComponents.navbar = {
  render(target) {
    target.innerHTML = `
      <div class="topbar">
        <div>
          <h1 class="page-title">Painel Administrativo</h1>
          <p class="page-subtitle">Estrutura modular, CMS profissional e compatível com GitHub Pages.</p>
        </div>
        <div class="topbar-actions">
          <span class="badge badge-published">Online</span>
        </div>
      </div>
    `;
  }
};
