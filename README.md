# Luciano Editor

Site institucional estático com CMS e backend no Supabase.

## Estrutura

- `admin/`: painel administrativo.
- `assets/`: estilos, imagens, componentes e configuração pública do Supabase.
- `supabase/migrations/`: migrações SQL do banco e das políticas de segurança.
- arquivos `.html` na raiz: páginas públicas.

## Instalação e publicação

1. No Supabase SQL Editor, execute primeiro `supabase/migrations/20260721_security_and_cms.sql` e depois `supabase/migrations/20260722_professional_cms.sql`.
2. Antes de executar a primeira migração, substitua `SEU_EMAIL_DE_ADMIN@EXEMPLO.COM` pelo e-mail usado no Supabase Auth para administrar o site.
3. Publique os arquivos da raiz mantendo a estrutura de pastas.

## Segurança

A chave em `assets/js/supabase-config.js` é a chave pública do navegador. Nunca inclua uma chave `service_role` nos arquivos do site ou em repositórios públicos.
