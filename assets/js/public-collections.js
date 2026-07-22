function publicEscape(value) { const el = document.createElement('div'); el.textContent = value || ''; return el.innerHTML; }
function publicImage(url) { try { const parsed = new URL(url); return ['https:', 'http:'].includes(parsed.protocol) ? parsed.href : ''; } catch { return ''; } }

async function renderPublicCollections() {
  if (!window.supabaseClient) return;
  const [services, portfolios, testimonials, faqs] = await Promise.all([
    supabaseClient.from('servicos').select('*').eq('ativo', true).order('ordem'),
    supabaseClient.from('portfolios').select('*').eq('publicado', true).order('ordem'),
    supabaseClient.from('depoimentos').select('*').eq('ativo', true).order('ordem'),
    supabaseClient.from('faqs').select('*').eq('ativo', true).order('ordem')
  ]);

  const servicesRoot = document.querySelector('[data-public-services]');
  if (servicesRoot && services.data?.length) servicesRoot.innerHTML = services.data.map(item => `<article class="card service-card" id="${publicEscape(item.slug)}"><div class="card-icon">&#10024;</div><h3 class="heading-md">${publicEscape(item.titulo)}</h3><p class="body-md">${publicEscape(item.resumo)}</p>${item.descricao ? `<details><summary class="service-link">Ver detalhes</summary><p class="body-sm">${publicEscape(item.descricao)}</p></details>` : ''}</article>`).join('');

  const portfolioRoot = document.querySelector('[data-public-portfolios]');
  if (portfolioRoot && portfolios.data?.length) portfolioRoot.innerHTML = portfolios.data.map(item => { const image = publicImage(item.imagem_url); return `<article class="portfolio-card" data-category="${publicEscape(item.categoria)}"><div class="portfolio-thumb" style="${image ? `background:url(&quot;${image}&quot;) center/cover` : 'background:linear-gradient(135deg,#EDE9FE,#DBEAFE)'}"></div><div class="portfolio-info"><span class="badge badge-purple">${publicEscape(item.categoria)}</span><h3 class="heading-sm">${publicEscape(item.titulo)}</h3><p class="body-sm">${publicEscape(item.resumo)}</p>${item.resultado ? `<p class="body-sm"><strong>${publicEscape(item.resultado)}</strong></p>` : ''}${item.video_url ? `<a class="service-link" href="${publicEscape(item.video_url)}" target="_blank" rel="noopener">Ver projeto &rarr;</a>` : ''}</div></article>`; }).join('');

  const testimonialRoot = document.querySelector('[data-public-testimonials]');
  if (testimonialRoot && testimonials.data?.length) testimonialRoot.innerHTML = testimonials.data.map(item => `<article class="card testimonial-card"><div class="testimonial-stars">${'★'.repeat(item.nota)}</div><p class="testimonial-text">&ldquo;${publicEscape(item.texto)}&rdquo;</p><div class="testimonial-author"><div class="testimonial-avatar">${publicEscape(item.nome.slice(0,2).toUpperCase())}</div><div><div class="testimonial-name">${publicEscape(item.nome)}</div><div class="testimonial-role">${publicEscape(item.cargo || '')}</div></div></div></article>`).join('');

  const faqRoot = document.querySelector('[data-public-faqs]');
  if (faqRoot && faqs.data?.length) { faqRoot.innerHTML = faqs.data.map(item => `<div class="faq-item"><button class="faq-question">${publicEscape(item.pergunta)} <span class="faq-icon">+</span></button><div class="faq-answer">${publicEscape(item.resposta)}</div></div>`).join(''); initFAQ(); }
}

document.addEventListener('DOMContentLoaded', renderPublicCollections);
