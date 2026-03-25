<script>
  import { formatComplex } from '../../lib/utils/format.js';

  let { results = null } = $props();

  const phaseColors = ['var(--phase-a)', 'var(--phase-b)', 'var(--phase-c)'];

  const sourceIsY = $derived(results?.config === 'yy' || results?.config === 'ydelta');
  const loadIsY = $derived(results?.config === 'yy' || results?.config === 'deltay');

  const srcPhaseLabels = $derived(sourceIsY ? ['Van', 'Vbn', 'Vcn'] : ['Vab', 'Vbc', 'Vca']);
  const srcLineLabels = ['Vab', 'Vbc', 'Vca'];
  const loadPhaseLabels = $derived(loadIsY ? ['VAN', 'VBN', 'VCN'] : ['VAB', 'VBC', 'VCA']);
  const loadLineLabels = ['VAB', 'VBC', 'VCA'];
</script>

{#if results}
<div class="table-section">
  <h4 class="section-title">Voltages</h4>

  <div class="subsection">
    <span class="sub-label">Source Phase</span>
    {#each results.sourcePhaseVoltages as v, i}
      <div class="result-row" style="--phase-color: {phaseColors[i]}">
        <span class="qty">{srcPhaseLabels[i]}</span>
        <span class="val">{formatComplex(v, 'phasor', 4)}</span>
      </div>
    {/each}
  </div>

  {#if sourceIsY}
  <div class="subsection">
    <span class="sub-label">Source Line</span>
    {#each results.sourceLineVoltages as v, i}
      <div class="result-row" style="--phase-color: {phaseColors[i]}">
        <span class="qty">{srcLineLabels[i]}</span>
        <span class="val">{formatComplex(v, 'phasor', 4)}</span>
      </div>
    {/each}
  </div>
  {/if}

  <div class="subsection">
    <span class="sub-label">Load Phase</span>
    {#each results.loadPhaseVoltages as v, i}
      <div class="result-row" style="--phase-color: {phaseColors[i]}">
        <span class="qty">{loadPhaseLabels[i]}</span>
        <span class="val">{formatComplex(v, 'phasor', 4)}</span>
      </div>
    {/each}
  </div>

  {#if loadIsY}
  <div class="subsection">
    <span class="sub-label">Load Line</span>
    {#each results.loadLineVoltages as v, i}
      <div class="result-row" style="--phase-color: {phaseColors[i]}">
        <span class="qty">{loadLineLabels[i]}</span>
        <span class="val">{formatComplex(v, 'phasor', 4)}</span>
      </div>
    {/each}
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
