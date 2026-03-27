<script>
  import { formatComplex } from '../../lib/utils/format.js';

  let { results = null } = $props();

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
    <span class="sub-label">Line Currents</span>
    {#each results.lineCurrents as c, i}
      <div class="result-row" style="--phase-color: {phaseColors[i]}">
        <span class="qty">{lineLabels[i]}</span>
        <span class="val">{fmtCurrent(c)}</span>
      </div>
    {/each}
  </div>

  {#if !loadIsY}
  <div class="subsection">
    <span class="sub-label">Phase Currents</span>
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
    <span class="sub-label">Neutral</span>
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

  .sub-label {
    font-size: var(--text-xs);
    color: var(--text-muted);
    font-weight: 500;
    margin-bottom: 2px;
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
