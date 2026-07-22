-- Execute após 20260721_security_and_cms.sql.
-- Expande o CMS sem remover conteúdo ou funções já existentes.

begin;

create table if not exists public.conteudos_site (
  chave text primary key,
  valor jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.servicos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  slug text not null unique,
  resumo text not null,
  descricao text,
  imagem_url text,
  destaque boolean not null default false,
  ativo boolean not null default true,
  ordem integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolios (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  categoria text not null,
  resumo text not null,
  imagem_url text,
  video_url text,
  resultado text,
  publicado boolean not null default true,
  ordem integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.depoimentos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cargo text,
  texto text not null,
  nota smallint not null default 5 check (nota between 1 and 5),
  foto_url text,
  destaque boolean not null default false,
  ativo boolean not null default true,
  ordem integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  pergunta text not null,
  resposta text not null,
  ativo boolean not null default true,
  ordem integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.conteudos_site enable row level security;
alter table public.servicos enable row level security;
alter table public.portfolios enable row level security;
alter table public.depoimentos enable row level security;
alter table public.faqs enable row level security;

drop trigger if exists conteudos_site_set_updated_at on public.conteudos_site;
create trigger conteudos_site_set_updated_at before update on public.conteudos_site
for each row execute procedure public.set_updated_at();

drop trigger if exists servicos_set_updated_at on public.servicos;
create trigger servicos_set_updated_at before update on public.servicos
for each row execute procedure public.set_updated_at();

drop trigger if exists portfolios_set_updated_at on public.portfolios;
create trigger portfolios_set_updated_at before update on public.portfolios
for each row execute procedure public.set_updated_at();

drop trigger if exists depoimentos_set_updated_at on public.depoimentos;
create trigger depoimentos_set_updated_at before update on public.depoimentos
for each row execute procedure public.set_updated_at();

drop trigger if exists faqs_set_updated_at on public.faqs;
create trigger faqs_set_updated_at before update on public.faqs
for each row execute procedure public.set_updated_at();

drop policy if exists "public_read_site_content" on public.conteudos_site;
drop policy if exists "admin_manage_site_content" on public.conteudos_site;
drop policy if exists "public_read_active_services" on public.servicos;
drop policy if exists "admin_manage_services" on public.servicos;
drop policy if exists "public_read_published_portfolios" on public.portfolios;
drop policy if exists "admin_manage_portfolios" on public.portfolios;
drop policy if exists "public_read_active_testimonials" on public.depoimentos;
drop policy if exists "admin_manage_testimonials" on public.depoimentos;
drop policy if exists "public_read_active_faqs" on public.faqs;
drop policy if exists "admin_manage_faqs" on public.faqs;

create policy "public_read_site_content" on public.conteudos_site
for select to anon using (true);
create policy "admin_manage_site_content" on public.conteudos_site
for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public_read_active_services" on public.servicos
for select to anon using (ativo = true);
create policy "admin_manage_services" on public.servicos
for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public_read_published_portfolios" on public.portfolios
for select to anon using (publicado = true);
create policy "admin_manage_portfolios" on public.portfolios
for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public_read_active_testimonials" on public.depoimentos
for select to anon using (ativo = true);
create policy "admin_manage_testimonials" on public.depoimentos
for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public_read_active_faqs" on public.faqs
for select to anon using (ativo = true);
create policy "admin_manage_faqs" on public.faqs
for all to authenticated using (public.is_admin()) with check (public.is_admin());

commit;
