const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

export class Complex {
  constructor(re = 0, im = 0) {
    this.re = re;
    this.im = im;
  }

  static fromPhasor(mag, angleDeg) {
    return new Complex(
      mag * Math.cos(angleDeg * DEG),
      mag * Math.sin(angleDeg * DEG)
    );
  }

  static zero() {
    return new Complex(0, 0);
  }

  static one() {
    return new Complex(1, 0);
  }

  get magnitude() {
    return Math.sqrt(this.re * this.re + this.im * this.im);
  }

  get angle() {
    return Math.atan2(this.im, this.re) * RAD;
  }

  add(other) {
    return new Complex(this.re + other.re, this.im + other.im);
  }

  sub(other) {
    return new Complex(this.re - other.re, this.im - other.im);
  }

  mul(other) {
    return new Complex(
      this.re * other.re - this.im * other.im,
      this.re * other.im + this.im * other.re
    );
  }

  div(other) {
    const d = other.re * other.re + other.im * other.im;
    if (d === 0) throw new Error('Division by zero in complex division');
    return new Complex(
      (this.re * other.re + this.im * other.im) / d,
      (this.im * other.re - this.re * other.im) / d
    );
  }

  conjugate() {
    return new Complex(this.re, -this.im);
  }

  negate() {
    return new Complex(-this.re, -this.im);
  }

  reciprocal() {
    const d = this.re * this.re + this.im * this.im;
    if (d === 0) throw new Error('Reciprocal of zero');
    return new Complex(this.re / d, -this.im / d);
  }

  scale(k) {
    return new Complex(this.re * k, this.im * k);
  }

  isZero() {
    return this.re === 0 && this.im === 0;
  }

  toRect(decimals = 4) {
    const r = this.re.toFixed(decimals);
    const i = Math.abs(this.im).toFixed(decimals);
    if (this.im === 0) return `${r}`;
    if (this.re === 0) return this.im > 0 ? `j${i}` : `-j${i}`;
    const sign = this.im > 0 ? '+' : '-';
    return `${r} ${sign} j${i}`;
  }

  toPhasor(decimals = 4) {
    return `${this.magnitude.toFixed(decimals)}\u2220${this.angle.toFixed(decimals)}\u00B0`;
  }

  toString() {
    return this.toPhasor(2);
  }
}

// Convenience: sqrt(3)
export const SQRT3 = Math.sqrt(3);
