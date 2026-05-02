window.AdvisorTab = {
  loading: false,

  // Top quick questions (short, casual)
  _topQs: [
    'Should I increase my SIP this month?',
    'Best investment for 6 months?',
    'What is rupee cost averaging?',
    'Should I add gold to my portfolio?',
  ],

  // Sidebar suggestion questions (detailed, topic-based)
  _sideQs: [
    '⚖️ How do I rebalance my portfolio?',
    '📊 Explain my SIP performance this month',
    '🌴 How to retire comfortably at 55?',
    '🏠 Home loan vs SIP — which is better?',
    '💰 How much emergency fund do I need?',
    '📚 Explain index funds in simple terms',
  ],

  render: function() {
    var el = document.getElementById('tab-advisor');
    if (!el) return;

    // Build top QQ buttons — use prefix 't' for top
    var qqHTML = '';
    for (var i = 0; i < AdvisorTab._topQs.length; i++) {
      qqHTML += '<button class="qq-btn" onclick="AdvisorTab.sendTop(' + i + ')">' + AdvisorTab._topQs[i] + '</button>';
    }

    // Build sidebar buttons — use prefix 's' for side
    var sugHTML = '';
    for (var j = 0; j < AdvisorTab._sideQs.length; j++) {
      sugHTML += '<button class="sug-btn" onclick="AdvisorTab.sendSide(' + j + ')">' + AdvisorTab._sideQs[j] + '</button>';
    }

    var u = window.State.user;
    var p = window.State.portfolio;
    var profileRows = [
      ['Name',       u.name || 'User'],
      ['Monthly SIP', window.Utils.fmt(u.monthlySavings || 5000)],
      ['Risk',        (u.risk||'balanced').charAt(0).toUpperCase()+(u.risk||'balanced').slice(1)],
      ['Portfolio',   window.Utils.fmtK(p.totalValue)],
      ['XIRR',        '<span style="color:var(--green-dark);font-weight:700;">' + p.xirr + '%</span>'],
    ];
    var profileHTML = '';
    for (var k = 0; k < profileRows.length; k++) {
      profileHTML += '<div class="profile-row"><span class="pr-key">' + profileRows[k][0] + '</span><span class="pr-val">' + profileRows[k][1] + '</span></div>';
    }

    el.innerHTML =
      '<div class="page-header"><h1>AI Advisor</h1><p>Personalised investment guidance — powered by Claude AI</p></div>' +
      '<div class="advisor-layout">' +
        '<div class="chat-window">' +
          '<div class="chat-topbar">' +
            '<div class="chat-avatar"><svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" width="20" height="20"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke-linecap="round" stroke-linejoin="round"/></svg></div>' +
            '<div><div class="chat-ai-name">Nivesh AI Advisor</div><div class="chat-ai-status">Online</div></div>' +
            '<span class="chat-powered">Powered by Claude</span>' +
            '<button class="btn btn-ghost btn-sm" onclick="AdvisorTab.clear()" style="margin-left:6px;">Clear</button>' +
          '</div>' +
          '<div class="quick-questions" id="chat-qq">' + qqHTML + '</div>' +
          '<div class="chat-messages" id="chat-msgs">' + AdvisorTab._welcome() + '</div>' +
          '<div class="chat-input-area">' +
            '<div class="chat-input-row">' +
              '<input class="chat-input" id="chat-inp" placeholder="Koi bhi investment sawaal pucho..." autocomplete="off"' +
              ' onkeydown="if(event.key===\'Enter\'&&!event.shiftKey){event.preventDefault();AdvisorTab.send();}"/>' +
              '<button class="chat-send-btn" id="send-btn" onclick="AdvisorTab.send()">' +
                '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
              '</button>' +
            '</div>' +
            '<div class="chat-disclaimer">📋 Educational guidance only — not SEBI-registered investment advice</div>' +
          '</div>' +
        '</div>' +
        '<div class="advisor-sidebar">' +
          '<div class="card"><div class="card-header"><div class="card-title">Your Profile</div></div>' +
            '<div class="card-body" style="padding-top:8px;">' + profileHTML + '</div></div>' +
          '<div class="card"><div class="card-header"><div class="card-title">Ask About</div></div>' +
            '<div class="card-body" style="padding-top:14px;">' + sugHTML + '</div></div>' +
          '<div class="card"><div class="card-header"><div class="card-title">Chat Stats</div></div>' +
            '<div class="card-body"><div id="chat-stats" style="font-size:13px;color:var(--text-2);">0 messages</div>' +
            '<div style="font-size:11px;color:var(--text-3);margin-top:4px;">Not stored between sessions</div></div></div>' +
        '</div>' +
      '</div>';
  },

  _welcome: function() {
    var name = (window.State.user.name || 'there').split(' ')[0];
    return '<div class="msg bot">' +
      '<div class="msg-bubble">Namaste, ' + name + '! 🙏 Main hun aapka Nivesh AI Advisor.<br><br>' +
      'Mujhe aapka portfolio pata hai — ' + window.Utils.fmtK(window.State.portfolio.totalValue) +
      ' portfolio, ' + window.State.portfolio.xirr + '% XIRR. Aaj kaise madad kar sakta hun?<br><br>' +
      'Upar quick questions hain, ya apna sawaal type karein! 👇</div>' +
      '<div class="msg-time">Just now</div></div>';
  },

  // Top quick question clicked (index into _topQs)
  sendTop: function(i) {
    var text = AdvisorTab._topQs[i];
    if (!text) return;
    AdvisorTab._doSend(text);
  },

  // Sidebar suggestion clicked (index into _sideQs)
  sendSide: function(i) {
    var text = AdvisorTab._sideQs[i];
    if (!text) return;
    // Strip the emoji prefix for sending
    var clean = text.replace(/^[^\w\u0900-\u097F]+/, '').trim();
    AdvisorTab._doSend(clean);
  },

  send: function() {
    var inp = document.getElementById('chat-inp');
    if (!inp) return;
    var msg = inp.value.trim();
    if (!msg) { inp.focus(); return; }
    inp.value = '';
    AdvisorTab._doSend(msg);
  },

  _doSend: function(msg) {
    if (AdvisorTab.loading) return;
    AdvisorTab._addMsg(msg, 'user');
    window.State.chat.history.push({ role: 'user', content: msg });
    if (window.Supabase) window.Supabase.saveMessage('user', msg);
    AdvisorTab._setLoading(true);
    AdvisorTab._showTyping();
    window.API.chat(window.State.chat.history)
      .then(function(reply) {
        AdvisorTab._removeTyping();
        AdvisorTab._addMsg(reply, 'bot');
        window.State.chat.history.push({ role: 'assistant', content: reply });
        if (window.Supabase) window.Supabase.saveMessage('assistant', reply);
        AdvisorTab._updateStats();
        AdvisorTab._setLoading(false);
      })
      .catch(function() {
        AdvisorTab._removeTyping();
        AdvisorTab._addMsg('Oops! Network issue. Please try again. 🙏', 'bot');
        AdvisorTab._setLoading(false);
      });
  },

  _addMsg: function(text, role) {
    var msgs = document.getElementById('chat-msgs');
    if (!msgs) return;
    var time = new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
    var d = document.createElement('div');
    d.className = 'msg ' + role + ' fade-in-fast';
    var safe = text
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/\n/g,'<br>')
      .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>');
    d.innerHTML = '<div class="msg-bubble">' + safe + '</div><div class="msg-time">' + time + '</div>';
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  },

  _showTyping: function() {
    var msgs = document.getElementById('chat-msgs');
    if (!msgs) return;
    var d = document.createElement('div');
    d.className = 'msg bot'; d.id = 'typing-ind';
    d.innerHTML = '<div class="typing-bubble"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>';
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  },

  _removeTyping: function() { var t = document.getElementById('typing-ind'); if (t) t.remove(); },

  _setLoading: function(v) {
    AdvisorTab.loading = v;
    var btn = document.getElementById('send-btn');
    if (!btn) return;
    btn.disabled = v;
    btn.innerHTML = v
      ? '<div class="spinner"></div>'
      : '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  },

  _updateStats: function() {
    var el = document.getElementById('chat-stats');
    var n = window.State.chat.history.length;
    if (el) el.textContent = n + ' message' + (n !== 1 ? 's' : '') + ' exchanged';
  },

  clear: function() {
    window.State.chat.history = [];
    var msgs = document.getElementById('chat-msgs');
    if (msgs) msgs.innerHTML = AdvisorTab._welcome();
    AdvisorTab._updateStats();
    window.Utils.toast('Chat cleared', '', 1500);
  },
};
