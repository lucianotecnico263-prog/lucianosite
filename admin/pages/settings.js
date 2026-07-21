window.AdminPages = window.AdminPages || {};

window.AdminPages.settings = {
  async render(root) {
    const { data, error } = await AdminSettingsService.list();
    const saved = data?.find(item => item.chave === 'site_info');
    let siteInfo = {};

    try {
      siteInfo = saved?.valor ? JSON.parse(saved.valor) : {};
    } catch (parseError) {
      siteInfo = {};
    }

    root.innerHTML = `
      <div class="page-card panel">
        <h1 class="page-title">Configurações</h1>
        <p class="page-subtitle">Defina logo, nome do site, contatos e metas principais.</p>
        <div class="form-card panel">
          <div class="form-grid">
            <div class="form-field">
              <label for="site-name">Nome do site</label>
              <input id="site-name" type="text" placeholder="Luciano Editor" value="${AdminUtils.escapeHtml(siteInfo.nome || '')}">
            </div>
            <div class="form-field">
              <label for="site-instagram">Instagram</label>
              <input id="site-instagram" type="text" placeholder="@lucianoeditor" value="${AdminUtils.escapeHtml(siteInfo.instagram || '')}">
            </div>
            <div class="form-field">
              <label for="site-whatsapp">WhatsApp</label>
              <input id="site-whatsapp" type="text" placeholder="+55 75 99999-9999" value="${AdminUtils.escapeHtml(siteInfo.whatsapp || '')}">
            </div>
            <button id="save-settings" class="btn btn-primary" type="button">Salvar configurações</button>
            <div id="settings-status" class="helper-text">${error ? error.message : 'Configurações prontas para edição.'}</div>
          </div>
        </div>
      </div>
    `;

    root.querySelector('#save-settings').addEventListener('click', async () => {
      const status = root.querySelector('#settings-status');
      const payload = {
        nome: root.querySelector('#site-name').value,
        instagram: root.querySelector('#site-instagram').value,
        whatsapp: root.querySelector('#site-whatsapp').value
      };

      const { error } = await AdminSettingsService.upsert('site_info', JSON.stringify(payload));
      if (error) {
        status.textContent = error.message;
        return;
      }

      status.textContent = 'Configurações salvas com sucesso.';
    });
  }
};
