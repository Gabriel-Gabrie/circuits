<script>
  import InteractiveElement from '../InteractiveElement.svelte';
  import { circuitState } from '../../../lib/state/circuit.svelte.js';

  const srcNeutralX = 55;
  const loadNeutralX = 600;
  const wireY = 385;
  const znX = 320;

  function openNeutral() { circuitState.activeModal = { type: 'neutral', index: 0 }; }

  function fmtVal(c) {
    if (!c) return '';
    const r = c.re.toFixed(2);
    const im = Math.abs(c.im).toFixed(2);
    if (Math.abs(c.im) < 0.005) return r;
    if (Math.abs(c.re) < 0.005) return (c.im < 0 ? '-j' : 'j') + im;
    return r + (c.im >= 0 ? '+j' : '-j') + im;
  }
</script>

<!-- Dashed neutral wire running below the circuit -->
<line x1={srcNeutralX} y1={200} x2={srcNeutralX} y2={wireY} stroke="var(--svg-wire)" stroke-width="1" stroke-dasharray="6 4" />
<line x1={srcNeutralX} y1={wireY} x2={znX - 22} y2={wireY} stroke="var(--svg-wire)" stroke-width="1" stroke-dasharray="6 4" />

<!-- Neutral impedance Zn -->
<InteractiveElement
  hasValue={!!circuitState.neutralImpedance}
  x={znX - 20} y={wireY - 10} width={40} height={20}
  onclick={openNeutral}
>
  <rect x={znX - 16} y={wireY - 7} width={32} height={14} rx="2"
    fill="none" stroke="var(--text-muted)" stroke-width="1.5" class="component-body" />
  <text x={znX} y={wireY + 1} fill="var(--text-muted)" font-size="9" text-anchor="middle" dominant-baseline="middle" font-family="var(--font-mono)">Zn</text>
</InteractiveElement>
{#if circuitState.neutralImpedance}
  <text x={znX} y={wireY + 16} fill="var(--text-muted)" font-size="8" text-anchor="middle" font-family="var(--font-mono)" opacity="0.6">{fmtVal(circuitState.neutralImpedance)}</text>
{/if}

<line x1={znX + 18} y1={wireY} x2={loadNeutralX} y2={wireY} stroke="var(--svg-wire)" stroke-width="1" stroke-dasharray="6 4" />
<line x1={loadNeutralX} y1={wireY} x2={loadNeutralX} y2={200} stroke="var(--svg-wire)" stroke-width="1" stroke-dasharray="6 4" />

<!-- In label -->
<text x={znX + 35} y={wireY - 12} fill="var(--text-muted)" font-size="12" text-anchor="middle" font-family="var(--font-mono)">In</text>
