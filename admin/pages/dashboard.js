window.AdminPages = window.AdminPages || {};

window.AdminPages.dashboard = {
  async render(root) {
    const metrics = await window.AdminDashboard.loadMetrics();

    root.innerHTML = `
      <div class="page-card panel">
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Visão geral do conteúdo e do desempenho administrativo.</p>
        <div class="dashboard-grid">
          <div class="metric-card panel">
            <div class="metric-label">Publicações</div>
            <div class="metric-value">${metrics.posts}</div>
            <div class="metric-trend">Total no banco</div>
          </div>
          <div class="metric-card panel">
            <div class="metric-label">Categorias</div>
            <div class="metric-value">${metrics.categorias}</div>
            <div class="metric-trend">Ativas no blog</div>
          </div>
          <div class="metric-card panel">
            <div class="metric-label">Mensagens novas</div>
            <div class="metric-value">${metrics.mensagens}</div>
            <div class="metric-trend">Pendentes de leitura</div>
          </div>
          <div class="metric-card panel">
            <div class="metric-label">Portfólios</div>
            <div class="metric-value">${metrics.portfolios}</div>
            <div class="metric-trend">Projetos cadastrados</div>
          </div>
          <div class="metric-card panel">
            <div class="metric-label">Usuários</div>
            <div class="metric-value">${metrics.usuarios}</div>
            <div class="metric-trend">Contas cadastradas</div>
          </div>
        </div>
      </div>
    `;
  }
};
