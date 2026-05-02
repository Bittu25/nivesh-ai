window.InvestTab = {
  activeFilter: 'all',
  currentFund: null,
  currentAmt: 1000,

  funds: [
    {id:'pp',  name:'Parag Parikh Flexi Cap Fund', category:'equity', type:'Flexi Cap',      logo:'PP', logoColor:'#1a6b5a', logoBg:'#edfaf5', ret3y:22.4, ret1y:18.2, minSip:1000, aiPick:true,  risk:'Moderate'},
    {id:'hd',  name:'HDFC Mid Cap Opportunities',  category:'equity', type:'Mid Cap',        logo:'HD', logoColor:'#1d6fca', logoBg:'#eff6ff', ret3y:28.1, ret1y:24.6, minSip:500,  aiPick:true,  risk:'Mod. High'},
    {id:'ma',  name:'Mirae Asset Large Cap Fund',  category:'equity', type:'Large Cap',      logo:'MA', logoColor:'#7c3aed', logoBg:'#f5f3ff', ret3y:17.8, ret1y:15.2, minSip:1000, aiPick:false, risk:'Moderate'},
    {id:'ax',  name:'Axis Small Cap Fund',         category:'equity', type:'Small Cap',      logo:'AX', logoColor:'#dc2626', logoBg:'#fef2f2', ret3y:31.2, ret1y:19.8, minSip:500,  aiPick:false, risk:'High'},
    {id:'sb',  name:'SBI Short Term Debt Fund',    category:'debt',   type:'Short Duration', logo:'SB', logoColor:'#16a34a', logoBg:'#f0fdf4', ret3y:7.8,  ret1y:7.2,  minSip:500,  aiPick:false, risk:'Low'},
    {id:'hl',  name:'HDFC Liquid Fund',            category:'debt',   type:'Liquid',         logo:'HL', logoColor:'#0ea5e9', logoBg:'#f0f9ff', ret3y:6.8,  ret1y:7.1,  minSip:100,  aiPick:false, risk:'Very Low'},
    {id:'ni',  name:'Nippon India Gold ETF',       category:'gold',   type:'Gold ETF',       logo:'NI', logoColor:'#d97706', logoBg:'#fff8ec', ret3y:18.2, ret1y:22.1, minSip:100,  aiPick:true,  risk:'Moderate'},
    {id:'me',  name:'Mirae Asset ELSS Tax Saver',  category:'tax',    type:'ELSS / 80C',     logo:'MI', logoColor:'#7c3aed', logoBg:'#f5f3ff', ret3y:19.6, ret1y:16.3, minSip:500,  aiPick:false, risk:'High'},
  ],

  render: function() {
    var el = document.getElementById('tab-invest');
    if (!el) return;
    var sip = window.State.user.monthlySavings || 5000;
    el.innerHTML =
      '<div class="page-header"><h1>Invest</h1><p>AI-curated funds tailored to your risk profile and goals</p></div>' +
      '<div class="invest-hero">' +
        '<div style="flex:1;">' +
          '<h2>Find the right fund for you</h2>' +
          '<p>Start with as little as ₹100/month. Our AI picks the best funds based on your goals.</p>' +
          '<div class="invest-hero-actions">' +
            '<button class="btn btn-primary" onclick="window.Router.go(\'advisor\')">Ask AI to pick for me</button>' +
            '<button class="btn btn-secondary" onclick="window.Router.go(\'learn\')">SIP Calculator</button>' +
          '</div>' +
        '</div>' +
        '<div class="invest-hero-stat">' +
          '<div class="ihs-label">Your Monthly SIP</div>' +
          '<div class="ihs-value">' + window.Utils.fmt(sip) + '</div>' +
          '<div class="ihs-sub">across your portfolio</div>' +
        '</div>' +
      '</div>' +
      '<div class="fund-filters">' +
        '<button class="chip active" onclick="window.InvestTab.filter(this,\'all\')">All Funds</button>' +
        '<button class="chip" onclick="window.InvestTab.filter(this,\'equity\')">Equity</button>' +
        '<button class="chip" onclick="window.InvestTab.filter(this,\'debt\')">Debt</button>' +
        '<button class="chip" onclick="window.InvestTab.filter(this,\'gold\')">Gold</button>' +
        '<button class="chip" onclick="window.InvestTab.filter(this,\'tax\')">Tax Saving</button>' +
        '<span style="margin-left:auto;font-size:12px;color:var(--text-3);font-style:italic;">✦ AI Picks highlighted</span>' +
      '</div>' +
      '<div id="fund-list">' + window.InvestTab.renderFunds(window.InvestTab.funds) + '</div>' +

      // SIP Modal
      '<div class="modal-overlay" id="sip-modal">' +
        '<div class="modal">' +
          '<div class="modal-title" id="sip-modal-title">Start SIP</div>' +
          '<p style="font-size:13px;color:var(--text-2);margin-bottom:20px;" id="sip-modal-sub"></p>' +
          '<div class="sip-amount-display">' +
            '<div class="sa-label">Monthly SIP Amount</div>' +
            '<div class="sa-val" id="sip-display-val">₹1,000</div>' +
          '</div>' +
          '<input type="range" id="sip-slider" min="100" max="100000" step="100" value="1000" style="width:100%;margin:12px 0 8px;" oninput="window.InvestTab.onSlider(this.value)"/>' +
          '<div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-3);margin-bottom:14px;"><span id="sip-slider-min">₹100</span><span>₹1L</span></div>' +
          '<div class="sip-presets" id="sip-presets"></div>' +
          '<div class="field">' +
            '<label>Or enter amount directly</label>' +
            '<div class="input-prefix-wrap"><span class="input-prefix">₹</span>' +
              '<input type="number" id="sip-manual" placeholder="e.g. 3000" min="100" oninput="window.InvestTab.onManual(this.value)" style="font-weight:600;"/>' +
            '</div>' +
          '</div>' +
          '<div class="field">' +
            '<label>SIP Date</label>' +
            '<select id="sip-date-sel">' +
              '<option>1st of every month</option>' +
              '<option selected>10th of every month</option>' +
              '<option>15th of every month</option>' +
              '<option>25th of every month</option>' +
            '</select>' +
          '</div>' +
          '<div id="sip-ai-note" style="background:var(--brand-light);border-radius:var(--r-sm);padding:10px 12px;font-size:12px;color:var(--brand);margin-bottom:18px;line-height:1.6;"></div>' +
          '<div style="display:flex;gap:10px;">' +
            '<button class="btn btn-secondary btn-full" onclick="window.InvestTab.closeSip()">Cancel</button>' +
            '<button class="btn btn-primary btn-full" onclick="window.InvestTab.confirmSip()">Start SIP →</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  },

  renderFunds: function(funds) {
    return funds.map(function(f) {
      var already = window.InvestTab._alreadyAdded(f.id);
      return '<div class="fund-item" onclick="window.InvestTab.openSip(\'' + f.id + '\')">' +
        '<div class="fund-logo" style="background:' + f.logoBg + ';color:' + f.logoColor + ';">' + f.logo + '</div>' +
        '<div class="fund-info">' +
          '<div class="fund-name">' + f.name +
            (f.aiPick ? ' <span class="badge badge-brand">✦ AI Pick</span>' : '') +
            (already ? ' <span class="badge badge-green">✓ Active SIP</span>' : '') +
          '</div>' +
          '<div class="fund-tags">' +
            '<span class="badge badge-blue">' + (f.category==='equity'?'Equity':f.category==='debt'?'Debt':f.category==='gold'?'Gold':'ELSS') + '</span>' +
            '<span class="badge badge-neutral">' + f.type + '</span>' +
            '<span class="badge badge-neutral">Risk: ' + f.risk + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="fund-returns">' +
          '<div class="fund-ret-value">+' + f.ret3y + '%</div>' +
          '<div class="fund-ret-label">3-yr CAGR</div>' +
          '<div class="fund-min-sip">Min ₹' + f.minSip.toLocaleString('en-IN') + '/mo</div>' +
        '</div>' +
      '</div>';
    }).join('');
  },

  _alreadyAdded: function(id) {
    var h = window.State.portfolio.holdings || [];
    for (var i = 0; i < h.length; i++) if (h[i].id === id && h[i].sipAmount > 0) return true;
    return false;
  },

  filter: function(btn, cat) {
    var chips = document.querySelectorAll('.fund-filters .chip');
    for (var i = 0; i < chips.length; i++) chips[i].classList.remove('active');
    btn.classList.add('active');
    var filtered = cat === 'all' ? this.funds : this.funds.filter(function(f){ return f.category === cat; });
    var list = document.getElementById('fund-list');
    if (list) list.innerHTML = window.InvestTab.renderFunds(filtered);
  },

  openSip: function(fundId) {
    var fund = null;
    for (var i = 0; i < this.funds.length; i++) { if (this.funds[i].id === fundId) { fund = this.funds[i]; break; } }
    if (!fund) return;
    this.currentFund = fund;

    // Default amount = user's monthly SIP budget for this fund
    var sip = window.State.user.monthlySavings || 5000;
    var defaultAmt = Math.max(fund.minSip, Math.round(sip * 0.3 / 100) * 100 || 1000);
    this.currentAmt = defaultAmt;

    // Set modal title & subtitle
    var title = document.getElementById('sip-modal-title');
    var sub   = document.getElementById('sip-modal-sub');
    if (title) title.textContent = fund.name;
    if (sub)   sub.innerHTML = '3-yr CAGR: <strong>+' + fund.ret3y + '%</strong> &nbsp;·&nbsp; Min SIP: ₹' + fund.minSip.toLocaleString('en-IN');

    // Set slider - update min to fund's actual minimum
    var slider = document.getElementById('sip-slider');
    if (slider) {
      slider.min = fund.minSip;
      slider.step = fund.minSip >= 1000 ? 500 : 100;
      slider.value = defaultAmt;
    }
    // Update the min label shown below slider
    var sliderMinLbl = document.getElementById('sip-slider-min');
    if (sliderMinLbl) sliderMinLbl.textContent = '₹' + fund.minSip.toLocaleString('en-IN') + ' (min)';

    // Set manual input
    var manual = document.getElementById('sip-manual');
    if (manual) {
      manual.min = fund.minSip;
      manual.value = defaultAmt;
      manual.placeholder = 'Min ₹' + fund.minSip.toLocaleString('en-IN');
    }

    // Update display
    this._updateDisplay(defaultAmt, fund);

    // Build presets relative to user's budget
    var presets = [
      Math.max(fund.minSip, 500),
      Math.max(fund.minSip, 1000),
      Math.max(fund.minSip, 2000),
      Math.max(fund.minSip, Math.round(sip * 0.5 / 500) * 500),
      sip,
    ];
    // Deduplicate
    var seen = {};
    presets = presets.filter(function(v) { if (seen[v]) return false; seen[v] = true; return true; });
    var presetsEl = document.getElementById('sip-presets');
    if (presetsEl) {
      presetsEl.innerHTML = presets.map(function(v) {
        return '<button class="sip-preset' + (v === defaultAmt ? ' active' : '') + '" onclick="window.InvestTab.setPreset(' + v + ')">₹' + v.toLocaleString('en-IN') + '</button>';
      }).join('');
    }

    document.getElementById('sip-modal').classList.add('open');
  },

  onSlider: function(val) {
    var minSip = this.currentFund ? this.currentFund.minSip : 100;
    val = Math.max(minSip, parseInt(val) || minSip);
    this.currentAmt = val;
    var manual = document.getElementById('sip-manual');
    if (manual) manual.value = val;
    // Update slider to not go below min
    var slider = document.getElementById('sip-slider');
    if (slider && parseInt(slider.value) < minSip) slider.value = minSip;
    this._updateDisplay(val, this.currentFund);
  },

  onManual: function(val) {
    val = parseInt(val) || 0;
    this.currentAmt = val;
    var slider = document.getElementById('sip-slider');
    if (slider && val >= 100 && val <= 100000) slider.value = val;
    this._updateDisplay(val, this.currentFund);
    // Update presets active state
    var presets = document.querySelectorAll('.sip-preset');
    for (var i = 0; i < presets.length; i++) {
      var pv = parseInt(presets[i].textContent.replace(/[^0-9]/g,''));
      presets[i].classList.toggle('active', pv === val);
    }
  },

  setPreset: function(val) {
    this.currentAmt = val;
    var slider = document.getElementById('sip-slider');
    var manual = document.getElementById('sip-manual');
    if (slider) slider.value = val;
    if (manual) manual.value = val;
    this._updateDisplay(val, this.currentFund);
    var presets = document.querySelectorAll('.sip-preset');
    for (var i = 0; i < presets.length; i++) {
      var pv = parseInt(presets[i].textContent.replace(/[^0-9]/g,''));
      presets[i].classList.toggle('active', pv === val);
    }
  },

  _updateDisplay: function(val, fund) {
    var display = document.getElementById('sip-display-val');
    if (display) display.textContent = window.Utils.fmt(val);

    // AI note — show what this SIP will grow to in 5 years
    if (fund && val > 0) {
      var note = document.getElementById('sip-ai-note');
      if (note) {
        var r = 0.01, n = 60; // 12% pa, 5 years
        var fv = 0;
        for (var i = 0; i < n; i++) fv = fv * (1+r) + val;
        note.innerHTML = '✦ At <strong>' + window.Utils.fmt(val) + '/mo</strong> for 5 years at ~12% CAGR → <strong>' + window.Utils.fmtK(Math.round(fv)) + '</strong>';
      }
    }
  },

  closeSip: function() {
    var modal = document.getElementById('sip-modal');
    if (modal) modal.classList.remove('open');
  },

  confirmSip: function() {
    var fund = this.currentFund;
    var amt = this.currentAmt;
    if (!fund || !amt || amt < (fund.minSip || 100)) {
      window.Utils.toast('Please enter a valid amount (min ₹' + (fund ? fund.minSip : 100) + ')', 'error', 3000);
      return;
    }

    // Actually add to portfolio State
    var holdings = window.State.portfolio.holdings;
    var existing = null;
    for (var i = 0; i < holdings.length; i++) {
      if (holdings[i].id === fund.id) { existing = holdings[i]; break; }
    }

    if (existing) {
      // Update SIP amount
      existing.sipAmount = amt;
      window.Utils.toast('SIP updated to ' + window.Utils.fmt(amt) + '/mo for ' + fund.name + '! ✓', 'success', 3500);
    } else {
      // Add new holding
      holdings.push({
        id: fund.id, name: fund.name, category: fund.category, type: fund.type,
        logo: fund.logo, logoColor: fund.logoColor, logoBg: fund.logoBg,
        invested: amt, current: Math.round(amt * 1.02),
        returns: 2.0, sipAmount: amt, sipDate: 10,
      });
      window.Utils.toast('SIP of ' + window.Utils.fmt(amt) + '/mo started in ' + fund.name + '! 🎉', 'success', 3500);
    }

    // Update total monthly SIP
    var totalSip = 0;
    for (var j = 0; j < holdings.length; j++) totalSip += holdings[j].sipAmount || 0;
    window.State.user.monthlySavings = totalSip;

    // Save to Supabase
    if (window.Supabase) window.Supabase.saveAction('sip_start', fund.name, amt);

    this.closeSip();
    // Re-render to show "Active SIP" badge
    this.render();
  },
};
