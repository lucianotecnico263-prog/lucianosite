window.AdminPages = window.AdminPages || {};

window.AdminPages.messages = {
  async render(root) {
    const { data, error } = await AdminMessagesService.list();

    root.innerHTML = `
      <div class="page-card panel">
        <h1 class="page-title">Mensagens</h1>
        <p class="page-subtitle">Caixa de entrada administrativa para contatos e suporte.</p>
        ${error ? `<div class="empty-state">${error.message}</div>` : `
          <div class="card-list">
            ${data.map(msg => `
              <div class="activity-item">
                <div>
                  <strong>${AdminUtils.escapeHtml(msg.nome || 'Anônimo')}</strong><br>
                  <small>${AdminUtils.escapeHtml(msg.email || '—')}</small><br>
                  <small>${AdminUtils.escapeHtml(msg.mensagem || '')}</small>
                </div>
                <div class="table-actions">
                  <button class="btn-edit" data-action="read" data-id="${msg.id}">Lida</button>
                  <button class="btn-archive" data-action="archive" data-id="${msg.id}">Arquivar</button>
                  <button class="btn-delete" data-action="delete" data-id="${msg.id}">Excluir</button>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;

    root.querySelectorAll('[data-action="read"]').forEach(btn => btn.addEventListener('click', async () => {
      const { error } = await AdminMessagesService.markAsRead(btn.dataset.id);
      if (error) {
        AdminUI.showToast('error', error.message || 'Erro ao marcar mensagem como lida.');
        return;
      }
      AdminUI.showToast('success', 'Mensagem marcada como lida.');
      await this.render(root);
    }));

    root.querySelectorAll('[data-action="archive"]').forEach(btn => btn.addEventListener('click', async () => {
      const { error } = await AdminMessagesService.archive(btn.dataset.id);
      if (error) {
        AdminUI.showToast('error', error.message || 'Erro ao arquivar mensagem.');
        return;
      }
      AdminUI.showToast('success', 'Mensagem arquivada.');
      await this.render(root);
    }));

    root.querySelectorAll('[data-action="delete"]').forEach(btn => btn.addEventListener('click', async () => {
      if (!confirm('Excluir esta mensagem?')) return;
      const { error } = await AdminMessagesService.remove(btn.dataset.id);
      if (error) {
        AdminUI.showToast('error', error.message || 'Erro ao excluir mensagem.');
        return;
      }
      AdminUI.showToast('success', 'Mensagem removida.');
      await this.render(root);
    }));
  }
};
