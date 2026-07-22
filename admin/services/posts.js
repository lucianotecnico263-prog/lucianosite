const AdminPostsService = {
  async list() {
    const { data, error } = await supabaseClient
      .from('publicacoes')
      .select('*, categoria:categorias!publicacoes_categoria_id_fkey(id, nome, slug)')
      .order('created_at', { ascending: false });

    return { data: data || [], error };
  },

  async create(payload) {
    const { data, error } = await supabaseClient
      .from('publicacoes')
      .insert([payload])
      .select()
      .single();

    return { data, error };
  },

  async update(id, payload) {
    const { data, error } = await supabaseClient
      .from('publicacoes')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  async remove(id) {
    const { error } = await supabaseClient
      .from('publicacoes')
      .delete()
      .eq('id', id);

    return { error };
  }
};
