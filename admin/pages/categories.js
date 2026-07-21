window.AdminPages = window.AdminPages || {};

window.AdminPages.categories = {
  state: { categories: [] },

  async render(root) {
    const { data, error } = await AdminCategoriesService.list();
    this.state.categories = data || [];

    root.innerHTML = `
      <div class="page-card panel">
        <h1 class="page-title">Categorias</h1>
        <p class="page-subtitle">Gerencie a organização do blog com categorias.</p>
        <div class="form-card panel">
          <form id="category-form" class="form-grid">
            <input type="hidden" id="category-id">
            <div class="form-field">
              <label for="category-name">Nome</label>
              <input id="category-name" type="text" required>
            </div>
            <div class="form-field">
              <label for="category-slug">Slug</label>
              <input id="category-slug" type="text" required>
            </div>
            <div class="table-actions">
              <button class="btn btn-primary" type="submit">Salvar categoria</button>
              <button class="btn btn-secondary" type="button" id="cancel-category-edit">Cancelar</button>
            </div>
          </form>
        </div>
        <div class="page-card" style="margin-top: 18px;">
          ${error ? `<div class="empty-state">${error.message}</div>` : `
            <table class="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Slug</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                ${this.state.categories.map(category => `
                  <tr>
                    <td>${AdminUtils.escapeHtml(category.nome)}</td>
                    <td>${AdminUtils.escapeHtml(category.slug)}</td>
                    <td>${category.ativo ? 'Ativa' : 'Inativa'}</td>
                    <td class="table-actions">
                      <button class="btn-edit" data-action="edit" data-id="${category.id}">Editar</button>
                      <button class="btn-delete" data-action="delete" data-id="${category.id}">Excluir</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `}
        </div>
      </div>
    `;

    root.querySelector('#category-form').addEventListener('submit', async (event) => {
      event.preventDefault();
      const id = root.querySelector('#category-id').value;
      const payload = {
        nome: root.querySelector('#category-name').value.trim(),
        slug: AdminUtils.slugify(root.querySelector('#category-slug').value || root.querySelector('#category-name').value),
        ordem: 0,
        ativo: true
      };

      const { error } = id
        ? await AdminCategoriesService.update(id, payload)
        : await AdminCategoriesService.create(payload);

      if (error) {
        AdminUI.showToast('error', error.message || 'Erro ao salvar categoria.');
        return;
      }

      AdminUI.showToast('success', 'Categoria salva com sucesso.');
      await this.render(root);
    });

    root.querySelector('#cancel-category-edit').addEventListener('click', () => this.resetForm(root));
    root.querySelectorAll('[data-action="edit"]').forEach(btn => {
      btn.addEventListener('click', () => this.edit(root, btn.dataset.id));
    });
    root.querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', () => this.delete(root, btn.dataset.id));
    });
  },

  resetForm(root) {
    root.querySelector('#category-id').value = '';
    root.querySelector('#category-name').value = '';
    root.querySelector('#category-slug').value = '';
  },

  edit(root, id) {
    const category = this.state.categories.find(item => item.id === id);
    if (!category) return;

    root.querySelector('#category-id').value = category.id;
    root.querySelector('#category-name').value = category.nome || '';
    root.querySelector('#category-slug').value = category.slug || '';
  },

  async delete(root, id) {
    if (!confirm('Excluir esta categoria?')) return;

    const { error } = await AdminCategoriesService.remove(id);
    if (error) {
      AdminUI.showToast('error', error.message || 'Erro ao excluir categoria.');
      return;
    }

    AdminUI.showToast('success', 'Categoria removida.');
    await this.render(root);
  }
};
