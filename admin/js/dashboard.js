window.AdminDashboard = {
  async loadMetrics() {
    const [postsResult, categoriesResult] = await Promise.all([
      AdminPostsService.list(),
      AdminCategoriesService.list()
    ]);

    const posts = postsResult.data || [];
    const categories = categoriesResult.data || [];

    return {
      posts: posts.length,
      categorias: categories.length,
      uploads: 0,
      users: 1
    };
  }
};
