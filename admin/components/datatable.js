window.AdminComponents = window.AdminComponents || {};
window.AdminComponents.datatable = {
  render(target, rows) {
    if (!rows.length) {
      target.innerHTML = '<div class="empty-state">Nenhuma linha para exibir.</div>';
      return;
    }

    target.innerHTML = `
      <table class="table">
        <tbody>
          ${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
    `;
  }
};
