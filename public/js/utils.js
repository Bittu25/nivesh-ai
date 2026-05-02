// ===== Utils =====
window.Utils = {
  fmt:  function(n) { return '₹' + Math.round(n).toLocaleString('en-IN'); },
  fmtK: function(n) {
    if (n >= 10000000) return '₹' + (n/10000000).toFixed(2) + 'Cr';
    if (n >= 100000)   return '₹' + (n/100000).toFixed(1) + 'L';
    if (n >= 1000)     return '₹' + (n/1000).toFixed(0) + 'K';
    return '₹' + Math.round(n);
  },
  today: function() {
    return new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  },

  el:   function(id)        { return document.getElementById(id); },
  qs:   function(sel, ctx)  { return (ctx||document).querySelector(sel); },
  qsa:  function(sel, ctx)  { return Array.prototype.slice.call((ctx||document).querySelectorAll(sel)); },
  html: function(el, html)  { if (el) el.innerHTML = html; },
  on:   function(el, ev, fn){ if (el) el.addEventListener(ev, fn); },

  toast: function(msg, type, duration) {
    duration = duration || 3000;
    var c = document.querySelector('.toast-container');
    if (!c) { c = document.createElement('div'); c.className = 'toast-container'; document.body.appendChild(c); }
    var t = document.createElement('div');
    t.className = 'toast ' + (type||'');
    t.textContent = msg;
    c.appendChild(t);
    setTimeout(function() {
      t.style.opacity = '0'; t.style.transform = 'translateX(30px)'; t.style.transition = '0.3s';
      setTimeout(function() { if(t.parentNode) t.remove(); }, 300);
    }, duration);
  },

  goalPct: function(g) { return Math.min(100, Math.round((g.saved / g.target) * 100)); },

  // Portfolio growth chart — shows PROJECTION for next 12 months
  // Honest: user just started today, so we show where they'll be
  growthData: function() {
    var p = window.State.portfolio;
    var u = window.State.user;
    var sip = u.monthlySavings || 5000;
    var currentValue = p.totalValue || 0;

    // Expected annual return based on risk
    var annualRate = { safe: 0.08, balanced: 0.12, growth: 0.18 }[u.risk] || 0.12;
    var monthlyRate = annualRate / 12;

    var months = 12;
    var labels = [];
    var vals = [];
    var now = new Date();

    // Start from current month going forward
    var running = currentValue;
    for (var i = 0; i < months; i++) {
      var d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      labels.push(d.toLocaleString('en-IN', { month: 'short', year: i === 0 || d.getMonth() === 0 ? '2-digit' : undefined }));
      // Each month: existing corpus grows + new SIP added
      running = running * (1 + monthlyRate) + sip;
      vals.push(Math.round(running));
    }

    return { months: labels, vals: vals };
  },
};
