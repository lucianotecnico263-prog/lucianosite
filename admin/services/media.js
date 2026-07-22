const AdminMediaService = {
  async upload(bucket, file, path = null) {
    const key = path || `${Date.now()}-${Math.random().toString(36).slice(2)}.${file.name.split('.').pop()}`;
    const { error } = await supabaseClient.storage.from(bucket).upload(key, file, { upsert: false });
    if (error) return { error };

    const { data } = supabaseClient.storage.from(bucket).getPublicUrl(key);
    return { data: data.publicUrl, error: null };
  },

  async remove(bucket, path) {
    const { error } = await supabaseClient.storage.from(bucket).remove([path]);
    return { error };
  },

  async list(bucket) {
    const { data, error } = await supabaseClient.storage.from(bucket).list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });
    if (error) return { data: [], error };
    return { data: (data || []).map(file => ({ ...file, url: supabaseClient.storage.from(bucket).getPublicUrl(file.name).data.publicUrl })), error: null };
  }
};
