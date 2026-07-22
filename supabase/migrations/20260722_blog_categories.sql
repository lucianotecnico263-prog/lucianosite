-- Categorias iniciais do blog. Pode ser executado mais de uma vez com segurança.
-- "Todos" é apenas um filtro do site; não é uma categoria de publicação.

begin;

insert into public.categorias (nome, slug, ordem, ativo)
select seed.nome, seed.slug, seed.ordem, true
from (
  values
    ('Edição', 'edicao', 10),
    ('Estratégia', 'estrategia', 20),
    ('Storytelling', 'storytelling', 30),
    ('Marketing', 'marketing', 40),
    ('IA', 'ia', 50)
) as seed(nome, slug, ordem)
where not exists (
  select 1
  from public.categorias categoria
  where categoria.slug = seed.slug
);

commit;
