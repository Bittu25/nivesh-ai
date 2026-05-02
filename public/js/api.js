// ===== API Layer — dynamically built from user State =====
window.API = {
  chat: function(messages) {
    var u = window.State.user;
    var p = window.State.portfolio;
    var goals = window.State.goals || [];

    // Build holdings string from ACTUAL portfolio
    var holdingsStr = '';
    if (p.holdings && p.holdings.length > 0) {
      holdingsStr = p.holdings.map(function(h) {
        return h.name + ' (' + window.Utils.fmtK(h.current) + ' | ' +
               (h.returns >= 0 ? '+' : '') + h.returns + '%)';
      }).join(', ');
    } else {
      holdingsStr = 'No holdings yet — just getting started';
    }

    // Build goals string from ACTUAL user goals
    var goalsStr = '';
    if (goals.length > 0) {
      goalsStr = goals.map(function(g) {
        var pct = Math.min(100, Math.round(g.saved / g.target * 100));
        return g.name + ': ' + window.Utils.fmtK(g.saved) + ' saved of ' +
               window.Utils.fmtK(g.target) + ' (' + pct + '%, target ' + g.deadline + ')';
      }).join('\n- ');
      goalsStr = '- ' + goalsStr;
    } else {
      goalsStr = '- No goals set yet';
    }

    var isNewUser = p.totalInvested <= (u.monthlySavings * 2);

    var system =
      'You are Nivesh AI — a warm, expert investment advisor for Indian retail investors.\n\n' +

      'USER PROFILE (this is the REAL user, use this data, not any demo data):\n' +
      '- Name: ' + (u.name || 'User') + '\n' +
      '- Monthly SIP: ' + window.Utils.fmt(u.monthlySavings || 0) + '\n' +
      '- Risk profile: ' + (u.risk || 'balanced') + '\n' +
      '- Goals selected: ' + (u.goals || []).join(', ') + '\n' +
      (isNewUser ? '- Status: BRAND NEW USER — just started their investment journey today!\n' : '') +

      '\nPORTFOLIO (REAL, CURRENT DATA):\n' +
      '- Total value: ' + window.Utils.fmtK(p.totalValue || 0) + '\n' +
      '- Total invested: ' + window.Utils.fmtK(p.totalInvested || 0) + '\n' +
      '- XIRR: ' + (p.xirr || 0) + '%\n' +
      '- Holdings: ' + holdingsStr + '\n' +

      '\nACTIVE GOALS (REAL DATA):\n' + goalsStr + '\n' +

      '\nCONTEXT: India, 2026. User is in the Nivesh AI app.\n' +

      '\nTONE & RULES:\n' +
      '1. Warm, friendly — like a trusted friend who is also a financial expert.\n' +
      '2. Naturally mix Hindi phrases (bilkul, bahut achha, ek kaam karo, dekho, sahi hai) but keep readable.\n' +
      '3. Keep responses concise — 3-5 sentences max unless detail is requested.\n' +
      '4. ALWAYS reference their actual portfolio and goals — never mention demo funds or other users data.\n' +
      '5. If user is new (just started), be encouraging and explain basics warmly.\n' +
      '6. Always acknowledge market uncertainty.\n' +
      '7. End EVERY response with exactly: "📋 Note: This is educational guidance, not SEBI-registered investment advice."\n' +
      '8. Use ₹ symbol with Indian formatting (lakhs/crores).\n' +
      '9. NEVER make up portfolio data — only reference what is in the USER PROFILE and PORTFOLIO sections above.';

    return fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: messages, system: system }),
    })
    .then(function(response) {
      if (!response.ok) throw new Error('Network error: ' + response.status);
      return response.json();
    })
    .then(function(data) {
      if (data.error) throw new Error(data.error.message || 'API error');
      var content = data.content || [];
      for (var i = 0; i < content.length; i++) {
        if (content[i].type === 'text') return content[i].text;
      }
      return 'Sorry, kuch issue aa gaya. Please try again!';
    });
  },
};
