<script>
  import { formatComplex } from '../../lib/utils/format.js';

  let { results = null } = $props();

  const size = 380;
  const cx = size / 2;
  const cy = size / 2;
  const margin = 50;
  const DEG = Math.PI / 180;

  let tooltip = $state(null);
  let scale = $state(1);
  let panX = $state(0);
  let panY = $state(0);

  // Collect all phasors for scaling
  let phasors = $derived.by(() => {
    if (!results) return [];
    const items = [];
    const phaseColors = ['#ff6b6b', '#4ecdc4', '#ffe66d'];
    const loadIsY = results.config === 'yy' || results.config === 'deltay';

    // Voltage phasors
    const vLabels = loadIsY ? ['VAN', 'VBN', 'VCN'] : ['VAB', 'VBC', 'VCA'];
    results.loadPhaseVoltages.forEach((v, i) => {
      items.push({
        label: vLabels[i],
        magnitude: v.magnitude,
        angle: v.angle,
        color: phaseColors[i],
        type: 'voltage',
        complex: v
      });
    });

    // Current phasors
    const iLabels = ['Ia', 'Ib', 'Ic'];
    results.lineCurrents.forEach((c, i) => {
      items.push({
        label: iLabels[i],
        magnitude: c.magnitude,
        angle: c.angle,
        color: phaseColors[i],
        type: 'current',
        complex: c
      });
    });

    return items;
  });

  // Auto-scale to fit
  let maxMag = $derived.by(() => {
    if (phasors.length === 0) return 1;
    return Math.max(...phasors.map(p => p.magnitude), 0.001);
  });

  let pixelScale = $derived((size / 2 - margin) / maxMag);

  // Grid circles
  let gridCircles = $derived.by(() => {
    const steps = 4;
    const stepMag = maxMag / steps;
    return Array.from({ length: steps }, (_, i) => ({
      r: ((i + 1) * stepMag) * pixelScale,
      label: ((i + 1) * stepMag).toFixed(1)
    }));
  });

  function phasorEnd(p) {
    const r = p.magnitude * pixelScale;
    return {
      x: cx + r * Math.cos(p.angle * DEG),
      y: cy - r * Math.sin(p.angle * DEG) // SVG y is inverted
    };
  }

  function showTooltip(p, event) {
    const end = phasorEnd(p);
    tooltip = {
      label: p.label,
      value: formatComplex(p.complex, 'phasor', 4),
      rect: formatComplex(p.complex, 'rect', 4),
      x: end.x,
      y: end.y
    };
  }

  function hideTooltip() {
    tooltip = null;
  }

  // Zoom handling
  function handleWheel(e) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    scale = Math.max(0.5, Math.min(3, scale * delta));
  }

  // Touch zoom
  let lastTouchDist = $state(0);

  function handleTouchStart(e) {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastTouchDist = Math.sqrt(dx * dx + dy * dy);
    }
  }

  function handleTouchMove(e) {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const delta = dist / lastTouchDist;
      scale = Math.max(0.5, Math.min(3, scale * delta));
      lastTouchDist = dist;
    }
  }

  // Angle labels
  const angleMarkers = [
    { angle: 0, label: '0°' },
    { angle: 90, label: '90°' },
    { angle: 180, label: '±180°' },
    { angle: -90, label: '-90°' }
  ];
</script>

{#if results}
<div class="phasor-container">
  <h4 class="section-title">Phasor Diagram</h4>

  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <svg
    viewBox="0 0 {size} {size}"
    class="phasor-svg"
    onwheel={handleWheel}
    ontouchstart={handleTouchStart}
    ontouchmove={handleTouchMove}
  >
    <g transform="scale({scale}) translate({panX}, {panY})" transform-origin="{cx} {cy}">
      <!-- Grid circles -->
      {#each gridCircles as gc}
        <circle cx={cx} cy={cy} r={gc.r} fill="none" stroke="var(--border-subtle)" stroke-width="0.5" />
        <text x={cx + gc.r + 3} y={cy - 3} fill="var(--text-muted)" font-size="8" font-family="var(--font-mono)">{gc.label}</text>
      {/each}

      <!-- Axes -->
      <line x1={margin - 10} y1={cy} x2={size - margin + 10} y2={cy} stroke="var(--border)" stroke-width="0.5" />
      <line x1={cx} y1={margin - 10} x2={cx} y2={size - margin + 10} stroke="var(--border)" stroke-width="0.5" />

      <!-- Angle labels -->
      {#each angleMarkers as am}
        {@const r = size / 2 - margin + 18}
        {@const ax = cx + r * Math.cos(am.angle * DEG)}
        {@const ay = cy - r * Math.sin(am.angle * DEG)}
        <text x={ax} y={ay + 4} fill="var(--text-muted)" font-size="9" text-anchor="middle" font-family="var(--font-mono)">{am.label}</text>
      {/each}

      <!-- Phasor arrows -->
      {#each phasors as p}
        {@const end = phasorEnd(p)}
        <line
          x1={cx} y1={cy} x2={end.x} y2={end.y}
          stroke={p.color}
          stroke-width={p.type === 'voltage' ? 2 : 1.5}
          stroke-dasharray={p.type === 'current' ? '6 3' : 'none'}
          marker-end="url(#phasor-arrow-{p.label})"
        />
        <!-- Label at tip -->
        {@const labelOffset = 14}
        {@const labelAngle = p.angle * DEG}
        <text
          x={end.x + labelOffset * Math.cos(labelAngle)}
          y={end.y - labelOffset * Math.sin(labelAngle)}
          fill={p.color}
          font-size="10"
          font-weight="600"
          text-anchor="middle"
          font-family="var(--font-mono)"
          class="phasor-label"
          onclick={() => showTooltip(p)}
          onmouseenter={(e) => showTooltip(p, e)}
          onmouseleave={hideTooltip}
          role="button"
          tabindex="0"
          onkeydown={(e) => { if (e.key === 'Enter') showTooltip(p); }}
        >{p.label}</text>

        <!-- Arrow marker -->
        <defs>
          <marker id="phasor-arrow-{p.label}" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill={p.color} />
          </marker>
        </defs>

        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <line
          x1={cx} y1={cy} x2={end.x} y2={end.y}
          stroke="transparent"
          stroke-width="12"
          onclick={() => showTooltip(p)}
          onmouseenter={(e) => showTooltip(p, e)}
          onmouseleave={hideTooltip}
          class="phasor-hit"
        />
      {/each}

      <!-- Tooltip -->
      {#if tooltip}
        {@const tx = Math.min(Math.max(tooltip.x, 60), size - 60)}
        {@const ty = Math.max(tooltip.y - 30, 20)}
        <g class="tooltip-group">
          <rect x={tx - 55} y={ty - 16} width="110" height="34" rx="4"
            fill="var(--bg-elevated)" stroke="var(--border)" stroke-width="1" />
          <text x={tx} y={ty - 2} fill="var(--text-primary)" font-size="9" text-anchor="middle" font-family="var(--font-mono)" font-weight="600">{tooltip.label}: {tooltip.value}</text>
          <text x={tx} y={ty + 11} fill="var(--text-secondary)" font-size="8" text-anchor="middle" font-family="var(--font-mono)">{tooltip.rect}</text>
        </g>
      {/if}
    </g>

    <!-- Legend -->
    <g transform="translate(10, {size - 35})">
      <line x1="0" y1="0" x2="16" y2="0" stroke="var(--text-secondary)" stroke-width="2" />
      <text x="20" y="4" fill="var(--text-muted)" font-size="8">Voltage</text>
      <line x1="65" y1="0" x2="81" y2="0" stroke="var(--text-secondary)" stroke-width="1.5" stroke-dasharray="6 3" />
      <text x="85" y="4" fill="var(--text-muted)" font-size="8">Current</text>
    </g>
  </svg>
</div>
{/if}

<style>
  .phasor-container {
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
  }

  .section-title {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--text-primary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .phasor-svg {
    width: 100%;
    height: auto;
    max-height: 400px;
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-subtle);
    touch-action: none;
  }

  .phasor-label {
    cursor: pointer;
  }

  .phasor-hit {
    cursor: pointer;
  }
</style>
