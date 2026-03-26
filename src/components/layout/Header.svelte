<script>
  import SegmentedControl from '../shared/SegmentedControl.svelte';
  import ThemeToggle from '../shared/ThemeToggle.svelte';
  import InfoModal from './InfoModal.svelte';
  import { circuitState } from '../../lib/state/circuit.svelte.js';

  let showInfo = $state(false);

  const configs = [
    { value: 'yy', label: 'Y-Y' },
    { value: 'ydelta', label: 'Y-\u0394' },
    { value: 'deltay', label: '\u0394-Y' },
    { value: 'deltadelta', label: '\u0394-\u0394' }
  ];

  function handleConfigChange(value) {
    circuitState.config = value;
    circuitState.results = null;
  }
</script>

<header class="header">
  <div class="header-top">
    <h1 class="title">
      <svg class="logo-icon" viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
        <circle cx="16" cy="16" r="14" fill="none" stroke="var(--accent)" stroke-width="2"/>
        <path d="M8 16q4-7 8 0t8 0" fill="none" stroke="var(--accent)" stroke-width="2.2" stroke-linecap="round"/>
      </svg>
      <span class="title-brand">Circuits</span>
      <span class="title-sub">3-Phase AC Analyzer</span>
    </h1>
    <div class="header-actions">
      <ThemeToggle />
      <button class="info-btn" onclick={() => showInfo = true} aria-label="Info">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      </button>
    </div>
  </div>

  {#if showInfo}
    <InfoModal onclose={() => showInfo = false} />
  {/if}
  <SegmentedControl
    options={configs}
    selected={circuitState.config}
    onchange={handleConfigChange}
  />
</header>

<style>
  .header {
    padding: var(--sp-2) var(--sp-4);
    padding-top: calc(var(--sp-1) + env(safe-area-inset-top, 0px));
    display: flex;
    flex-direction: column;
    gap: var(--sp-1);
    border-bottom: 1px solid var(--border-subtle);
    background: var(--bg-surface);
  }

  .header-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .title {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    font-size: var(--text-lg);
    font-weight: 600;
    letter-spacing: -0.02em;
  }

  .title-brand {
    font-family: 'Orbitron', sans-serif;
    font-weight: 700;
    letter-spacing: 0.04em;
  }

  .title-sub {
    font-size: var(--text-xs);
    color: var(--text-muted);
    font-weight: 500;
    letter-spacing: 0;
  }

  .logo-icon {
    flex-shrink: 0;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: var(--sp-1);
  }

  .info-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: var(--radius-sm);
    color: var(--text-secondary);
    transition: color var(--transition-fast), background var(--transition-fast);
  }

  .info-btn:hover {
    color: var(--text-primary);
    background: var(--bg-hover);
  }
</style>
