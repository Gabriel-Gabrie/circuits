<script>
  import InteractiveElement from '../InteractiveElement.svelte';
  import { circuitState } from '../../../lib/state/circuit.svelte.js';

  const phases = [
    { color: 'var(--phase-a)', wireY: 70 },
    { color: 'var(--phase-b)', wireY: 200 },
    { color: 'var(--phase-c)', wireY: 330 }
  ];

  const lineStartX = 190;
  const lineEndX = 500;
  const zlX = 330;

  const currentLabels = ['Ia', 'Ib', 'Ic'];

  function openLine(i) { circuitState.activeModal = { type: 'line', index: i }; }

  function fmtVal(c) {
    if (!c) return '';
    const r = Math.abs(c.re) >= 100 ? c.re.toFixed(0) : c.re.toFixed(1);
    const im = Math.abs(c.im) >= 100 ? Math.abs(c.im).toFixed(0) : Math.abs(c.im).toFixed(1);
    if (Math.abs(c.im) < 0.05) return r;
    if (Math.abs(c.re) < 0.05) return (c.im < 0 ? '-j' : 'j') + im;
    return r + (c.im >= 0 ? '+j' : '-j') + im;
  }
</script>

{#each phases as phase, i}
  <!-- Wire from source terminal to Zl -->
  <line x1={lineStartX} y1={phase.wireY} x2={zlX - 25} y2={phase.wireY} stroke="var(--svg-wire)" stroke-width="1.5" />

  <!-- Line impedance Zl -->
  <InteractiveElement
    hasValue={!!circuitState.lineImpedances[i]}
    x={zlX - 25} y={phase.wireY - 12} width={50} height={24}
    onclick={() => openLine(i)}
  >
    <rect x={zlX - 22} y={phase.wireY - 8} width={44} height={16} rx="2"
      fill="none" stroke={phase.color} stroke-width="1.5" class="component-body" opacity="0.8" />
    <text x={zlX} y={phase.wireY + 1} fill={phase.color} font-size="8" text-anchor="middle" dominant-baseline="middle" font-family="var(--font-mono)">Zl</text>
  </InteractiveElement>
  {#if circuitState.lineImpedances[i]}
    <text x={zlX} y={phase.wireY + 16} fill={phase.color} font-size="6" text-anchor="middle" font-family="var(--font-mono)" opacity="0.6">{fmtVal(circuitState.lineImpedances[i])}</text>
  {/if}

  <!-- Wire from Zl to load terminal -->
  <line x1={zlX + 24} y1={phase.wireY} x2={lineEndX} y2={phase.wireY} stroke="var(--svg-wire)" stroke-width="1.5" />

  <!-- Current arrow -->
  {@const arrowX = zlX + 45}
  <line x1={arrowX} y1={phase.wireY - 16} x2={arrowX + 25} y2={phase.wireY - 16} stroke={phase.color} stroke-width="1.5" marker-end="url(#arrowhead-{i})" />
  <text x={arrowX + 12} y={phase.wireY - 22} fill={phase.color} font-size="10" text-anchor="middle" font-family="var(--font-mono)" font-weight="500">{currentLabels[i]}</text>
{/each}

<!-- Arrow markers -->
<defs>
  {#each phases as phase, i}
    <marker id="arrowhead-{i}" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill={phase.color} />
    </marker>
  {/each}
</defs>
