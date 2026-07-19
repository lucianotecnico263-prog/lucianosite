# Luciano Júnior | Editor de Vídeo

Site profissional para Luciano Júnior — Editor de Vídeo.
Stack: **Cloudflare Pages** (frontend) + **Cloudflare Worker** (API) + **Cloudflare D1** (banco SQLite).

---

## Estrutura do Projeto

```
luciano-editor/
├── frontend/
│   ├── index.html        ← Landing page principal (dinâmica via API)
│   ├── admin.html        ← Painel administrativo
│   ├── termos.html       ← Termos de serviço
│   ├── privacidade.html  ← Política de privacidade
│   ├── style.css         ← Estilos globais (preto + dourado)
│   ├── script.js         ← Fetch API, portfólio, animações
│   ├── llms.txt          ← Metadados para LLMs/AI crawlers
│   ├── og-image.jpg      ← Imagem Open Graph (adicionar manualmente)
│   ├── _headers          ← Headers HTTP (cache, CORS, CSP)
│   └── _redirects        ← Redirecionamentos Cloudflare Pages
├── worker/
│   ├── index.js          ← Cloudflare Worker (API /api/settings)
│   └── schema.sql        ← Schema do banco D1
├── wrangler.toml         ← Configuração do Wrangler CLI
└── README.md             ← Este arquivo
```

---

## Deploy Passo a Passo

### Pré-requisitos

- Conta na [Cloudflare](https://cloudflare.com) (plano gratuito é suficiente)
- [Node.js](https://nodejs.org) instalado
- Wrangler CLI: `npm install -g wrangler`
- Login: `wrangler login`

---

### Passo 1 — Criar o banco D1

```bash
wrangler d1 create luciano-db
```

Copie o `database_id` retornado e cole no `wrangler.toml`:

```toml
[[d1_databases]]
binding       = "DB"
database_name = "luciano-db"
database_id   = "SEU-ID-AQUI"
```

---

### Passo 2 — Executar o schema SQL

```bash
wrangler d1 execute luciano-db --file=./worker/schema.sql
```

Isso cria a tabela `settings` com os valores padrão.

---

### Passo 3 — Deploy do Worker

```bash
wrangler deploy
```

Anote a URL do Worker (ex: `https://luciano-editor-worker.SEU-USUARIO.workers.dev`).

---

### Passo 4 — Deploy do Frontend no Cloudflare Pages

**Opção A — Via Dashboard (recomendado):**

1. Acesse [dash.cloudflare.com](https://dash.cloudflare.com) → Pages → Create a project
2. Conecte seu repositório Git ou faça upload direto da pasta `/frontend`
3. Build settings: deixe em branco (site estático)
4. Root directory: `frontend`
5. Clique em **Deploy**

**Opção B — Via CLI:**

```bash
wrangler pages deploy frontend --project-name=luciano-editor
```

---

### Passo 5 — Conectar Worker ao Pages

No dashboard do Cloudflare Pages:

1. Vá em **Settings → Functions**
2. Em **KV namespace bindings** ou **Service bindings**, adicione o Worker
3. Ou configure um **Custom Domain** e use **Route** para `/api/*` → Worker

**Alternativa simples:** No `script.js`, altere a URL da API para o endereço completo do Worker:

```js
// Em script.js, linha do fetch:
const res = await fetch('https://luciano-editor-worker.SEU-USUARIO.workers.dev/api/settings', ...);
```

---

### Passo 6 — Adicionar og-image.jpg

Coloque uma imagem de capa (1200×630px) na pasta `/frontend/` com o nome `og-image.jpg`.

---

## Painel Admin

Acesse: `https://SEU-SITE.pages.dev/admin.html`

**Chave de acesso:** `luciano2026`

> Para alterar a senha, edite a constante `ADMIN_KEY` em `worker/index.js` e faça `wrangler deploy` novamente.

---

## Personalização

| O que mudar | Onde |
|---|---|
| Preço, WhatsApp, títulos | Painel admin (`/admin.html`) |
| Vídeos do portfólio | `script.js` → array `VIDEO_IDS` |
| Cores e fontes | `style.css` → variáveis `:root` |
| Senha do admin | `worker/index.js` → constante `ADMIN_KEY` |
| Textos fixos | `index.html` (seções Serviços, Como Funciona, Sobre) |

---

## Redirecionamentos Disponíveis

| URL | Destino |
|---|---|
| `/whatsapp` | WhatsApp do Luciano |
| `/site` | WhatsApp do desenvolvedor |
| `/youtube` | Canal @matrizgeek |

---

## Suporte

Desenvolvido por [Manus AI](https://manus.im).
Dúvidas sobre o site: [wa.me/5535998737319](https://wa.me/5535998737319)
