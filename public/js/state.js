// ===== Global App State =====
window.State = {
  user: {
    name: '',
    initials: '',
    income: '25-50',
    monthlySavings: 5000,
    goals: [],
    risk: 'balanced',
    onboarded: false,
    supabaseId: null,
  },

  // Portfolio is GENERATED from user's onboarding inputs — not hardcoded
  portfolio: {
    totalValue: 0,
    totalInvested: 0,
    xirr: 0,
    holdings: [],
    transactions: [],
  },

  goals: [],   // built from onboarding selections
  chat: { history: [] },
  notifications: [],
  charts: {},

  // Called after onboarding to build personalized portfolio simulation
  buildFromUser: function() {
    var u = window.State.user;
    var sip = u.monthlySavings;
    var risk = u.risk;

    // Fund allocation based on risk
    var allocs = {
      safe:     [{id:'sb',name:'SBI Short Term Debt',    logo:'SB',color:'#059669',bg:'#f0fdf4',cat:'debt',  type:'Short Duration',share:0.50,ret:7.8},
                 {id:'hl',name:'HDFC Liquid Fund',       logo:'HL',color:'#1d6fca',bg:'#eff6ff',cat:'debt',  type:'Liquid',        share:0.30,ret:6.9},
                 {id:'ni',name:'Nippon Gold ETF',        logo:'NI',color:'#d97706',bg:'#fff8ec',cat:'gold',  type:'Gold ETF',      share:0.20,ret:18.2}],
      balanced: [{id:'pp',name:'Parag Parikh Flexi Cap', logo:'PP',color:'#1a6b5a',bg:'#edfaf5',cat:'equity',type:'Flexi Cap',     share:0.50,ret:22.4},
                 {id:'hd',name:'HDFC Mid Cap',           logo:'HD',color:'#1d6fca',bg:'#eff6ff',cat:'equity',type:'Mid Cap',       share:0.25,ret:28.1},
                 {id:'ni',name:'Nippon Gold ETF',        logo:'NI',color:'#d97706',bg:'#fff8ec',cat:'gold',  type:'Gold ETF',      share:0.25,ret:18.2}],
      growth:   [{id:'hd',name:'HDFC Mid Cap',           logo:'HD',color:'#1d6fca',bg:'#eff6ff',cat:'equity',type:'Mid Cap',       share:0.40,ret:28.1},
                 {id:'ax',name:'Axis Small Cap',         logo:'AX',color:'#dc2626',bg:'#fef2f2',cat:'equity',type:'Small Cap',     share:0.35,ret:31.2},
                 {id:'pp',name:'Parag Parikh Flexi Cap', logo:'PP',color:'#1a6b5a',bg:'#edfaf5',cat:'equity',type:'Flexi Cap',     share:0.25,ret:22.4}],
    };
    var funds = allocs[risk] || allocs.balanced;

    // NEW USER — starts fresh today, no simulated history
    var holdings = [];
    var totalInvested = 0;
    var totalValue = 0;

    for (var i = 0; i < funds.length; i++) {
      var f = funds[i];
      var monthlyAmt = Math.round(sip * f.share);
      // First SIP just made — invested = 1 month, small gain
      var invested = monthlyAmt;
      var current  = Math.round(invested * 1.008); // ~1% first month gain
      totalInvested += invested;
      totalValue    += current;
      holdings.push({
        id: f.id, name: f.name, category: f.cat, type: f.type,
        logo: f.logo, logoColor: f.color, logoBg: f.bg,
        invested: invested, current: current,
        returns: 0.8,
        sipAmount: monthlyAmt, sipDate: 10,
      });
    }

    window.State.portfolio.holdings = holdings;
    window.State.portfolio.totalInvested = totalInvested;
    window.State.portfolio.totalValue = totalValue;
    // XIRR for 1 month of SIP — show expected annual rate based on fund mix
    var expectedAnnualReturn = {'safe':8.0,'balanced':12.5,'growth':18.0}[u.risk] || 12.5;
    window.State.portfolio.xirr = expectedAnnualReturn;
    window.State.portfolio.transactions = window.State._buildTransactions(holdings);

    // Build goals from user selections
    var goalTemplates = {
      home:       {emoji:'🏠',name:'Home Down Payment',bg:'#edfaf5',color:'#1a6b5a',targetMult:300},
      retirement: {emoji:'🌴',name:'Retirement Corpus', bg:'#eff6ff',color:'#1d6fca',targetMult:6000},
      education:  {emoji:'🎓',name:'Education Fund',    bg:'#f5f3ff',color:'#7c3aed',targetMult:500},
      wedding:    {emoji:'💒',name:'Wedding Fund',      bg:'#fdf2f8',color:'#db2777',targetMult:400},
      vehicle:    {emoji:'🚗',name:'Vehicle Fund',      bg:'#fff7ed',color:'#ea580c',targetMult:200},
      travel:     {emoji:'✈️', name:'Travel Fund',       bg:'#fff8ec',color:'#d97706',targetMult:150},
      emergency:  {emoji:'🛡️',name:'Emergency Fund',    bg:'#f0fdf4',color:'#16a34a',targetMult:120},
      business:   {emoji:'💼',name:'Business Capital',  bg:'#eff6ff',color:'#1d6fca',targetMult:800},
      other:      {emoji:'⭐',name:'My Goal',           bg:'#fafafa', color:'#64748b',targetMult:200},
    };
    var deadlines = {home:'Dec 2028',retirement:'2045',education:'Jun 2030',wedding:'Mar 2027',vehicle:'Dec 2026',travel:'Dec 2026',emergency:'Jun 2026',business:'2030',other:'2028'};
    var defaultTargets = {home:2000000,retirement:10000000,education:1500000,wedding:800000,vehicle:500000,travel:200000,emergency:300000,business:2000000,other:500000};
    var userAmounts = u.goalAmounts || {};
    var goals = u.goals.slice(0, 4);
    window.State.goals = goals.map(function(gid) {
      var t = goalTemplates[gid] || goalTemplates.other;
      // Use user-entered amount if available, else default
      var target = userAmounts[gid] || defaultTargets[gid] || (sip * t.targetMult);
      var saved = Math.round(totalValue * (1 / goals.length)); // proportional share of current portfolio
      return { id: gid, emoji: t.emoji, name: t.name, bg: t.bg, color: t.color,
               saved: saved, target: target, deadline: deadlines[gid] || '2028' };
    });

    // Notifications based on user data
    window.State.notifications = [
      { id:1, title:'SIP Executed ✓', body: window.Utils.fmt(sip) + ' invested across ' + funds.length + ' funds', time:'Today', read:false },
      { id:2, title:'AI Insight 💡',  body: 'Your ' + risk + ' portfolio is on track. Tap AI Advisor for detailed analysis.', time:'1d ago', read:false },
    ];
  },

  _buildTransactions: function(holdings) {
    // Only show actual first SIP — today when user starts
    var txns = [];
    var today = new Date();
    var dateStr = today.getDate() + ' ' + today.toLocaleString('en-IN', {month:'short'}) + ' ' + today.getFullYear();
    for (var i = 0; i < holdings.length; i++) {
      if (holdings[i].sipAmount > 0) {
        txns.push({
          date: dateStr,
          fund: holdings[i].name.split(' ').slice(0,3).join(' '),
          type: 'sip',
          amount: holdings[i].sipAmount,
          status: 'done'
        });
      }
    }
    return txns;
  },

  save: function() {
    try {
      var toSave = {
        name: window.State.user.name,
        income: window.State.user.income,
        monthlySavings: window.State.user.monthlySavings,
        risk: window.State.user.risk,
        goals: window.State.user.goals,
      };
      localStorage.setItem('nivesh_prefs', JSON.stringify(toSave));
    } catch(e) {}
  },

  load: function() {
    try {
      var saved = JSON.parse(localStorage.getItem('nivesh_prefs') || 'null');
      if (saved && saved.name) {
        window.State.user.income = saved.income || '25-50';
        window.State.user.monthlySavings = saved.monthlySavings || 5000;
        window.State.user.risk = saved.risk || 'balanced';
        // Don't restore name — force fresh onboarding
      }
    } catch(e) {}
  },
};
