<script>
  import InteractiveElement from '../InteractiveElement.svelte';
  import { circuitState } from '../../../lib/state/circuit.svelte.js';

  // Triangle vertices
  const top = { x: 80, y: 80 };     // vertex a (top)
  const botL = { x: 50, y: 310 };   // vertex c (bottom-left)
  const botR = { x: 110, y: 310 };  // vertex b (bottom-right)

  // Source positions (midpoints of triangle edges)
  const sources = [
    { // Vab: between a and b (right edge)
      label: 'Vab', color: 'var(--phase-a)',
      x: (top.x + botR.x) / 2 + 10,
      y: (top.y + botR.y) / 2,
      wireY: 80  // line out
    },
    { // Vbc: between b and c (bottom edge)
      label: 'Vbc', color: 'var(--phase-b)',
      x: (botR.x + botL.x) / 2,
      y: (botR.y + botL.y) / 2 + 15,
      wireY: 210  // line out
    },
    { // Vca: between c and a (left edge)
      label: 'Vca', color: 'var(--phase-c)',
      x: (botL.x + top.x) / 2 - 10,
      y: (botL.y + top.y) / 2,
      wireY: 340  // line out
    }
  ];

  // Wire-out points
  const wireOutX = 140;
  const wireYs = [80, 210, 340];

  function openSource(i) {
    circuitState.activeModal = { type: 'source', index: i };
  }

  function openSourceZ(i) {
    circuitState.activeModal = { type: 'sourceZ', index: i };
  }
</script>

<!-- Triangle edges -->
<line x1={top.x} y1={top.y} x2={botR.x} y2={botR.y} stroke="var(--svg-wire)" stroke-width="1.5" />
<line x1={botR.x} y1={botR.y} x2={botL.x} y2={botL.y} stroke="var(--svg-wire)" stroke-width="1.5" />
<line x1={botL.x} y1={botL.y} x2={top.x} y2={top.y} stroke="var(--svg-wire)" stroke-width="1.5" />

{#each sources as src, i}
  <!-- Voltage source on triangle edge -->
  <InteractiveElement
    hasValue={!!circuitState.sourceVoltages[i]}
    x={src.x - 22} y={src.y - 22} width={44} height={44}
    onclick={() => openSource(i)}
  >
    <circle cx={src.x} cy={src.y} r="16" fill="var(--bg-primary)" stroke={src.color} stroke-width="2" class="component-body" />
    <text x={src.x} y={src.y + 1} fill={src.color} font-size="9" text-anchor="middle" dominant-baseline="middle" font-weight="500">~</text>
    <circle cx={src.x + 14} cy={src.y - 14} r="3" fill={src.color} class="value-dot" opacity={circuitState.sourceVoltages[i] ? 1 : 0} />
  </InteractiveElement>

  <!-- Label -->
  <text x={src.x + (i === 2 ? -22 : 22)} y={src.y + (i === 1 ? 28 : 5)} fill={src.color} font-size="11" text-anchor={i === 2 ? 'end' : 'start'} font-family="var(--font-mono)">{src.label}</text>
{/each}

<!-- Wires from vertices to line outputs -->
{#each [[top, 0], [botR, 1], [botL, 2]] as [vertex, i]}
  <!-- Horizontal wire from vertex to Zs -->
  <line x1={vertex.x} y1={vertex.y} x2={vertex.x} y2={wireYs[i]} stroke="var(--svg-wire)" stroke-width="1.5" />
  <line x1={vertex.x} y1={wireYs[i]} x2={wireOutX - 50} y2={wireYs[i]} stroke="var(--svg-wire)" stroke-width="1.5" />

  <!-- Source impedance Zs -->
  <InteractiveElement
    hasValue={!!circuitState.sourceImpedances[i]}
    x={wireOutX - 50} y={wireYs[i] - 10} width={36} height={20}
    onclick={() => openSourceZ(i)}
  >
    <rect x={wireOutX - 48} y={wireYs[i] - 8} width={30} height={16} rx="2"
      fill="none" stroke={sources[i].color} stroke-width="1.5" class="component-body" opacity="0.7" />
    <text x={wireOutX - 33} y={wireYs[i] + 2} fill={sources[i].color} font-size="7" text-anchor="middle" dominant-baseline="middle" opacity="0.7">Zs</text>
  </InteractiveElement>

  <line x1={wireOutX - 16} y1={wireYs[i]} x2={wireOutX} y2={wireYs[i]} stroke="var(--svg-wire)" stroke-width="1.5" />

  <!-- Terminal label -->
  <text x={wireOutX} y={wireYs[i] - 10} fill={sources[i].color} font-size="10" text-anchor="middle" font-weight="500">
    {['a', 'b', 'c'][i]}
  </text>
{/each}
