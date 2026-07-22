document.addEventListener('DOMContentLoaded', async () => {
  AdminUI.init();

  const isLoginPage = window.location.pathname.includes('login.html');

  if (isLoginPage) {
    const formLogin = document.querySelector('#form-login');
    const errorEl = document.querySelector('#login-error');
    const session = await AdminAuth.session();
    if (new URLSearchParams(window.location.search).get('erro') === 'sem-permissao') {
      errorEl.textContent = 'Esta conta não possui permissão de administrador.';
      errorEl.style.display = 'block';
    }

    if (session) {
      window.location.href = 'index.html';
      return;
    }

    formLogin?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = document.querySelector('#email')?.value.trim();
      const password = document.querySelector('#senha')?.value;
      const button = document.querySelector('#login-btn');

      button.disabled = true;
      errorEl.style.display = 'none';

      const { error } = await AdminAuth.login(email, password);
      if (error) {
        errorEl.textContent = 'Falha no login. Verifique e-mail e senha.';
        errorEl.style.display = 'block';
        button.disabled = false;
        return;
      }

      window.location.href = 'index.html';
    });

    return;
  }

  const session = await AdminAuth.requireSession();
  if (!session) return;

  const logoutBtn = document.querySelector('#logout-btn');
  logoutBtn?.addEventListener('click', async () => {
    const { error } = await AdminAuth.logout();
    if (!error) {
      window.location.href = 'login.html';
    }
  });

  AdminRouter.init();
});
