window.AdminComponents = window.AdminComponents || {};
window.AdminComponents.modal = {
  open(title, bodyHtml) {
    const backdrop = document.querySelector('#admin-modal-backdrop') || document.createElement('div');
    backdrop.id = 'admin-modal-backdrop';
    backdrop.className = 'modal-backdrop open';
    backdrop.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <strong>${title}</strong>
          <button type="button" class="btn btn-secondary" data-close-modal>Fechar</button>
        </div>
        <div>${bodyHtml}</div>
      </div>
    `;

    if (!backdrop.parentNode) document.body.appendChild(backdrop);
    backdrop.querySelector('[data-close-modal]').addEventListener('click', () => this.close());
  },
  close() {
    const backdrop = document.querySelector('#admin-modal-backdrop');
    if (backdrop) backdrop.remove();
  }
};
