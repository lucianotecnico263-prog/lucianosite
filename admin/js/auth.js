const AdminAuth = {
  async session() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    return session;
  },

  async login(email, password) {
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    return { error };
  },

  async logout() {
    const { error } = await supabaseClient.auth.signOut();
    return { error };
  },

  async requireSession() {
    const session = await this.session();
    if (!session) {
      window.location.href = 'login.html';
      return null;
    }

    const { data: profile, error } = await supabaseClient
      .from('usuarios')
      .select('papel')
      .eq('id', session.user.id)
      .single();

    if (error || profile?.papel !== 'admin') {
      await this.logout();
      window.location.href = 'login.html?erro=sem-permissao';
      return null;
    }

    return session;
  }
};
