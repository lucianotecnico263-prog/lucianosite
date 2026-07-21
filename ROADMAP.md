# Roadmap do repositório `lucianosite`

> Objetivo: referência rápida para localizar código, páginas e dados antes de editar. Atualizado por inspeção local em 21/07/2026.

## Leitura em 30 segundos

Este repositório contém **dois sites estáticos independentes**, com identidades e backends diferentes. Não há `package.json`, build, framework ou testes no estado atual.

| Área | Ponto de entrada | Dados | Uso atual |
| --- | --- | --- | --- |
| Site institucional (raiz) | `index.html` | Supabase | Site “Luciano Editor”, blog e painel administrativo |
| Landing legada/alternativa | `frontend/index.html` | `/api/settings` (Cloudflare Worker/D1, externo ao repositório) | Site “Luciano Júnior”, preço/WhatsApp/título dinâmicos |

**Antes de alterar:** confirme qual desses dois sites está publicado no domínio alvo. Não misture `assets/css/style.css` com `frontend/main.css`, nem `admin/` com `frontend/`.

## Mapa de arquivos

### Raiz: site institucional

| Arquivo | Responsabilidade |
| --- | --- |
| `index.html` | Home: hero, serviços, processo, portfólio, depoimentos, prévia do blog, FAQ e CTA. |
| `sobre.html` | Página institucional e documentação histórica do projeto; parte dela está desatualizada (cita Worker/D1). |
| `servicos.html` | Hub/lista de todos os serviços. |
| `servico-youtube.html` | Página do serviço de edição para YouTube. |
| `servico-reels.html` | Página do serviço Reels/Shorts. |
| `servico-vsl.html` | Página do serviço VSL. |
| `servico-podcast.html` | Página do serviço de podcasts. |
| `servico-documentarios.html` | Página do serviço de documentários. |
| `servico-corporativos.html` | Página do serviço de vídeos corporativos. |
| `portfolio.html` | Projetos/case de portfólio. |
| `blog.html` | Lista de posts publicados; lê `public.publicacoes` diretamente no Supabase. |
| `recursos.html` | Recursos/ferramentas recomendados. |
| `contato.html` | Página de contato, formulário/CTAs. |
| `README.md` | Documentação histórica de Cloudflare Worker/D1; não representa integralmente a implementação atual. |
| `package-lock.json` | Lock vazio, sem dependências instaladas ou scripts de projeto. |

### `assets/`: base compartilhada do site institucional

| Arquivo | Responsabilidade |
| --- | --- |
| `assets/css/style.css` | Design system e estilos globais do site da raiz e do painel. |
| `assets/js/components.js` | Navbar e footer compartilhados; menu mobile, animação de reveal, contadores, FAQ e filtros. Edite aqui para links/navegação globais. |
| `assets/js/supabase-config.js` | Cria `supabaseClient` com URL/chave pública; é carregado por blog e admin. |
| `assets/img/luciano-photo.jpg` | Foto usada na navegação/rodapé. |

### `admin/`: CMS do blog (Supabase)

| Arquivo | Responsabilidade |
| --- | --- |
| `admin/login.html` | Tela de login por e-mail/senha do Supabase Auth. |
| `admin/index.html` | Formulário e lista de publicações do blog; requer sessão. |
| `admin/admin.js` | Login/logout, proteção de sessão, CRUD de posts e upload de imagens. |

Fluxo: `login.html` → `supabase.auth.signInWithPassword` → `admin/index.html` → CRUD em `publicacoes`; imagem opcional vai para o bucket `posts-imagens`.

### `frontend/`: landing alternativa/legada

| Arquivo | Responsabilidade |
| --- | --- |
| `frontend/index.html` | Landing principal alternativa. |
| `frontend/main.css` | Estilos próprios dessa landing. |
| `frontend/app.js` | Busca `GET /api/settings`, aplica preço, WhatsApp e textos; tem fallback local se a API falhar. Também controla menu, vídeo, loader e animações. |
| `frontend/termos.html` | Termos de serviço. |
| `frontend/privacidade.html` | Política de privacidade; menciona Cloudflare D1. |
| `frontend/llms.txt` | Resumo público para crawlers/LLMs. |
| `frontend/_headers` | Cabeçalhos de hospedagem Cloudflare Pages. |
| `frontend/_redirects` | Redirecionamentos Cloudflare Pages. |
| `frontend/luciano-avatar.jpg` | Avatar da landing. |
| `frontend/video.mp4` / `video-thumb.jpg` | Vídeo principal e miniatura. |
| `frontend/og-image.jpg` | Imagem social/Open Graph. |

## Supabase: inventário confirmado pelo código

Projeto configurado em `assets/js/supabase-config.js`. O inventário abaixo é baseado no código local; a consulta ao servidor não foi possível neste ambiente (rede bloqueada), portanto não afirma a existência de tabelas sem uso no frontend.

### Tabela `public.publicacoes`

| Campo usado | Origem/uso | Observação |
| --- | --- | --- |
| `id` | edição e exclusão | Identificador do post. Tipo não confirmado. |
| `titulo` | exibição e formulário | Texto do título. |
| `resumo` | cards do blog e formulário | Resumo curto. |
| `conteudo` | cálculo de tempo de leitura e formulário | Corpo do post. Atualmente o link “Ler artigo” não abre uma página de artigo. |
| `imagem_url` | capa do post e formulário | URL pública, normalmente do Storage. |
| `categoria` | badge/filtro e formulário | Valores de categoria são tratados no front. |
| `publicado` | filtro do blog e status no admin | Somente `true` aparece em `blog.html`. |
| `created_at` | ordenação e data exibida | Ordenação decrescente no blog/admin. |
| `autor_id` | preenchido apenas na criação | Recebe `session.user.id`; provavelmente referencia `auth.users.id`, mas a FK precisa ser confirmada no banco. |

Operações no código:

- Público: `SELECT *` onde `publicado = true`, ordenado por `created_at DESC` (`blog.html`).
- Admin autenticado: listar, inserir, atualizar por `id` e excluir por `id` (`admin/admin.js`).
- Implicação de segurança: RLS deve permitir leitura pública apenas de posts publicados e escrita apenas a usuários autorizados. Validar as policies antes de alterações no banco.

### Auth e Storage

| Recurso | Uso no projeto |
| --- | --- |
| `auth.users` (gerenciado pelo Supabase) | Sessão e login do painel. O código usa `session.user.id` como `autor_id`. Não editar essa tabela diretamente. |
| Bucket Storage `posts-imagens` | Upload de capas pelo admin em caminho aleatório; a URL pública é salva em `publicacoes.imagem_url`. O bucket precisa ser público, ou o blog precisará usar URLs assinadas. |

### Itens Supabase que **não** estão confirmados

- Outras tabelas, views, funções RPC, triggers, índices e policies RLS.
- Tipos, `NOT NULL`, defaults, chaves estrangeiras e valores permitidos de `categoria`.
- Conteúdo e permissões efetivas do bucket.

Para completar o mapa com o estado real, execute no **SQL Editor do Supabase** e cole o resultado nesta seção/numa futura tarefa:

```sql
select table_schema, table_name
from information_schema.tables
where table_type = 'BASE TABLE'
  and table_schema not in ('pg_catalog', 'information_schema')
order by table_schema, table_name;

select table_schema, table_name, ordinal_position,
       column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public'
order by table_name, ordinal_position;

select schemaname, tablename, policyname, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
```

## Roteiro de mudança rápida

| Se a tarefa for… | Comece por… |
| --- | --- |
| Alterar estilo/navegação do site institucional | `assets/css/style.css` e `assets/js/components.js` |
| Alterar conteúdo da home institucional | `index.html` |
| Alterar uma página de serviço | O respectivo `servico-*.html` |
| Criar/editar/excluir post | Painel `admin/`; tabela `publicacoes` |
| Ajustar regras do blog | `blog.html` + policies/estrutura de `publicacoes` |
| Alterar preço, WhatsApp ou hero da landing alternativa | API externa `/api/settings`; fallback em `frontend/app.js` |
| Alterar visual da landing alternativa | `frontend/main.css` e `frontend/index.html` |
| Alterar vídeo/imagens sociais da landing alternativa | Arquivos de mídia em `frontend/` |

## Pontos de atenção para o futuro

1. Há documentação e textos com caracteres corrompidos por encoding; manter arquivos novos em UTF-8.
2. A documentação de Cloudflare/D1 coexistindo com código Supabase indica uma migração parcial ou duas versões do site. Antes de remover qualquer área, confirmar o deploy ativo.
3. A chave em `supabase-config.js` é pública por natureza, mas nunca adicionar chave `service_role` ao repositório ou ao navegador.
4. Depois de qualquer migração de banco, atualizar esta seção e registrar tabelas/policies novas aqui.
