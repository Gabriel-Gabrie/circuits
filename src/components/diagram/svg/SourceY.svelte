<script>
  import InteractiveElement from '../InteractiveElement.svelte';
  import { circuitState } from '../../../lib/state/circuit.svelte.js';

  const phases = [
    { label: 'Van', color: 'var(--phase-a)', wireY: 80 },
    { label: 'Vbn', color: 'var(--phase-b)', wireY: 210 },
    { label: 'Vcn', color: 'var(--phase-c)', wireY: 340 }
  ];

  const neutralX = 100;
  const neutralY = 210;
  const srcX = 60;

  function openSource(i) {
    circuitState.activeModal = { type: 'source', index: i };
  }

  function openSourceZ(i) {
    circuitState.activeModal = { type: 'sourceZ', index: i };
  }
</script>

<!-- Neutral point -->
<circle cx={neutralX} cy={neutralY} r="3" fill="var(--svg-wire)" />
<text x={neutralX - 5} y={neutralY + 18} fill="var(--text-muted)" font-size="11" text-anchor="end">n</text>

{#each phases as phase, i}
  <!-- Wire from neutral to source -->
  <line x1={neutralX} y1={neutralY} x2={neutralX} y2={phase.wireY} stroke="var(--svg-wire)" stroke-width="1.5" />
  <line x1={neutralX} y1={phase.wireY} x2={srcX} y2={phase.wireY} stroke="var(--svg-wire)" stroke-width="1.5" />

  <!-- Voltage source circle -->
  <InteractiveElement
    hasValue={!!circuitState.sourceVoltages[i]}
    x={srcX - 22} y={phase.wireY - 22} width={44} height={44}
    onclick={() => openSource(i)}
  >
    <circle cx={srcX} cy={phase.wireY} r="16" fill="none" stroke={phase.color} stroke-width="2" class="component-body" />
    <text x={srcX} y={phase.wireY + 1} fill={phase.color} font-size="9" text-anchor="middle" dominant-baseline="middle" font-weight="500">~</text>
    <!-- Value indicator dot -->
    <circle cx={srcX + 14} cy={phase.wireY - 14} r="3" fill={phase.color} class="value-dot" opacity={circuitState.sourceVoltages[i] ? 1 : 0} />
  </InteractiveElement>

  <!-- Label -->
  <text x={srcX - 22} y={phase.wireY + 5} fill={phase.color} font-size="11" text-anchor="end" font-family="var(--font-mono)">{phase.label}</text>

  <!-- Wire from source to Zs position -->
  <line x1={srcX} y1={phase.wireY} x2={srcX + 32} y2={phase.wireY} stroke="var(--svg-wire)" stroke-width="1.5" />

  <!-- Source impedance Zs -->
  <InteractiveElement
    hasValue={!!circuitState.sourceImpedances[i]}
    x={srcX + 32} y={phase.wireY - 10} width={36} height={20}
    onclick={() => openSourceZ(i)}
  >
    <rect x={srcX + 34} y={phase.wireY - 8} width={30} height={16} rx="2"
      fill="none" stroke={phase.color} stroke-width="1.5" class="component-body" opacity="0.7" />
    <text x={srcX + 49} y={phase.wireY + 2} fill={phase.color} font-size="7" text-anchor="middle" dominant-baseline="middle" opacity="0.7">Zs</text>
  </InteractiveElement>

  <!-- Wire from Zs to line out -->
  <line x1={srcX + 66} y1={phase.wireY} x2={140} y2={phase.wireY} stroke="var(--svg-wire)" stroke-width="1.5" />

  <!-- Terminal label -->
  <text x={140} y={phase.wireY - 10} fill={phase.color} font-size="10" text-anchor="middle" font-weight="500">
    {['a', 'b', 'c'][i]}
  </text>
{/each}
