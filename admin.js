/* ============================================================
   ADMIN — admin.js
   Login, guarda de sessão e CRUD de publicações via Supabase.
   Depende de: supabase-config.js (variável supabaseClient) carregado antes.
   ============================================================ */
'use strict';

const isLoginPage = window.location.pathname.includes('login.html');

/* ── Login (somente em login.html) ─────────────────────────── */
const formLogin = document.getElementById('form-login');
if (formLogin) {
  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;
    const btn = document.getElementById('login-btn');
    const errEl = document.getElementById('login-error');

    btn.disabled = true;
    errEl.style.display = 'none';

    const { error } = await supabaseClient.auth.signInWithPassword({ email, password: senha });

    if (error) {
      errEl.textContent = 'Falha no login: e-mail ou senha inválidos.';
      errEl.style.display = 'block';
      btn.disabled = false;
      return;
    }

    window.location.href = 'index.html';
  });
}

/* ── Guarda de sessão (somente em index.html do admin) ─────── */
async function verificarSessaoAdmin() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!isLoginPage && !session) {
    window.location.href = 'login.html';
    return null;
  }
  return session;
}

/* ── Logout ─────────────────────────────────────────────────── */
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    await supabaseClient.auth.signOut();
    window.location.href = 'login.html';
  });
}

/* ── Painel de publicações (somente em index.html do admin) ─── */
const formPublicacao = document.getElementById('form-publicacao');

if (formPublicacao) {
  let currentUserId = null;

  (async () => {
    const session = await verificarSessaoAdmin();
    if (!session) return; // já foi redirecionado
    currentUserId = session.user.id;
    await carregarPublicacoes();
  })();

  /* Criar ou atualizar */
  formPublicacao.addEventListener('submit', async (e) => {
    e.preventDefault();

    const idEditando = document.getElementById('post-id').value;
    const statusEl = document.getElementById('save-status');
    const saveBtn = document.getElementById('save-btn');

    const post = {
      titulo:     document.getElementById('titulo').value.trim(),
      resumo:     document.getElementById('resumo').value.trim(),
      conteudo:   document.getElementById('conteudo').value.trim(),
      imagem_url: document.getElementById('imagem_url').value.trim() || null,
      categoria:  document.getElementById('categoria').value,
      publicado:  document.getElementById('publicado').checked,
    };

    saveBtn.disabled = true;
    statusEl.className = '';
    statusEl.style.display = 'none';

    let error;
    if (idEditando) {
      ({ error } = await supabaseClient.from('publicacoes').update(post).eq('id', idEditando));
    } else {
      post.autor_id = currentUserId;
      ({ error } = await supabaseClient.from('publicacoes').insert([post]));
    }

    if (error) {
      statusEl.textContent = '❌ Erro ao salvar: ' + error.message;
      statusEl.className = 'error';
    } else {
      statusEl.textContent = '✅ Publicação salva com sucesso!';
      statusEl.className = 'success';
      resetForm();
      await carregarPublicacoes();
    }

    saveBtn.disabled = false;
    setTimeout(() => { statusEl.style.display = 'none'; }, 4000);
  });

  document.getElementById('cancel-edit-btn').addEventListener('click', resetForm);

  function resetForm() {
    formPublicacao.reset();
    document.getElementById('post-id').value = '';
    document.getElementById('publicado').checked = true;
    document.getElementById('form-title').textContent = 'Nova publicação';
    document.getElementById('cancel-edit-btn').style.display = 'none';
  }

  /* Carregar lista */
  async function carregarPublicacoes() {
    const listEl = document.getElementById('posts-list');
    listEl.innerHTML = '<p class="body-sm">Carregando...</p>';

    const { data, error } = await supabaseClient
      .from('publicacoes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      listEl.innerHTML = `<p class="body-sm">Erro ao carregar: ${error.message}</p>`;
      return;
    }

    if (!data || data.length === 0) {
      listEl.innerHTML = '<p class="body-sm">Nenhuma publicação ainda.</p>';
      return;
    }

    listEl.innerHTML = data.map(post => `
      <div class="post-item">
        <div>
          <div class="post-title">${escapeHtml(post.titulo)}
            <span class="status-tag ${post.publicado ? 'pub' : 'draft'}">${post.publicado ? 'Publicado' : 'Rascunho'}</span>
          </div>
          <div class="post-meta">${escapeHtml(post.categoria || '')} · ${new Date(post.created_at).toLocaleDateString('pt-BR')}</div>
        </div>
        <div class="post-actions">
          <button class="edit-btn" data-id="${post.id}">Editar</button>
          <button class="delete-btn" data-id="${post.id}">Excluir</button>
        </div>
      </div>
    `).join('');

    listEl.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => editarPost(btn.dataset.id, data));
    });
    listEl.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => excluirPost(btn.dataset.id));
    });
  }

  function editarPost(id, data) {
    const post = data.find(p => p.id === id);
    if (!post) return;

    document.getElementById('post-id').value = post.id;
    document.getElementById('titulo').value = post.titulo || '';
    document.getElementById('resumo').value = post.resumo || '';
    document.getElementById('conteudo').value = post.conteudo || '';
    document.getElementById('imagem_url').value = post.imagem_url || '';
    document.getElementById('categoria').value = post.categoria || 'edicao';
    document.getElementById('publicado').checked = !!post.publicado;

    document.getElementById('form-title').textContent = 'Editando publicação';
    document.getElementById('cancel-edit-btn').style.display = 'inline-flex';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function excluirPost(id) {
    if (!confirm('Tem certeza que deseja excluir esta publicação? Essa ação não pode ser desfeita.')) return;

    const { error } = await supabaseClient.from('publicacoes').delete().eq('id', id);
    if (error) {
      alert('Erro ao excluir: ' + error.message);
    } else {
      await carregarPublicacoes();
    }
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str ?? '';
    return div.innerHTML;
  }
}

/* Roda a guarda de sessão também na página de login, caso o usuário
   já esteja logado e tente acessar login.html de novo */
if (isLoginPage) {
  (async () => {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) window.location.href = 'index.html';
  })();
}
