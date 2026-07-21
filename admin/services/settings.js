const AdminSettingsService = {
  async list() {
    const { data, error } = await supabaseClient.from('configuracoes').select('*');
    return { data: data || [], error };
  },

  async upsert(key, value) {
    const { data, error } = await supabaseClient
      .from('configuracoes')
      .upsert({ chave: key, valor: value })
      .select()
      .single();

    return { data, error };
  }
};
