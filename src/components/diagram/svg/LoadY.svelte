<script>
  import InteractiveElement from '../InteractiveElement.svelte';
  import { circuitState } from '../../../lib/state/circuit.svelte.js';

  const phases = [
    { label: 'Z_A', color: 'var(--phase-a)', wireY: 70 },
    { label: 'Z_B', color: 'var(--phase-b)', wireY: 200 },
    { label: 'Z_C', color: 'var(--phase-c)', wireY: 330 }
  ];

  const loadX = 540;
  const neutralX = 600;
  const neutralY = 200;

  function openLoad(i) { circuitState.activeModal = { type: 'load', index: i }; }

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
<text x={neutralX + 10} y={neutralY + 5} fill="var(--text-muted)" font-size="12">N</text>

{#each phases as phase, i}
  {@const isDimmed = circuitState.loadBalanced && i > 0}
  <!-- Wire from line to load -->
  <line x1={500} y1={phase.wireY} x2={loadX - 20} y2={phase.wireY} stroke="var(--svg-wire)" stroke-width="1.5" opacity={isDimmed ? 0.3 : 1} />

  <!-- Terminal label -->
  <text x={502} y={phase.wireY - 10} fill={phase.color} font-size="12" text-anchor="start" font-weight="600" opacity={isDimmed ? 0.3 : 1}>
    {['A', 'B', 'C'][i]}
  </text>

  <!-- Load impedance box -->
  <InteractiveElement
    hasValue={!!circuitState.loadImpedances[i]}
    dimmed={isDimmed}
    x={loadX - 22} y={phase.wireY - 12} width={44} height={24}
    onclick={() => openLoad(i)}
  >
    <rect x={loadX - 18} y={phase.wireY - 8} width={36} height={16} rx="2"
      fill="none" stroke={phase.color} stroke-width="2" class="component-body" />
    <text x={loadX} y={phase.wireY + 1} fill={phase.color} font-size="9" text-anchor="middle" dominant-baseline="middle" font-family="var(--font-mono)">{phase.label}</text>
  </InteractiveElement>
  {#if circuitState.loadImpedances[i]}
    <text x={loadX} y={phase.wireY + 17} fill={phase.color} font-size="8" text-anchor="middle" font-family="var(--font-mono)" opacity={isDimmed ? 0.2 : 0.6}>{fmtVal(circuitState.loadImpedances[i])}</text>
  {/if}

  <!-- Wire from load to neutral -->
  <line x1={loadX + 20} y1={phase.wireY} x2={neutralX} y2={phase.wireY} stroke="var(--svg-wire)" stroke-width="1.5" opacity={isDimmed ? 0.3 : 1} />
  <line x1={neutralX} y1={phase.wireY} x2={neutralX} y2={neutralY} stroke="var(--svg-wire)" stroke-width="1.5" opacity={isDimmed ? 0.3 : 1} />
{/each}
