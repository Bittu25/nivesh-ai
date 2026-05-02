// ===== Tools Tab =====
window.ToolsTab = {

  // User's alert settings
  alerts: [],
  alertsLoaded: false,

  render: function() {
    var el = document.getElementById('tab-tools');
    if (!el) return;

    el.innerHTML =
      '<div class="page-header"><h1>Tools</h1><p>Advanced features to manage and grow your wealth</p></div>' +

      // Tool cards grid at top
      '<div class="tools-nav">' +
        ToolsTab._toolNav('xirr',  '📊', 'XIRR Tracker',    'vs Nifty 50') +
        ToolsTab._toolNav('swp',   '💸', 'SWP Calculator',   'Withdrawal plan') +
        ToolsTab._toolNav('alerts','🔔', 'Smart Alerts',     'Price & SIP') +
        ToolsTab._toolNav('tax',   '📄', 'Tax Report',       'Capital gains') +
      '</div>' +

      // Tool panels
      '<div id="tool-xirr"   class="tool-panel active">' + ToolsTab._panelXIRR()   + '</div>' +
      '<div id="tool-swp"    class="tool-panel">'         + ToolsTab._panelSWP()    + '</div>' +
      '<div id="tool-alerts" class="tool-panel">'         + ToolsTab._panelAlerts() + '</div>' +
      '<div id="tool-tax"    class="tool-panel">'         + ToolsTab._panelTax()    + '</div>';

    // Init calculators
    setTimeout(function() {
      ToolsTab.calcXIRR();
      ToolsTab.calcSWP();
      ToolsTab.renderAlerts();
      ToolsTab.renderTax();
    }, 50);
  },

  _toolNav: function(id, emoji, title, sub) {
    return '<button class="tool-nav-btn' + (id==='xirr'?' active':'') + '" onclick="ToolsTab.switchTool(\'' + id + '\')">' +
      '<div class="tool-nav-emoji">' + emoji + '</div>' +
      '<div class="tool-nav-title">' + title + '</div>' +
      '<div class="tool-nav-sub">' + sub + '</div>' +
    '</button>';
  },

  switchTool: function(id) {
    document.querySelectorAll('.tool-nav-btn').forEach(function(b) { b.classList.remove('active'); });
    document.querySelectorAll('.tool-panel').forEach(function(p) { p.classList.remove('active'); });
    var btn = document.querySelector('[onclick*="' + id + '"]');
    var panel = document.getElementById('tool-' + id);
    if (btn)   btn.classList.add('active');
    if (panel) panel.classList.add('active');
  },

  // ===== XIRR TRACKER =====
  _panelXIRR: function() {
    var p = window.State.portfolio;
    var u = window.State.user;
    var xirr = p.xirr || 0;
    var niftyReturn = 14.2; // Nifty 50 3yr CAGR approximate
    var beating = xirr > niftyReturn;

    return '<div class="tool-section">' +
      '<h2 class="tool-title">📊 XIRR vs Nifty 50</h2>' +
      '<p class="tool-desc">See how your portfolio performs against India\'s benchmark index.</p>' +

      '<div class="xirr-compare">' +
        '<div class="xirr-card yours">' +
          '<div class="xirr-label">Your Portfolio XIRR</div>' +
          '<div class="xirr-value" id="xirr-your-val">' + xirr + '%</div>' +
          '<div class="xirr-sub">Annualised return</div>' +
        '</div>' +
        '<div class="xirr-vs">VS</div>' +
        '<div class="xirr-card nifty">' +
          '<div class="xirr-label">Nifty 50 CAGR</div>' +
          '<div class="xirr-value nifty-val">' + niftyReturn + '%</div>' +
          '<div class="xirr-sub">3-year benchmark</div>' +
        '</div>' +
      '</div>' +

      '<div class="xirr-verdict ' + (beating ? 'beating' : 'lagging') + '">' +
        (beating
          ? '🎉 Bahut achha! Your portfolio is beating Nifty 50 by <strong>' + (xirr - niftyReturn).toFixed(1) + '%</strong>. Keep the SIPs going!'
          : '📈 Your portfolio is currently ' + (niftyReturn - xirr).toFixed(1) + '% behind Nifty 50. Consider rebalancing towards better-performing funds.') +
      '</div>' +

      '<div style="margin-top:20px;">' +
        '<div class="tool-sub-title">Portfolio Breakdown</div>' +
        '<div id="xirr-holdings-table"></div>' +
      '</div>' +

      '<div class="tool-calc-row" style="margin-top:20px;">' +
        '<div class="field">' +
          '<label>Simulate Expected Return (%)</label>' +
          '<input type="range" id="xirr-rate" min="6" max="30" step="0.5" value="' + xirr + '" oninput="ToolsTab.calcXIRR()"/>' +
        '</div>' +
        '<div class="calc-result" style="margin-top:12px;">' +
          '<div class="calc-result-label">5-Year Projected Value</div>' +
          '<div class="calc-result-value" id="xirr-projected">—</div>' +
          '<div class="calc-result-sub" id="xirr-projected-sub"></div>' +
        '</div>' +
      '</div>' +
    '</div>';
  },

  calcXIRR: function() {
    var p = window.State.portfolio;
    var rate = parseFloat(document.getElementById('xirr-rate')?.value) || p.xirr || 12;
    var current = p.totalValue || 0;
    var sip = window.State.user.monthlySavings || 0;

    // Project 5 years: existing corpus + new SIPs
    var r = rate / 100 / 12;
    var n = 60;
    var corpusGrowth = current * Math.pow(1 + rate/100, 5);
    var sipFV = sip * ((Math.pow(1+r, n) - 1) / r) * (1+r);
    var total = corpusGrowth + sipFV;

    var el = document.getElementById('xirr-projected');
    var el2 = document.getElementById('xirr-projected-sub');
    if (el)  el.textContent = window.Utils.fmtK(Math.round(total));
    if (el2) el2.textContent = 'At ' + rate + '% XIRR · incl. ₹' + (sip*12).toLocaleString('en-IN') + '/yr SIP';

    // Render holdings table
    var tbl = document.getElementById('xirr-holdings-table');
    if (tbl && p.holdings && p.holdings.length > 0) {
      var html = '<table class="data-table"><thead><tr><th>Fund</th><th class="right">Invested</th><th class="right">Current</th><th class="right">Return</th><th class="right">vs Nifty</th></tr></thead><tbody>';
      var nifty = 14.2;
      p.holdings.forEach(function(h) {
        var vs = (h.returns - nifty).toFixed(1);
        var vsColor = h.returns >= nifty ? 'var(--green-dark)' : 'var(--red-dark)';
        html += '<tr><td><div style="font-weight:600;">' + h.name.split(' ').slice(0,3).join(' ') + '</div><div style="font-size:11px;color:var(--text-3);">' + h.type + '</div></td>' +
          '<td class="right">' + window.Utils.fmtK(h.invested) + '</td>' +
          '<td class="right" style="font-weight:600;">' + window.Utils.fmtK(h.current) + '</td>' +
          '<td class="right" style="color:' + (h.returns >= 0 ? 'var(--green-dark)':'var(--red-dark)') + ';font-weight:600;">+' + h.returns + '%</td>' +
          '<td class="right" style="color:' + vsColor + ';font-weight:600;">' + (h.returns >= nifty ? '+' : '') + vs + '%</td></tr>';
      });
      html += '</tbody></table>';
      tbl.innerHTML = html;
    }
  },

  // ===== SWP CALCULATOR =====
  _panelSWP: function() {
    return '<div class="tool-section">' +
      '<h2 class="tool-title">💸 SWP — Systematic Withdrawal Plan</h2>' +
      '<p class="tool-desc">SWP lets you withdraw a fixed amount every month from your corpus — like a salary from your investments. Perfect for retirement or passive income.</p>' +

      '<div class="tool-grid">' +
        '<div class="field"><label>Your Corpus (Current Value)</label>' +
          '<div class="input-prefix-wrap"><span class="input-prefix">₹</span>' +
            '<input type="number" id="swp-corpus" value="' + (window.State.portfolio.totalValue || 100000) + '" oninput="ToolsTab.calcSWP()"/>' +
          '</div>' +
        '</div>' +
        '<div class="field"><label>Monthly Withdrawal Amount</label>' +
          '<div class="input-prefix-wrap"><span class="input-prefix">₹</span>' +
            '<input type="number" id="swp-monthly" value="5000" oninput="ToolsTab.calcSWP()"/>' +
          '</div>' +
        '</div>' +
        '<div class="field"><label>Expected Annual Return: <strong id="swp-rate-lbl">12</strong>%</label>' +
          '<input type="range" id="swp-rate" min="4" max="20" step="0.5" value="12" oninput="document.getElementById(\'swp-rate-lbl\').textContent=this.value;ToolsTab.calcSWP()"/>' +
        '</div>' +
        '<div class="field"><label>Withdrawal Period: <strong id="swp-years-lbl">10</strong> years</label>' +
          '<input type="range" id="swp-years" min="1" max="40" step="1" value="10" oninput="document.getElementById(\'swp-years-lbl\').textContent=this.value;ToolsTab.calcSWP()"/>' +
        '</div>' +
      '</div>' +

      '<div class="swp-results" id="swp-results"></div>' +

      '<div style="margin-top:20px;background:var(--blue-bg);border:1px solid var(--blue-border);border-radius:var(--r);padding:14px 16px;font-size:13px;color:var(--text-2);line-height:1.7;">' +
        '💡 <strong>How SWP works:</strong> You invest a lump sum in a debt/hybrid fund. Every month, units worth your withdrawal amount are redeemed automatically. The remaining corpus continues to grow. Unlike FD interest, SWP from equity funds after 1 year has <strong>lower tax</strong> (10% LTCG vs 30% slab rate).' +
      '</div>' +
    '</div>';
  },

  calcSWP: function() {
    var corpus  = parseFloat(document.getElementById('swp-corpus')?.value)  || 100000;
    var monthly = parseFloat(document.getElementById('swp-monthly')?.value) || 5000;
    var rate    = parseFloat(document.getElementById('swp-rate')?.value)    || 12;
    var years   = parseFloat(document.getElementById('swp-years')?.value)   || 10;

    var r = rate / 100 / 12;
    var n = years * 12;
    var remaining = corpus;
    var totalWithdrawn = 0;
    var monthsLasted = 0;

    for (var m = 0; m < n; m++) {
      remaining = remaining * (1 + r);
      if (remaining <= 0) break;
      remaining -= monthly;
      totalWithdrawn += monthly;
      monthsLasted++;
      if (remaining <= 0) { remaining = 0; break; }
    }

    var sustainsFullPeriod = monthsLasted >= n;
    var corpusExhausted = !sustainsFullPeriod;

    // Safe withdrawal rate
    var safeMonthly = Math.round(corpus * r / (1 - Math.pow(1+r, -n)));

    var el = document.getElementById('swp-results');
    if (!el) return;
    el.innerHTML =
      '<div class="swp-result-grid">' +
        '<div class="swp-res-card ' + (sustainsFullPeriod ? 'good' : 'warn') + '">' +
          '<div class="swp-res-label">Corpus after ' + years + ' years</div>' +
          '<div class="swp-res-val">' + window.Utils.fmtK(Math.max(0, Math.round(remaining))) + '</div>' +
          '<div class="swp-res-sub">' + (sustainsFullPeriod ? '✓ Corpus survives' : '⚠ Corpus runs out in ~' + monthsLasted + ' months') + '</div>' +
        '</div>' +
        '<div class="swp-res-card">' +
          '<div class="swp-res-label">Total Withdrawn</div>' +
          '<div class="swp-res-val">' + window.Utils.fmtK(Math.round(totalWithdrawn)) + '</div>' +
          '<div class="swp-res-sub">' + monthsLasted + ' months × ' + window.Utils.fmt(monthly) + '</div>' +
        '</div>' +
        '<div class="swp-res-card good">' +
          '<div class="swp-res-label">Safe Monthly Withdrawal</div>' +
          '<div class="swp-res-val">' + window.Utils.fmt(safeMonthly) + '</div>' +
          '<div class="swp-res-sub">Corpus lasts full ' + years + ' years</div>' +
        '</div>' +
      '</div>' +
      (corpusExhausted ? '<div class="xirr-verdict lagging" style="margin-top:14px;">⚠️ At ₹' + monthly.toLocaleString('en-IN') + '/mo withdrawal, your corpus runs out in <strong>' + Math.round(monthsLasted/12*10)/10 + ' years</strong>. Reduce withdrawal to <strong>' + window.Utils.fmt(safeMonthly) + '/mo</strong> for the full period.</div>' :
        '<div class="xirr-verdict beating" style="margin-top:14px;">✓ Bilkul sahi! Your ₹' + monthly.toLocaleString('en-IN') + '/mo SWP is sustainable. The corpus grows faster than you withdraw.</div>');
  },

  // ===== SMART ALERTS =====
  _panelAlerts: function() {
    return '<div class="tool-section">' +
      '<h2 class="tool-title">🔔 Smart Alerts</h2>' +
      '<p class="tool-desc">Set alerts for your funds and portfolio. We\'ll notify you when conditions are met.</p>' +

      '<div class="alert-builder card" style="padding:20px;margin-bottom:20px;">' +
        '<div class="tool-sub-title" style="margin-bottom:16px;">Create New Alert</div>' +
        '<div class="tool-grid">' +
          '<div class="field"><label>Alert Type</label>' +
            '<select id="alert-type" onchange="ToolsTab.updateAlertBuilder()">' +
              '<option value="drop">Fund drops by % (Buy signal)</option>' +
              '<option value="rise">Fund rises by % (Book profit)</option>' +
              '<option value="sip_due">SIP due reminder</option>' +
              '<option value="goal">Goal milestone reached</option>' +
              '<option value="xirr">Portfolio XIRR drops below</option>' +
            '</select>' +
          '</div>' +
          '<div class="field" id="alert-fund-wrap"><label>Fund</label>' +
            '<select id="alert-fund">' +
              (function() {
                var opts = '<option value="any">Any fund in my portfolio</option>';
                var holdings = window.State.portfolio.holdings || [];
                holdings.forEach(function(h) { opts += '<option value="' + h.id + '">' + h.name.split(' ').slice(0,4).join(' ') + '</option>'; });
                return opts;
              })() +
            '</select>' +
          '</div>' +
          '<div class="field" id="alert-val-wrap"><label id="alert-val-label">Drop percentage (%)</label>' +
            '<div class="input-prefix-wrap"><span class="input-prefix" id="alert-prefix">%</span>' +
              '<input type="number" id="alert-value" value="5" min="1" max="50"/>' +
            '</div>' +
          '</div>' +
          '<div class="field"><label>Notify via</label>' +
            '<select id="alert-channel">' +
              '<option>In-app notification</option>' +
              '<option>Browser notification</option>' +
            '</select>' +
          '</div>' +
        '</div>' +
        '<button class="btn btn-primary" onclick="ToolsTab.addAlert()">+ Add Alert</button>' +
      '</div>' +

      '<div class="tool-sub-title" style="margin-bottom:12px;">Active Alerts</div>' +
      '<div id="alerts-list"></div>' +
    '</div>';
  },

  updateAlertBuilder: function() {
    var type = document.getElementById('alert-type')?.value;
    var label = document.getElementById('alert-val-label');
    var prefix = document.getElementById('alert-prefix');
    var fundWrap = document.getElementById('alert-fund-wrap');
    var valWrap  = document.getElementById('alert-val-wrap');
    var configs = {
      drop:     { label: 'Drop by (%)',         prefix: '%',  showFund: true,  showVal: true },
      rise:     { label: 'Rise by (%)',          prefix: '%',  showFund: true,  showVal: true },
      sip_due:  { label: 'Days before (days)',   prefix: 'd',  showFund: false, showVal: true },
      goal:     { label: 'Milestone (%)',        prefix: '%',  showFund: false, showVal: true },
      xirr:     { label: 'XIRR drops below (%)',prefix: '%',  showFund: false, showVal: true },
    };
    var cfg = configs[type] || configs.drop;
    if (label)    label.textContent = cfg.label;
    if (prefix)   prefix.textContent = cfg.prefix;
    if (fundWrap) fundWrap.style.display = cfg.showFund ? '' : 'none';
  },

  addAlert: function() {
    var type    = document.getElementById('alert-type')?.value    || 'drop';
    var fund    = document.getElementById('alert-fund')?.value    || 'any';
    var value   = parseFloat(document.getElementById('alert-value')?.value) || 5;
    var channel = document.getElementById('alert-channel')?.value || 'In-app notification';

    var labels = { drop:'Drop by', rise:'Rise by', sip_due:'SIP reminder', goal:'Goal milestone', xirr:'XIRR below' };
    var emojis = { drop:'📉', rise:'📈', sip_due:'📅', goal:'🎯', xirr:'⚠️' };

    var fundName = 'Any fund';
    if (fund !== 'any') {
      var h = window.State.portfolio.holdings || [];
      for (var i = 0; i < h.length; i++) if (h[i].id === fund) { fundName = h[i].name.split(' ').slice(0,3).join(' '); break; }
    }

    var alert = {
      id: Date.now(),
      type: type,
      fund: fund,
      fundName: fundName,
      value: value,
      channel: channel,
      emoji: emojis[type] || '🔔',
      label: labels[type] || type,
      active: true,
      triggered: false,
      createdAt: new Date().toLocaleDateString('en-IN'),
    };

    ToolsTab.alerts.push(alert);
    ToolsTab._saveAlerts();
    ToolsTab.renderAlerts();
    window.Utils.toast('Alert created! 🔔', 'success', 2000);
  },

  renderAlerts: function() {
    // Load from localStorage
    if (!ToolsTab.alertsLoaded) {
      try { ToolsTab.alerts = JSON.parse(localStorage.getItem('nivesh_alerts') || '[]'); } catch(e) {}
      ToolsTab.alertsLoaded = true;
    }

    var el = document.getElementById('alerts-list');
    if (!el) return;
    if (ToolsTab.alerts.length === 0) {
      el.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🔔</div><h3>No alerts set</h3><p>Create your first alert above to get notified when market conditions change.</p></div>';
      return;
    }

    el.innerHTML = ToolsTab.alerts.map(function(a, idx) {
      return '<div class="alert-item card" style="padding:14px 18px;margin-bottom:10px;display:flex;align-items:center;gap:14px;">' +
        '<div style="font-size:24px;flex-shrink:0;">' + a.emoji + '</div>' +
        '<div style="flex:1;">' +
          '<div style="font-size:13px;font-weight:600;">' + a.label + ' ' + a.value + (a.type==='sip_due'?' days':a.type==='xirr'?'%':'%') + '</div>' +
          '<div style="font-size:12px;color:var(--text-3);">' + a.fundName + ' · ' + a.channel + ' · Set ' + a.createdAt + '</div>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:8px;">' +
          '<span class="badge ' + (a.active ? 'badge-green' : 'badge-neutral') + '">' + (a.triggered ? '⚡ Triggered' : a.active ? 'Active' : 'Paused') + '</span>' +
          '<button class="btn btn-ghost btn-sm" onclick="ToolsTab.removeAlert(' + idx + ')" style="color:var(--red-dark);">✕</button>' +
        '</div>' +
      '</div>';
    }).join('');

    // Simulate checking alerts against portfolio
    ToolsTab._checkAlerts();
  },

  _checkAlerts: function() {
    var p = window.State.portfolio;
    ToolsTab.alerts.forEach(function(a) {
      if (a.triggered) return;
      if (a.type === 'xirr' && p.xirr < a.value) {
        a.triggered = true;
        window.Utils.toast('⚠️ Alert: Portfolio XIRR dropped below ' + a.value + '%!', 'error', 5000);
      }
      if (a.type === 'goal') {
        var goals = window.State.goals || [];
        goals.forEach(function(g) {
          var pct = Math.round(g.saved / g.target * 100);
          if (pct >= a.value && !a.triggered) {
            a.triggered = true;
            window.Utils.toast('🎯 Goal milestone! ' + g.name + ' is ' + pct + '% complete!', 'success', 5000);
          }
        });
      }
    });
    ToolsTab._saveAlerts();
  },

  removeAlert: function(idx) {
    ToolsTab.alerts.splice(idx, 1);
    ToolsTab._saveAlerts();
    ToolsTab.renderAlerts();
    window.Utils.toast('Alert removed', '', 1500);
  },

  _saveAlerts: function() {
    try { localStorage.setItem('nivesh_alerts', JSON.stringify(ToolsTab.alerts)); } catch(e) {}
  },

  // ===== TAX REPORT =====
  _panelTax: function() {
    return '<div class="tool-section">' +
      '<h2 class="tool-title">📄 Tax Report — Capital Gains</h2>' +
      '<p class="tool-desc">Summary of your capital gains for ITR filing. Mutual fund gains in India are taxed as STCG (< 1yr) or LTCG (> 1yr).</p>' +

      '<div id="tax-report-content"></div>' +

      '<div style="margin-top:20px;background:var(--amber-bg);border:1px solid rgba(245,158,11,0.25);border-radius:var(--r);padding:14px 16px;">' +
        '<div style="font-size:13px;font-weight:700;margin-bottom:8px;">📋 Tax Rules for Mutual Funds (FY 2025-26)</div>' +
        '<div style="font-size:13px;color:var(--text-2);line-height:1.8;">' +
          '<strong>Equity funds (held > 1 year):</strong> LTCG at 10% on gains above ₹1 lakh<br>' +
          '<strong>Equity funds (held < 1 year):</strong> STCG at 15%<br>' +
          '<strong>Debt funds (all holding periods):</strong> Taxed as per income slab (after Apr 2023)<br>' +
          '<strong>ELSS funds:</strong> 3-year lock-in, LTCG at 10% after lock-in<br>' +
          '<strong>Gold ETF:</strong> LTCG at 20% with indexation (held > 3 years)' +
        '</div>' +
      '</div>' +

      '<button class="btn btn-primary" style="margin-top:16px;" onclick="ToolsTab.downloadTaxReport()">⬇ Download Tax Summary</button>' +
    '</div>';
  },

  renderTax: function() {
    var el = document.getElementById('tax-report-content');
    if (!el) return;

    var p = window.State.portfolio;
    var holdings = p.holdings || [];
    var fy = 'FY 2025-26';
    var totalGain = 0;
    var stcgTotal = 0;
    var ltcgTotal = 0;
    var taxableGain = 0;

    if (holdings.length === 0) {
      el.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📄</div><h3>No holdings yet</h3><p>Start investing to see your tax summary here.</p></div>';
      return;
    }

    var rows = '';
    holdings.forEach(function(h) {
      var gain = h.current - h.invested;
      totalGain += gain;
      // Since user just started, all gains are STCG (< 1 year)
      var isLTCG = false; // new user
      var taxType = isLTCG ? 'LTCG' : 'STCG';
      var taxRate = h.category === 'equity' ? (isLTCG ? '10%' : '15%') : 'Slab rate';
      var taxAmt  = h.category === 'equity' ? Math.round(gain * (isLTCG ? 0.10 : 0.15)) : Math.round(gain * 0.30);
      if (taxAmt < 0) taxAmt = 0;
      if (isLTCG) ltcgTotal += taxAmt; else stcgTotal += taxAmt;
      taxableGain += taxAmt;

      rows += '<tr>' +
        '<td><div style="font-weight:600;">' + h.name.split(' ').slice(0,3).join(' ') + '</div>' +
              '<div style="font-size:11px;color:var(--text-3);">' + h.type + '</div></td>' +
        '<td class="right">' + window.Utils.fmtK(h.invested) + '</td>' +
        '<td class="right">' + window.Utils.fmtK(h.current) + '</td>' +
        '<td class="right" style="color:' + (gain>=0?'var(--green-dark)':'var(--red-dark)') + ';font-weight:600;">' + (gain>=0?'+':'') + window.Utils.fmtK(Math.abs(gain)) + '</td>' +
        '<td class="right"><span class="badge ' + (isLTCG?'badge-green':'badge-amber') + '">' + taxType + '</span></td>' +
        '<td class="right">' + taxRate + '</td>' +
        '<td class="right" style="font-weight:600;">' + window.Utils.fmt(taxAmt) + '</td>' +
      '</tr>';
    });

    el.innerHTML =
      '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:20px;">' +
        '<div class="stat-card accent-green"><div class="stat-label">Total Gain</div><div class="stat-value" style="font-size:20px;">' + window.Utils.fmtK(totalGain) + '</div><div class="stat-change up">FY ' + fy + '</div></div>' +
        '<div class="stat-card accent-amber"><div class="stat-label">STCG Tax (est.)</div><div class="stat-value" style="font-size:20px;">' + window.Utils.fmt(stcgTotal) + '</div><div class="stat-change neutral">@ 15% equity</div></div>' +
        '<div class="stat-card"><div class="stat-label">LTCG Tax (est.)</div><div class="stat-value" style="font-size:20px;">' + window.Utils.fmt(ltcgTotal) + '</div><div class="stat-change neutral">@ 10% above ₹1L</div></div>' +
      '</div>' +
      '<div style="overflow-x:auto;">' +
        '<table class="data-table">' +
          '<thead><tr><th>Fund</th><th class="right">Invested</th><th class="right">Current</th><th class="right">Gain/Loss</th><th class="right">Type</th><th class="right">Tax Rate</th><th class="right">Est. Tax</th></tr></thead>' +
          '<tbody>' + rows + '</tbody>' +
        '</table>' +
      '</div>';
  },

  downloadTaxReport: function() {
    var p = window.State.portfolio;
    var u = window.State.user;
    var rows = [
      ['NIVESH AI — CAPITAL GAINS REPORT'],
      ['FY 2025-26'],
      ['Investor', u.name],
      ['Generated', new Date().toLocaleDateString('en-IN')],
      [],
      ['Fund', 'Category', 'Invested (₹)', 'Current Value (₹)', 'Gain/Loss (₹)', 'Holding Period', 'Type', 'Tax Rate', 'Est. Tax (₹)'],
    ];
    (p.holdings || []).forEach(function(h) {
      var gain = h.current - h.invested;
      var taxAmt = Math.max(0, Math.round(gain * (h.category === 'equity' ? 0.15 : 0.30)));
      rows.push([
        h.name, h.type,
        h.invested, h.current,
        gain, '< 1 year', 'STCG',
        h.category === 'equity' ? '15%' : 'Slab rate',
        taxAmt
      ]);
    });
    rows.push([]);
    rows.push(['NOTE: Estimates only. Consult a CA for ITR filing.']);
    rows.push(['SEBI Disclaimer: Not investment advice.']);

    var csv = rows.map(function(r) {
      return r.map(function(c) { return '"' + String(c||'').replace(/"/g,'""') + '"'; }).join(',');
    }).join('\n');

    var blob = new Blob([csv], { type: 'text/csv' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'NiveshAI_TaxReport_FY2025-26.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    window.Utils.toast('Tax report downloaded as CSV ✓', 'success', 2000);
  },
};
