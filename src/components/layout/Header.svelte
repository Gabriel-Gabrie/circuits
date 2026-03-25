<script>
  import SegmentedControl from '../shared/SegmentedControl.svelte';
  import ThemeToggle from '../shared/ThemeToggle.svelte';
  import { circuitState } from '../../lib/state/circuit.svelte.js';

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
    <h1 class="title">3\u03C6 Analyzer</h1>
    <ThemeToggle />
  </div>
  <SegmentedControl
    options={configs}
    selected={circuitState.config}
    onchange={handleConfigChange}
  />
</header>

<style>
  .header {
    padding: var(--sp-4);
    padding-bottom: var(--sp-3);
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
    border-bottom: 1px solid var(--border-subtle);
    background: var(--bg-surface);
  }

  .header-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .title {
    font-size: var(--text-lg);
    font-weight: 600;
    letter-spacing: -0.02em;
  }
</style>
