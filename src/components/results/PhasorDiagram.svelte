<script>
  import { formatComplex } from '../../lib/utils/format.js';

  let {
    results = null,
    showSourcePhase = true,
    showSourceLine = true,
    showLoadPhase = true,
    showLoadLine = false,
    showLineCurrents = true,
    showPhaseCurrents = false,
    showNeutralCurrent = false
  } = $props();

  const size = 400;
  const cx = size / 2;
  const cy = size / 2;
  const margin = 55;
  const DEG = Math.PI / 180;
  const maxR = size / 2 - margin;

  let tooltip = $state(null);
  let scale = $state(1);

  const colors = ['var(--phase-a)', 'var(--phase-b)', 'var(--phase-c)'];
  const rawColors = ['#ff6b6b', '#4ecdc4', '#ffe66d'];

  let voltagePhasors = $derived.by(() => {
    if (!results) return [];
    const phasors = [];

    const sourceIsY = results.config === 'yy' || results.config === 'ydelta';
    const loadIsY = results.config === 'yy' || results.config === 'deltay';

    const srcPhaseLabels = sourceIsY ? ['Van', 'Vbn', 'Vcn'] : ['Vab', 'Vbc', 'Vca'];
    const srcLineLabels = ['Vab', 'Vbc', 'Vca'];
    const loadPhaseLabels = loadIsY ? ['VAN', 'VBN', 'VCN'] : ['VAB', 'VBC', 'VCA'];
    const loadLineLabels = ['VAB', 'VBC', 'VCA'];

    if (showSourcePhase && results.sourcePhaseVoltages) {
      for (let i = 0; i < results.sourcePhaseVoltages.length; i++) {
        const v = results.sourcePhaseVoltages[i];
        phasors.push({ label: srcPhaseLabels[i], magnitude: v.magnitude, angle: v.angle,
          color: colors[i], rawColor: rawColors[i], type: 'voltage', complex: v });
      }
    }

    if (showSourceLine && sourceIsY && results.sourceLineVoltages) {
      for (let i = 0; i < results.sourceLineVoltages.length; i++) {
        const v = results.sourceLineVoltages[i];
        phasors.push({ label: srcLineLabels[i], magnitude: v.magnitude, angle: v.angle,
          color: colors[i], rawColor: rawColors[i], type: 'voltage', complex: v, dashed: true });
      }
    }

    if (showLoadPhase && results.loadPhaseVoltages) {
      for (let i = 0; i < results.loadPhaseVoltages.length; i++) {
        const v = results.loadPhaseVoltages[i];
        phasors.push({ label: loadPhaseLabels[i], magnitude: v.magnitude, angle: v.angle,
          color: colors[i], rawColor: rawColors[i], type: 'voltage', complex: v });
      }
    }

    if (showLoadLine && loadIsY && results.loadLineVoltages) {
      for (let i = 0; i < results.loadLineVoltages.length; i++) {
        const v = results.loadLineVoltages[i];
        phasors.push({ label: loadLineLabels[i], magnitude: v.magnitude, angle: v.angle,
          color: colors[i], rawColor: rawColors[i], type: 'voltage', complex: v, dashed: true });
      }
    }

    return phasors;
  });

  let currentPhasors = $derived.by(() => {
    if (!results) return [];
    const phasors = [];

    const loadIsY = results.config === 'yy' || results.config === 'deltay';
    const lineLabels = ['Ia', 'Ib', 'Ic'];
    const phaseLabels = loadIsY ? ['IA', 'IB', 'IC'] : ['IAB', 'IBC', 'ICA'];

    if (showLineCurrents && results.lineCurrents) {
      for (let i = 0; i < results.lineCurrents.length; i++) {
        const c = results.lineCurrents[i];
        phasors.push({ label: lineLabels[i], magnitude: c.magnitude, angle: c.angle,
          color: colors[i], rawColor: rawColors[i], type: 'current', complex: c });
      }
    }

    if (showPhaseCurrents && results.phaseCurrents) {
      for (let i = 0; i < results.phaseCurrents.length; i++) {
        const c = results.phaseCurrents[i];
        phasors.push({ label: phaseLabels[i], magnitude: c.magnitude, angle: c.angle,
          color: colors[i], rawColor: rawColors[i], type: 'current', complex: c });
      }
    }

    if (showNeutralCurrent && results.neutralCurrent) {
      const c = results.neutralCurrent;
      phasors.push({ label: 'In', magnitude: c.magnitude, angle: c.angle,
        color: 'var(--text-muted)', rawColor: '#999', type: 'current', complex: c });
    }

    return phasors;
  });

  // Separate scales — guard against empty arrays
  let maxVmag = $derived(voltagePhasors.length > 0 ? Math.max(...voltagePhasors.map(p => p.magnitude)) : 0.001);
  let maxImag = $derived(currentPhasors.length > 0 ? Math.max(...currentPhasors.map(p => p.magnitude)) : 0.001);

  // Voltage uses full radius, current uses 60% radius for clarity
  let vScale = $derived(maxVmag > 0 ? maxR / maxVmag : 1);
  let iScale = $derived(maxImag > 0 ? (maxR * 0.55) / maxImag : 1);

  // Grid circles based on voltage scale
  let gridCircles = $derived.by(() => {
    if (voltagePhasors.length === 0 && currentPhasors.length === 0) return [];
    const refMag = voltagePhasors.length > 0 ? maxVmag : maxImag;
    const refScale = voltagePhasors.length > 0 ? vScale : iScale;
    const steps = 3;
    const stepMag = refMag / steps;
    return Array.from({ length: steps }, (_, i) => ({
      r: ((i + 1) * stepMag) * refScale,
      label: Math.round((i + 1) * stepMag).toString()
    }));
  });

  function phasorEnd(p) {
    const s = p.type === 'voltage' ? vScale : iScale;
    const r = p.magnitude * s;
    return {
      x: cx + r * Math.cos(p.angle * DEG),
      y: cy - r * Math.sin(p.angle * DEG)
    };
  }

  function showTooltipFn(p) {
    const end = phasorEnd(p);
    tooltip = {
      label: p.label,
      value: formatComplex(p.complex, 'phasor', 2),
      rect: formatComplex(p.complex, 'rect', 2),
      x: end.x, y: end.y
    };
  }

  function hideTooltip() { tooltip = null; }

  function handleWheel(e) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    scale = Math.max(0.5, Math.min(3, scale * delta));
  }

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
      scale = Math.max(0.5, Math.min(3, scale * (dist / lastTouchDist)));
      lastTouchDist = dist;
    }
  }

  const angleMarkers = [
    { angle: 0, label: '0°' },
    { angle: 90, label: '90°' },
    { angle: 180, label: '±180°' },
    { angle: -90, label: '-90°' }
  ];

  let allPhasors = $derived([...voltagePhasors, ...currentPhasors]);
  let hasAnyPhasors = $derived(allPhasors.length > 0);
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
    <g transform="scale({scale})" transform-origin="{cx} {cy}">
      <!-- Grid circles -->
      {#each gridCircles as gc}
        <circle cx={cx} cy={cy} r={gc.r} fill="none" stroke="var(--border-subtle)" stroke-width="0.5" />
        <text x={cx + 3} y={cy - gc.r + 10} fill="var(--text-muted)" font-size="8" font-family="var(--font-mono)" opacity="0.6">{gc.label}</text>
      {/each}

      <!-- Axes -->
      <line x1={margin - 15} y1={cy} x2={size - margin + 15} y2={cy} stroke="var(--border)" stroke-width="0.5" />
      <line x1={cx} y1={margin - 15} x2={cx} y2={size - margin + 15} stroke="var(--border)" stroke-width="0.5" />

      <!-- Angle labels -->
      {#each angleMarkers as am}
        {@const r = maxR + 20}
        {@const ax = cx + r * Math.cos(am.angle * DEG)}
        {@const ay = cy - r * Math.sin(am.angle * DEG)}
        <text x={ax} y={ay + 4} fill="var(--text-muted)" font-size="9" text-anchor="middle" font-family="var(--font-mono)">{am.label}</text>
      {/each}

      <!-- Voltage phasors (solid) -->
      {#each voltagePhasors as p}
        {@const end = phasorEnd(p)}
        <line x1={cx} y1={cy} x2={end.x} y2={end.y}
          stroke={p.color} stroke-width="2.5"
          marker-end="url(#phasor-v-{p.label})" />
        {@const lblR = 16}
        {@const la = p.angle * DEG}
        <text
          x={end.x + lblR * Math.cos(la)} y={end.y - lblR * Math.sin(la)}
          fill={p.color} font-size="11" font-weight="700" text-anchor="middle"
          font-family="var(--font-mono)" class="phasor-label"
          onclick={() => showTooltipFn(p)}
          onmouseenter={() => showTooltipFn(p)}
          onmouseleave={hideTooltip}
          role="button" tabindex="0"
          onkeydown={(e) => { if (e.key === 'Enter') showTooltipFn(p); }}
        >{p.label}</text>
        <defs>
          <marker id="phasor-v-{p.label}" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill={p.color} />
          </marker>
        </defs>
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <line x1={cx} y1={cy} x2={end.x} y2={end.y}
          stroke="transparent" stroke-width="14"
          onclick={() => showTooltipFn(p)}
          onmouseenter={() => showTooltipFn(p)}
          onmouseleave={hideTooltip} class="phasor-hit" />
      {/each}

      <!-- Current phasors (dashed, independently scaled) -->
      {#each currentPhasors as p}
        {@const end = phasorEnd(p)}
        <line x1={cx} y1={cy} x2={end.x} y2={end.y}
          stroke={p.color} stroke-width="1.5" stroke-dasharray="8 4"
          marker-end="url(#phasor-i-{p.label})" />
        {@const lblR = 16}
        {@const la = p.angle * DEG}
        <text
          x={end.x + lblR * Math.cos(la)} y={end.y - lblR * Math.sin(la)}
          fill={p.color} font-size="10" font-weight="600" text-anchor="middle"
          font-family="var(--font-mono)" class="phasor-label" font-style="italic"
          onclick={() => showTooltipFn(p)}
          onmouseenter={() => showTooltipFn(p)}
          onmouseleave={hideTooltip}
          role="button" tabindex="0"
          onkeydown={(e) => { if (e.key === 'Enter') showTooltipFn(p); }}
        >{p.label}</text>
        <defs>
          <marker id="phasor-i-{p.label}" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill={p.color} />
          </marker>
        </defs>
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <line x1={cx} y1={cy} x2={end.x} y2={end.y}
          stroke="transparent" stroke-width="14"
          onclick={() => showTooltipFn(p)}
          onmouseenter={() => showTooltipFn(p)}
          onmouseleave={hideTooltip} class="phasor-hit" />
      {/each}

      <!-- Empty state hint -->
      {#if !hasAnyPhasors}
        <text x={cx} y={cy} fill="var(--text-muted)" font-size="11" text-anchor="middle" font-family="var(--font-mono)">Toggle sections above to display phasors</text>
      {/if}

      <!-- Tooltip -->
      {#if tooltip}
        {@const tx = Math.min(Math.max(tooltip.x, 70), size - 70)}
        {@const ty = Math.max(tooltip.y - 35, 25)}
        <g>
          <rect x={tx - 60} y={ty - 18} width="120" height="38" rx="6"
            fill="var(--bg-elevated)" stroke="var(--border)" stroke-width="1" />
          <text x={tx} y={ty - 3} fill="var(--text-primary)" font-size="9" text-anchor="middle" font-family="var(--font-mono)" font-weight="600">{tooltip.label}: {tooltip.value}</text>
          <text x={tx} y={ty + 12} fill="var(--text-secondary)" font-size="8" text-anchor="middle" font-family="var(--font-mono)">{tooltip.rect}</text>
        </g>
      {/if}
    </g>

    <!-- Legend -->
    {#if hasAnyPhasors}
    <g transform="translate(12, {size - 30})">
      {#if voltagePhasors.length > 0}
        <line x1="0" y1="0" x2="18" y2="0" stroke="var(--text-secondary)" stroke-width="2.5" />
        <text x="22" y="4" fill="var(--text-muted)" font-size="9">Voltage</text>
      {/if}
      {#if currentPhasors.length > 0}
        {@const offset = voltagePhasors.length > 0 ? 80 : 0}
        <line x1={offset} y1="0" x2={offset + 18} y2="0" stroke="var(--text-secondary)" stroke-width="1.5" stroke-dasharray="8 4" />
        <text x={offset + 22} y="4" fill="var(--text-muted)" font-size="9">Current (scaled)</text>
      {/if}
    </g>
    {/if}
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
    max-height: 420px;
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-subtle);
    touch-action: none;
  }

  .phasor-label { cursor: pointer; }
  .phasor-hit { cursor: pointer; }
</style>
