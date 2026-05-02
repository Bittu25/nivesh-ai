// ===== Nivesh AI — Supabase Configuration =====

window.AppConfig = {
  // Project ref: fcqsnwjcsuonqpwieols
  supabaseUrl: 'https://fcqsnwjcsuonqpwieols.supabase.co',
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjcXNud2pjc3VvbnFwd2llb2xzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NjAxNDksImV4cCI6MjA5MzIzNjE0OX0.XRsqBQR-20GZLOeVNfOrCrhrSBJWHg8VREY7m_1rNfI',
};

// Auto-init synchronously — supabase.js is already loaded at this point
(function() {
  if (window.Supabase) {
    window.Supabase.init(window.AppConfig.supabaseUrl, window.AppConfig.supabaseKey);
    console.log('%c✓ Supabase connected: ' + window.AppConfig.supabaseUrl, 'color:#1a6b5a;font-weight:bold;');
  }
})();
