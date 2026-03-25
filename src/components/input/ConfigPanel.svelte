<script>
  import Toggle from '../shared/Toggle.svelte';
  import SegmentedControl from '../shared/SegmentedControl.svelte';
  import { circuitState } from '../../lib/state/circuit.svelte.js';

  const sequenceOptions = [
    { value: 'abc', label: 'abc (+)' },
    { value: 'acb', label: 'acb (-)' },
    { value: 'custom', label: 'Custom' }
  ];

  function handleSourceBalanced(val) {
    circuitState.sourceBalanced = val;
  }

  function handleLoadBalanced(val) {
    circuitState.loadBalanced = val;
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
  <div class="config-row">
    <Toggle label="Source balanced" checked={circuitState.sourceBalanced} onchange={handleSourceBalanced} />
    <Toggle label="Load balanced" checked={circuitState.loadBalanced} onchange={handleLoadBalanced} />
  </div>

  <div class="config-section">
    <span class="config-label">Sequence</span>
    <SegmentedControl
      options={sequenceOptions}
      selected={circuitState.sequence}
      onchange={handleSequence}
      compact
    />
  </div>

  {#if circuitState.sequence === 'custom'}
    <div class="custom-angles">
      <span class="config-label">Phase angles (\u00B0)</span>
      <div class="angle-fields">
        {#each ['A', 'B', 'C'] as label, i}
          <div class="angle-field">
            <label class="angle-label" style="color: var(--phase-{label.toLowerCase()})">{label}
              <input
                type="number"
                step="any"
                value={circuitState.customAngles[i]}
                oninput={(e) => updateCustomAngle(i, e)}
                inputmode="decimal"
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
    gap: var(--sp-3);
  }

  .config-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--sp-4);
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
  }

  .angle-field input {
    font-size: var(--text-sm);
    padding: var(--sp-1) var(--sp-2);
  }
</style>
