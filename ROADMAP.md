# Roadmap do projeto

## Arquitetura atual

- Site público estático: arquivos HTML na raiz.
- CMS: diretório `admin/`.
- Backend: Supabase Auth, Postgres e Storage.
- Migração do banco: `supabase/migrations/20260721_security_and_cms.sql`.

## Fluxos implementados

1. Visitantes leem apenas posts publicados e categorias ativas.
2. O formulário de contato registra mensagens na tabela `mensagens`.
3. Apenas perfis com `papel = 'admin'` podem acessar o CMS e alterar dados.
4. Posts usam `categoria_id`, ligado à tabela `categorias`.
5. Imagens do blog são enviadas para o bucket público `posts-imagens` por administradores.

## Antes de publicar

1. Execute a migração SQL no Supabase, após trocar o e-mail do administrador no fim do arquivo.
2. Faça login com essa conta e valide o dashboard, criação de post, envio de imagem e formulário de contato.
3. Publique a raiz do projeto, incluindo `admin/`, `assets/` e `supabase/`.
