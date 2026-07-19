/* ============================================================
   LUCIANO JÚNIOR | EDITOR ESTRATÉGICO — main.js
   ============================================================ */

'use strict';

const DEFAULTS = {
  price:      'R$30',
  whatsapp:   '+557581385296',
  hero_title: 'Luciano Júnior | Editor Estratégico',
  hero_sub:   'Edição estratégica para YouTube e Redes Sociais. Teste meu trabalho por apenas R$30.'
};

// ... (Mantenha aqui as funções whatsappLink, setAllWhatsappLinks, updatePriceElements, 
// loadSettings, applySettings, initScrollReveal, initNavbar, hideLoader e initVideoPlayer 
// que já existem no seu arquivo original)

document.addEventListener('DOMContentLoaded', async () => {
  initNavbar();
  await loadSettings();
  initScrollReveal();
  initVideoPlayer();
  hideLoader();
});
