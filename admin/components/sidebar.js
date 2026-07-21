window.AdminComponents = window.AdminComponents || {};
window.AdminComponents.sidebar = {
  render(target) {
    target.innerHTML = `
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-badge">⚙️</div>
          <div>
            <div>Luciano Admin</div>
            <small style="color: var(--muted);">CMS</small>
          </div>
        </div>
        <div class="sidebar-section-title">Navegação</div>
        <button class="nav-link active" data-route="dashboard">📊 Dashboard</button>
        <button class="nav-link" data-route="posts">📝 Publicações</button>
        <button class="nav-link" data-route="media">🖼️ Mídia</button>
        <button class="nav-link" data-route="settings">⚙️ Configurações</button>
      </aside>
    `;
  }
};
