/* ============================================================
   converter.js — Unit conversion & calculation engine
   QuantaConvert | UI-only build
   ============================================================ */

const Converter = (() => {

  /* ── Unit definitions ── */
  const UNITS = {
    LENGTH:      ['m', 'km', 'cm', 'mm', 'ft', 'in', 'yd', 'mi'],
    WEIGHT:      ['kg', 'g', 'mg', 'lb', 'oz', 't'],
    TEMPERATURE: ['°C', '°F', 'K'],
    VOLUME:      ['L', 'mL', 'gal', 'qt', 'pt', 'cup', 'fl oz'],
  };

  /* ── Conversion factors to base unit ──
       LENGTH  → metres
       WEIGHT  → grams
       VOLUME  → litres
       TEMPERATURE is handled separately (non-linear)
  ── */
  const TO_BASE = {
    // Length (base: metre)
    m: 1, km: 1000, cm: 0.01, mm: 0.001,
    ft: 0.3048, in: 0.0254, yd: 0.9144, mi: 1609.344,

    // Weight (base: gram)
    kg: 1000, g: 1, mg: 0.001, lb: 453.592, oz: 28.3495, t: 1e6,

    // Volume (base: litre)
    L: 1, mL: 0.001, gal: 3.78541, qt: 0.946353,
    pt: 0.473176, cup: 0.236588, 'fl oz': 0.0295735,
  };

  /* ── Helpers ── */
  function toBase(value, unit) {
    return value * (TO_BASE[unit] || 1);
  }

  function fromBase(value, unit) {
    return value / (TO_BASE[unit] || 1);
  }

  function round(n, decimals = 4) {
    return parseFloat(n.toFixed(decimals));
  }

  /* ── Temperature conversion ── */
  function convertTemp(value, from, to) {
    // Step 1: convert to Celsius
    let celsius;
    if      (from === '°C') celsius = value;
    else if (from === '°F') celsius = (value - 32) * 5 / 9;
    else                    celsius = value - 273.15;       // Kelvin

    // Step 2: convert Celsius to target
    if      (to === '°C') return celsius;
    else if (to === '°F') return celsius * 9 / 5 + 32;
    else                  return celsius + 273.15;          // Kelvin
  }

  /* ════════════════════════════════════════
     OPERATIONS
  ════════════════════════════════════════ */

  function convert(v1, u1, u2, type) {
    if (type === 'TEMPERATURE') {
      const res = convertTemp(v1, u1, u2);
      return `${v1} ${u1} = ${round(res)} ${u2}`;
    }
    const res = fromBase(toBase(v1, u1), u2);
    return `${v1} ${u1} = ${round(res)} ${u2}`;
  }

  function add(v1, u1, v2, u2, type) {
    if (type === 'TEMPERATURE') throw new Error('Addition is not supported for temperature.');
    const base  = toBase(v1, u1) + toBase(v2, u2);
    const inU1  = fromBase(base, u1);
    return `${v1} ${u1} + ${v2} ${u2} = ${round(inU1)} ${u1}`;
  }

  function subtract(v1, u1, v2, u2, type) {
    if (type === 'TEMPERATURE') throw new Error('Subtraction is not supported for temperature.');
    const base  = toBase(v1, u1) - toBase(v2, u2);
    const inU1  = fromBase(base, u1);
    return `${v1} ${u1} − ${v2} ${u2} = ${round(inU1)} ${u1}`;
  }

  function divide(v1, u1, v2, u2, type) {
    if (type === 'TEMPERATURE') throw new Error('Division is not supported for temperature.');
    if (v2 === 0) throw new Error('Cannot divide by zero.');
    const b1 = toBase(v1, u1);
    const b2 = toBase(v2, u2);
    return `${v1} ${u1} ÷ ${v2} ${u2} = ${round(b1 / b2)} (ratio)`;
  }

  function compare(v1, u1, v2, u2, type) {
    let c1, c2;

    if (type === 'TEMPERATURE') {
      c1 = convertTemp(v1, u1, '°C');
      c2 = convertTemp(v2, u2, '°C');
    } else {
      c1 = toBase(v1, u1);
      c2 = toBase(v2, u2);
    }

    const equal = Math.abs(c1 - c2) < 1e-9;
    if (equal) return `${v1} ${u1} = ${v2} ${u2} (equal)`;

    const greater = c1 > c2;
    const diffBase  = Math.abs(c1 - c2);
    let diffDisplay;

    if (type === 'TEMPERATURE') {
      diffDisplay = `${round(diffBase)}°C`;
    } else {
      diffDisplay = `${round(fromBase(diffBase, u1))} ${u1}`;
    }

    return greater
      ? `${v1} ${u1} > ${v2} ${u2} (by ${diffDisplay})`
      : `${v1} ${u1} < ${v2} ${u2} (by ${diffDisplay})`;
  }

  /* ── Dispatcher ── */
  function calculate(mode, v1, u1, v2, u2, type) {
    switch (mode) {
      case 'convert':  return convert(v1, u1, u2, type);
      case 'add':      return add(v1, u1, v2, u2, type);
      case 'subtract': return subtract(v1, u1, v2, u2, type);
      case 'divide':   return divide(v1, u1, v2, u2, type);
      case 'compare':  return compare(v1, u1, v2, u2, type);
      default: throw new Error(`Unknown mode: ${mode}`);
    }
  }

  /* ── Public API ── */
  return { UNITS, calculate };

})();
