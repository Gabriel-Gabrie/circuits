<script>
  import VoltageTable from './VoltageTable.svelte';
  import CurrentTable from './CurrentTable.svelte';
  import PowerTable from './PowerTable.svelte';
  import PhasorDiagram from './PhasorDiagram.svelte';
  import { circuitState } from '../../lib/state/circuit.svelte.js';

  // Phasor diagram visibility toggles
  let showSourcePhase = $state(true);
  let showSourceLine = $state(false);
  let showLoadPhase = $state(false);
  let showLoadLine = $state(false);
  let showLineCurrents = $state(true);
  let showPhaseCurrents = $state(false);
  let showNeutralCurrent = $state(false);
</script>

<div class="results-panel">
  {#if circuitState.results}
    <VoltageTable results={circuitState.results}
      bind:showSourcePhase
      bind:showSourceLine
      bind:showLoadPhase
      bind:showLoadLine
    />
    <CurrentTable results={circuitState.results}
      bind:showLineCurrents
      bind:showPhaseCurrents
      bind:showNeutralCurrent
    />
    <PowerTable results={circuitState.results} />
    <PhasorDiagram results={circuitState.results}
      {showSourcePhase}
      {showSourceLine}
      {showLoadPhase}
      {showLoadLine}
      {showLineCurrents}
      {showPhaseCurrents}
      {showNeutralCurrent}
    />
  {:else}
    <div class="empty">
      <p class="empty-text">Enter circuit values and press Calculate to see results.</p>
    </div>
  {/if}
</div>

<style>
  .results-panel {
    display: flex;
    flex-direction: column;
    gap: var(--sp-6);
  }

  .empty {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    background: var(--bg-surface);
    border-radius: var(--radius-md);
    border: 1px dashed var(--border);
  }

  .empty-text {
    color: var(--text-muted);
    font-size: var(--text-sm);
    text-align: center;
    padding: var(--sp-4);
  }
</style>
