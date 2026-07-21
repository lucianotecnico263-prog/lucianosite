window.AdminPages = window.AdminPages || {};

window.AdminPages.media = {
  async render(root) {
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
      </div>
    `;

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

      const { data, error } = await AdminMediaService.upload('posts-imagens', file);
      if (error) {
        status.textContent = error.message;
        return;
      }

      status.textContent = `Arquivo enviado: ${data}`;
    });
  }
};
