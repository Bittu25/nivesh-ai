// ===== Router =====
window.Router = {
  current: 'dashboard',

  // Tabs resolved lazily so no load-order issues
  tab(name) {
    const map = {
      dashboard: window.DashboardTab,
      invest:    window.InvestTab,
      advisor:   window.AdvisorTab,
      portfolio: window.PortfolioTab,
      learn:     window.LearnTab,
      profile:   window.ProfileTab,
      tools:     window.ToolsTab,
    };
    return map[name];
  },

  init() {
    window.Utils.qsa('.nav-btn, .mnav-btn').forEach(btn => {
      window.Utils.on(btn, 'click', () => this.go(btn.dataset.tab));
    });
    this.go('dashboard');
  },

  go(name) {
    const tabModule = this.tab(name);
    if (!tabModule) return;

    window.Utils.qsa('.nav-btn, .mnav-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.tab === name)
    );
    window.Utils.qsa('.tab-page').forEach(p => p.classList.remove('active'));
    const page = window.Utils.el(`tab-${name}`);
    if (page) page.classList.add('active');

    tabModule.render();
    this.current = name;

    // Safe call — window.Notifications may not be ready on first call
    if (window.Notifications && window.Notifications.close) window.Notifications.close();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
};
