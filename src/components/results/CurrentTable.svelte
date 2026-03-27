<script>
  import { formatComplex } from '../../lib/utils/format.js';

  let {
    results = null,
    showLineCurrents = $bindable(true),
    showPhaseCurrents = $bindable(false),
    showNeutralCurrent = $bindable(false)
  } = $props();

  const phaseColors = ['var(--phase-a)', 'var(--phase-b)', 'var(--phase-c)'];

  const loadIsY = $derived(results?.config === 'yy' || results?.config === 'deltay');
  const lineLabels = ['Ia', 'Ib', 'Ic'];
  const phaseLabels = $derived(loadIsY ? ['IA', 'IB', 'IC'] : ['IAB', 'IBC', 'ICA']);

  function fmtCurrent(c) {
    if (!c) return '—';
    return `${c.magnitude.toFixed(3)}\u2220${c.angle.toFixed(2)}\u00B0`;
  }
</script>

{#if results}
<div class="table-section">
  <h4 class="section-title">Currents</h4>

  <div class="subsection">
    <div class="sub-header">
      <span class="sub-label">Line Currents</span>
      <label class="phasor-toggle" title="Show on phasor diagram">
        <input type="checkbox" bind:checked={showLineCurrents} />
        <span class="toggle-track"><span class="toggle-thumb"></span></span>
      </label>
    </div>
    {#each results.lineCurrents as c, i}
      <div class="result-row" style="--phase-color: {phaseColors[i]}">
        <span class="qty">{lineLabels[i]}</span>
        <span class="val">{fmtCurrent(c)}</span>
      </div>
    {/each}
  </div>

  {#if !loadIsY}
  <div class="subsection">
    <div class="sub-header">
      <span class="sub-label">Phase Currents</span>
      <label class="phasor-toggle" title="Show on phasor diagram">
        <input type="checkbox" bind:checked={showPhaseCurrents} />
        <span class="toggle-track"><span class="toggle-thumb"></span></span>
      </label>
    </div>
    {#each results.phaseCurrents as c, i}
      <div class="result-row" style="--phase-color: {phaseColors[i]}">
        <span class="qty">{phaseLabels[i]}</span>
        <span class="val">{fmtCurrent(c)}</span>
      </div>
    {/each}
  </div>
  {/if}

  {#if results.neutralCurrent}
  <div class="subsection">
    <div class="sub-header">
      <span class="sub-label">Neutral</span>
      <label class="phasor-toggle" title="Show on phasor diagram">
        <input type="checkbox" bind:checked={showNeutralCurrent} />
        <span class="toggle-track"><span class="toggle-thumb"></span></span>
      </label>
    </div>
    <div class="result-row" style="--phase-color: var(--text-muted)">
      <span class="qty">In</span>
      <span class="val">{fmtCurrent(results.neutralCurrent)}</span>
    </div>
  </div>
  {/if}
</div>
{/if}

<style>
  .table-section {
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
  }

  .section-title {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--text-primary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .subsection {
    display: flex;
    flex-direction: column;
    gap: var(--sp-1);
  }

  .sub-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2px;
  }

  .sub-label {
    font-size: var(--text-xs);
    color: var(--text-muted);
    font-weight: 500;
  }

  .phasor-toggle {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .phasor-toggle input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .toggle-track {
    position: relative;
    width: 28px;
    height: 16px;
    background: var(--border-subtle);
    border-radius: var(--radius-full);
    transition: background 0.2s;
  }

  .phasor-toggle input:checked + .toggle-track {
    background: var(--accent);
  }

  .toggle-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 12px;
    height: 12px;
    background: var(--bg-primary);
    border-radius: var(--radius-full);
    transition: transform 0.2s;
  }

  .phasor-toggle input:checked + .toggle-track .toggle-thumb {
    transform: translateX(12px);
  }

  .result-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--sp-1) var(--sp-2);
    border-left: 3px solid var(--phase-color);
    background: var(--bg-secondary);
    border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  }

  .qty {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--phase-color);
  }

  .val {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--text-primary);
  }
</style>
