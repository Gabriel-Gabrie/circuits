<script>
  import InteractiveElement from '../InteractiveElement.svelte';
  import { circuitState } from '../../../lib/state/circuit.svelte.js';

  const phases = [
    { label: 'Z_A', color: 'var(--phase-a)', wireY: 80 },
    { label: 'Z_B', color: 'var(--phase-b)', wireY: 210 },
    { label: 'Z_C', color: 'var(--phase-c)', wireY: 340 }
  ];

  const loadX = 560;
  const neutralX = 610;
  const neutralY = 210;

  function openLoad(i) {
    circuitState.activeModal = { type: 'load', index: i };
  }
</script>

<!-- Neutral point -->
<circle cx={neutralX} cy={neutralY} r="3" fill="var(--svg-wire)" />
<text x={neutralX + 12} y={neutralY + 5} fill="var(--text-muted)" font-size="11">N</text>

{#each phases as phase, i}
  <!-- Wire from line to load -->
  <line x1={530} y1={phase.wireY} x2={loadX - 20} y2={phase.wireY} stroke="var(--svg-wire)" stroke-width="1.5" />

  <!-- Terminal label -->
  <text x={530} y={phase.wireY - 10} fill={phase.color} font-size="10" text-anchor="middle" font-weight="500">
    {['A', 'B', 'C'][i]}
  </text>

  <!-- Load impedance box -->
  <InteractiveElement
    hasValue={!!circuitState.loadImpedances[i]}
    x={loadX - 22} y={phase.wireY - 12} width={44} height={24}
    onclick={() => openLoad(i)}
  >
    <rect x={loadX - 18} y={phase.wireY - 9} width={36} height={18} rx="2"
      fill="none" stroke={phase.color} stroke-width="2" class="component-body" />
    <text x={loadX} y={phase.wireY + 1} fill={phase.color} font-size="8" text-anchor="middle" dominant-baseline="middle" font-family="var(--font-mono)">{phase.label}</text>
    <circle cx={loadX + 16} cy={phase.wireY - 9} r="3" fill={phase.color} class="value-dot" opacity={circuitState.loadImpedances[i] ? 1 : 0} />
  </InteractiveElement>

  <!-- Wire from load to neutral -->
  <line x1={loadX + 20} y1={phase.wireY} x2={neutralX} y2={phase.wireY} stroke="var(--svg-wire)" stroke-width="1.5" />
  <line x1={neutralX} y1={phase.wireY} x2={neutralX} y2={neutralY} stroke="var(--svg-wire)" stroke-width="1.5" />
{/each}
