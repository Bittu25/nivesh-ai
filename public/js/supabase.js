// ===== Supabase Integration =====
window.Supabase = {
  url: '',
  key: '',
  _status: 'not_configured', // 'not_configured' | 'ok' | 'error'

  init: function(url, key) {
    window.Supabase.url = (url || '').replace(/\/$/, ''); // strip trailing slash
    window.Supabase.key = key || '';
    window.Supabase._status = 'ok';
  },

  configured: function() {
    return window.Supabase._status === 'ok' &&
           window.Supabase.url !== '' &&
           window.Supabase.key !== '';
  },

  _headers: function() {
    return {
      'Content-Type': 'application/json',
      'apikey': window.Supabase.key,
      'Authorization': 'Bearer ' + window.Supabase.key,
      'Prefer': 'return=representation',
    };
  },

  // Test connection — call this from browser console: Supabase.test()
  test: function() {
    if (!window.Supabase.configured()) {
      console.warn('Supabase not configured. Set URL and key in config.js');
      return;
    }
    console.log('Testing Supabase connection...');
    fetch(window.Supabase.url + '/rest/v1/users?select=count&limit=1', {
      headers: window.Supabase._headers(),
    })
    .then(function(r) {
      console.log('HTTP status:', r.status);
      return r.json();
    })
    .then(function(data) {
      console.log('%c✓ Supabase connection OK', 'color:#1a6b5a;font-weight:bold;', data);
    })
    .catch(function(e) {
      console.error('✗ Supabase connection failed:', e.message);
    });
  },

  // Insert a new user after onboarding
  saveUser: function(user) {
    if (!window.Supabase.configured()) {
      console.log('Supabase not configured — skipping save');
      return Promise.resolve(null);
    }

    var payload = {
      name:        user.name,
      income:      user.income,
      monthly_sip: user.monthlySavings,
      risk:        user.risk,
      goals:       JSON.stringify(user.goals || []),
      created_at:  new Date().toISOString(),
    };

    console.log('Saving user to Supabase...', payload.name);

    return fetch(window.Supabase.url + '/rest/v1/users', {
      method:  'POST',
      headers: window.Supabase._headers(),
      body:    JSON.stringify(payload),
    })
    .then(function(r) {
      if (!r.ok) {
        return r.text().then(function(t) { throw new Error('HTTP ' + r.status + ': ' + t); });
      }
      return r.json();
    })
    .then(function(data) {
      // data is an array because of Prefer: return=representation
      var row = Array.isArray(data) ? data[0] : data;
      if (row && row.id) {
        window.State.user.supabaseId = row.id;
        localStorage.setItem('nivesh_uid', row.id);
        console.log('%c✓ User saved to Supabase', 'color:#1a6b5a;font-weight:bold;', row.id);
      }
      return row;
    })
    .catch(function(e) {
      console.error('✗ Supabase saveUser failed:', e.message);
      return null;
    });
  },

  // Update existing user
  updateUser: function(id, fields) {
    if (!window.Supabase.configured()) return Promise.resolve(null);
    return fetch(window.Supabase.url + '/rest/v1/users?id=eq.' + id, {
      method:  'PATCH',
      headers: window.Supabase._headers(),
      body:    JSON.stringify(fields),
    })
    .then(function(r) { return r.json(); })
    .catch(function(e) { console.warn('Supabase updateUser:', e.message); return null; });
  },

  // Load user by their saved ID
  loadUser: function(id) {
    if (!window.Supabase.configured()) return Promise.resolve(null);
    return fetch(window.Supabase.url + '/rest/v1/users?id=eq.' + id + '&select=*', {
      headers: window.Supabase._headers(),
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      var row = Array.isArray(data) ? data[0] : null;
      if (row) {
        window.State.user.name          = row.name;
        window.State.user.income        = row.income;
        window.State.user.monthlySavings = row.monthly_sip;
        window.State.user.risk          = row.risk;
        window.State.user.goals         = JSON.parse(row.goals || '[]');
        window.State.user.supabaseId    = row.id;
        console.log('%c✓ User loaded from Supabase', 'color:#1a6b5a;font-weight:bold;', row.name);
      }
      return row;
    })
    .catch(function(e) { console.warn('Supabase loadUser:', e.message); return null; });
  },

  // Save each AI chat message
  saveMessage: function(role, content) {
    if (!window.Supabase.configured() || !window.State.user.supabaseId) return Promise.resolve(null);
    return fetch(window.Supabase.url + '/rest/v1/messages', {
      method:  'POST',
      headers: window.Supabase._headers(),
      body: JSON.stringify({
        user_id:    window.State.user.supabaseId,
        role:       role,
        content:    content,
        created_at: new Date().toISOString(),
      }),
    })
    .then(function(r) { return r.json(); })
    .catch(function() { return null; });
  },

  // Save a SIP / investment action
  saveAction: function(type, fundName, amount) {
    if (!window.Supabase.configured() || !window.State.user.supabaseId) return Promise.resolve(null);
    return fetch(window.Supabase.url + '/rest/v1/actions', {
      method:  'POST',
      headers: window.Supabase._headers(),
      body: JSON.stringify({
        user_id:    window.State.user.supabaseId,
        type:       type,
        fund_name:  fundName,
        amount:     amount,
        created_at: new Date().toISOString(),
      }),
    })
    .then(function(r) { return r.json(); })
    .catch(function() { return null; });
  },

  // Show a small status badge in the UI
  showStatus: function() {
    var badge = document.getElementById('sb-status');
    if (!badge) {
      badge = document.createElement('div');
      badge.id = 'sb-status';
      badge.style.cssText = 'position:fixed;bottom:80px;left:16px;z-index:9000;font-size:11px;font-weight:600;padding:5px 10px;border-radius:20px;cursor:pointer;';
      badge.onclick = function() { window.Supabase.test(); };
      document.body.appendChild(badge);
    }
    if (window.Supabase.configured()) {
      badge.style.background = '#ecfdf5';
      badge.style.color = '#059669';
      badge.style.border = '1px solid #a7f3d0';
      badge.textContent = '🟢 Supabase connected';
      badge.title = 'Click to test connection in console';
    } else {
      badge.style.background = '#fef3c7';
      badge.style.color = '#d97706';
      badge.style.border = '1px solid #fde68a';
      badge.textContent = '⚪ Supabase (not set)';
      badge.title = 'Open config.js to add credentials';
    }
  },
};
