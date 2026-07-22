window.AdminDashboard = {
  async loadMetrics() {
    const [postsResult, categoriesResult, messagesResult, usersResult, portfoliosResult] = await Promise.all([
      AdminPostsService.list(),
      AdminCategoriesService.list(),
      supabaseClient.from('mensagens').select('id, lida'),
      supabaseClient.from('usuarios').select('id'),
      AdminCmsService.list('portfolios')
    ]);

    const posts = postsResult.data || [];
    const categories = categoriesResult.data || [];

    return {
      posts: posts.length,
      categorias: categories.length,
      mensagens: (messagesResult.data || []).filter(item => !item.lida).length,
      usuarios: (usersResult.data || []).length,
      portfolios: (portfoliosResult.data || []).length
    };
  }
};
