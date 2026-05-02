// ===== Theme Manager — Dark / Light mode =====
window.ThemeManager = {
  // 'dark' | 'light' | 'system'
  current: 'system',

  init: function() {
    // Load saved preference — DEFAULT IS DARK
    try {
      var saved = localStorage.getItem('nivesh_theme');
      if (saved === 'light') {
        ThemeManager.current = 'light';
        ThemeManager._apply('light');
      } else {
        // Dark is default (no saved pref = dark)
        ThemeManager.current = 'dark';
        ThemeManager._apply('dark');
      }
    } catch(e) {
      ThemeManager._apply('dark');
    }
    ThemeManager._updateIcon();

    // Listen for system theme changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
        if (ThemeManager.current === 'system') {
          ThemeManager._applySystem();
          ThemeManager._updateIcon();
        }
      });
    }
  },

  toggle: function() {
    // Cycle: system → light → dark → light → dark ...
    // If currently showing dark → switch to light, and vice versa
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    var next = isDark ? 'light' : 'dark';
    ThemeManager.current = next;
    ThemeManager._apply(next);
    ThemeManager._updateIcon();
    try { localStorage.setItem('nivesh_theme', next); } catch(e) {}

    window.Utils && window.Utils.toast(
      next === 'dark' ? '🌙 Dark mode on' : '☀️ Light mode on',
      '', 1500
    );
  },

  _apply: function(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.style.colorScheme = 'light';
    }
  },

  _applySystem: function() {
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    ThemeManager._apply(prefersDark ? 'dark' : 'light');
  },

  isDark: function() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  },

  _updateIcon: function() {
    var isDark = ThemeManager.isDark();
    // Update all moon/sun icons across all screens
    var moonIds = ['theme-icon-moon', 'ob-theme-moon'];
    var sunIds  = ['theme-icon-sun',  'ob-theme-sun'];
    moonIds.forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.style.display = isDark ? 'none' : 'block';
    });
    sunIds.forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.style.display = isDark ? 'block' : 'none';
    });
  },
};

// Init immediately so theme applies before page renders (no flash)
ThemeManager.init();
