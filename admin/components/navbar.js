window.AdminComponents = window.AdminComponents || {};
window.AdminComponents.navbar = {
  render(target) {
    target.innerHTML = `
      <div class="topbar">
        <div>
          <h1 class="page-title">Painel Administrativo</h1>
          <p class="page-subtitle">CMS protegido por autenticação e permissões do Supabase.</p>
        </div>
        <div class="topbar-actions">
          <span class="badge badge-published">Online</span>
        </div>
      </div>
    `;
  }
};
