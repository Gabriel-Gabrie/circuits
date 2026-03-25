<script>
  import InteractiveElement from '../InteractiveElement.svelte';
  import { circuitState } from '../../../lib/state/circuit.svelte.js';

  // Reference layout: compact triangle, loads on edges
  //
  //  (wire a at y=70)  ────── A
  //                           / \
  //                        ZAB   ZCA
  //                         /     \
  //  (wire b at y=200) ── B───────C ── (wire c at y=330)
  //                          ZBC

  // Triangle vertices — compact, right side of diagram
  const tri = {
    A: { x: 570, y: 70 },    // top → wire a (y=70)
    B: { x: 535, y: 200 },   // bottom-left → wire b (y=200)
    C: { x: 610, y: 200 },   // bottom-right → wire c (y=330)
  };

  // Load positions on triangle edges (midpoints)
  const loads = [
    { label: 'Z_AB', color: 'var(--phase-a)',
      x: (tri.A.x + tri.B.x) / 2 - 10,
      y: (tri.A.y + tri.B.y) / 2 },
    { label: 'Z_BC', color: 'var(--phase-b)',
      x: (tri.B.x + tri.C.x) / 2,
      y: tri.B.y + 18 },
    { label: 'Z_CA', color: 'var(--phase-c)',
      x: (tri.C.x + tri.A.x) / 2 + 10,
      y: (tri.C.y + tri.A.y) / 2 },
  ];

  const wireYs = [70, 200, 330];
  const wireInX = 500; // where line wires end

  function openLoad(i) { circuitState.activeModal = { type: 'load', index: i }; }

  function fmtVal(c) {
    if (!c) return '';
    const m = c.magnitude >= 100 ? c.magnitude.toFixed(0) : c.magnitude.toFixed(1);
    const a = c.angle.toFixed(1);
    return m + '\u2220' + a + '\u00B0';
  }
</script>

<!-- Triangle edges -->
<line x1={tri.A.x} y1={tri.A.y} x2={tri.B.x} y2={tri.B.y} stroke="var(--svg-wire)" stroke-width="1.5" />
<line x1={tri.B.x} y1={tri.B.y} x2={tri.C.x} y2={tri.C.y} stroke="var(--svg-wire)" stroke-width="1.5" />
<line x1={tri.C.x} y1={tri.C.y} x2={tri.A.x} y2={tri.A.y} stroke="var(--svg-wire)" stroke-width="1.5" />

<!-- Load impedances on triangle edges -->
{#each loads as load, i}
  <InteractiveElement
    hasValue={!!circuitState.loadImpedances[i]}
    x={load.x - 20} y={load.y - 10} width={40} height={20}
    onclick={() => openLoad(i)}
  >
    <rect x={load.x - 17} y={load.y - 8} width={34} height={16} rx="2"
      fill="var(--bg-primary)" stroke={load.color} stroke-width="2" class="component-body" />
    <text x={load.x} y={load.y + 1} fill={load.color} font-size="7" text-anchor="middle" dominant-baseline="middle" font-family="var(--font-mono)">{load.label}</text>
  </InteractiveElement>

  <!-- Value label -->
  {#if circuitState.loadImpedances[i]}
    {#if i === 0}
      <text x={load.x - 22} y={load.y + 2} fill={load.color} font-size="6" text-anchor="end" font-family="var(--font-mono)" opacity="0.6">{fmtVal(circuitState.loadImpedances[i])}</text>
    {:else if i === 1}
      <text x={load.x} y={load.y + 18} fill={load.color} font-size="6" text-anchor="middle" font-family="var(--font-mono)" opacity="0.6">{fmtVal(circuitState.loadImpedances[i])}</text>
    {:else}
      <text x={load.x + 22} y={load.y + 2} fill={load.color} font-size="6" text-anchor="start" font-family="var(--font-mono)" opacity="0.6">{fmtVal(circuitState.loadImpedances[i])}</text>
    {/if}
  {/if}
{/each}

<!-- Wires from line to triangle vertices -->
<!-- A: wire a (y=70) → vertex A (already at y=70) -->
<line x1={wireInX} y1={wireYs[0]} x2={tri.A.x} y2={tri.A.y} stroke="var(--svg-wire)" stroke-width="1.5" />
<text x={wireInX + 2} y={wireYs[0] - 10} fill="var(--phase-a)" font-size="10" text-anchor="start" font-weight="600">A</text>

<!-- B: wire b (y=200) → vertex B (at y=200, direct horizontal) -->
<line x1={wireInX} y1={wireYs[1]} x2={tri.B.x} y2={tri.B.y} stroke="var(--svg-wire)" stroke-width="1.5" />
<text x={wireInX + 2} y={wireYs[1] - 10} fill="var(--phase-b)" font-size="10" text-anchor="start" font-weight="600">B</text>

<!-- C: wire c (y=330) → up to vertex C (at y=200) -->
<line x1={wireInX} y1={wireYs[2]} x2={tri.C.x} y2={wireYs[2]} stroke="var(--svg-wire)" stroke-width="1.5" />
<line x1={tri.C.x} y1={wireYs[2]} x2={tri.C.x} y2={tri.C.y} stroke="var(--svg-wire)" stroke-width="1.5" />
<text x={wireInX + 2} y={wireYs[2] - 10} fill="var(--phase-c)" font-size="10" text-anchor="start" font-weight="600">C</text>

<!-- Vertex labels -->
<text x={tri.A.x + 6} y={tri.A.y - 6} fill="var(--text-muted)" font-size="9" font-weight="500">A</text>
<text x={tri.B.x - 10} y={tri.B.y - 6} fill="var(--text-muted)" font-size="9" font-weight="500">B</text>
<text x={tri.C.x + 6} y={tri.C.y - 6} fill="var(--text-muted)" font-size="9" font-weight="500">C</text>
