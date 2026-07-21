# Luciano Júnior | Editor de Vídeo

Site institucional hospedado em GitHub Pages, com Supabase como backend para autenticação, banco de dados e storage.

---

## Estrutura do Projeto

```text
lucianosite/
├── admin/
│   ├── index.html
│   ├── login.html
│   ├── css/
│   ├── js/
│   ├── services/
│   ├── pages/
│   └── components/
├── assets/
│   ├── css/
│   ├── img/
│   └── js/
├── frontend/
│   ├── app.js
│   ├── index.html
│   └── style.css
└── README.md
```

---

## Arquitetura Administrativa

O painel administrativo foi refatorado para seguir uma estrutura modular, com separação por responsabilidade:

- `admin/js/` → autenticação, roteamento, UI e utilitários
- `admin/services/` → integrações com Supabase para posts, mídia e configurações
- `admin/pages/` → renderização das páginas do CMS
- `admin/components/` → blocos reutilizáveis como sidebar, navbar, modal e toast
- `admin/css/` → estilos do painel em módulos temáticos

Essa organização mantém compatibilidade com GitHub Pages e evita o acoplamento de lógica do frontend público com o CMS.

---

## Fluxo de Publicações

O blog público continua lendo os artigos diretamente do Supabase usando a tabela `publicacoes`.

Regra principal:

- `publicado = true` → aparece no frontend público
- `publicado = false` → permanece como rascunho no admin

A correção do fluxo foi feita no nível de persistência e de leitura, com a tabela e políticas já preparadas no Supabase.

---

## Painel Admin

- Login: `admin/login.html`
- Dashboard principal: `admin/index.html`

O painel agora está preparado para evoluir com:

- dashboard com métricas
- gestão de publicações
- biblioteca de mídia
- categorias
- configurações
- mensagens e logs

---

## Observações de Deploy

- O frontend público não foi alterado.
- O painel administrativo continua estático e compatível com GitHub Pages.
- O backend continua sendo o Supabase com autenticação e storage.

---

## Suporte

Desenvolvido por Luciano Júnior.
Dúvidas sobre o site: [wa.me/5535998737319](https://wa.me/5535998737319)
