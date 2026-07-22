const AdminCmsService = {
  async list(table, order = 'ordem') {
    const { data, error } = await supabaseClient.from(table).select('*').order(order, { ascending: true });
    return { data: data || [], error };
  },

  async create(table, payload) {
    const { data, error } = await supabaseClient.from(table).insert([payload]).select().single();
    return { data, error };
  },

  async update(table, id, payload) {
    const { data, error } = await supabaseClient.from(table).update(payload).eq('id', id).select().single();
    return { data, error };
  },

  async remove(table, id) {
    const { error } = await supabaseClient.from(table).delete().eq('id', id);
    return { error };
  },

  async getSiteContent() {
    const { data, error } = await supabaseClient.from('conteudos_site').select('*').eq('chave', 'geral').maybeSingle();
    return { data: data?.valor || {}, error };
  },

  async saveSiteContent(valor) {
    const { data, error } = await supabaseClient
      .from('conteudos_site')
      .upsert({ chave: 'geral', valor }, { onConflict: 'chave' })
      .select()
      .single();
    return { data, error };
  }
};
