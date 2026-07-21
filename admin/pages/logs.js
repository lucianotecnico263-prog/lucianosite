window.AdminPages = window.AdminPages || {};

window.AdminPages.logs = {
  async render(root) {
    const { data, error } = await AdminLogsService.list();

    root.innerHTML = `
      <div class="page-card panel">
        <h1 class="page-title">Logs</h1>
        <p class="page-subtitle">Registro de ações administrativas e eventos do sistema.</p>
        ${error ? `<div class="empty-state">${error.message}</div>` : `
          <div class="card-list">
            ${data.map(log => `
              <div class="activity-item">
                <div>
                  <strong>${AdminUtils.escapeHtml(log.tipo)}</strong><br>
                  <small>${AdminUtils.escapeHtml(log.descricao || '')}</small>
                </div>
                <div>${AdminUtils.formatDate(log.created_at)}</div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;
  }
};
