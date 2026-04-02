/* ============================================================
   auth.js — Login, Signup, Logout logic
   QuantaConvert | UI-only build (localStorage)
   Depends on: storage.js, router.js
   ============================================================ */

const Auth = (() => {

  /* ── Helpers ── */
  function showError(boxId, textId, message) {
    const box  = document.getElementById(boxId);
    const text = document.getElementById(textId);
    if (box && text) { text.textContent = message; box.style.display = 'flex'; }
  }

  function hideError(boxId) {
    const box = document.getElementById(boxId);
    if (box) box.style.display = 'none';
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ── Login ── */
  function login() {
    hideError('login-error');

    const email    = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
      showError('login-error', 'login-error-text', 'Please fill in all fields.');
      return;
    }
    if (!isValidEmail(email)) {
      showError('login-error', 'login-error-text', 'Please enter a valid email address.');
      return;
    }

    const user = Storage.findUser(email, password);
    if (!user) {
      showError('login-error', 'login-error-text', 'Invalid email or password.');
      return;
    }

    Storage.saveSession(user);
    Router.goToDashboard(user);
  }

  /* ── Signup ── */
  function signup() {
    hideError('signup-error');

    const name     = document.getElementById('signup-name').value.trim();
    const email    = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;

    if (!name || !email || !password) {
      showError('signup-error', 'signup-error-text', 'Please fill in all fields.');
      return;
    }
    if (!isValidEmail(email)) {
      showError('signup-error', 'signup-error-text', 'Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      showError('signup-error', 'signup-error-text', 'Password must be at least 6 characters.');
      return;
    }
    if (Storage.emailExists(email)) {
      showError('signup-error', 'signup-error-text', 'An account with this email already exists.');
      return;
    }

    const user = { name, email, password };
    Storage.addUser(user);
    Storage.saveSession(user);
    Router.goToDashboard(user);
  }

  /* ── Demo / Google (mock) ── */
  function demoLogin() {
    const user = { name: 'Demo User', email: 'demo@quantaconvert.io', password: '' };
    Storage.saveSession(user);
    Router.goToDashboard(user);
  }

  /* ── Logout ── */
  function logout() {
    Storage.clearSession();
    Router.goToLogin();
  }

  /* ── Public API ── */
  return { login, signup, demoLogin, logout };

})();
