window.AdminPages = window.AdminPages || {};

window.AdminPages.users = {
  async render(root) {
    root.innerHTML = `
      <div class="page-card panel">
        <h1 class="page-title">Usuários</h1>
        <p class="page-subtitle">Preparado para múltiplos administradores, editores e autores.</p>
        <div class="empty-state">Estrutura de usuários pronta para expansão por perfil e permissões.</div>
      </div>
    `;
  }
};
