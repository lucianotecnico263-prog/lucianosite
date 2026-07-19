-- ============================================================
-- Luciano Júnior | Editor de Vídeo — Cloudflare D1 Schema
-- Executar: wrangler d1 execute luciano-db --file=./worker/schema.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS settings (
  id         INTEGER PRIMARY KEY,
  price      TEXT    DEFAULT 'R$30',
  whatsapp   TEXT    DEFAULT '+557581385296',
  hero_title TEXT    DEFAULT 'Luciano Júnior | Editor Estratégico',
  hero_sub   TEXT    DEFAULT 'Edição estratégica para YouTube e Redes Sociais. Teste meu trabalho por apenas R$30.'
);

-- Inserir configuração inicial (apenas se não existir)
INSERT OR IGNORE INTO settings (id, price, whatsapp, hero_title, hero_sub)
VALUES (
  1,
  'R$30',
  '+557581385296',
  'Luciano Júnior | Editor Estratégico',
  'Edição estratégica para YouTube e Redes Sociais. Teste meu trabalho por apenas R$30.'
);
