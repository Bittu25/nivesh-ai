window.Onboarding = {
  step: 1,
  total: 5,  // added goal-amount step
  _goalAmounts: {},  // stores user-entered amounts per goal

  init: function() {
    var el = document.getElementById('onboarding-inner');
    if (!el) return;
    Onboarding._goalAmounts = {};
    el.innerHTML = Onboarding._wrapper();
    var nameInp = document.getElementById('inp-name');
    if (nameInp) nameInp.addEventListener('input', function() { nameInp.style.borderColor = ''; });
  },

  _wrapper: function() {
    return '<div class="ob-topbar">' +
      '<svg viewBox="0 0 40 40" fill="none" width="30" height="30"><rect width="40" height="40" rx="20" fill="#0f172a"/><text x="20" y="27" text-anchor="middle" font-size="21" font-weight="700" fill="#1a9e75" font-family="system-ui,sans-serif">₹</text><path d="M30 9L34 5L38 9" stroke="#f59e0b" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><line x1="34" y1="5" x2="34" y2="14" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/></svg>' +
      '<span class="topbar-brand">Nivesh AI</span>' +
      '<span id="ob-step-label" style="margin-left:auto;font-size:12px;color:var(--text-3);">Step 1 of 5</span>' +
      '<button class="icon-btn" onclick="ThemeManager.toggle()" title="Toggle theme" style="margin-left:12px;width:36px;height:36px;">' +
        '<svg id="ob-theme-moon" viewBox="0 0 20 20" fill="currentColor" width="17"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>' +
        '<svg id="ob-theme-sun" viewBox="0 0 20 20" fill="currentColor" width="17" style="display:none;"><path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/></svg>' +
      '</button>' +
    '</div>' +
    '<div class="ob-body"><div class="ob-container">' +
      '<div class="ob-progress"><div class="ob-progress-fill" id="ob-progress-fill" style="width:20%"></div></div>' +
      '<div id="ob-step-1" class="ob-step active">' + Onboarding._step1() + '</div>' +
      '<div id="ob-step-2" class="ob-step">' + Onboarding._step2() + '</div>' +
      '<div id="ob-step-3" class="ob-step">' + Onboarding._step3() + '</div>' +
      '<div id="ob-step-4" class="ob-step">' + Onboarding._step4() + '</div>' +
      '<div id="ob-step-5" class="ob-step">' + Onboarding._step5() + '</div>' +
    '</div></div>';
  },

  _step1: function() {
    return '<div class="ob-eyebrow">✦ Welcome to Nivesh AI</div>' +
      '<h1 class="ob-title">Aapka paisa,<br><em>aapke sapne</em></h1>' +
      '<p class="ob-sub">Smart AI-powered investing for every Indian. Build your personalised plan in 2 minutes.</p>' +
      '<div class="field"><label>Your Name</label>' +
        '<input id="inp-name" type="text" placeholder="e.g. Priya Sharma" autocomplete="name" style="font-size:16px;"/>' +
      '</div>' +
      '<div class="field"><label>Monthly Income</label>' +
        '<div class="income-grid">' +
          '<div class="income-option" data-val="u25" onclick="Onboarding.selIncome(this)"><div class="io-amount">Under ₹25K</div><div class="io-sub">₹0–₹25,000</div></div>' +
          '<div class="income-option sel" data-val="25-50" onclick="Onboarding.selIncome(this)"><div class="io-amount">₹25K–₹50K</div><div class="io-sub">Mid income</div></div>' +
          '<div class="income-option" data-val="50-1L" onclick="Onboarding.selIncome(this)"><div class="io-amount">₹50K–₹1L</div><div class="io-sub">Upper income</div></div>' +
          '<div class="income-option" data-val="1L+" onclick="Onboarding.selIncome(this)"><div class="io-amount">Above ₹1L</div><div class="io-sub">High income</div></div>' +
        '</div>' +
      '</div>' +
      '<div class="field"><label>Monthly Amount to Invest</label>' +
        '<div class="input-prefix-wrap"><span class="input-prefix">₹</span>' +
          '<input id="inp-savings" type="number" placeholder="5000" value="5000" min="100" style="font-size:18px;font-weight:600;color:var(--brand);"/>' +
        '</div>' +
        '<div class="field-hint">Your monthly SIP budget — you can change this anytime.</div>' +
      '</div>' +
      '<button class="btn btn-primary btn-full btn-lg" onclick="Onboarding.next1()">Continue →</button>';
  },

  _step2: function() {
    var goals = [
      {id:'home',      emoji:'🏠', label:'Home',       sub:'Down payment'},
      {id:'retirement',emoji:'🌴', label:'Retirement',  sub:'Financial freedom'},
      {id:'education', emoji:'🎓', label:'Education',   sub:"Child's future"},
      {id:'wedding',   emoji:'💒', label:'Wedding',     sub:'Big day savings'},
      {id:'vehicle',   emoji:'🚗', label:'Vehicle',     sub:'Dream ride'},
      {id:'travel',    emoji:'✈️',  label:'Travel',      sub:'Vacation fund'},
      {id:'emergency', emoji:'🛡️', label:'Emergency',   sub:'Safety net 6mo'},
      {id:'business',  emoji:'💼', label:'Business',    sub:'Startup capital'},
      {id:'other',     emoji:'⭐', label:'Other',       sub:'My own goal'},
    ];
    var cards = goals.map(function(g) {
      return '<div class="goal-card" data-goal="' + g.id + '" onclick="this.classList.toggle(\'sel\')">' +
        '<div class="goal-emoji">' + g.emoji + '</div>' +
        '<div class="goal-label">' + g.label + '</div>' +
        '<div class="goal-sub">' + g.sub + '</div>' +
      '</div>';
    }).join('');
    return '<h1 class="ob-title">Kya hai aapka sapna?</h1>' +
      '<p class="ob-sub">Select all that apply. We\'ll ask how much you need for each one.</p>' +
      '<div class="goal-grid">' + cards + '</div>' +
      '<button class="btn btn-primary btn-full btn-lg" onclick="Onboarding.next2()">Continue →</button>' +
      '<button class="btn btn-ghost btn-full" style="margin-top:10px;" onclick="Onboarding.goTo(1)">← Back</button>';
  },

  // Step 3 — Goal amounts (new step!)
  _step3: function() {
    return '<div id="goal-amounts-container"><div style="padding:20px;text-align:center;color:var(--text-3);">Loading your goals...</div></div>';
  },

  _buildStep3: function() {
    var goals = window.State.user.goals || [];
    var defaults = {
      home: 2000000, retirement: 10000000, education: 1500000,
      wedding: 800000, vehicle: 500000, travel: 200000,
      emergency: 300000, business: 2000000, other: 500000,
    };
    var descriptions = {
      home: 'Typical down payment is 20% of property value',
      retirement: 'Aim for 25× your annual expenses',
      education: 'Covers 4-year college education + living costs',
      wedding: 'Covers venue, catering, jewellery & celebrations',
      vehicle: 'New mid-range car or premium bike',
      travel: 'International trip for 2 (2–3 weeks)',
      emergency: '6 months of your monthly expenses',
      business: 'Initial capital for a small business',
      other: 'Set your own target amount',
    };
    var sip = window.State.user.monthlySavings || 5000;
    var html = '<h1 class="ob-title">Kitna chahiye?</h1>' +
      '<p class="ob-sub">AI ne suggest kiya hai — aap change kar sakte hain.</p>';

    for (var i = 0; i < goals.length; i++) {
      var gid = goals[i];
      var emoji = {home:'🏠',retirement:'🌴',education:'🎓',wedding:'💒',vehicle:'🚗',travel:'✈️',emergency:'🛡️',business:'💼',other:'⭐'}[gid] || '⭐';
      var name  = {home:'Home Down Payment',retirement:'Retirement Corpus',education:'Education Fund',wedding:'Wedding Fund',vehicle:'Vehicle Fund',travel:'Travel Fund',emergency:'Emergency Fund',business:'Business Capital',other:'My Goal'}[gid] || 'Goal';
      var defAmt = defaults[gid] || 500000;
      var savedAmt = Onboarding._goalAmounts[gid] || defAmt;
      // Calculate years needed at current SIP (rough: FV = SIP*n at 12% pa)
      var r = 0.01, n = 0;
      var fv = 0;
      while (fv < defAmt && n < 600) { fv = fv * (1 + r) + sip; n++; }
      var yrs = (n / 12).toFixed(1);

      html +=
        '<div class="goal-amt-card" style="margin-bottom:16px;">' +
          '<div class="goal-amt-header">' +
            '<div class="goal-amt-icon">' + emoji + '</div>' +
            '<div>' +
              '<div class="goal-amt-name">' + name + '</div>' +
              '<div class="goal-amt-hint">' + (descriptions[gid]||'') + '</div>' +
            '</div>' +
          '</div>' +
          '<div class="goal-amt-ai-suggest">' +
            '✦ AI Suggest: <strong>' + Onboarding._fmtCrLakh(defAmt) + '</strong> — at ₹' + sip.toLocaleString('en-IN') + '/mo SIP you can reach this in ~<strong>' + yrs + ' yrs</strong>' +
          '</div>' +
          '<div class="field" style="margin-bottom:0;">' +
            '<label>Your target amount</label>' +
            '<div class="input-prefix-wrap"><span class="input-prefix">₹</span>' +
              '<input type="number" id="goal-amt-' + gid + '" value="' + savedAmt + '" min="10000" step="10000" oninput="Onboarding._updateGoalAmt(\'' + gid + '\',this.value)" style="font-weight:600;font-size:16px;color:var(--brand);"/>' +
            '</div>' +
            '<div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;">' +
              [defAmt * 0.5, defAmt, defAmt * 1.5, defAmt * 2].map(function(v) {
                return '<button class="sip-preset" onclick="Onboarding._setGoalPreset(\'' + gid + '\',' + Math.round(v) + ')">' + Onboarding._fmtCrLakh(Math.round(v)) + '</button>';
              }).join('') +
            '</div>' +
          '</div>' +
        '</div>';
    }

    html += '<button class="btn btn-primary btn-full btn-lg" onclick="Onboarding.next3()">Continue →</button>' +
            '<button class="btn btn-ghost btn-full" style="margin-top:10px;" onclick="Onboarding.goTo(2)">← Back</button>';
    return html;
  },

  _fmtCrLakh: function(n) {
    if (n >= 10000000) return '₹' + (n/10000000).toFixed(1) + 'Cr';
    if (n >= 100000)   return '₹' + (n/100000).toFixed(1) + 'L';
    return '₹' + Math.round(n).toLocaleString('en-IN');
  },

  _updateGoalAmt: function(gid, val) {
    Onboarding._goalAmounts[gid] = parseInt(val) || 0;
  },

  _setGoalPreset: function(gid, val) {
    var inp = document.getElementById('goal-amt-' + gid);
    if (inp) { inp.value = val; Onboarding._goalAmounts[gid] = val; }
  },

  _step4: function() {
    return '<h1 class="ob-title">Risk tolerance kya hai?</h1>' +
      '<p class="ob-sub">Be honest — this shapes your entire portfolio. You can change it later.</p>' +
      '<div class="risk-row">' +
        '<div class="risk-btn" data-risk="safe" onclick="Onboarding.selRisk(this)">' +
          '<div class="risk-icon">🛡️</div><div class="risk-name">Safe</div>' +
          '<div class="risk-sub">Low risk<br>FD-like returns<br>7–9% p.a.</div>' +
        '</div>' +
        '<div class="risk-btn sel" data-risk="balanced" onclick="Onboarding.selRisk(this)">' +
          '<div class="risk-icon">⚖️</div><div class="risk-name">Balanced</div>' +
          '<div class="risk-sub">Moderate risk<br>Steady growth<br>10–14% p.a.</div>' +
        '</div>' +
        '<div class="risk-btn" data-risk="growth" onclick="Onboarding.selRisk(this)">' +
          '<div class="risk-icon">🚀</div><div class="risk-name">Growth</div>' +
          '<div class="risk-sub">High risk<br>Max returns<br>14–22% p.a.</div>' +
        '</div>' +
      '</div>' +
      '<div class="ai-suggest" id="risk-suggest">✦ <strong>AI Recommendation:</strong> Based on your profile, <strong>Balanced</strong> suits you best — 60% equity + 40% debt builds wealth steadily while managing volatility.</div>' +
      '<button class="btn btn-primary btn-full btn-lg" onclick="Onboarding.next4()">Continue →</button>' +
      '<button class="btn btn-ghost btn-full" style="margin-top:10px;" onclick="Onboarding.goTo(3)">← Back</button>';
  },

  _step5: function() {
    return '<div class="ob-eyebrow" style="color:var(--green-dark);">🎉 Your plan is ready!</div>' +
      '<h1 class="ob-title">AI-curated plan<br>just for you</h1>' +
      '<p class="ob-sub">Based on your goals and risk profile, here\'s what we recommend.</p>' +
      '<div class="plan-card">' +
        '<div class="plan-header">' +
          '<div><div class="plan-total-label">Monthly SIP</div><div class="plan-total-val" id="ob-sip-display">₹5,000</div></div>' +
          '<div style="margin-left:auto;text-align:right;"><div style="font-size:12px;color:var(--text-3);margin-bottom:3px;">Expected XIRR</div><div style="font-size:20px;font-weight:700;color:var(--green-dark);">12–14%</div></div>' +
        '</div>' +
        '<div id="ob-fund-rows"><div style="padding:16px;text-align:center;color:var(--text-3);">Building your plan...</div></div>' +
      '</div>' +
      '<div style="background:var(--amber-bg);border:1px solid rgba(245,158,11,0.25);border-radius:var(--r);padding:12px 14px;margin-bottom:22px;font-size:12px;color:var(--text-2);line-height:1.6;">📋 AI-generated suggestions for educational purposes. Not SEBI-registered investment advice.</div>' +
      '<button class="btn btn-primary btn-full btn-lg" onclick="Onboarding.launch()">🚀 Launch My Dashboard</button>' +
      '<button class="btn btn-ghost btn-full" style="margin-top:10px;" onclick="Onboarding.goTo(4)">← Modify Plan</button>';
  },

  selIncome: function(el) {
    var all = document.querySelectorAll('.income-option');
    for (var i = 0; i < all.length; i++) all[i].classList.remove('sel');
    el.classList.add('sel');
  },

  selRisk: function(el) {
    var all = document.querySelectorAll('.risk-btn');
    for (var i = 0; i < all.length; i++) all[i].classList.remove('sel');
    el.classList.add('sel');
    var suggests = {
      safe:     '✦ <strong>AI Recommendation:</strong> With <strong>Safe</strong> profile — liquid funds + short debt. Ideal for goals under 3 years.',
      balanced: '✦ <strong>AI Recommendation:</strong> With <strong>Balanced</strong> profile — 60% equity + 40% debt. Great for 3–7 year goals.',
      growth:   '✦ <strong>AI Recommendation:</strong> With <strong>Growth</strong> profile — 80% equity. Best for 7+ year goals with high return potential.'
    };
    var box = document.getElementById('risk-suggest');
    if (box) box.innerHTML = suggests[el.dataset.risk] || suggests.balanced;
  },

  goTo: function(step) {
    var steps = document.querySelectorAll('.ob-step');
    for (var i = 0; i < steps.length; i++) steps[i].classList.remove('active');
    var target = document.getElementById('ob-step-' + step);
    if (target) target.classList.add('active');
    var pcts = [20, 40, 60, 80, 100];
    var fill = document.getElementById('ob-progress-fill');
    if (fill) fill.style.width = (pcts[step-1] || 20) + '%';
    var label = document.getElementById('ob-step-label');
    if (label) label.textContent = 'Step ' + step + ' of 5';
    var obEl = document.getElementById('onboarding');
    if (obEl) obEl.scrollTop = 0;
  },

  next1: function() {
    var nameEl = document.getElementById('inp-name');
    var name = nameEl ? nameEl.value.trim() : '';
    if (!name || name.length < 2) {
      if (nameEl) { nameEl.style.borderColor = 'var(--red)'; nameEl.focus(); }
      return;
    }
    var incomeEl = document.querySelector('.income-option.sel');
    var savingsEl = document.getElementById('inp-savings');
    window.State.user.name = name;
    window.State.user.income = incomeEl ? incomeEl.dataset.val : '25-50';
    window.State.user.monthlySavings = Math.max(100, parseInt(savingsEl ? savingsEl.value : '5000') || 5000);
    Onboarding.goTo(2);
  },

  next2: function() {
    var sel = document.querySelectorAll('.goal-card.sel');
    var goals = [];
    for (var i = 0; i < sel.length; i++) goals.push(sel[i].dataset.goal);
    if (goals.length === 0) {
      window.Utils.toast('Please select at least one goal', 'error', 2000);
      return;
    }
    window.State.user.goals = goals;
    // Build goal amounts step dynamically
    var container = document.getElementById('goal-amounts-container');
    if (container) container.innerHTML = Onboarding._buildStep3();
    Onboarding.goTo(3);
  },

  next3: function() {
    // Save entered goal amounts
    var goals = window.State.user.goals || [];
    for (var i = 0; i < goals.length; i++) {
      var inp = document.getElementById('goal-amt-' + goals[i]);
      if (inp) Onboarding._goalAmounts[goals[i]] = parseInt(inp.value) || 500000;
    }
    window.State.user.goalAmounts = Onboarding._goalAmounts;
    Onboarding.goTo(4);
  },

  next4: function() {
    var sel = document.querySelector('.risk-btn.sel');
    window.State.user.risk = sel ? sel.dataset.risk : 'balanced';
    Onboarding.goTo(5);
    Onboarding._populatePlan();
  },

  _populatePlan: function() {
    var sip = window.State.user.monthlySavings;
    var sipEl = document.getElementById('ob-sip-display');
    if (sipEl) sipEl.textContent = window.Utils.fmt(sip);
    var plans = {
      safe:     [{logo:'SB',bg:'#f0fdf4',color:'#059669',name:'SBI Short Term Debt',type:'Debt · Low Risk',share:0.50},
                 {logo:'HL',bg:'#eff6ff',color:'#1d6fca',name:'HDFC Liquid Fund',type:'Liquid · Very Low Risk',share:0.30},
                 {logo:'NI',bg:'#fff8ec',color:'#d97706',name:'Nippon Gold ETF',type:'Gold · Low Risk',share:0.20}],
      balanced: [{logo:'PP',bg:'#edfaf5',color:'#1a6b5a',name:'Parag Parikh Flexi Cap',type:'Equity · Moderate',share:0.50},
                 {logo:'HD',bg:'#eff6ff',color:'#1d6fca',name:'HDFC Mid Cap',type:'Equity · Moderate-High',share:0.25},
                 {logo:'NI',bg:'#fff8ec',color:'#d97706',name:'Nippon Gold ETF',type:'Gold · Moderate',share:0.25}],
      growth:   [{logo:'HD',bg:'#eff6ff',color:'#1d6fca',name:'HDFC Mid Cap',type:'Equity · High',share:0.40},
                 {logo:'AX',bg:'#fef2f2',color:'#dc2626',name:'Axis Small Cap',type:'Equity · Very High',share:0.35},
                 {logo:'PP',bg:'#edfaf5',color:'#1a6b5a',name:'Parag Parikh FC',type:'Equity · Moderate',share:0.25}],
    };
    var funds = plans[window.State.user.risk] || plans.balanced;
    var html = '';
    for (var i = 0; i < funds.length; i++) {
      var f = funds[i];
      var amt = Math.round(sip * f.share);
      html += '<div class="ob-fund-row">' +
        '<div class="ob-fund-logo" style="background:' + f.bg + ';color:' + f.color + ';">' + f.logo + '</div>' +
        '<div style="flex:1;"><div class="ob-fund-name">' + f.name + '</div><div class="ob-fund-type">' + f.type + '</div></div>' +
        '<div class="ob-fund-amt">' + window.Utils.fmt(amt) + '/mo</div>' +
      '</div>';
    }
    var rowsEl = document.getElementById('ob-fund-rows');
    if (rowsEl) rowsEl.innerHTML = html;
  },

  launch: function() {
    if (!window.State.user.name || window.State.user.name.trim().length < 1) { Onboarding.goTo(1); return; }
    window.State.buildFromUser();
    window.State.save();
    if (window.Supabase && window.Supabase.configured()) {
      window.Supabase.saveUser(window.State.user).then(function(d) { if(d) console.log('Saved:', d.id); });
    }
    var initials = window.State.user.name.trim().split(' ')
      .filter(function(w){ return w.length > 0; }).map(function(w){ return w[0]; })
      .join('').toUpperCase().slice(0,2) || 'NA';
    window.State.user.initials = initials;
    var avatarEl = document.getElementById('user-avatar');
    if (avatarEl) avatarEl.textContent = initials;
    var obEl = document.getElementById('onboarding');
    var appEl = document.getElementById('main-app');
    if (obEl) { obEl.scrollTop = 0; obEl.classList.remove('active'); }
    if (appEl) { appEl.scrollTop = 0; appEl.classList.add('active'); }
    setTimeout(function() { if (appEl) appEl.scrollTop = 0; }, 50);
    window.Router.init();
    window.Notifications.init();
  },
};
