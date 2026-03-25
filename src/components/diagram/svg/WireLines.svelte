<script>
  import InteractiveElement from '../InteractiveElement.svelte';
  import { circuitState } from '../../../lib/state/circuit.svelte.js';

  const phases = [
    { color: 'var(--phase-a)', wireY: 80 },
    { color: 'var(--phase-b)', wireY: 210 },
    { color: 'var(--phase-c)', wireY: 340 }
  ];

  const lineStartX = 140;
  const lineEndX = 530;
  const zlX = 310; // midpoint for line impedance box

  // Current arrow labels
  const currentLabels = ['Ia', 'Ib', 'Ic'];

  function openLine(i) {
    circuitState.activeModal = { type: 'line', index: i };
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
    <rect x={zlX - 22} y={phase.wireY - 9} width={44} height={18} rx="2"
      fill="none" stroke={phase.color} stroke-width="1.5" class="component-body" opacity="0.8" />
    <text x={zlX} y={phase.wireY + 1} fill={phase.color} font-size="8" text-anchor="middle" dominant-baseline="middle" font-family="var(--font-mono)">Zl</text>
    <circle cx={zlX + 20} cy={phase.wireY - 9} r="3" fill={phase.color} class="value-dot" opacity={circuitState.lineImpedances[i] ? 1 : 0} />
  </InteractiveElement>

  <!-- Wire from Zl to load terminal -->
  <line x1={zlX + 25} y1={phase.wireY} x2={lineEndX} y2={phase.wireY} stroke="var(--svg-wire)" stroke-width="1.5" />

  <!-- Current arrow -->
  <line x1={zlX + 50} y1={phase.wireY - 18} x2={zlX + 75} y2={phase.wireY - 18} stroke={phase.color} stroke-width="1.5" marker-end="url(#arrowhead-{i})" />
  <text x={zlX + 62} y={phase.wireY - 24} fill={phase.color} font-size="10" text-anchor="middle" font-family="var(--font-mono)">{currentLabels[i]}</text>
{/each}

<!-- Arrow markers -->
<defs>
  {#each phases as phase, i}
    <marker id="arrowhead-{i}" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill={phase.color} />
    </marker>
  {/each}
</defs>
