// ===== Dashboard — Single Page, Everything Visible =====
window.DashboardTab = {

  render: function() {
    var el = document.getElementById('tab-dashboard');
    if (!el) return;

    var u = window.State.user;
    var p = window.State.portfolio;
    var goals = window.State.goals || [];
    var hr = new Date().getHours();
    var greet = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';
    var first = (u.name || 'there').split(' ')[0];
    var gain = p.totalValue - p.totalInvested;
    var gainPct = p.totalInvested ? ((gain / p.totalInvested) * 100).toFixed(1) : '0.0';

    // Build holdings rows
    var holdingsHTML = '';
    var holdings = p.holdings || [];
    for (var i = 0; i < holdings.length; i++) {
      var h = holdings[i];
      var retColor = h.returns >= 0 ? 'var(--green-dark)' : 'var(--red)';
      var retStr = (h.returns >= 0 ? '+' : '') + h.returns + '%';
      holdingsHTML +=
        '<div class="db1-holding">' +
          '<div class="db1-fund-logo" style="background:' + h.logoBg + ';color:' + h.logoColor + ';">' + h.logo + '</div>' +
          '<div class="db1-fund-info">' +
            '<div class="db1-fund-name">' + h.name + '</div>' +
            '<div class="db1-fund-type">' + h.type + (h.sipAmount ? ' · ₹' + h.sipAmount.toLocaleString('en-IN') + '/mo' : '') + '</div>' +
          '</div>' +
          '<div class="db1-fund-vals">' +
            '<div class="db1-fund-curr">' + window.Utils.fmtK(h.current) + '</div>' +
            '<div class="db1-fund-ret" style="color:' + retColor + ';">' + retStr + '</div>' +
          '</div>' +
        '</div>';
    }

    // Build goals rows
    var goalsHTML = '';
    if (goals.length === 0) {
      goalsHTML = '<div style="text-align:center;padding:20px;color:var(--text-3);font-size:13px;">No goals set — restart onboarding to add goals.</div>';
    }
    for (var g = 0; g < goals.length; g++) {
      var gl = goals[g];
      var pct = Math.min(100, Math.round(gl.saved / gl.target * 100));
      goalsHTML +=
        '<div class="db1-goal">' +
          '<div class="db1-goal-icon" style="background:' + gl.bg + ';">' + gl.emoji + '</div>' +
          '<div class="db1-goal-body">' +
            '<div class="db1-goal-row">' +
              '<span class="db1-goal-name">' + gl.name + '</span>' +
              '<span class="db1-goal-pct" style="color:' + gl.color + ';">' + pct + '%</span>' +
            '</div>' +
            '<div class="progress-wrap" style="margin:6px 0;">' +
              '<div class="progress-fill" style="width:' + pct + '%;background:' + gl.color + ';"></div>' +
            '</div>' +
            '<div class="db1-goal-row" style="font-size:11px;color:var(--text-3);">' +
              '<span>' + window.Utils.fmtK(gl.saved) + ' saved of ' + window.Utils.fmtK(gl.target) + '</span>' +
              '<span>📅 ' + gl.deadline + '</span>' +
            '</div>' +
          '</div>' +
        '</div>';
    }

    // Allocation values
    var alloc = DashboardTab._allocValues();
    var allocColors = ['#1a6b5a','#3b82f6','#f59e0b'];
    var allocLabels = ['Equity','Debt','Gold'];

    el.innerHTML =
      // ── Greeting ──
      '<div class="db1-header">' +
        '<div>' +
          '<div class="db1-greeting">' + greet + ', <strong>' + first + '</strong> 👋</div>' +
          '<div class="db1-date">' + window.Utils.today() + '</div>' +
        '</div>' +
        '<button class="btn btn-primary btn-sm" onclick="window.Router.go(\'advisor\')">Ask AI Advisor</button>' +
      '</div>' +

      // ── AI Insight Banner ──
      '<div class="db1-ai-banner">' +
        '<div class="db1-ai-icon">✦</div>' +
        '<div class="db1-ai-text">Your <strong>' + (u.risk||'balanced') + '</strong> portfolio has grown ' +
        '<strong>+' + gainPct + '%</strong> since you started. ' +
        (goals.length > 0 ? 'Your <strong>' + goals[0].name + '</strong> goal is on track. ' : '') +
        'Next SIP of <strong>' + window.Utils.fmt(u.monthlySavings) + '</strong> debits in 9 days.</div>' +
      '</div>' +

      // ── Stats Row ──
      '<div class="db1-stats">' +
        '<div class="db1-stat accent-green">' +
          '<div class="db1-stat-label">Portfolio Value</div>' +
          '<div class="db1-stat-val">' + window.Utils.fmtK(p.totalValue) + '</div>' +
          '<div class="db1-stat-change up">↑ ' + p.xirr + '% XIRR p.a.</div>' +
        '</div>' +
        '<div class="db1-stat accent-blue">' +
          '<div class="db1-stat-label">Total Returns</div>' +
          '<div class="db1-stat-val" style="color:var(--green-dark);">' + window.Utils.fmtK(gain) + '</div>' +
          '<div class="db1-stat-change up">+' + gainPct + '% on invested</div>' +
        '</div>' +
        '<div class="db1-stat">' +
          '<div class="db1-stat-label">Monthly SIP</div>' +
          '<div class="db1-stat-val">' + window.Utils.fmt(u.monthlySavings) + '</div>' +
          '<div class="db1-stat-change neutral">Across ' + p.holdings.length + ' fund' + (p.holdings.length !== 1 ? 's' : '') + '</div>' +
        '</div>' +
        '<div class="db1-stat accent-amber">' +
          '<div class="db1-stat-label">Goals</div>' +
          '<div class="db1-stat-val">' + goals.length + ' active</div>' +
          '<div class="db1-stat-change up" style="color:var(--blue-dark);">' + (goals.length > 0 ? '✓ On track' : 'Set goals') + '</div>' +
        '</div>' +
      '</div>' +

      // ── Charts Row ──
      '<div class="db1-two-col">' +
        '<div class="card">' +
          '<div class="card-header"><div class="card-title">Portfolio Growth</div><div class="card-subtitle">Since you started</div></div>' +
          '<div class="card-body"><div style="height:180px;position:relative;"><canvas id="growthChart"></canvas></div></div>' +
        '</div>' +
        '<div class="card">' +
          '<div class="card-header"><div class="card-title">Asset Allocation</div></div>' +
          '<div class="card-body">' +
            '<div style="height:130px;position:relative;"><canvas id="allocChart"></canvas></div>' +
            '<div style="margin-top:12px;">' +
              allocLabels.map(function(lbl, i) {
                return '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">' +
                  '<div style="width:10px;height:10px;border-radius:50%;background:' + allocColors[i] + ';flex-shrink:0;"></div>' +
                  '<div style="flex:1;font-size:13px;">' + lbl + '</div>' +
                  '<div style="font-size:13px;font-weight:700;">' + alloc[i] + '%</div>' +
                '</div>';
              }).join('') +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      // ── Goals ──
      (goals.length > 0 ?
        '<div class="card" style="margin-bottom:16px;">' +
          '<div class="card-header">' +
            '<div class="card-title">Goal Progress</div>' +
            '<button class="btn btn-ghost btn-sm" onclick="window.Router.go(\'invest\')">Invest More</button>' +
          '</div>' +
          '<div class="card-body" style="padding-top:8px;">' + goalsHTML + '</div>' +
        '</div>'
      : '') +

      // ── Holdings ──
      '<div class="card" style="margin-bottom:16px;">' +
        '<div class="card-header">' +
          '<div class="card-title">Your Holdings</div>' +
          '<button class="btn btn-ghost btn-sm" onclick="window.Router.go(\'portfolio\')">View All</button>' +
        '</div>' +
        '<div class="card-body" style="padding-top:8px;">' + holdingsHTML + '</div>' +
      '</div>' +

      // ── Quick Actions ──
      '<div class="card" style="margin-bottom:8px;">' +
        '<div class="card-header"><div class="card-title">Quick Actions</div></div>' +
        '<div class="card-body">' +
          '<div class="db1-actions">' +
            DashboardTab._actionBtn('🤖','Ask AI Advisor','Get personalised advice','advisor','var(--brand-light)','var(--brand)') +
            DashboardTab._actionBtn('📈','Start New SIP','Invest in a new fund','invest','var(--blue-bg)','var(--blue-dark)') +
            DashboardTab._actionBtn('🧮','SIP Calculator','Plan your financial goal','learn','var(--amber-bg)','var(--amber)') +
            DashboardTab._actionBtn('📋','Full Portfolio','See all transactions','portfolio','var(--purple-bg)','var(--purple)') +
          '</div>' +
        '</div>' +
      '</div>';

    // Draw charts
    setTimeout(function() {
      if (window.Charts) {
        window.Charts.defaults();
        window.Charts.growth('growthChart');
        window.Charts.donut('allocChart',
          { labels: allocLabels, values: alloc },
          allocColors
        );
      }
    }, 80);
  },

  _actionBtn: function(emoji, title, sub, tab, bg, color) {
    return '<div onclick="window.Router.go(\'' + tab + '\')" class="db1-action-btn" style="background:' + bg + ';">' +
      '<div class="db1-action-icon">' + emoji + '</div>' +
      '<div>' +
        '<div style="font-size:13px;font-weight:700;color:' + color + ';">' + title + '</div>' +
        '<div style="font-size:11px;color:var(--text-3);">' + sub + '</div>' +
      '</div>' +
      '<svg style="margin-left:auto;flex-shrink:0;" width="14" height="14" fill="none" stroke="' + color + '" stroke-width="2.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>' +
    '</div>';
  },

  _allocValues: function() {
    var h = window.State.portfolio.holdings || [];
    var equity = 0, debt = 0, gold = 0, total = 0;
    for (var i = 0; i < h.length; i++) {
      total += h[i].current;
      if (h[i].category === 'equity') equity += h[i].current;
      else if (h[i].category === 'debt')   debt   += h[i].current;
      else gold += h[i].current;
    }
    if (!total) return [60, 25, 15];
    return [Math.round(equity/total*100), Math.round(debt/total*100), Math.round(gold/total*100)];
  },
};
