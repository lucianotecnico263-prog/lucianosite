const AdminMessagesService = {
  async list() {
    const { data, error } = await supabaseClient
      .from('mensagens')
      .select('*')
      .order('created_at', { ascending: false });

    return { data: data || [], error };
  },

  async markAsRead(id) {
    const { data, error } = await supabaseClient
      .from('mensagens')
      .update({ lida: true })
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  async archive(id) {
    const { data, error } = await supabaseClient
      .from('mensagens')
      .update({ arquivada: true })
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  async remove(id) {
    const { error } = await supabaseClient
      .from('mensagens')
      .delete()
      .eq('id', id);

    return { error };
  }
};
