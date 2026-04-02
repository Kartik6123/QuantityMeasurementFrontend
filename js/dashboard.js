/* ============================================================
   dashboard.js — Dashboard UI state & interactions
   QuantaConvert | UI-only build (localStorage)
   Depends on: storage.js, converter.js
   ============================================================ */

const Dashboard = (() => {

  /* ── Internal state ── */
  let currentType = 'LENGTH';
  let currentMode = 'convert';
  let historyOpen = false;

  const TYPE_META = {
    LENGTH:      { label: 'Length',      icon: 'fa-ruler' },
    WEIGHT:      { label: 'Weight',      icon: 'fa-weight-scale' },
    TEMPERATURE: { label: 'Temperature', icon: 'fa-temperature-half' },
    VOLUME:      { label: 'Volume',      icon: 'fa-flask' },
  };

  const MODE_ICONS = {
    convert: 'fa-right-left',
    add:     'fa-plus',
    subtract:'fa-minus',
    divide:  'fa-divide',
    compare: 'fa-equals',
  };

  /* ════════════════════════════════════════
     INIT
  ════════════════════════════════════════ */
  function init(user) {
    document.getElementById('user-name-display').textContent = user.name;
    document.getElementById('welcome-name').textContent       = user.name;
    document.getElementById('user-avatar').textContent        = user.name.charAt(0).toUpperCase();

    setType('LENGTH');
    setMode('convert');
    hideResultCards();
  }

  /* ════════════════════════════════════════
     TYPE SWITCHER
  ════════════════════════════════════════ */
  function setType(type) {
    currentType = type;
    historyOpen = false;

    // Sidebar active state
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById('nav-' + type).classList.add('active');

    // Page title
    const { label, icon } = TYPE_META[type];
    document.getElementById('page-type-title').innerHTML =
      `<i class="fa-solid ${icon} type-icon"></i> ${label}`;

    // Populate unit selects
    const units = Converter.UNITS[type];
    ['unit1', 'unit2'].forEach((id, i) => {
      const sel = document.getElementById(id);
      sel.innerHTML = units.map(u => `<option value="${u}">${u}</option>`).join('');
      sel.value     = units[i === 0 ? 0 : Math.min(1, units.length - 1)];
    });

    hideResultCards();
    document.getElementById('history-card').style.display = 'none';
  }

  /* ════════════════════════════════════════
     MODE SWITCHER
  ════════════════════════════════════════ */
  function setMode(mode) {
    currentMode = mode;

    document.querySelectorAll('.op-pill').forEach(p => p.classList.remove('active'));
    document.getElementById('pill-' + mode).classList.add('active');

    document.getElementById('op-badge').innerHTML =
      `<i class="fa-solid ${MODE_ICONS[mode]}"></i>`;

    hideResultCards();
  }

  /* ════════════════════════════════════════
     SLIDERS ↔ INPUTS SYNC
  ════════════════════════════════════════ */
  function syncSlider(n) {
    const val = parseFloat(document.getElementById('value' + n).value) || 0;
    document.getElementById('slider' + n).value  = val;
    document.getElementById('cur'    + n).textContent = val;
  }

  function syncInput(n) {
    const val = document.getElementById('slider' + n).value;
    document.getElementById('value' + n).value        = val;
    document.getElementById('cur'   + n).textContent  = val;
  }

  /* ════════════════════════════════════════
     RESULT / ERROR DISPLAY
  ════════════════════════════════════════ */
  function hideResultCards() {
    document.getElementById('result-card').style.display = 'none';
    document.getElementById('error-card').style.display  = 'none';
  }

  function showResult(text) {
    document.getElementById('result-value').textContent  = text;
    document.getElementById('result-card').style.display = 'flex';
    document.getElementById('error-card').style.display  = 'none';
  }

  function showError(text) {
    document.getElementById('error-text').textContent   = text;
    document.getElementById('error-card').style.display = 'flex';
    document.getElementById('result-card').style.display = 'none';
  }

  /* ════════════════════════════════════════
     CALCULATE
  ════════════════════════════════════════ */
  function perform() {
    const v1 = parseFloat(document.getElementById('value1').value) || 0;
    const v2 = parseFloat(document.getElementById('value2').value) || 0;
    const u1 = document.getElementById('unit1').value;
    const u2 = document.getElementById('unit2').value;

    try {
      const result = Converter.calculate(currentMode, v1, u1, v2, u2, currentType);
      showResult(result);
      Storage.addHistoryEntry({ mode: currentMode, type: currentType, v1, u1, v2, u2, result });
    } catch (err) {
      showError(err.message);
    }
  }

  /* ════════════════════════════════════════
     HISTORY
  ════════════════════════════════════════ */
  function toggleHistory() {
    historyOpen = !historyOpen;
    const card  = document.getElementById('history-card');
    if (historyOpen) { renderHistory(); card.style.display = 'block'; }
    else             { card.style.display = 'none'; }
  }

  function renderHistory() {
    const all  = Storage.getHistory();
    const body = document.getElementById('history-body');

    if (!all.length) {
      body.innerHTML = `<div class="history-empty">
        <i class="fa-regular fa-folder-open"></i> No history yet. Run a calculation first.
      </div>`;
      return;
    }

    body.innerHTML = `<div class="history-list">
      ${all.slice(0, 10).map(h => `
        <div class="history-item">
          <span class="op-tag op-tag--${h.mode}">${h.mode.toUpperCase()}</span>
          <span class="hist-from">${h.v1} ${h.u1}</span>
          <span class="hist-arrow"><i class="fa-solid fa-arrow-right"></i></span>
          <span class="hist-to">${h.result}</span>
        </div>
      `).join('')}
    </div>`;
  }

  /* ── Public API ── */
  return { init, setType, setMode, syncSlider, syncInput, perform, toggleHistory };

})();
