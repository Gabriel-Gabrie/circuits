<script>
  import SegmentedControl from '../shared/SegmentedControl.svelte';
  import { circuitState } from '../../lib/state/circuit.svelte.js';

  const sequenceOptions = [
    { value: 'abc', label: 'Positive (abc)' },
    { value: 'acb', label: 'Negative (acb)' },
    { value: 'custom', label: 'Custom' }
  ];

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
      <span class="question">Are the sources balanced?</span>
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
      <span class="question">Are the loads balanced?</span>
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
    <span class="config-label">Phase Sequence</span>
    <SegmentedControl
      options={sequenceOptions}
      selected={circuitState.sequence}
      onchange={handleSequence}
    />
  </div>

  {#if circuitState.sequence === 'custom'}
    <div class="custom-angles">
      <span class="config-label">Phase Offsets (degrees from Phase A)</span>
      <div class="angle-fields">
        {#each [['A', 'var(--phase-a)'], ['B', 'var(--phase-b)'], ['C', 'var(--phase-c)']] as [label, color], i}
          <div class="angle-field">
            <label class="angle-label" style="color: {color}">
              Phase {label}
              <input
                type="number"
                step="any"
                value={circuitState.customAngles[i]}
                oninput={(e) => updateCustomAngle(i, e)}
                inputmode="decimal"
                disabled={i === 0}
              />
            </label>
          </div>
        {/each}
      </div>
    </div>
  {/if}
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

  .custom-angles {
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
    flex-direction: column;
    gap: 2px;
  }

  .angle-label {
    font-size: var(--text-xs);
    font-weight: 600;
    font-family: var(--font-mono);
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .angle-field input {
    font-size: var(--text-sm);
    padding: var(--sp-1) var(--sp-2);
  }

  .angle-field input:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    .config-row {
      grid-template-columns: 1fr;
      gap: var(--sp-3);
    }
  }
</style>
