const AdminUtils = {
  escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = value ?? '';
    return div.innerHTML;
  },

  formatDate(value) {
    if (!value) return '—';
    return new Date(value).toLocaleDateString('pt-BR');
  },

  slugify(text) {
    return String(text || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  },

  setStatus(el, type, message) {
    if (!el) return;
    el.className = `toast ${type}`;
    el.textContent = message;
  }
};
