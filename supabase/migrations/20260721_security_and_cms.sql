-- Execute este arquivo inteiro no SQL Editor do Supabase.
-- Antes de executar, substitua o e-mail na última instrução pelo e-mail
-- da conta que deve administrar o CMS.

begin;

-- Perfis e autorização administrativa.
alter table public.usuarios
  add column if not exists papel text not null default 'usuario'
  check (papel in ('usuario', 'admin'));

insert into public.usuarios (id, email)
select id, email
from auth.users
where email is not null
on conflict (id) do nothing;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.usuarios
    where id = auth.uid()
      and papel = 'admin'
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.usuarios (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Relação consistente entre posts e categorias.
-- Algumas instalações já migraram para categoria_id. O bloco abaixo só
-- aproveita a coluna antiga categoria quando ela ainda existir.
alter table public.publicacoes
  add column if not exists categoria_id uuid;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'publicacoes' and column_name = 'categoria'
  ) then
    execute $sql$
      insert into public.categorias (nome, slug, ordem, ativo)
      select distinct trim(categoria), lower(regexp_replace(trim(categoria), '[^[:alnum:]]+', '-', 'g')), 0, true
      from public.publicacoes
      where categoria is not null and trim(categoria) <> ''
      on conflict do nothing
    $sql$;

    execute $sql$
      update public.publicacoes as publicacao
      set categoria_id = categoria.id
      from public.categorias as categoria
      where publicacao.categoria is not null
        and categoria.slug = lower(regexp_replace(trim(publicacao.categoria), '[^[:alnum:]]+', '-', 'g'))
    $sql$;
  end if;
end;
$$;

alter table public.publicacoes
  drop constraint if exists publicacoes_categoria_id_fkey;

alter table public.publicacoes
  add constraint publicacoes_categoria_id_fkey
  foreign key (categoria_id) references public.categorias(id) on delete set null;

alter table public.publicacoes
  drop column if exists categoria;

alter table public.publicacoes
  alter column publicado set default false;

update public.publicacoes set publicado = false where publicado is null;

alter table public.publicacoes
  alter column publicado set not null;

alter table public.mensagens
  alter column lida set default false,
  alter column arquivada set default false;

alter table public.mensagens
  drop constraint if exists mensagens_mensagem_tamanho_check;

alter table public.mensagens
  add constraint mensagens_mensagem_tamanho_check
  check (char_length(mensagem) between 10 and 5000) not valid;

-- Atualização automática dos campos updated_at.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists categorias_set_updated_at on public.categorias;
create trigger categorias_set_updated_at before update on public.categorias
for each row execute procedure public.set_updated_at();

drop trigger if exists configuracoes_set_updated_at on public.configuracoes;
create trigger configuracoes_set_updated_at before update on public.configuracoes
for each row execute procedure public.set_updated_at();

drop trigger if exists mensagens_set_updated_at on public.mensagens;
create trigger mensagens_set_updated_at before update on public.mensagens
for each row execute procedure public.set_updated_at();

drop trigger if exists publicacoes_set_updated_at on public.publicacoes;
create trigger publicacoes_set_updated_at before update on public.publicacoes
for each row execute procedure public.set_updated_at();

-- Remove regras permissivas antigas e aplica acesso mínimo necessário.
drop policy if exists "authenticated_can_manage_categories" on public.categorias;
drop policy if exists "public_can_read_active_categories" on public.categorias;
drop policy if exists "authenticated_can_manage_config" on public.configuracoes;
drop policy if exists "public_can_read_config" on public.configuracoes;
drop policy if exists "authenticated_can_insert_logs" on public.logs;
drop policy if exists "authenticated_can_read_logs" on public.logs;
drop policy if exists "authenticated_can_manage_messages" on public.mensagens;
drop policy if exists "public_can_insert_messages" on public.mensagens;
drop policy if exists "Permitir CRUD em publicacoes apenas para usuarios logados" on public.publicacoes;
drop policy if exists "authenticated_can_delete_own_posts" on public.publicacoes;
drop policy if exists "authenticated_can_insert_posts" on public.publicacoes;
drop policy if exists "authenticated_can_read_all_posts" on public.publicacoes;
drop policy if exists "authenticated_can_update_own_posts" on public.publicacoes;
drop policy if exists "public_can_read_published_posts" on public.publicacoes;
drop policy if exists "publico_le_publicados" on public.publicacoes;
drop policy if exists "Permitir CRUD no proprio perfil" on public.usuarios;
drop policy if exists "public_read_active_categories" on public.categorias;
drop policy if exists "admin_manage_categories" on public.categorias;
drop policy if exists "public_read_site_settings" on public.configuracoes;
drop policy if exists "admin_manage_settings" on public.configuracoes;
drop policy if exists "admin_read_logs" on public.logs;
drop policy if exists "admin_create_logs" on public.logs;
drop policy if exists "public_send_messages" on public.mensagens;
drop policy if exists "admin_manage_messages" on public.mensagens;
drop policy if exists "public_read_published_posts" on public.publicacoes;
drop policy if exists "admin_manage_posts" on public.publicacoes;
drop policy if exists "user_read_own_profile" on public.usuarios;
drop policy if exists "admin_manage_profiles" on public.usuarios;

create policy "public_read_active_categories" on public.categorias
for select to anon using (ativo = true);
create policy "admin_manage_categories" on public.categorias
for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Não armazene senhas, chaves privadas ou dados sensíveis em configuracoes.
create policy "public_read_site_settings" on public.configuracoes
for select to anon using (true);
create policy "admin_manage_settings" on public.configuracoes
for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admin_read_logs" on public.logs
for select to authenticated using (public.is_admin());
create policy "admin_create_logs" on public.logs
for insert to authenticated with check (public.is_admin());

create policy "public_send_messages" on public.mensagens
for insert to anon with check (
  char_length(mensagem) between 10 and 5000
  and (email is null or char_length(email) <= 254)
);
create policy "admin_manage_messages" on public.mensagens
for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public_read_published_posts" on public.publicacoes
for select to anon using (publicado = true);
create policy "admin_manage_posts" on public.publicacoes
for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "user_read_own_profile" on public.usuarios
for select to authenticated using (id = auth.uid());
create policy "admin_manage_profiles" on public.usuarios
for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Bucket de imagens usado pelo CMS.
insert into storage.buckets (id, name, public)
values ('posts-imagens', 'posts-imagens', true)
on conflict (id) do update set public = true;

drop policy if exists "public_read_post_images" on storage.objects;
drop policy if exists "admin_manage_post_images" on storage.objects;
create policy "public_read_post_images" on storage.objects
for select to anon using (bucket_id = 'posts-imagens');
create policy "admin_manage_post_images" on storage.objects
for all to authenticated
using (bucket_id = 'posts-imagens' and public.is_admin())
with check (bucket_id = 'posts-imagens' and public.is_admin());

-- TROQUE pelo e-mail da sua conta administrativa antes de executar.
update public.usuarios
set papel = 'admin'
where email = 'SEU_EMAIL_DE_ADMIN@EXEMPLO.COM';

commit;
