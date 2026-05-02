// ===== Notifications =====
window.Notifications = {
  init() {
    this.render();
    if (window.ProfileTab) window.ProfileTab.updateTopbar();
    window.Utils.on(window.Utils.el('notif-btn'), 'click', (e) => { e.stopPropagation(); this.toggle(); });
    window.Utils.on(window.Utils.el('notif-overlay'), 'click', () => this.close());
    window.Utils.on(window.Utils.el('notif-clear'), 'click', () => this.clearAll());
  },

  render() {
    const unread = window.State.notifications.filter(n => !n.read).length;
    const badge = window.Utils.el('notif-badge');
    if (badge) { badge.textContent = unread; badge.style.display = unread ? '' : 'none'; }
    const list = window.Utils.el('notif-list');
    if (!list) return;
    if (!window.State.notifications.length) {
      list.innerHTML = '<div class="empty-state" style="padding:24px;"><p>No notifications</p></div>';
      return;
    }
    list.innerHTML = window.State.notifications.map(n => `
      <div class="notif-item" onclick="Notifications.markRead(${n.id})">
        <div class="notif-item-title">${n.read ? '' : '<span class="notif-dot-unread"></span>'}${n.title}</div>
        <div class="notif-item-body">${n.body}</div>
        <div class="notif-item-time">${n.time}</div>
      </div>
    `).join('');
  },

  toggle() {
    const drawer = window.Utils.el('notif-drawer');
    const overlay = window.Utils.el('notif-overlay');
    const isOpen = drawer.classList.contains('open');
    drawer.classList.toggle('open', !isOpen);
    overlay.classList.toggle('open', !isOpen);
  },

  close() {
    window.Utils.el('notif-drawer')?.classList.remove('open');
    window.Utils.el('notif-overlay')?.classList.remove('open');
  },

  markRead(id) {
    const n = window.State.notifications.find(n => n.id === id);
    if (n) { n.read = true; this.render(); }
  },

  clearAll() {
    window.State.notifications.forEach(n => n.read = true);
    window.State.notifications = [];
    this.render();
    this.close();
  },
};
