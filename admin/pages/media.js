window.AdminPages = window.AdminPages || {};

window.AdminPages.media = {
  async render(root) {
    const bucket = 'posts-imagens';
    root.innerHTML = `
      <div class="page-card panel">
        <h1 class="page-title">Biblioteca de mídia</h1>
        <p class="page-subtitle">Upload, preview e gestão de arquivos do bucket do blog.</p>
        <div class="form-card panel">
          <div class="form-grid">
            <div class="form-field">
              <label for="media-file">Arquivo</label>
              <input id="media-file" type="file" accept="image/*">
            </div>
            <div class="file-preview" id="media-preview-wrap" style="display:none;">
              <img id="media-preview" alt="Preview do arquivo">
            </div>
            <button id="media-upload" class="btn btn-primary" type="button">Enviar</button>
            <div id="media-status" class="helper-text"></div>
          </div>
        </div>
        <div class="page-card" style="margin-top:18px"><h2 class="heading-sm">Arquivos enviados</h2><div id="media-list" class="card-list"></div></div>
      </div>
    `;

    const renderFiles = async () => {
      const target = root.querySelector('#media-list');
      const { data, error } = await AdminMediaService.list(bucket);
      if (error) { target.innerHTML = `<div class="empty-state">${AdminUtils.escapeHtml(error.message)}</div>`; return; }
      if (!data.length) { target.innerHTML = '<div class="empty-state">Nenhum arquivo enviado.</div>'; return; }
      target.innerHTML = data.map(file => `<div class="activity-item"><div><strong>${AdminUtils.escapeHtml(file.name)}</strong><br><small>${Math.round((file.metadata?.size || 0) / 1024)} KB</small></div><div class="table-actions"><button class="btn-edit" data-copy="${file.url}">Copiar URL</button><button class="btn-delete" data-delete="${file.name}">Excluir</button></div></div>`).join('');
      target.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', async () => { await navigator.clipboard.writeText(button.dataset.copy); AdminUI.showToast('success', 'URL copiada.'); }));
      target.querySelectorAll('[data-delete]').forEach(button => button.addEventListener('click', async () => { if (!confirm('Excluir este arquivo?')) return; const { error: removeError } = await AdminMediaService.remove(bucket, button.dataset.delete); if (removeError) return AdminUI.showToast('error', removeError.message); await renderFiles(); }));
    };

    const fileInput = root.querySelector('#media-file');
    const preview = root.querySelector('#media-preview');
    const previewWrap = root.querySelector('#media-preview-wrap');

    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (!file) {
        previewWrap.style.display = 'none';
        return;
      }

      preview.src = URL.createObjectURL(file);
      previewWrap.style.display = 'block';
    });

    root.querySelector('#media-upload').addEventListener('click', async () => {
      const file = fileInput.files[0];
      const status = root.querySelector('#media-status');
      if (!file) {
        status.textContent = 'Selecione um arquivo antes de enviar.';
        return;
      }

      const { data, error } = await AdminMediaService.upload(bucket, file);
      if (error) {
        status.textContent = error.message;
        return;
      }

      status.textContent = `Arquivo enviado: ${data}`;
      fileInput.value = '';
      previewWrap.style.display = 'none';
      await renderFiles();
    });

    await renderFiles();
  }
};
