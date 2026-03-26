<script>
  import InteractiveElement from '../InteractiveElement.svelte';
  import { circuitState } from '../../../lib/state/circuit.svelte.js';

  // Compact triangle centered around x=80, between y=70 and y=200
  const tri = {
    a: { x: 80, y: 70 },
    b: { x: 120, y: 200 },
    c: { x: 40, y: 200 },
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

  const wireYs = [70, 200, 330];
  const zsX = 140;
  const lineOutX = 190;

  function openSource(i) { circuitState.activeModal = { type: 'source', index: i }; }
  function openSourceZ(i) { circuitState.activeModal = { type: 'sourceZ', index: i }; }

  function fmtVal(c) {
    if (!c) return '';
    return c.magnitude.toFixed(2) + '\u2220' + c.angle.toFixed(2) + '\u00B0';
  }
</script>

<!-- Triangle edges -->
<line x1={tri.a.x} y1={tri.a.y} x2={tri.b.x} y2={tri.b.y} stroke="var(--svg-wire)" stroke-width="1.5" />
<line x1={tri.b.x} y1={tri.b.y} x2={tri.c.x} y2={tri.c.y} stroke="var(--svg-wire)" stroke-width="1.5" />
<line x1={tri.c.x} y1={tri.c.y} x2={tri.a.x} y2={tri.a.y} stroke="var(--svg-wire)" stroke-width="1.5" />

<!-- Sources on triangle edges -->
{#each sources as src, i}
  {@const isDimmed = circuitState.sourceBalanced && i > 0}
  <InteractiveElement
    hasValue={!!circuitState.sourceVoltages[i]}
    dimmed={isDimmed}
    x={src.x - 18} y={src.y - 18} width={36} height={36}
    onclick={() => openSource(i)}
  >
    <circle cx={src.x} cy={src.y} r="13" fill="var(--bg-primary)" stroke={src.color} stroke-width="2" class="component-body" />
    <text x={src.x} y={src.y + 1} fill={src.color} font-size="12" text-anchor="middle" dominant-baseline="middle">~</text>
  </InteractiveElement>

  <!-- Label outside the triangle -->
  {#if i === 0}
    <text x={src.x + 18} y={src.y - 2} fill={src.color} font-size="12" font-family="var(--font-mono)" font-weight="600">{src.label}</text>
    {#if circuitState.sourceVoltages[i]}
      <text x={src.x + 18} y={src.y + 10} fill={src.color} font-size="8" font-family="var(--font-mono)" opacity="0.7">{fmtVal(circuitState.sourceVoltages[i])}</text>
    {/if}
  {:else if i === 1}
    <text x={src.x} y={src.y + 24} fill={src.color} font-size="12" text-anchor="middle" font-family="var(--font-mono)" font-weight="600" opacity={isDimmed ? 0.3 : 1}>{src.label}</text>
    {#if circuitState.sourceVoltages[i]}
      <text x={src.x} y={src.y + 35} fill={src.color} font-size="8" text-anchor="middle" font-family="var(--font-mono)" opacity={isDimmed ? 0.2 : 0.7}>{fmtVal(circuitState.sourceVoltages[i])}</text>
    {/if}
  {:else}
    <text x={src.x - 18} y={src.y - 2} fill={src.color} font-size="12" text-anchor="end" font-family="var(--font-mono)" font-weight="600" opacity={isDimmed ? 0.3 : 1}>{src.label}</text>
    {#if circuitState.sourceVoltages[i]}
      <text x={src.x - 18} y={src.y + 10} fill={src.color} font-size="8" text-anchor="end" font-family="var(--font-mono)" opacity={isDimmed ? 0.2 : 0.7}>{fmtVal(circuitState.sourceVoltages[i])}</text>
    {/if}
  {/if}
{/each}

<!-- Wire from vertex a → rightward at y=70 -->
<line x1={tri.a.x} y1={tri.a.y} x2={zsX} y2={wireYs[0]} stroke="var(--svg-wire)" stroke-width="1.5" />

<!-- Wire from vertex b → rightward at y=200 -->
<line x1={tri.b.x} y1={wireYs[1]} x2={zsX} y2={wireYs[1]} stroke="var(--svg-wire)" stroke-width="1.5" />

<!-- Wire from vertex c → down to y=330 then rightward -->
<line x1={tri.c.x} y1={tri.c.y} x2={tri.c.x} y2={wireYs[2]} stroke="var(--svg-wire)" stroke-width="1.5" />
<line x1={tri.c.x} y1={wireYs[2]} x2={zsX} y2={wireYs[2]} stroke="var(--svg-wire)" stroke-width="1.5" />

<!-- Zs boxes and output wires for each phase -->
{#each [0, 1, 2] as i}
  {@const color = sources[i].color}
  {@const isDimmed = circuitState.sourceBalanced && i > 0}
  <InteractiveElement
    hasValue={!!circuitState.sourceImpedances[i]}
    dimmed={isDimmed}
    x={zsX} y={wireYs[i] - 9} width={32} height={18}
    onclick={() => openSourceZ(i)}
  >
    <rect x={zsX + 2} y={wireYs[i] - 7} width={26} height={14} rx="2"
      fill="none" stroke={color} stroke-width="1.2" class="component-body" opacity="0.6" />
    <text x={zsX + 15} y={wireYs[i] + 1} fill={color} font-size="8" text-anchor="middle" dominant-baseline="middle" opacity="0.6">Zs</text>
  </InteractiveElement>
  {#if circuitState.sourceImpedances[i]}
    <text x={zsX + 15} y={wireYs[i] + 15} fill={color} font-size="7" text-anchor="middle" font-family="var(--font-mono)" opacity={isDimmed ? 0.2 : 0.5}>{fmtVal(circuitState.sourceImpedances[i])}</text>
  {/if}

  <line x1={zsX + 30} y1={wireYs[i]} x2={lineOutX} y2={wireYs[i]} stroke="var(--svg-wire)" stroke-width="1.5" opacity={isDimmed ? 0.3 : 1} />

  <text x={lineOutX + 4} y={wireYs[i] - 8} fill={color} font-size="12" text-anchor="start" font-weight="600" opacity={isDimmed ? 0.3 : 1}>
    {['a', 'b', 'c'][i]}
  </text>
{/each}
