window.AdminComponents = window.AdminComponents || {};
window.AdminComponents.toast = {
  show(type, message) {
    const stack = document.querySelector('#toast-stack') || document.createElement('div');
    stack.id = 'toast-stack';
    stack.className = 'toast-stack';
    if (!stack.parentNode) document.body.appendChild(stack);

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    stack.appendChild(toast);
    setTimeout(() => toast.remove(), 3200);
  }
};
