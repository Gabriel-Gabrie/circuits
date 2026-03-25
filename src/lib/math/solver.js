import { Complex, SQRT3 } from './complex.js';
import { deltaToY } from './transforms.js';

/**
 * Main circuit solver for all 4 three-phase configurations.
 *
 * @param {object} state - The circuit state
 * @returns {object} Full results object
 */
export function solveCircuit(state) {
  const config = state.config;
  const Vs = state.sourceVoltages.map(v => v || Complex.zero());
  const Zs = state.sourceImpedances.map(z => z || Complex.zero());
  const Zl = state.lineImpedances.map(z => z || Complex.zero());
  const ZL = state.loadImpedances.map(z => z || Complex.zero());
  const Zn = state.neutralImpedance || null;

  // Validate that loads are not zero
  for (let i = 0; i < 3; i++) {
    if (ZL[i].isZero()) {
      throw new Error(`Load impedance ${['A', 'B', 'C'][i]} cannot be zero`);
    }
  }

  let result;
  switch (config) {
    case 'yy':
      result = solveYY(Vs, Zs, Zl, ZL, Zn);
      break;
    case 'ydelta':
      result = solveYDelta(Vs, Zs, Zl, ZL);
      break;
    case 'deltay':
      result = solveDeltaY(Vs, Zs, Zl, ZL, Zn);
      break;
    case 'deltadelta':
      result = solveDeltaDelta(Vs, Zs, Zl, ZL);
      break;
    default:
      throw new Error(`Unknown config: ${config}`);
  }

  return result;
}

/**
 * Y-Y solver using neutral displacement voltage method.
 */
function solveYY(Vs, Zs, Zl, ZL, Zn) {
  // Total impedance per phase: Zs + Zl + ZL
  const Ztot = [
    Zs[0].add(Zl[0]).add(ZL[0]),
    Zs[1].add(Zl[1]).add(ZL[1]),
    Zs[2].add(Zl[2]).add(ZL[2])
  ];

  // Admittances per phase
  const Y = Ztot.map(z => z.reciprocal());

  // Neutral displacement voltage: V_nN = (Σ Vi*Yi + 0) / (Σ Yi + Yn)
  let numerator = Complex.zero();
  let denominator = Complex.zero();
  for (let i = 0; i < 3; i++) {
    numerator = numerator.add(Vs[i].mul(Y[i]));
    denominator = denominator.add(Y[i]);
  }

  // If neutral wire exists, add neutral admittance
  let In = null;
  if (Zn !== null) {
    if (!Zn.isZero()) {
      const Yn = Zn.reciprocal();
      denominator = denominator.add(Yn);
    } else {
      // Zero neutral impedance = solid neutral connection
      // V_nN = 0
      numerator = Complex.zero();
      denominator = Complex.one();
    }
  }

  const VnN = numerator.div(denominator);

  // Line currents
  const Iline = [];
  for (let i = 0; i < 3; i++) {
    Iline[i] = Vs[i].sub(VnN).div(Ztot[i]);
  }

  // Neutral current (sum of line currents, or through Zn)
  In = Iline[0].add(Iline[1]).add(Iline[2]);

  // Source terminal voltages (after Zs drop)
  const Vsrc_terminal = [];
  for (let i = 0; i < 3; i++) {
    Vsrc_terminal[i] = Vs[i].sub(Iline[i].mul(Zs[i]));
  }

  // Load phase voltages
  const VloadPhase = [];
  for (let i = 0; i < 3; i++) {
    VloadPhase[i] = Iline[i].mul(ZL[i]);
  }

  // Line-to-line voltages (source side)
  const VsrcLine = [
    Vs[0].sub(Vs[1]),      // Vab
    Vs[1].sub(Vs[2]),      // Vbc
    Vs[2].sub(Vs[0])       // Vca
  ];

  // Line-to-line voltages (load side)
  const VloadLine = [
    VloadPhase[0].sub(VloadPhase[1]),  // VAB
    VloadPhase[1].sub(VloadPhase[2]),  // VBC
    VloadPhase[2].sub(VloadPhase[0])   // VCA
  ];

  return buildResults({
    config: 'yy',
    sourcePhaseVoltages: Vs,
    sourceLineVoltages: VsrcLine,
    loadPhaseVoltages: VloadPhase,
    loadLineVoltages: VloadLine,
    lineCurrents: Iline,
    phaseCurrents: Iline, // In Y, line current = phase current
    neutralCurrent: In,
    loadImpedances: ZL
  });
}

/**
 * Y-Delta solver: convert delta load to Y, solve as Y-Y, then compute delta currents.
 */
function solveYDelta(Vs, Zs, Zl, ZL_delta) {
  // Convert delta load to equivalent Y
  const { Za, Zb, Zc } = deltaToY(ZL_delta[0], ZL_delta[1], ZL_delta[2]);
  const ZL_y = [Za, Zb, Zc];

  // Solve as Y-Y (no neutral wire in Y-Delta)
  const yyResult = solveYY(Vs, Zs, Zl, ZL_y, null);

  // The line currents from Y-Y solution are correct
  const Iline = yyResult.lineCurrents;

  // Load phase voltages across delta branches = load line voltages
  const VloadLine = yyResult.loadLineVoltages;

  // Delta phase currents: I_phase = V_line / Z_delta
  const Iphase = [
    VloadLine[0].div(ZL_delta[0]),  // IAB = VAB / ZAB
    VloadLine[1].div(ZL_delta[1]),  // IBC = VBC / ZBC
    VloadLine[2].div(ZL_delta[2])   // ICA = VCA / ZCA
  ];

  return buildResults({
    config: 'ydelta',
    sourcePhaseVoltages: Vs,
    sourceLineVoltages: yyResult.sourceLineVoltages,
    loadPhaseVoltages: VloadLine,  // Delta phase voltages = line voltages
    loadLineVoltages: VloadLine,
    lineCurrents: Iline,
    phaseCurrents: Iphase,
    neutralCurrent: null,
    loadImpedances: ZL_delta
  });
}

/**
 * Delta-Y solver: convert delta source to equivalent Y, then solve as Y-Y.
 */
function solveDeltaY(Vs_delta, Zs, Zl, ZL, Zn) {
  // Vs_delta: [Vab, Vbc, Vca] — delta source line voltages
  // Convert to equivalent Y phase voltages: Van = Vab / sqrt(3) ∠ -30°
  const shift = Complex.fromPhasor(1 / SQRT3, -30);
  const Vs_y = [
    Vs_delta[0].mul(shift),  // Van from Vab
    Vs_delta[1].mul(shift),  // Vbn from Vbc
    Vs_delta[2].mul(shift)   // Vcn from Vca
  ];

  // Solve as Y-Y
  const result = solveYY(Vs_y, Zs, Zl, ZL, Zn);

  // Override source voltages to show original delta values
  return buildResults({
    config: 'deltay',
    sourcePhaseVoltages: Vs_delta,  // Show delta source voltages
    sourceLineVoltages: Vs_delta,   // For delta source, phase = line
    loadPhaseVoltages: result.loadPhaseVoltages,
    loadLineVoltages: result.loadLineVoltages,
    lineCurrents: result.lineCurrents,
    phaseCurrents: result.lineCurrents, // Y load: line = phase
    neutralCurrent: result.neutralCurrent,
    loadImpedances: ZL
  });
}

/**
 * Delta-Delta solver: convert both to Y, solve, convert results back.
 */
function solveDeltaDelta(Vs_delta, Zs, Zl, ZL_delta) {
  // Convert delta source to Y
  const shift = Complex.fromPhasor(1 / SQRT3, -30);
  const Vs_y = [
    Vs_delta[0].mul(shift),
    Vs_delta[1].mul(shift),
    Vs_delta[2].mul(shift)
  ];

  // Convert delta load to Y
  const { Za, Zb, Zc } = deltaToY(ZL_delta[0], ZL_delta[1], ZL_delta[2]);
  const ZL_y = [Za, Zb, Zc];

  // Solve as Y-Y (no neutral)
  const yyResult = solveYY(Vs_y, Zs, Zl, ZL_y, null);

  const Iline = yyResult.lineCurrents;
  const VloadLine = yyResult.loadLineVoltages;

  // Delta phase currents
  const Iphase = [
    VloadLine[0].div(ZL_delta[0]),
    VloadLine[1].div(ZL_delta[1]),
    VloadLine[2].div(ZL_delta[2])
  ];

  return buildResults({
    config: 'deltadelta',
    sourcePhaseVoltages: Vs_delta,
    sourceLineVoltages: Vs_delta,
    loadPhaseVoltages: VloadLine,
    loadLineVoltages: VloadLine,
    lineCurrents: Iline,
    phaseCurrents: Iphase,
    neutralCurrent: null,
    loadImpedances: ZL_delta
  });
}

/**
 * Build the standard results object with power calculations.
 */
function buildResults(data) {
  const { lineCurrents, phaseCurrents, loadImpedances } = data;

  // Power per phase: S = V_phase * I_phase*
  // For Y load: S = VloadPhase * Iline* (since Iphase = Iline)
  // For Delta load: S = VloadLine * Iphase*
  const perPhase = [];
  for (let i = 0; i < 3; i++) {
    const V = data.loadPhaseVoltages[i];
    const I = phaseCurrents[i];
    const S = V.mul(I.conjugate());
    const P = S.re;
    const Q = S.im;
    const Smag = S.magnitude;
    const PF = Smag > 0 ? Math.abs(P) / Smag : 1;
    perPhase.push({ S, P, Q, Smag, PF });
  }

  const totalP = perPhase.reduce((sum, p) => sum + p.P, 0);
  const totalQ = perPhase.reduce((sum, p) => sum + p.Q, 0);
  const totalS = Math.sqrt(totalP * totalP + totalQ * totalQ);
  const totalPF = totalS > 0 ? Math.abs(totalP) / totalS : 1;

  return {
    config: data.config,
    sourcePhaseVoltages: data.sourcePhaseVoltages,
    sourceLineVoltages: data.sourceLineVoltages,
    loadPhaseVoltages: data.loadPhaseVoltages,
    loadLineVoltages: data.loadLineVoltages,
    lineCurrents: data.lineCurrents,
    phaseCurrents: data.phaseCurrents,
    neutralCurrent: data.neutralCurrent,
    power: {
      perPhase,
      total: { P: totalP, Q: totalQ, S: totalS, PF: totalPF }
    }
  };
}
