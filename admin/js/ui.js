const AdminUI = {
  toastStack: null,

  init() {
    this.toastStack = document.querySelector('#toast-stack');
    if (!this.toastStack) {
      const root = document.body;
      this.toastStack = document.createElement('div');
      this.toastStack.id = 'toast-stack';
      this.toastStack.className = 'toast-stack';
      root.appendChild(this.toastStack);
    }
  },

  showToast(type, message) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    this.toastStack.appendChild(toast);
    setTimeout(() => toast.remove(), 3200);
  },

  setLoading(el, text = 'Carregando...') {
    if (!el) return;
    el.innerHTML = `<div class="skeleton" style="width:140px;display:block;margin:8px 0"></div>`;
  },

  renderEmpty(el, message = 'Nenhum registro encontrado.') {
    if (!el) return;
    el.innerHTML = `<div class="empty-state">${message}</div>`;
  }
};
