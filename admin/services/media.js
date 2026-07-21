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
  }
};
