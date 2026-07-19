/* ============================================================
   ADMINISTRATIVO — admin.js
   ============================================================ */

const supabaseUrl = 'SUA_URL_AQUI'; // Substitua
const supabaseKey = 'SUA_CHAVE_ANON_AQUI'; // Substitua
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Trava de Segurança: Expulsa se não estiver logado
async function verificarSessaoAdmin() {
    const { data: { session } } = await supabase.auth.getSession();
    const isAdminPage = window.location.pathname.includes('admin.html');
    
    if (isAdminPage && !session) {
        window.location.href = 'login.html';
    }
}

// Lógica de Login
const formLogin = document.getElementById('form-login');
if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        
        const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
        error ? alert("Erro no login") : window.location.href = 'admin.html';
    });
}

// Lógica de Salvar Publicação
const formPublicacao = document.getElementById('form-publicacao');
if (formPublicacao) {
    formPublicacao.addEventListener('submit', async (e) => {
        e.preventDefault();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) return alert("Erro: Usuário Desconhecido");

        const post = {
            titulo: document.getElementById('titulo').value,
            resumo: document.getElementById('resumo').value,
            conteudo: document.getElementById('conteudo').value,
            imagem_url: document.getElementById('imagem_url').value,
            autor_id: session.user.id
        };

        const { error } = await supabase.from('publicacoes').insert([post]);
        error ? alert("Erro ao salvar: " + error.message) : alert("Salvo com sucesso!");
    });
}

// Inicializa verificação na página de admin
verificarSessaoAdmin();
