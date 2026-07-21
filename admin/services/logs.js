const AdminLogsService = {
  async list() {
    const { data, error } = await supabaseClient
      .from('logs')
      .select('*')
      .order('created_at', { ascending: false });

    return { data: data || [], error };
  },

  async create(tipo, descricao, usuarioId = null, metadata = {}) {
    const { data, error } = await supabaseClient
      .from('logs')
      .insert([{ tipo, descricao, usuario_id: usuarioId, metadata }])
      .select()
      .single();

    return { data, error };
  }
};
