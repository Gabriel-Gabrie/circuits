<script>
  import InteractiveElement from '../InteractiveElement.svelte';
  import { circuitState } from '../../../lib/state/circuit.svelte.js';

  // Triangle vertices (where line wires connect)
  const vA = { x: 580, y: 80 };    // A (top)
  const vB = { x: 550, y: 340 };   // B (bottom-left)
  const vC = { x: 620, y: 340 };   // C (bottom-right)

  // Load positions (midpoints of triangle edges)
  const loads = [
    { // ZAB: between A and B
      label: 'Z_AB', color: 'var(--phase-a)',
      mx: (vA.x + vB.x) / 2 - 5,
      my: (vA.y + vB.y) / 2,
    },
    { // ZBC: between B and C
      label: 'Z_BC', color: 'var(--phase-b)',
      mx: (vB.x + vC.x) / 2,
      my: (vB.y + vC.y) / 2 + 10,
    },
    { // ZCA: between C and A
      label: 'Z_CA', color: 'var(--phase-c)',
      mx: (vC.x + vA.x) / 2 + 5,
      my: (vC.y + vA.y) / 2,
    }
  ];

  const wireInX = 530;
  const wireYs = [80, 210, 340];

  function openLoad(i) {
    circuitState.activeModal = { type: 'load', index: i };
  }
</script>

<!-- Triangle edges -->
<line x1={vA.x} y1={vA.y} x2={vB.x} y2={vB.y} stroke="var(--svg-wire)" stroke-width="1.5" />
<line x1={vB.x} y1={vB.y} x2={vC.x} y2={vC.y} stroke="var(--svg-wire)" stroke-width="1.5" />
<line x1={vC.x} y1={vC.y} x2={vA.x} y2={vA.y} stroke="var(--svg-wire)" stroke-width="1.5" />

{#each loads as load, i}
  <!-- Load impedance on edge -->
  <InteractiveElement
    hasValue={!!circuitState.loadImpedances[i]}
    x={load.mx - 22} y={load.my - 12} width={44} height={24}
    onclick={() => openLoad(i)}
  >
    <rect x={load.mx - 18} y={load.my - 9} width={36} height={18} rx="2"
      fill="var(--bg-primary)" stroke={load.color} stroke-width="2" class="component-body" />
    <text x={load.mx} y={load.my + 1} fill={load.color} font-size="7" text-anchor="middle" dominant-baseline="middle" font-family="var(--font-mono)">{load.label}</text>
    <circle cx={load.mx + 16} cy={load.my - 9} r="3" fill={load.color} class="value-dot" opacity={circuitState.loadImpedances[i] ? 1 : 0} />
  </InteractiveElement>
{/each}

<!-- Wires from line to triangle vertices -->
<!-- A -->
<line x1={wireInX} y1={wireYs[0]} x2={vA.x} y2={vA.y} stroke="var(--svg-wire)" stroke-width="1.5" />
<text x={wireInX} y={wireYs[0] - 10} fill="var(--phase-a)" font-size="10" text-anchor="middle" font-weight="500">A</text>

<!-- B -->
<line x1={wireInX} y1={wireYs[1]} x2={vB.x} y2={wireYs[1]} stroke="var(--svg-wire)" stroke-width="1.5" />
<line x1={vB.x} y1={wireYs[1]} x2={vB.x} y2={vB.y} stroke="var(--svg-wire)" stroke-width="1.5" />
<text x={wireInX} y={wireYs[1] - 10} fill="var(--phase-b)" font-size="10" text-anchor="middle" font-weight="500">B</text>

<!-- C -->
<line x1={wireInX} y1={wireYs[2]} x2={vC.x} y2={wireYs[2]} stroke="var(--svg-wire)" stroke-width="1.5" />
<line x1={vC.x} y1={wireYs[2]} x2={vC.x} y2={vC.y} stroke="var(--svg-wire)" stroke-width="1.5" />
<text x={wireInX} y={wireYs[2] - 10} fill="var(--phase-c)" font-size="10" text-anchor="middle" font-weight="500">C</text>
