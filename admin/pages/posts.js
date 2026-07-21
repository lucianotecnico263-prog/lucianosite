window.AdminPages = window.AdminPages || {};

window.AdminPages.posts = {
  state: { posts: [], editingId: null },

  async render(root) {
    root.innerHTML = `
      <div class="page-card panel">
        <h1 class="page-title">Publicações</h1>
        <p class="page-subtitle">Gerencie artigos, rascunhos, publicação e organização do blog.</p>
        <div class="form-card panel">
          <form id="post-form" class="form-grid">
            <input type="hidden" id="post-id">
            <div class="form-row">
              <div class="form-field">
                <label for="post-titulo">Título</label>
                <input id="post-titulo" type="text" required>
              </div>
              <div class="form-field">
                <label for="post-categoria">Categoria</label>
                <select id="post-categoria">
                  <option value="edicao">Edição</option>
                  <option value="estrategia">Estratégia</option>
                  <option value="storytelling">Storytelling</option>
                  <option value="marketing">Marketing</option>
                  <option value="ia">IA</option>
                </select>
              </div>
            </div>
            <div class="form-field">
              <label for="post-resumo">Resumo</label>
              <textarea id="post-resumo" rows="3" required></textarea>
            </div>
            <div class="form-field">
              <label for="post-conteudo">Conteúdo</label>
              <textarea id="post-conteudo" rows="6" required></textarea>
            </div>
            <div class="form-field">
              <label for="post-imagem-url">URL da imagem</label>
              <input id="post-imagem-url" type="url">
            </div>
            <div class="field-inline">
              <input id="post-publicado" type="checkbox">
              <label for="post-publicado">Publicado</label>
            </div>
            <div class="table-actions">
              <button class="btn btn-primary" type="submit">Salvar</button>
              <button class="btn btn-secondary" id="cancel-post-edit" type="button">Cancelar</button>
            </div>
          </form>
        </div>

        <div class="panel" style="margin-top: 18px; padding: 16px;">
          <div class="form-row">
            <div class="form-field">
              <label for="post-search">Buscar</label>
              <input id="post-search" type="search" placeholder="Buscar por título ou categoria">
            </div>
            <div class="form-field">
              <label for="post-status-filter">Status</label>
              <select id="post-status-filter">
                <option value="all">Todos</option>
                <option value="published">Publicado</option>
                <option value="draft">Rascunho</option>
              </select>
            </div>
          </div>
        </div>

        <div id="posts-table-wrap" class="page-card" style="margin-top: 18px;"></div>
      </div>
    `;

    await this.load(root.querySelector('#posts-table-wrap'));

    const form = root.querySelector('#post-form');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      await this.save(form);
    });

    root.querySelector('#cancel-post-edit').addEventListener('click', () => this.resetForm(form));
    root.querySelector('#post-search').addEventListener('input', () => this.filterTable(root));
    root.querySelector('#post-status-filter').addEventListener('change', () => this.filterTable(root));
  },

  async load(target) {
    const { data, error } = await AdminPostsService.list();
    if (error) {
      target.innerHTML = '<div class="empty-state">Não foi possível carregar as publicações.</div>';
      return;
    }

    this.state.posts = data;
    this.renderTable(target, data);
  },

  renderTable(target, data) {
    target.innerHTML = `
      <table class="table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Categoria</th>
            <th>Status</th>
            <th>Data</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(post => `
            <tr>
              <td>${AdminUtils.escapeHtml(post.titulo)}</td>
              <td>${AdminUtils.escapeHtml(post.categoria || '—')}</td>
              <td><span class="badge ${post.publicado ? 'badge-published' : 'badge-draft'}">${post.publicado ? 'Publicado' : 'Rascunho'}</span></td>
              <td>${AdminUtils.formatDate(post.created_at)}</td>
              <td class="table-actions">
                <button class="btn-edit" data-action="edit" data-id="${post.id}">Editar</button>
                <button class="btn-duplicate" data-action="duplicate" data-id="${post.id}">Duplicar</button>
                <button class="btn-delete" data-action="delete" data-id="${post.id}">Excluir</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    target.querySelectorAll('[data-action="edit"]').forEach(btn => {
      btn.addEventListener('click', () => this.edit(btn.dataset.id));
    });
    target.querySelectorAll('[data-action="duplicate"]').forEach(btn => {
      btn.addEventListener('click', () => this.duplicate(btn.dataset.id));
    });
    target.querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', () => this.delete(btn.dataset.id));
    });
  },

  filterTable(root) {
    const search = (root.querySelector('#post-search')?.value || '').toLowerCase();
    const status = root.querySelector('#post-status-filter')?.value || 'all';
    const target = root.querySelector('#posts-table-wrap');

    const filtered = this.state.posts.filter(post => {
      const text = `${post.titulo || ''} ${post.categoria || ''}`.toLowerCase();
      const matchesSearch = !search || text.includes(search);
      const matchesStatus = status === 'all' || (status === 'published' ? !!post.publicado : !post.publicado);
      return matchesSearch && matchesStatus;
    });

    this.renderTable(target, filtered);
  },

  resetForm(form) {
    form.reset();
    form.querySelector('#post-id').value = '';
    this.state.editingId = null;
  },

  edit(id) {
    const post = this.state.posts.find(item => item.id === id);
    if (!post) return;

    const form = document.querySelector('#post-form');
    form.querySelector('#post-id').value = post.id;
    form.querySelector('#post-titulo').value = post.titulo || '';
    form.querySelector('#post-resumo').value = post.resumo || '';
    form.querySelector('#post-conteudo').value = post.conteudo || '';
    form.querySelector('#post-categoria').value = post.categoria || 'edicao';
    form.querySelector('#post-imagem-url').value = post.imagem_url || '';
    form.querySelector('#post-publicado').checked = !!post.publicado;
    this.state.editingId = id;
  },

  async save(form) {
    const payload = {
      titulo: form.querySelector('#post-titulo').value.trim(),
      resumo: form.querySelector('#post-resumo').value.trim(),
      conteudo: form.querySelector('#post-conteudo').value.trim(),
      imagem_url: form.querySelector('#post-imagem-url').value.trim(),
      categoria: form.querySelector('#post-categoria').value,
      publicado: form.querySelector('#post-publicado').checked,
    };

    const id = form.querySelector('#post-id').value;
    const session = await AdminAuth.requireSession();
    if (!session) return;

    payload.autor_id = session.user.id;

    const { error } = id
      ? await AdminPostsService.update(id, payload)
      : await AdminPostsService.create(payload);

    if (error) {
      AdminUI.showToast('error', error.message || 'Erro ao salvar a publicação.');
      return;
    }

    AdminUI.showToast('success', 'Publicação salva com sucesso.');
    this.resetForm(form);
    await this.load(document.querySelector('#posts-table-wrap'));
  },

  async duplicate(id) {
    const post = this.state.posts.find(item => item.id === id);
    if (!post) return;

    const payload = {
      ...post,
      titulo: `${post.titulo} (Cópia)`,
      publicado: false,
      id: undefined,
      created_at: undefined,
      updated_at: undefined
    };

    const { error } = await AdminPostsService.create(payload);

    if (error) {
      AdminUI.showToast('error', error.message || 'Erro ao duplicar publicação.');
      return;
    }

    AdminUI.showToast('success', 'Publicação duplicada.');
    await this.load(document.querySelector('#posts-table-wrap'));
  },

  async delete(id) {
    if (!confirm('Excluir esta publicação?')) return;

    const { error } = await AdminPostsService.remove(id);
    if (error) {
      AdminUI.showToast('error', error.message || 'Erro ao excluir publicação.');
      return;
    }

    AdminUI.showToast('success', 'Publicação removida.');
    await this.load(document.querySelector('#posts-table-wrap'));
  }
};
