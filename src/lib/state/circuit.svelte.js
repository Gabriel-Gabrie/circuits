import { Complex } from '../math/complex.js';

/**
 * Global reactive circuit state using Svelte 5 runes.
 */
export const circuitState = $state({
  // Circuit configuration
  config: 'yy',           // 'yy' | 'ydelta' | 'deltay' | 'deltadelta'

  // Balanced toggles
  sourceBalanced: true,
  loadBalanced: true,

  // Phase sequence
  sequence: 'abc',         // 'abc' | 'acb' | 'custom'
  customAngles: [0, -120, 120],  // editable when sequence='custom'

  // Source voltages [phase A, B, C]
  sourceVoltages: [null, null, null],

  // Source internal impedances
  sourceImpedances: [null, null, null],

  // Line impedances
  lineImpedances: [null, null, null],

  // Load impedances
  loadImpedances: [null, null, null],

  // Neutral impedance (Y-Y only)
  neutralImpedance: null,

  // Computed results (null until Calculate pressed)
  results: null,

  // UI state
  activeModal: null,       // { type: 'source'|'sourceZ'|'line'|'load'|'neutral', index: 0|1|2 }
  activeTab: 'diagram',   // 'diagram' | 'results'
});

/**
 * Get the phase angles based on sequence setting.
 */
export function getPhaseAngles(state) {
  switch (state.sequence) {
    case 'abc': return [0, -120, 120];
    case 'acb': return [0, 120, -120];
    case 'custom': return state.customAngles;
    default: return [0, -120, 120];
  }
}

/**
 * Apply balanced auto-fill for source voltages.
 * When source is balanced and index 0 is set, fill 1 and 2 with phase-shifted versions.
 */
export function applySourceBalanced(state, baseValue) {
  if (!baseValue) return;
  const angles = getPhaseAngles(state);
  const mag = baseValue.magnitude;
  const baseAngle = baseValue.angle;
  state.sourceVoltages[0] = baseValue;
  state.sourceVoltages[1] = Complex.fromPhasor(mag, baseAngle + angles[1]);
  state.sourceVoltages[2] = Complex.fromPhasor(mag, baseAngle + angles[2]);
}

/**
 * Apply balanced auto-fill for impedances (source, line, or load).
 * Balanced impedances are identical across all 3 phases.
 */
export function applyBalancedImpedance(array, baseValue) {
  if (!baseValue) return;
  array[0] = baseValue;
  array[1] = baseValue;
  array[2] = baseValue;
}

/**
 * Derived helpers
 */
export function sourceIsY(config) {
  return config === 'yy' || config === 'ydelta';
}

export function loadIsY(config) {
  return config === 'yy' || config === 'deltay';
}

export function hasNeutral(config) {
  return config === 'yy';
}

/**
 * Check if all required inputs are filled.
 */
export function canCalculate(state) {
  for (let i = 0; i < 3; i++) {
    if (!state.sourceVoltages[i]) return false;
    if (!state.loadImpedances[i]) return false;
  }
  return true;
}
