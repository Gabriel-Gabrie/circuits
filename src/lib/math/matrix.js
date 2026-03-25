import { Complex } from './complex.js';

/**
 * Solves [A]{x} = {b} for a 3x3 complex linear system
 * using Gaussian elimination with partial pivoting.
 *
 * @param {Complex[][]} A - 3x3 matrix
 * @param {Complex[]} b - 3x1 vector
 * @returns {Complex[]} x - 3x1 solution
 */
export function solveLinearSystem(A, b) {
  const n = 3;

  // Create augmented matrix [A|b] as deep copy
  const aug = [];
  for (let i = 0; i < n; i++) {
    aug[i] = [];
    for (let j = 0; j < n; j++) {
      aug[i][j] = new Complex(A[i][j].re, A[i][j].im);
    }
    aug[i][n] = new Complex(b[i].re, b[i].im);
  }

  // Forward elimination with partial pivoting
  for (let col = 0; col < n; col++) {
    // Find pivot
    let maxMag = aug[col][col].magnitude;
    let pivotRow = col;
    for (let row = col + 1; row < n; row++) {
      const mag = aug[row][col].magnitude;
      if (mag > maxMag) {
        maxMag = mag;
        pivotRow = row;
      }
    }

    if (maxMag < 1e-12) {
      throw new Error('Singular matrix — circuit has no unique solution');
    }

    // Swap rows
    if (pivotRow !== col) {
      [aug[col], aug[pivotRow]] = [aug[pivotRow], aug[col]];
    }

    // Eliminate below
    for (let row = col + 1; row < n; row++) {
      const factor = aug[row][col].div(aug[col][col]);
      for (let j = col; j <= n; j++) {
        aug[row][j] = aug[row][j].sub(factor.mul(aug[col][j]));
      }
    }
  }

  // Back substitution
  const x = [Complex.zero(), Complex.zero(), Complex.zero()];
  for (let i = n - 1; i >= 0; i--) {
    let sum = aug[i][n];
    for (let j = i + 1; j < n; j++) {
      sum = sum.sub(aug[i][j].mul(x[j]));
    }
    x[i] = sum.div(aug[i][i]);
  }

  return x;
}
