window.AdminPages = window.AdminPages || {};

window.AdminPages.users = {
  async render(root) {
    const { data, error } = await supabaseClient.from('usuarios').select('id, email, papel, criado_em').order('criado_em', { ascending: false });
    root.innerHTML = `
      <div class="page-card panel">
        <h1 class="page-title">Usuários</h1>
        <p class="page-subtitle">Defina quem pode administrar o conteúdo e as configurações do site.</p>
        ${error ? `<div class="empty-state">${AdminUtils.escapeHtml(error.message)}</div>` : !data?.length ? '<div class="empty-state">Nenhum usuário encontrado.</div>' : `<table class="table"><thead><tr><th>E-mail</th><th>Papel</th><th>Criado em</th><th>Ação</th></tr></thead><tbody>${data.map(user => `<tr><td>${AdminUtils.escapeHtml(user.email)}</td><td><select data-role="${user.id}"><option value="usuario" ${user.papel === 'usuario' ? 'selected' : ''}>Usuário</option><option value="admin" ${user.papel === 'admin' ? 'selected' : ''}>Administrador</option></select></td><td>${AdminUtils.formatDate(user.criado_em)}</td><td><button class="btn btn-primary" data-save-role="${user.id}">Salvar</button></td></tr>`).join('')}</tbody></table>`}
      </div>
    `;

    root.querySelectorAll('[data-save-role]').forEach(button => button.addEventListener('click', async () => {
      const id = button.dataset.saveRole;
      const papel = root.querySelector(`[data-role="${id}"]`).value;
      const { error: updateError } = await supabaseClient.from('usuarios').update({ papel }).eq('id', id);
      if (updateError) return AdminUI.showToast('error', updateError.message);
      AdminUI.showToast('success', 'Papel atualizado.');
    }));
  }
};
