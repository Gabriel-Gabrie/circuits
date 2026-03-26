<script>
  import InteractiveElement from '../InteractiveElement.svelte';
  import { circuitState } from '../../../lib/state/circuit.svelte.js';

  const phases = [
    { label: 'Van', color: 'var(--phase-a)', wireY: 70 },
    { label: 'Vbn', color: 'var(--phase-b)', wireY: 200 },
    { label: 'Vcn', color: 'var(--phase-c)', wireY: 330 }
  ];

  const neutralX = 55;
  const neutralY = 200;
  const srcX = 55;
  const zsStartX = 120;
  const lineOutX = 190;

  function openSource(i) { circuitState.activeModal = { type: 'source', index: i }; }
  function openSourceZ(i) { circuitState.activeModal = { type: 'sourceZ', index: i }; }

  function fmtVal(c) {
    if (!c) return '';
    const r = c.re.toFixed(2);
    const im = Math.abs(c.im).toFixed(2);
    if (Math.abs(c.im) < 0.005) return r;
    if (Math.abs(c.re) < 0.005) return (c.im < 0 ? '-j' : 'j') + im;
    return r + (c.im >= 0 ? '+j' : '-j') + im;
  }
</script>

<!-- Neutral point -->
<circle cx={neutralX} cy={neutralY} r="3" fill="var(--svg-wire)" />
<text x={neutralX} y={neutralY + 18} fill="var(--text-muted)" font-size="12" text-anchor="middle">n</text>

{#each phases as phase, i}
  {@const isDimmed = circuitState.sourceBalanced && i > 0}
  <!-- Wire from neutral to source position -->
  <line x1={neutralX} y1={neutralY} x2={neutralX} y2={phase.wireY} stroke="var(--svg-wire)" stroke-width="1.5" opacity={isDimmed ? 0.3 : 1} />

  <!-- Voltage source circle (on the vertical wire) -->
  <InteractiveElement
    hasValue={!!circuitState.sourceVoltages[i]}
    dimmed={isDimmed}
    x={srcX - 22} y={phase.wireY - 22} width={44} height={44}
    onclick={() => openSource(i)}
  >
    <circle cx={srcX} cy={phase.wireY} r="15" fill="none" stroke={phase.color} stroke-width="2" class="component-body" />
    <text x={srcX} y={phase.wireY + 1} fill={phase.color} font-size="12" text-anchor="middle" dominant-baseline="middle">~</text>
  </InteractiveElement>

  <!-- Source voltage label + value -->
  <text x={srcX - 20} y={phase.wireY - 2} fill={phase.color} font-size="12" text-anchor="end" font-family="var(--font-mono)" font-weight="600" opacity={isDimmed ? 0.3 : 1}>{phase.label}</text>
  {#if circuitState.sourceVoltages[i]}
    <text x={srcX - 20} y={phase.wireY + 12} fill={phase.color} font-size="8" text-anchor="end" font-family="var(--font-mono)" opacity={isDimmed ? 0.2 : 0.7}>{fmtVal(circuitState.sourceVoltages[i])}</text>
  {/if}

  <!-- Wire from source to Zs -->
  <line x1={srcX + 15} y1={phase.wireY} x2={zsStartX} y2={phase.wireY} stroke="var(--svg-wire)" stroke-width="1.5" opacity={isDimmed ? 0.3 : 1} />

  <!-- Source impedance Zs -->
  <InteractiveElement
    hasValue={!!circuitState.sourceImpedances[i]}
    dimmed={isDimmed}
    x={zsStartX} y={phase.wireY - 10} width={40} height={20}
    onclick={() => openSourceZ(i)}
  >
    <rect x={zsStartX + 2} y={phase.wireY - 7} width={28} height={14} rx="2"
      fill="none" stroke={phase.color} stroke-width="1.2" class="component-body" opacity="0.6" />
    <text x={zsStartX + 16} y={phase.wireY + 1} fill={phase.color} font-size="8" text-anchor="middle" dominant-baseline="middle" opacity="0.6">Zs</text>
  </InteractiveElement>
  {#if circuitState.sourceImpedances[i]}
    <text x={zsStartX + 16} y={phase.wireY + 14} fill={phase.color} font-size="7" text-anchor="middle" font-family="var(--font-mono)" opacity={isDimmed ? 0.2 : 0.5}>{fmtVal(circuitState.sourceImpedances[i])}</text>
  {/if}

  <!-- Wire from Zs to line out -->
  <line x1={zsStartX + 32} y1={phase.wireY} x2={lineOutX} y2={phase.wireY} stroke="var(--svg-wire)" stroke-width="1.5" opacity={isDimmed ? 0.3 : 1} />

  <!-- Terminal label -->
  <text x={lineOutX + 4} y={phase.wireY - 8} fill={phase.color} font-size="12" text-anchor="start" font-weight="600" opacity={isDimmed ? 0.3 : 1}>
    {['a', 'b', 'c'][i]}
  </text>
{/each}
