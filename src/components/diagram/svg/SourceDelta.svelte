<script>
  import InteractiveElement from '../InteractiveElement.svelte';
  import { circuitState } from '../../../lib/state/circuit.svelte.js';

  // Reference layout: compact triangle, sources on edges
  // Triangle sits in left portion, vertices connect to horizontal wires
  //
  //        a ─────────────────── (wire a at y=70)
  //       / \
  //    Vca   Vab
  //     /     \
  //    c───────b
  //    |  Vbc  |
  //    c ──────b ────────────── (wire b at y=200)
  //    |
  //    c ─────────────────── (wire c at y=330)

  // Triangle vertices
  const ax = 90, ay = 70;    // top vertex → wire a
  const bx = 120, by = 180;  // right vertex → wire b
  const cx = 50, by2 = 180;  // left vertex → wire c
  // Actually let me make a proper equilateral-ish triangle

  // Compact triangle centered around x=80, between y=70 and y=200
  const tri = {
    a: { x: 80, y: 70 },    // top — connects to wire a (y=70)
    b: { x: 120, y: 200 },  // bottom-right — flush with wire b (y=200)
    c: { x: 40, y: 200 },   // bottom-left — connects to wire c (y=330)
  };

  // Source positions on triangle edges (midpoints)
  const srcAB = { x: (tri.a.x + tri.b.x) / 2 + 8, y: (tri.a.y + tri.b.y) / 2 };
  const srcBC = { x: (tri.b.x + tri.c.x) / 2, y: tri.b.y + 22 };
  const srcCA = { x: (tri.c.x + tri.a.x) / 2 - 8, y: (tri.c.y + tri.a.y) / 2 };

  const sources = [
    { label: 'Vab', color: 'var(--phase-a)', ...srcAB },
    { label: 'Vbc', color: 'var(--phase-b)', ...srcBC },
    { label: 'Vca', color: 'var(--phase-c)', ...srcCA },
  ];

  const wireYs = [70, 200, 330]; // y positions for the 3 horizontal lines
  const zsX = 140;               // Zs box start
  const lineOutX = 190;          // where wires exit to the line

  function openSource(i) { circuitState.activeModal = { type: 'source', index: i }; }
  function openSourceZ(i) { circuitState.activeModal = { type: 'sourceZ', index: i }; }

  function fmtVal(c) {
    if (!c) return '';
    const m = c.magnitude >= 100 ? c.magnitude.toFixed(0) : c.magnitude.toFixed(1);
    const a = c.angle.toFixed(1);
    return m + '\u2220' + a + '\u00B0';
  }
</script>

<!-- Triangle edges -->
<line x1={tri.a.x} y1={tri.a.y} x2={tri.b.x} y2={tri.b.y} stroke="var(--svg-wire)" stroke-width="1.5" />
<line x1={tri.b.x} y1={tri.b.y} x2={tri.c.x} y2={tri.c.y} stroke="var(--svg-wire)" stroke-width="1.5" />
<line x1={tri.c.x} y1={tri.c.y} x2={tri.a.x} y2={tri.a.y} stroke="var(--svg-wire)" stroke-width="1.5" />

<!-- Sources on triangle edges -->
{#each sources as src, i}
  <InteractiveElement
    hasValue={!!circuitState.sourceVoltages[i]}
    x={src.x - 18} y={src.y - 18} width={36} height={36}
    onclick={() => openSource(i)}
  >
    <circle cx={src.x} cy={src.y} r="13" fill="var(--bg-primary)" stroke={src.color} stroke-width="2" class="component-body" />
    <text x={src.x} y={src.y + 1} fill={src.color} font-size="10" text-anchor="middle" dominant-baseline="middle">~</text>
  </InteractiveElement>

  <!-- Label outside the triangle -->
  {#if i === 0}
    <!-- Vab: right of the source -->
    <text x={src.x + 18} y={src.y - 2} fill={src.color} font-size="10" font-family="var(--font-mono)" font-weight="600">{src.label}</text>
    {#if circuitState.sourceVoltages[i]}
      <text x={src.x + 18} y={src.y + 9} fill={src.color} font-size="7" font-family="var(--font-mono)" opacity="0.7">{fmtVal(circuitState.sourceVoltages[i])}</text>
    {/if}
  {:else if i === 1}
    <!-- Vbc: below -->
    <text x={src.x} y={src.y + 24} fill={src.color} font-size="10" text-anchor="middle" font-family="var(--font-mono)" font-weight="600">{src.label}</text>
    {#if circuitState.sourceVoltages[i]}
      <text x={src.x} y={src.y + 34} fill={src.color} font-size="7" text-anchor="middle" font-family="var(--font-mono)" opacity="0.7">{fmtVal(circuitState.sourceVoltages[i])}</text>
    {/if}
  {:else}
    <!-- Vca: left of the source -->
    <text x={src.x - 18} y={src.y - 2} fill={src.color} font-size="10" text-anchor="end" font-family="var(--font-mono)" font-weight="600">{src.label}</text>
    {#if circuitState.sourceVoltages[i]}
      <text x={src.x - 18} y={src.y + 9} fill={src.color} font-size="7" text-anchor="end" font-family="var(--font-mono)" opacity="0.7">{fmtVal(circuitState.sourceVoltages[i])}</text>
    {/if}
  {/if}
{/each}

<!-- Wire from vertex a → rightward at y=70 (already at correct y) -->
<line x1={tri.a.x} y1={tri.a.y} x2={zsX} y2={wireYs[0]} stroke="var(--svg-wire)" stroke-width="1.5" />

<!-- Wire from vertex b → rightward at y=200 (already flush) -->
<line x1={tri.b.x} y1={wireYs[1]} x2={zsX} y2={wireYs[1]} stroke="var(--svg-wire)" stroke-width="1.5" />

<!-- Wire from vertex c → down to y=330 then rightward -->
<line x1={tri.c.x} y1={tri.c.y} x2={tri.c.x} y2={wireYs[2]} stroke="var(--svg-wire)" stroke-width="1.5" />
<line x1={tri.c.x} y1={wireYs[2]} x2={zsX} y2={wireYs[2]} stroke="var(--svg-wire)" stroke-width="1.5" />

<!-- Zs boxes and output wires for each phase -->
{#each [0, 1, 2] as i}
  {@const color = sources[i].color}
  <!-- Zs -->
  <InteractiveElement
    hasValue={!!circuitState.sourceImpedances[i]}
    x={zsX} y={wireYs[i] - 9} width={32} height={18}
    onclick={() => openSourceZ(i)}
  >
    <rect x={zsX + 2} y={wireYs[i] - 7} width={26} height={14} rx="2"
      fill="none" stroke={color} stroke-width="1.2" class="component-body" opacity="0.6" />
    <text x={zsX + 15} y={wireYs[i] + 1} fill={color} font-size="7" text-anchor="middle" dominant-baseline="middle" opacity="0.6">Zs</text>
  </InteractiveElement>
  {#if circuitState.sourceImpedances[i]}
    <text x={zsX + 15} y={wireYs[i] + 15} fill={color} font-size="6" text-anchor="middle" font-family="var(--font-mono)" opacity="0.5">{fmtVal(circuitState.sourceImpedances[i])}</text>
  {/if}

  <!-- Wire out -->
  <line x1={zsX + 30} y1={wireYs[i]} x2={lineOutX} y2={wireYs[i]} stroke="var(--svg-wire)" stroke-width="1.5" />

  <!-- Terminal label -->
  <text x={lineOutX + 4} y={wireYs[i] - 8} fill={color} font-size="10" text-anchor="start" font-weight="600">
    {['a', 'b', 'c'][i]}
  </text>
{/each}
