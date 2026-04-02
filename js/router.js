/* ============================================================
   router.js — Simple page router (no backend, no hash routing)
   QuantaConvert | UI-only build (localStorage)
   Pages: login | signup | dashboard
   ============================================================ */

const Router = (() => {

  const PAGES = ['login', 'signup', 'dashboard'];

  /* Show one page, hide the rest */
  function show(name) {
    PAGES.forEach(p => {
      const el = document.getElementById('page-' + p);
      if (el) el.style.display = (p === name) ? (p === 'dashboard' ? 'flex' : 'flex') : 'none';
    });
  }

  function goToLogin()    { show('login'); }
  function goToSignup()   { show('signup'); }

  function goToDashboard(user) {
    show('dashboard');
    Dashboard.init(user);
  }

  /* ── Boot: check for an existing session ── */
  function boot() {
    // Hide all pages first
    PAGES.forEach(p => {
      const el = document.getElementById('page-' + p);
      if (el) el.style.display = 'none';
    });

    const session = Storage.getSession();
    if (session) {
      goToDashboard(session);
    } else {
      goToLogin();
    }
  }

  return { boot, goToLogin, goToSignup, goToDashboard };

})();
