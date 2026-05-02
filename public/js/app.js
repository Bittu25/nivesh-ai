// ===== App Bootstrap =====

// Clear any old storage keys
try { localStorage.removeItem('nivesh_state'); } catch(e) {}

// Load saved preferences (income/risk) but NEVER skip onboarding
window.State.load();
// Always reset portfolio so stale cached data never shows wrong funds
window.State.portfolio.holdings = [];
window.State.portfolio.transactions = [];
window.State.portfolio.totalValue = 0;
window.State.portfolio.totalInvested = 0;
window.State.goals = [];

function hideSplash() {
  var splash = document.getElementById('splash');
  var app = document.getElementById('app');
  if (app) app.style.display = '';
  if (splash) {
    splash.classList.add('hidden');
    setTimeout(function() { if (splash.parentNode) splash.parentNode.removeChild(splash); }, 500);
  }
}

function boot() {
  if (window.Charts) window.Charts.defaults();
  if (window.Supabase) window.Supabase.showStatus();
  // ALWAYS show onboarding — never skip, even for returning users
  // Returning users will have their prefs pre-filled from localStorage
  window.Onboarding.init();
  hideSplash();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
