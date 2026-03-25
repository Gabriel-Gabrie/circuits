import { Complex } from '../math/complex.js';

/**
 * Parse a string into a Complex number.
 * Supports:
 *   Rectangular: "3+j4", "3 + j4", "3-j4", "-3+j4", "j4", "-j4", "3"
 *   Phasor: "5∠53", "5<53", "5∠-30", "5 < 53.13"
 *   Pure real: "10", "-5.5"
 *   Pure imaginary: "j3", "-j7"
 *
 * @param {string} str
 * @returns {Complex|null} parsed complex number, or null if invalid
 */
export function parseComplex(str) {
  if (!str || typeof str !== 'string') return null;
  str = str.trim().replace(/\s+/g, '');

  if (str === '') return null;

  // Try phasor format: mag∠angle or mag<angle
  const phasorMatch = str.match(/^([+-]?[\d.]+)[∠<]([+-]?[\d.]+)$/);
  if (phasorMatch) {
    const mag = parseFloat(phasorMatch[1]);
    const angle = parseFloat(phasorMatch[2]);
    if (isNaN(mag) || isNaN(angle)) return null;
    return Complex.fromPhasor(mag, angle);
  }

  // Try pure imaginary: "j4", "-j4", "j", "-j"
  const pureImMatch = str.match(/^([+-]?)j([\d.]*)$/);
  if (pureImMatch) {
    const sign = pureImMatch[1] === '-' ? -1 : 1;
    const val = pureImMatch[2] === '' ? 1 : parseFloat(pureImMatch[2]);
    if (isNaN(val)) return null;
    return new Complex(0, sign * val);
  }

  // Try rectangular: "a+jb" or "a-jb"
  const rectMatch = str.match(/^([+-]?[\d.]+)([+-])j([\d.]*)$/);
  if (rectMatch) {
    const re = parseFloat(rectMatch[1]);
    const sign = rectMatch[2] === '-' ? -1 : 1;
    const im = rectMatch[3] === '' ? 1 : parseFloat(rectMatch[3]);
    if (isNaN(re) || isNaN(im)) return null;
    return new Complex(re, sign * im);
  }

  // Try pure real
  const num = parseFloat(str);
  if (!isNaN(num) && str.match(/^[+-]?[\d.]+$/)) {
    return new Complex(num, 0);
  }

  return null;
}
