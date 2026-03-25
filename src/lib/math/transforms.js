/**
 * Y-Delta and Delta-Y impedance transformations.
 */

/**
 * Convert Y-connected impedances to Delta.
 * Za, Zb, Zc are the Y impedances (connected at neutral).
 * Returns { Zab, Zbc, Zca } the Delta impedances.
 */
export function yToDelta(Za, Zb, Zc) {
  // Sum of products: Za*Zb + Zb*Zc + Zc*Za
  const sumProd = Za.mul(Zb).add(Zb.mul(Zc)).add(Zc.mul(Za));
  return {
    Zab: sumProd.div(Zc),
    Zbc: sumProd.div(Za),
    Zca: sumProd.div(Zb)
  };
}

/**
 * Convert Delta-connected impedances to Y.
 * Zab, Zbc, Zca are the Delta impedances.
 * Returns { Za, Zb, Zc } the Y impedances.
 */
export function deltaToY(Zab, Zbc, Zca) {
  const sum = Zab.add(Zbc).add(Zca);
  return {
    Za: Zab.mul(Zca).div(sum),
    Zb: Zab.mul(Zbc).div(sum),
    Zc: Zbc.mul(Zca).div(sum)
  };
}
