/* ============================================================
   storage.js — localStorage helpers
   QuantaConvert | UI-only build
   All user data, session, and history is stored in the browser.
   ============================================================ */

const Storage = (() => {

  const KEYS = {
    USERS:   'qc_users',
    SESSION: 'qc_session',
    HISTORY: 'qc_history',
  };

  /* ── Users ── */
  function getUsers() {
    return JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
  }

  function saveUsers(users) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  }

  function addUser(user) {
    const users = getUsers();
    users.push(user);
    saveUsers(users);
  }

  function findUser(email, password) {
    return getUsers().find(u => u.email === email && u.password === password) || null;
  }

  function emailExists(email) {
    return getUsers().some(u => u.email === email);
  }

  /* ── Session ── */
  function getSession() {
    const s = localStorage.getItem(KEYS.SESSION);
    return s ? JSON.parse(s) : null;
  }

  function saveSession(user) {
    localStorage.setItem(KEYS.SESSION, JSON.stringify(user));
  }

  function clearSession() {
    localStorage.removeItem(KEYS.SESSION);
  }

  /* ── History ── */
  function getHistory() {
    return JSON.parse(localStorage.getItem(KEYS.HISTORY) || '[]');
  }

  function addHistoryEntry(entry) {
    const history = getHistory();
    history.unshift({ ...entry, ts: Date.now() });
    if (history.length > 50) history.pop();      // keep last 50 entries
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
  }

  /* ── Public API ── */
  return {
    getUsers, saveUsers, addUser, findUser, emailExists,
    getSession, saveSession, clearSession,
    getHistory, addHistoryEntry,
  };

})();
