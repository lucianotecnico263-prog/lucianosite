async function applyPublicSiteContent() {
  if (!window.supabaseClient) return;
  const { data, error } = await supabaseClient
    .from('conteudos_site')
    .select('valor')
    .eq('chave', 'geral')
    .maybeSingle();
  if (error || !data?.valor) return;

  const content = data.valor;
  document.querySelectorAll('[data-site-content]').forEach(element => {
    const value = content[element.dataset.siteContent];
    if (!value) return;
    if (element.dataset.siteContentHtml === 'true') element.innerHTML = value;
    else element.textContent = value;
  });

  if (content.nome) document.querySelectorAll('[data-site-name]').forEach(element => { element.textContent = content.nome; });
  if (content.email) document.querySelectorAll('[data-site-email]').forEach(element => { element.textContent = content.email; if (element.tagName === 'A') element.href = `mailto:${content.email}`; });
  if (content.whatsapp) {
    const digits = content.whatsapp.replace(/\D/g, '');
    document.querySelectorAll('[data-site-whatsapp]').forEach(element => { element.textContent = content.whatsapp; if (element.tagName === 'A') element.href = `https://wa.me/${digits}`; });
  }
  if (content.instagram) document.querySelectorAll('[data-site-instagram]').forEach(element => { element.textContent = content.instagram; });
  if (content.cta_texto) document.querySelectorAll('[data-site-cta]').forEach(element => { element.textContent = content.cta_texto; });
}

document.addEventListener('DOMContentLoaded', applyPublicSiteContent);
