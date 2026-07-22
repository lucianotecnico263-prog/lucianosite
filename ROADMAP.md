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
6. Cada publicação abre em `artigo.html?id=<id>`; os links “Ler artigo” não retornam mais apenas para a lista do blog.
7. O painel preserva a sidebar redesenhada e inclui módulos para conteúdo do site, serviços, portfólio, depoimentos, FAQ, mídia, usuários, mensagens, categorias e publicações.
8. Serviços, portfólio, depoimentos e FAQ cadastrados no painel passam a substituir os cards demonstrativos das páginas públicas.

## Próximas evoluções do CMS

1. Adicionar edição detalhada de cada página de serviço e de todas as seções institucionais restantes.
2. Adicionar filtros, busca e resposta rápida por WhatsApp/e-mail na caixa de mensagens.
3. Adicionar SEO avançado por página, agendamento de publicação e histórico de alterações.

## Antes de publicar

1. Execute a migração SQL no Supabase, após trocar o e-mail do administrador no fim do arquivo.
2. Faça login com essa conta e valide o dashboard, criação de post, envio de imagem e formulário de contato.
3. Publique a raiz do projeto, incluindo `admin/`, `assets/` e `supabase/`.
