<script>
  import { formatPower } from '../../lib/utils/format.js';

  let { results = null } = $props();

  const phaseColors = ['var(--phase-a)', 'var(--phase-b)', 'var(--phase-c)'];
  const phaseLabels = ['A', 'B', 'C'];
</script>

{#if results}
<div class="table-section">
  <h4 class="section-title">Power</h4>

  <div class="subsection">
    <span class="sub-label">Per Phase</span>
    {#each results.power.perPhase as p, i}
      <div class="power-card" style="--phase-color: {phaseColors[i]}">
        <span class="phase-label">Phase {phaseLabels[i]}</span>
        <div class="power-values">
          <div class="power-item">
            <span class="power-key">P</span>
            <span class="power-val">{formatPower(p.P, 'W')}</span>
          </div>
          <div class="power-item">
            <span class="power-key">Q</span>
            <span class="power-val">{formatPower(p.Q, 'VAR')}</span>
          </div>
          <div class="power-item">
            <span class="power-key">S</span>
            <span class="power-val">{formatPower(p.Smag, 'VA')}</span>
          </div>
          <div class="power-item">
            <span class="power-key">PF</span>
            <span class="power-val">{p.PF.toFixed(2)}</span>
          </div>
        </div>
      </div>
    {/each}
  </div>

  <div class="subsection">
    <span class="sub-label">Total</span>
    <div class="power-card total">
      <div class="power-values">
        <div class="power-item">
          <span class="power-key">P</span>
          <span class="power-val">{formatPower(results.power.total.P, 'W')}</span>
        </div>
        <div class="power-item">
          <span class="power-key">Q</span>
          <span class="power-val">{formatPower(results.power.total.Q, 'VAR')}</span>
        </div>
        <div class="power-item">
          <span class="power-key">S</span>
          <span class="power-val">{formatPower(results.power.total.S, 'VA')}</span>
        </div>
        <div class="power-item">
          <span class="power-key">PF</span>
          <span class="power-val">{results.power.total.PF.toFixed(2)}</span>
        </div>
      </div>
    </div>
  </div>
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
    gap: var(--sp-2);
  }

  .sub-label {
    font-size: var(--text-xs);
    color: var(--text-muted);
    font-weight: 500;
  }

  .power-card {
    background: var(--bg-secondary);
    border-left: 3px solid var(--phase-color, var(--accent));
    border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
    padding: var(--sp-2) var(--sp-3);
  }

  .power-card.total {
    border-left-color: var(--accent);
  }

  .phase-label {
    font-size: var(--text-xs);
    font-weight: 600;
    color: var(--phase-color);
    font-family: var(--font-mono);
    margin-bottom: var(--sp-1);
    display: block;
  }

  .power-values {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--sp-1) var(--sp-4);
  }

  .power-item {
    display: flex;
    justify-content: space-between;
    gap: var(--sp-2);
  }

  .power-key {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    font-weight: 600;
    color: var(--text-muted);
  }

  .power-val {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--text-primary);
    text-align: right;
  }
</style>
