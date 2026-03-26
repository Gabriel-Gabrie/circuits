<script>
  import ComplexInput from './ComplexInput.svelte';
  import { circuitState, applySourceBalanced, applyBalancedImpedance, sourceIsY } from '../../lib/state/circuit.svelte.js';

  let complexInput;

  const modal = $derived(circuitState.activeModal);

  const title = $derived.by(() => {
    if (!modal) return '';
    const phaseNames = ['A', 'B', 'C'];
    const isY = sourceIsY(circuitState.config);
    const srcLabels = isY
      ? ['Van', 'Vbn', 'Vcn']
      : ['Vab', 'Vbc', 'Vca'];

    switch (modal.type) {
      case 'source': return `Source Voltage \u2014 ${srcLabels[modal.index]}`;
      case 'sourceZ': return `Source Impedance \u2014 Zs${phaseNames[modal.index]}`;
      case 'line': return `Line Impedance \u2014 Zl${phaseNames[modal.index]}`;
      case 'load': {
        const loadIsYConfig = circuitState.config === 'yy' || circuitState.config === 'deltay';
        const loadLabels = loadIsYConfig
          ? [`Z${phaseNames[0]}`, `Z${phaseNames[1]}`, `Z${phaseNames[2]}`]
          : ['ZAB', 'ZBC', 'ZCA'];
        return `Load Impedance \u2014 ${loadLabels[modal.index]}`;
      }
      case 'neutral': return 'Neutral Impedance \u2014 Zn';
      default: return 'Input';
    }
  });

  const isBalancedModal = $derived.by(() => {
    if (!modal) return false;
    if (modal.type === 'source' || modal.type === 'sourceZ') return circuitState.sourceBalanced;
    if (modal.type === 'load') return circuitState.loadBalanced;
    if (modal.type === 'line') return true;
    return false;
  });

  const currentValue = $derived.by(() => {
    if (!modal) return null;
    switch (modal.type) {
      case 'source': return circuitState.sourceVoltages[modal.index];
      case 'sourceZ': return circuitState.sourceImpedances[modal.index];
      case 'line': return circuitState.lineImpedances[modal.index];
      case 'load': return circuitState.loadImpedances[modal.index];
      case 'neutral': return circuitState.neutralImpedance;
      default: return null;
    }
  });

  function apply() {
    const val = complexInput?.getValue();
    if (!val || !modal) return;

    switch (modal.type) {
      case 'source':
        if (circuitState.sourceBalanced) {
          applySourceBalanced(circuitState, val);
        } else {
          circuitState.sourceVoltages[modal.index] = val;
        }
        break;
      case 'sourceZ':
        if (circuitState.sourceBalanced) {
          applyBalancedImpedance(circuitState.sourceImpedances, val);
        } else {
          circuitState.sourceImpedances[modal.index] = val;
        }
        break;
      case 'line':
        applyBalancedImpedance(circuitState.lineImpedances, val);
        break;
      case 'load':
        if (circuitState.loadBalanced) {
          applyBalancedImpedance(circuitState.loadImpedances, val);
        } else {
          circuitState.loadImpedances[modal.index] = val;
        }
        break;
      case 'neutral':
        circuitState.neutralImpedance = val;
        break;
    }

    circuitState.results = null;
    close();
  }

  function close() {
    circuitState.activeModal = null;
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') close();
    if (e.key === 'Enter') apply();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="modal-overlay" onclick={close}>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="modal-sheet" onclick={(e) => e.stopPropagation()}>
    <div class="modal-header">
      <div>
        <h3 class="modal-title">{title}</h3>
        {#if isBalancedModal}
          <p class="modal-balanced-hint">Balanced \u2014 applies to all phases</p>
        {/if}
      </div>
      <button class="modal-close" onclick={close} aria-label="Close">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>

    <div class="modal-body">
      <ComplexInput bind:this={complexInput} value={currentValue} />
    </div>

    <div class="modal-actions">
      <button class="btn btn-secondary" onclick={close}>Cancel</button>
      <button class="btn btn-primary" onclick={apply}>Apply</button>
    </div>
  </div>
</div>

<style>
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: var(--overlay);
    z-index: 200;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    animation: fadeIn 150ms ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }

  .modal-sheet {
    background: var(--bg-surface);
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    width: 100%;
    max-width: 480px;
    padding: var(--sp-4) var(--sp-4) var(--sp-6);
    animation: slideUp 250ms ease;
    max-height: 85vh;
    overflow-y: auto;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--sp-4);
  }

  .modal-title {
    font-size: var(--text-base);
    font-weight: 600;
    font-family: var(--font-mono);
  }

  .modal-balanced-hint {
    font-size: var(--text-xs);
    color: var(--accent);
    margin-top: 2px;
    font-weight: 500;
  }

  .modal-close {
    color: var(--text-muted);
    padding: var(--sp-1);
    border-radius: var(--radius-sm);
  }

  .modal-close:hover {
    color: var(--text-primary);
    background: var(--bg-hover);
  }

  .modal-body {
    margin-bottom: var(--sp-4);
  }

  .modal-actions {
    display: flex;
    gap: var(--sp-3);
  }

  .btn {
    flex: 1;
    padding: var(--sp-3);
    border-radius: var(--radius-md);
    font-weight: 600;
    font-size: var(--text-sm);
    transition: all var(--transition-fast);
  }

  .btn-secondary {
    background: var(--bg-elevated);
    color: var(--text-secondary);
  }

  .btn-secondary:hover {
    background: var(--bg-hover);
  }

  .btn-primary {
    background: var(--accent);
    color: #fff;
  }

  .btn-primary:hover {
    background: var(--accent-hover);
  }

  @media (min-width: 768px) {
    .modal-overlay {
      align-items: center;
    }

    .modal-sheet {
      border-radius: var(--radius-lg);
      animation: none;
      padding-bottom: var(--sp-4);
    }
  }
</style>
