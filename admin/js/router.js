const AdminRouter = {
  routes: {
    dashboard: window.AdminPages?.dashboard,
    posts: window.AdminPages?.posts,
    siteContent: window.AdminPages?.siteContent,
    categories: window.AdminPages?.categories,
    services: window.AdminPages?.services,
    portfolios: window.AdminPages?.portfolios,
    testimonials: window.AdminPages?.testimonials,
    faqs: window.AdminPages?.faqs,
    media: window.AdminPages?.media,
    messages: window.AdminPages?.messages,
    users: window.AdminPages?.users,
    logs: window.AdminPages?.logs,
    settings: window.AdminPages?.settings
  },

  current: 'dashboard',

  init() {
    document.querySelectorAll('[data-route]').forEach(link => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const route = event.currentTarget.dataset.route;
        this.navigate(route);
      });
    });

    this.navigate(this.current);
  },

  async navigate(route) {
    this.current = route;
    const view = this.routes[route];
    const root = document.querySelector('#admin-view');
    if (!view || !root) return;

    document.querySelectorAll('[data-route]').forEach(link => {
      link.classList.toggle('active', link.dataset.route === route);
    });

    await view.render(root);
  }
};
