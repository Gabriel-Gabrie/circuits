/**
 * Format a Complex number for display.
 * @param {import('../math/complex.js').Complex} c
 * @param {'rect'|'phasor'} mode
 * @param {number} decimals
 */
export function formatComplex(c, mode = 'rect', decimals = 4) {
  if (!c) return '—';
  if (mode === 'phasor') return c.toPhasor(decimals);
  return c.toRect(decimals);
}

/**
 * Format a power value with appropriate unit prefix.
 */
export function formatPower(value, unit = 'W') {
  if (value == null) return '—';
  const abs = Math.abs(value);
  if (abs >= 1e6) return `${(value / 1e6).toFixed(2)} M${unit}`;
  if (abs >= 1e3) return `${(value / 1e3).toFixed(2)} k${unit}`;
  if (abs < 0.01 && abs > 0) return `${(value * 1e3).toFixed(2)} m${unit}`;
  return `${value.toFixed(2)} ${unit}`;
}

/**
 * Format an angle in degrees.
 */
export function formatAngle(deg, decimals = 2) {
  if (deg == null) return '—';
  return `${deg.toFixed(decimals)}\u00B0`;
}
