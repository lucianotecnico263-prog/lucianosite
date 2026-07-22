/* ============================================================
   SUPABASE — configuração compartilhada
   Usado por: blog.html (leitura pública) e admin/*.html (CRUD)
   ============================================================ */

const SUPABASE_URL = 'https://tqxejgrbnvfgoqztrcpx.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_mX4XsY4ezp9WUkEPE1vMJQ_K_d359Z3'; // chave pública (anon) - ok expor no front

// Exige que o script do Supabase já tenha sido carregado via CDN antes deste arquivo
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// Disponibiliza o cliente para os módulos públicos de conteúdo carregados depois deste arquivo.
window.supabaseClient = supabaseClient;
