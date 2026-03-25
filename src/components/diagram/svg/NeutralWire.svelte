<script>
  import InteractiveElement from '../InteractiveElement.svelte';
  import { circuitState } from '../../../lib/state/circuit.svelte.js';

  // Source neutral at x=100, y=210
  // Load neutral at x=610, y=210
  const srcNeutralX = 100;
  const loadNeutralX = 610;
  const wireY = 390;
  const znX = 355;

  function openNeutral() {
    circuitState.activeModal = { type: 'neutral', index: 0 };
  }
</script>

<!-- Dashed neutral wire running below the circuit -->
<line x1={srcNeutralX} y1={210} x2={srcNeutralX} y2={wireY} stroke="var(--svg-wire)" stroke-width="1" stroke-dasharray="6 4" />
<line x1={srcNeutralX} y1={wireY} x2={znX - 25} y2={wireY} stroke="var(--svg-wire)" stroke-width="1" stroke-dasharray="6 4" />

<!-- Neutral impedance Zn -->
<InteractiveElement
  hasValue={!!circuitState.neutralImpedance}
  x={znX - 22} y={wireY - 12} width={44} height={24}
  onclick={openNeutral}
>
  <rect x={znX - 18} y={wireY - 9} width={36} height={18} rx="2"
    fill="none" stroke="var(--text-muted)" stroke-width="1.5" class="component-body" />
  <text x={znX} y={wireY + 1} fill="var(--text-muted)" font-size="8" text-anchor="middle" dominant-baseline="middle" font-family="var(--font-mono)">Zn</text>
</InteractiveElement>

<line x1={znX + 20} y1={wireY} x2={loadNeutralX} y2={wireY} stroke="var(--svg-wire)" stroke-width="1" stroke-dasharray="6 4" />
<line x1={loadNeutralX} y1={wireY} x2={loadNeutralX} y2={210} stroke="var(--svg-wire)" stroke-width="1" stroke-dasharray="6 4" />

<!-- In label -->
<text x={znX + 35} y={wireY - 14} fill="var(--text-muted)" font-size="10" text-anchor="middle" font-family="var(--font-mono)">In</text>
