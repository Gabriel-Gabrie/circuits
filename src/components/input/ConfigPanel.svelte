<script>
  import SegmentedControl from '../shared/SegmentedControl.svelte';
  import { circuitState, getPhaseAngles } from '../../lib/state/circuit.svelte.js';

  const sequenceOptions = [
    { value: 'abc', label: 'Positive (abc)' },
    { value: 'acb', label: 'Negative (acb)' },
    { value: 'custom', label: 'Custom' }
  ];

  const displayAngles = $derived(getPhaseAngles(circuitState));
  const isCustom = $derived(circuitState.sequence === 'custom');

  let activeTooltip = $state(null);

  function toggleTooltip(id) {
    activeTooltip = activeTooltip === id ? null : id;
  }

  function handleSequence(val) {
    circuitState.sequence = val;
  }

  function updateCustomAngle(index, e) {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) {
      circuitState.customAngles[index] = val;
    }
  }
</script>

<div class="config-panel">
  <!-- Balanced questions -->
  <div class="config-row">
    <div class="balanced-group">
      <span class="question">Are the sources balanced?
        <button class="info-btn" onclick={() => toggleTooltip('source')} aria-label="Info">
          <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><circle cx="8" cy="8" r="7.5" fill="none" stroke="currentColor" stroke-width="1"/><text x="8" y="12" text-anchor="middle" font-size="11" font-weight="600">i</text></svg>
        </button>
        {#if activeTooltip === 'source'}
          <span class="info-tooltip">When balanced, all three source voltages have equal magnitude with symmetrical phase shifts. Only phase A needs to be set — B and C are auto-filled.</span>
        {/if}
      </span>
      <div class="yes-no">
        <button
          class="yn-btn" class:active={circuitState.sourceBalanced}
          onclick={() => circuitState.sourceBalanced = true}
        >Yes</button>
        <button
          class="yn-btn" class:active={!circuitState.sourceBalanced}
          onclick={() => circuitState.sourceBalanced = false}
        >No</button>
      </div>
    </div>
    <div class="balanced-group">
      <span class="question">Are the loads balanced?
        <button class="info-btn" onclick={() => toggleTooltip('load')} aria-label="Info">
          <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><circle cx="8" cy="8" r="7.5" fill="none" stroke="currentColor" stroke-width="1"/><text x="8" y="12" text-anchor="middle" font-size="11" font-weight="600">i</text></svg>
        </button>
        {#if activeTooltip === 'load'}
          <span class="info-tooltip">When balanced, all three load impedances are identical. Only one value needs to be set — the others are auto-filled.</span>
        {/if}
      </span>
      <div class="yes-no">
        <button
          class="yn-btn" class:active={circuitState.loadBalanced}
          onclick={() => circuitState.loadBalanced = true}
        >Yes</button>
        <button
          class="yn-btn" class:active={!circuitState.loadBalanced}
          onclick={() => circuitState.loadBalanced = false}
        >No</button>
      </div>
    </div>
  </div>

  <!-- Phase sequence -->
  <div class="config-section">
    <span class="config-label">Phase Sequence
      <button class="info-btn" onclick={() => toggleTooltip('sequence')} aria-label="Info">
        <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><circle cx="8" cy="8" r="7.5" fill="none" stroke="currentColor" stroke-width="1"/><text x="8" y="12" text-anchor="middle" font-size="11" font-weight="600">i</text></svg>
      </button>
      {#if activeTooltip === 'sequence'}
        <span class="info-tooltip">Positive (abc): phases are 120° apart in A-B-C order. Negative (acb): reversed order (A-C-B). Custom: set any phase angles manually.</span>
      {/if}
    </span>
    <SegmentedControl
      options={sequenceOptions}
      selected={circuitState.sequence}
      onchange={handleSequence}
    />
  </div>

  <!-- Always show phase angles -->
  <div class="phase-angles">
    <span class="config-label">Phase Angles</span>
    <div class="angle-fields">
      {#each [['A', 'var(--phase-a)'], ['B', 'var(--phase-b)'], ['C', 'var(--phase-c)']] as [label, color], i}
        <div class="angle-field">
          <label class="angle-label" style="color: {color}">
            Phase {label}
            <input
              type="text"
              inputmode="decimal"
              value={isCustom ? circuitState.customAngles[i] : displayAngles[i]}
              oninput={(e) => updateCustomAngle(i, e)}
              disabled={!isCustom || i === 0}
            />
          </label>
          <span class="angle-unit">{'\u00B0'}</span>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .config-panel {
    background: var(--bg-surface);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-subtle);
    padding: var(--sp-3) var(--sp-4);
    display: flex;
    flex-direction: column;
    gap: var(--sp-4);
  }

  .config-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--sp-4);
  }

  .balanced-group {
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
  }

  .question {
    font-size: var(--text-sm);
    color: var(--text-secondary);
    font-weight: 500;
  }

  .yes-no {
    display: flex;
    gap: 2px;
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
    padding: 3px;
  }

  .yn-btn {
    flex: 1;
    padding: var(--sp-2) var(--sp-3);
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--text-muted);
    border-radius: calc(var(--radius-md) - 2px);
    transition: all var(--transition-fast);
  }

  .yn-btn:hover {
    color: var(--text-secondary);
  }

  .yn-btn.active {
    background: var(--bg-elevated);
    color: var(--accent);
    box-shadow: 0 1px 3px var(--shadow);
  }

  .config-section {
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
  }

  .config-label {
    font-size: var(--text-xs);
    color: var(--text-muted);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .phase-angles {
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
  }

  .angle-fields {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: var(--sp-2);
  }

  .angle-field {
    display: flex;
    align-items: flex-end;
    gap: 2px;
  }

  .angle-label {
    font-size: var(--text-xs);
    font-weight: 600;
    font-family: var(--font-mono);
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
  }

  .angle-unit {
    font-size: var(--text-sm);
    color: var(--text-muted);
    padding-bottom: var(--sp-1);
  }

  .angle-field input {
    font-size: var(--text-sm);
    padding: var(--sp-1) var(--sp-2);
  }

  .angle-field input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .question, .config-label {
    position: relative;
  }

  .info-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    margin-left: 4px;
    padding: 0;
    color: var(--text-muted);
    opacity: 0.6;
    transition: opacity var(--transition-fast);
    cursor: pointer;
    background: none;
    border: none;
  }

  .info-btn:hover {
    opacity: 1;
    color: var(--accent);
  }

  .info-tooltip {
    display: block;
    position: absolute;
    left: 0;
    top: calc(100% + 6px);
    z-index: 50;
    background: var(--bg-elevated);
    color: var(--text-secondary);
    font-size: var(--text-xs);
    font-weight: 400;
    text-transform: none;
    letter-spacing: normal;
    line-height: 1.45;
    padding: var(--sp-2) var(--sp-3);
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
    box-shadow: 0 4px 12px var(--shadow);
    max-width: 260px;
    width: max-content;
  }

  @media (max-width: 480px) {
    .config-row {
      grid-template-columns: 1fr;
      gap: var(--sp-3);
    }
  }
</style>
