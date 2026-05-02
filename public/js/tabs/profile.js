window.ProfileTab = {

  // Update avatar + dropdown header whenever user data changes
  updateTopbar: function() {
    var u = window.State.user;
    var initials = u.initials || (u.name||'NA').split(' ')
      .filter(function(w){return w.length>0;}).map(function(w){return w[0];})
      .join('').toUpperCase().slice(0,2) || 'NA';

    var avatarEl = document.getElementById('user-avatar');
    if (avatarEl) avatarEl.textContent = initials;

    var pdAvatar = document.getElementById('pd-avatar');
    if (pdAvatar) pdAvatar.textContent = initials;

    var pdName = document.getElementById('pd-name');
    if (pdName) pdName.textContent = u.name || 'User';

    var pdSub = document.getElementById('pd-sub');
    if (pdSub) {
      var riskLabel = (u.risk||'balanced').charAt(0).toUpperCase()+(u.risk||'balanced').slice(1);
      pdSub.textContent = riskLabel + ' · ' + window.Utils.fmt(u.monthlySavings||0) + '/mo';
    }
  },

  toggleDropdown: function() {
    var dd = document.getElementById('profile-dropdown');
    if (!dd) return;
    var isOpen = dd.classList.contains('open');
    if (isOpen) {
      ProfileTab.closeDropdown();
    } else {
      ProfileTab.updateTopbar();
      dd.classList.add('open');
      // Close on outside click
      setTimeout(function() {
        document.addEventListener('click', ProfileTab._outsideClick, { once: true });
      }, 10);
    }
  },

  _outsideClick: function(e) {
    var dd = document.getElementById('profile-dropdown');
    var av = document.getElementById('user-avatar');
    if (dd && !dd.contains(e.target) && e.target !== av) {
      ProfileTab.closeDropdown();
    }
  },

  closeDropdown: function() {
    var dd = document.getElementById('profile-dropdown');
    if (dd) dd.classList.remove('open');
  },

  goFullProfile: function() {
    ProfileTab.closeDropdown();
    window.Router.go('profile');
  },

  // Full profile page render
  render: function() {
    var el = document.getElementById('tab-profile');
    if (!el) return;
    var u = window.State.user;
    var p = window.State.portfolio;
    var initials = u.initials || (u.name||'U').split(' ')
      .filter(function(w){return w.length>0;}).map(function(w){return w[0];})
      .join('').toUpperCase().slice(0,2);
    var incomeLabels = {'u25':'Under ₹25,000','25-50':'₹25,000–₹50,000','50-1L':'₹50,000–₹1 Lakh','1L+':'Above ₹1 Lakh'};
    var riskColors = {safe:'var(--green-dark)',balanced:'var(--blue-dark)',growth:'var(--red-dark)'};
    var riskBg    = {safe:'var(--green-bg)',   balanced:'var(--blue-bg)',  growth:'var(--red-bg)'};
    var gain = p.totalValue - p.totalInvested;

    el.innerHTML =
      '<div class="page-header"><h1>My Profile</h1><p>Your investment profile and account settings</p></div>' +

      // Avatar + name
      '<div class="card" style="margin-bottom:16px;">' +
        '<div class="card-body" style="padding:24px;">' +
          '<div style="display:flex;align-items:center;gap:20px;margin-bottom:24px;">' +
            '<div style="width:80px;height:80px;border-radius:50%;background:#0f172a;border:2px solid #1a9e75;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:700;color:white;box-shadow:var(--shadow-brand);flex-shrink:0;">' + initials + '</div>' +
            '<div>' +
              '<div style="font-family:var(--font-serif);font-size:26px;color:var(--text);margin-bottom:4px;">' + (u.name||'User') + '</div>' +
              '<div style="font-size:13px;color:var(--text-3);">Investor since today 🌱</div>' +
              (window.Supabase && window.Supabase.configured() ?
                '<div style="font-size:12px;color:var(--green-dark);margin-top:6px;font-weight:600;display:flex;align-items:center;gap:4px;"><span style="width:7px;height:7px;background:var(--green);border-radius:50%;display:inline-block;"></span> Synced to cloud</div>' :
                '<div style="font-size:12px;color:var(--text-3);margin-top:6px;">⚪ Local only — Supabase not connected</div>') +
            '</div>' +
          '</div>' +
          '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">' +
            ProfileTab._tile('💰 Monthly Income', incomeLabels[u.income]||'—') +
            ProfileTab._tile('📅 Monthly SIP', window.Utils.fmt(u.monthlySavings||0), 'var(--brand)', 'var(--brand-light)') +
            ProfileTab._tile('⚖️ Risk Profile', (u.risk||'balanced').charAt(0).toUpperCase()+(u.risk||'balanced').slice(1), riskColors[u.risk], riskBg[u.risk]) +
            ProfileTab._tile('💼 Portfolio', window.Utils.fmtK(p.totalValue||0), 'var(--green-dark)', 'var(--green-bg)') +
            ProfileTab._tile('📈 Returns', window.Utils.fmtK(gain||0) + ' (' + (p.xirr||0) + '% XIRR)', gain >= 0 ? 'var(--green-dark)' : 'var(--red-dark)') +
            ProfileTab._tile('🎯 Goals', (window.State.goals||[]).length + ' active') +
          '</div>' +
        '</div>' +
      '</div>' +

      // Goals
      ((window.State.goals||[]).length > 0 ?
        '<div class="card" style="margin-bottom:16px;">' +
          '<div class="card-header"><div class="card-title">Active Goals</div></div>' +
          '<div class="card-body" style="padding-top:8px;">' +
          (window.State.goals||[]).map(function(g) {
            var pct = Math.min(100, Math.round(g.saved/g.target*100));
            return '<div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border);">' +
              '<div style="font-size:20px;">' + g.emoji + '</div>' +
              '<div style="flex:1;">' +
                '<div style="font-size:13px;font-weight:600;">' + g.name + '</div>' +
                '<div style="height:5px;background:var(--surface-3);border-radius:3px;margin:5px 0;overflow:hidden;"><div style="width:' + pct + '%;height:100%;background:' + g.color + ';border-radius:3px;"></div></div>' +
                '<div style="font-size:12px;color:var(--text-3);">Target: ' + window.Utils.fmtK(g.target) + ' · ' + g.deadline + '</div>' +
              '</div>' +
              '<div style="font-size:14px;font-weight:700;color:' + g.color + ';">' + pct + '%</div>' +
            '</div>';
          }).join('') +
          '</div></div>'
      : '') +

      // Holdings
      (p.holdings && p.holdings.length > 0 ?
        '<div class="card" style="margin-bottom:16px;">' +
          '<div class="card-header"><div class="card-title">My Funds</div></div>' +
          '<div class="card-body" style="padding-top:8px;">' +
          p.holdings.map(function(h) {
            return '<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border);">' +
              '<div style="width:36px;height:36px;border-radius:8px;background:' + h.logoBg + ';color:' + h.logoColor + ';font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;">' + h.logo + '</div>' +
              '<div style="flex:1;min-width:0;">' +
                '<div style="font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + h.name + '</div>' +
                '<div style="font-size:11px;color:var(--text-3);">' + h.type + ' · SIP ' + window.Utils.fmt(h.sipAmount) + '/mo</div>' +
              '</div>' +
              '<div style="text-align:right;">' +
                '<div style="font-size:13px;font-weight:700;">' + window.Utils.fmtK(h.current) + '</div>' +
                '<div style="font-size:12px;color:var(--green-dark);font-weight:600;">+' + h.returns + '%</div>' +
              '</div>' +
            '</div>';
          }).join('') +
          '</div></div>'
      : '') +

      // Actions
      '<div class="card" style="margin-bottom:16px;">' +
        '<div class="card-header"><div class="card-title">Account Actions</div></div>' +
        '<div class="card-body" style="display:flex;flex-direction:column;gap:10px;padding-top:16px;">' +
          '<button class="btn btn-secondary btn-full" style="justify-content:flex-start;gap:12px;" onclick="ProfileTab.restartOnboarding()"><span>✏️</span> Edit Profile &amp; Goals</button>' +
          '<button class="btn btn-secondary btn-full" style="justify-content:flex-start;gap:12px;" onclick="ProfileTab.testSupabase()"><span>🔌</span> Test Supabase Connection</button>' +
          '<button class="btn btn-danger btn-full" style="justify-content:flex-start;gap:12px;" onclick="ProfileTab.clearData()"><span>🗑️</span> Clear All Data &amp; Start Fresh</button>' +
        '</div>' +
      '</div>' +

      // Supabase help
      '<div class="card">' +
        '<div class="card-header"><div class="card-title">📊 How to check data in Supabase</div></div>' +
        '<div class="card-body">' +
          '<div style="font-size:13px;color:var(--text-2);line-height:1.8;">' +
            '1. Go to <strong>supabase.com</strong> → your project<br>' +
            '2. Click <strong>Table Editor</strong> in the left sidebar<br>' +
            '3. Select <strong>users</strong> table → you\'ll see your row<br>' +
            '4. Select <strong>messages</strong> → see AI chat history<br>' +
            '5. Select <strong>actions</strong> → see SIP actions<br><br>' +
            '<strong>If tables are empty:</strong> Complete onboarding and click "Launch My Dashboard". Data saves at that moment.' +
          '</div>' +
          '<button class="btn btn-primary btn-sm" style="margin-top:14px;" onclick="ProfileTab.testSupabase()">Test Connection Now</button>' +
        '</div>' +
      '</div>';
  },

  _tile: function(label, value, color, bg) {
    return '<div style="background:' + (bg||'var(--surface-2)') + ';border-radius:var(--r);padding:14px;border:1px solid var(--border);">' +
      '<div style="font-size:11px;color:var(--text-3);font-weight:600;margin-bottom:5px;">' + label + '</div>' +
      '<div style="font-size:15px;font-weight:700;color:' + (color||'var(--text)') + ';">' + value + '</div>' +
    '</div>';
  },

  restartOnboarding: function() {
    ProfileTab.closeDropdown();
    var appEl = document.getElementById('main-app');
    var obEl  = document.getElementById('onboarding');
    if (appEl) { appEl.scrollTop = 0; appEl.classList.remove('active'); }
    if (obEl)  { obEl.scrollTop = 0;  obEl.classList.add('active'); }
    window.Onboarding.init();
    // Pre-fill from current state
    setTimeout(function() {
      var nameInp = document.getElementById('inp-name');
      var savInp  = document.getElementById('inp-savings');
      if (nameInp && window.State.user.name) nameInp.value = window.State.user.name;
      if (savInp  && window.State.user.monthlySavings) savInp.value = window.State.user.monthlySavings;
      var incEl = document.querySelector('[data-val="' + window.State.user.income + '"]');
      if (incEl) window.Onboarding.selIncome(incEl);
    }, 100);
  },

  testSupabase: function() {
    ProfileTab.closeDropdown();
    if (window.Supabase && window.Supabase.configured()) {
      window.Supabase.test();
      window.Utils.toast('Check browser console (F12) for Supabase result', '', 4000);
    } else {
      window.Utils.toast('Supabase not configured — check config.js', 'error', 4000);
    }
  },

  clearData: function() {
    ProfileTab.closeDropdown();
    if (!confirm('This clears all local data and restarts onboarding. Sure?')) return;
    try { localStorage.clear(); } catch(e) {}
    location.reload();
  },
};
