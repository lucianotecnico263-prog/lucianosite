window.AdminPages = window.AdminPages || {};

const AdminCollectionPage = {
  definitions: {
    services: { table: 'servicos', title: 'Serviços', description: 'Cadastre os serviços exibidos no site.', fields: [
      ['titulo', 'Título', 'text', true], ['slug', 'Slug', 'text', true], ['resumo', 'Resumo', 'textarea', true], ['descricao', 'Descrição completa', 'textarea'], ['imagem_url', 'URL da imagem', 'url'], ['ordem', 'Ordem', 'number'], ['destaque', 'Destacar serviço', 'checkbox'], ['ativo', 'Publicado', 'checkbox']
    ] },
    portfolios: { table: 'portfolios', title: 'Portfólio', description: 'Gerencie projetos, resultados e links de vídeo.', fields: [
      ['titulo', 'Título', 'text', true], ['categoria', 'Categoria', 'text', true], ['resumo', 'Resumo', 'textarea', true], ['imagem_url', 'URL da imagem', 'url'], ['video_url', 'URL do vídeo', 'url'], ['resultado', 'Resultado / métrica', 'text'], ['ordem', 'Ordem', 'number'], ['publicado', 'Publicado', 'checkbox']
    ] },
    testimonials: { table: 'depoimentos', title: 'Depoimentos', description: 'Publique provas sociais no site.', fields: [
      ['nome', 'Nome', 'text', true], ['cargo', 'Cargo ou empresa', 'text'], ['texto', 'Depoimento', 'textarea', true], ['nota', 'Nota (1 a 5)', 'number'], ['foto_url', 'URL da foto', 'url'], ['ordem', 'Ordem', 'number'], ['destaque', 'Destacar', 'checkbox'], ['ativo', 'Publicado', 'checkbox']
    ] },
    faqs: { table: 'faqs', title: 'Perguntas frequentes', description: 'Edite as dúvidas e respostas exibidas para visitantes.', fields: [
      ['pergunta', 'Pergunta', 'text', true], ['resposta', 'Resposta', 'textarea', true], ['ordem', 'Ordem', 'number'], ['ativo', 'Publicado', 'checkbox']
    ] }
  },

  async render(root, key) {
    const definition = this.definitions[key];
    const { data, error } = await AdminCmsService.list(definition.table);
    const state = { items: data, editingId: null };
    const fieldMarkup = definition.fields.map(([name, label, type, required]) => type === 'textarea'
      ? `<div class="form-field"><label for="${key}-${name}">${label}</label><textarea id="${key}-${name}" rows="${name === 'descricao' || name === 'texto' || name === 'resposta' ? 5 : 3}" ${required ? 'required' : ''}></textarea></div>`
      : type === 'checkbox'
        ? `<label class="field-inline"><input id="${key}-${name}" type="checkbox" ${name === 'ativo' || name === 'publicado' ? 'checked' : ''}> ${label}</label>`
        : `<div class="form-field"><label for="${key}-${name}">${label}</label><input id="${key}-${name}" type="${type}" ${type === 'number' ? 'min="0" value="0"' : ''} ${required ? 'required' : ''}></div>`
    ).join('');

    root.innerHTML = `
      <div class="page-card panel">
        <h1 class="page-title">${definition.title}</h1><p class="page-subtitle">${definition.description}</p>
        <form id="${key}-form" class="form-grid form-card panel"><input id="${key}-id" type="hidden">${fieldMarkup}
          <div class="table-actions"><button class="btn btn-primary" type="submit">Salvar</button><button class="btn btn-secondary" id="${key}-cancel" type="button">Cancelar</button></div>
        </form>
        <div class="page-card" style="margin-top:18px"><div id="${key}-list"></div></div>
      </div>`;

    const form = root.querySelector(`#${key}-form`);
    const list = root.querySelector(`#${key}-list`);
    const reset = () => { form.reset(); root.querySelector(`#${key}-id`).value = ''; state.editingId = null; definition.fields.filter(field => field[2] === 'checkbox' && (field[0] === 'ativo' || field[0] === 'publicado')).forEach(([name]) => root.querySelector(`#${key}-${name}`).checked = true); };
    const renderList = () => {
      if (error) { list.innerHTML = `<div class="empty-state">${AdminUtils.escapeHtml(error.message)}</div>`; return; }
      if (!state.items.length) { list.innerHTML = '<div class="empty-state">Nenhum item cadastrado ainda.</div>'; return; }
      list.innerHTML = `<table class="table"><thead><tr><th>Item</th><th>Status</th><th>Ordem</th><th>Ações</th></tr></thead><tbody>${state.items.map(item => {
        const label = item.titulo || item.nome || item.pergunta;
        const published = item.ativo ?? item.publicado;
        return `<tr><td>${AdminUtils.escapeHtml(label)}</td><td>${published ? '<span class="badge badge-published">Publicado</span>' : '<span class="badge badge-draft">Oculto</span>'}</td><td>${item.ordem ?? 0}</td><td class="table-actions"><button class="btn-edit" data-edit="${item.id}">Editar</button><button class="btn-delete" data-delete="${item.id}">Excluir</button></td></tr>`;
      }).join('')}</tbody></table>`;
      list.querySelectorAll('[data-edit]').forEach(button => button.addEventListener('click', () => {
        const item = state.items.find(entry => entry.id === button.dataset.edit); if (!item) return;
        root.querySelector(`#${key}-id`).value = item.id; state.editingId = item.id;
        definition.fields.forEach(([name, , type]) => { const input = root.querySelector(`#${key}-${name}`); if (type === 'checkbox') input.checked = !!item[name]; else input.value = item[name] ?? ''; });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }));
      list.querySelectorAll('[data-delete]').forEach(button => button.addEventListener('click', async () => {
        if (!confirm('Excluir este item?')) return;
        const { error: removeError } = await AdminCmsService.remove(definition.table, button.dataset.delete);
        if (removeError) return AdminUI.showToast('error', removeError.message);
        state.items = state.items.filter(item => item.id !== button.dataset.delete); renderList(); AdminUI.showToast('success', 'Item excluído.');
      }));
    };
    renderList();
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const payload = {};
      definition.fields.forEach(([name, , type]) => { const input = root.querySelector(`#${key}-${name}`); payload[name] = type === 'checkbox' ? input.checked : type === 'number' ? Number(input.value || 0) : input.value.trim(); });
      const result = state.editingId ? await AdminCmsService.update(definition.table, state.editingId, payload) : await AdminCmsService.create(definition.table, payload);
      if (result.error) return AdminUI.showToast('error', result.error.message);
      state.items = state.editingId ? state.items.map(item => item.id === result.data.id ? result.data : item) : [...state.items, result.data];
      reset(); renderList(); AdminUI.showToast('success', 'Alterações salvas.');
    });
    root.querySelector(`#${key}-cancel`).addEventListener('click', reset);
  }
};

Object.keys(AdminCollectionPage.definitions).forEach(key => {
  window.AdminPages[key] = { render(root) { return AdminCollectionPage.render(root, key); } };
});

window.AdminPages.siteContent = {
  async render(root) {
    const { data, error } = await AdminCmsService.getSiteContent();
    const fields = [['nome','Nome do site'],['email','E-mail'],['whatsapp','WhatsApp'],['instagram','Instagram'],['hero_titulo','Título principal'],['hero_subtitulo','Subtítulo principal'],['cta_texto','Texto do CTA'],['sobre_titulo','Título da seção sobre'],['sobre_texto','Texto da seção sobre']];
    root.innerHTML = `<div class="page-card panel"><h1 class="page-title">Conteúdo do site</h1><p class="page-subtitle">Edite identidade, contatos e os textos principais sem mexer em código.</p><form id="site-content-form" class="form-grid form-card panel">${fields.map(([key,label]) => `<div class="form-field"><label for="content-${key}">${label}</label>${key.includes('texto') || key.includes('subtitulo') ? `<textarea id="content-${key}" rows="4">${AdminUtils.escapeHtml(data[key] || '')}</textarea>` : `<input id="content-${key}" value="${AdminUtils.escapeHtml(data[key] || '')}">`}</div>`).join('')}<button class="btn btn-primary" type="submit">Salvar conteúdo</button><div class="helper-text">${error ? AdminUtils.escapeHtml(error.message) : 'As alterações aparecem nas páginas que usam este conteúdo.'}</div></form></div>`;
    root.querySelector('#site-content-form').addEventListener('submit', async event => { event.preventDefault(); const payload = {}; fields.forEach(([key]) => payload[key] = root.querySelector(`#content-${key}`).value.trim()); const result = await AdminCmsService.saveSiteContent(payload); if (result.error) return AdminUI.showToast('error', result.error.message); AdminUI.showToast('success', 'Conteúdo do site atualizado.'); });
  }
};
