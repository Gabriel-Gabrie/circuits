<script>
  import { circuitState } from '../../lib/state/circuit.svelte.js';
</script>

<nav class="tabbar">
  <button
    class="tab"
    class:active={circuitState.activeTab === 'diagram'}
    onclick={() => circuitState.activeTab = 'diagram'}
  >
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <!-- circuit: wire path with component box -->
      <path d="M2 12h4" />
      <rect x="6" y="9" width="5" height="6" rx="1" />
      <path d="M11 12h3" />
      <circle cx="17" cy="12" r="3" />
      <path d="M20 12h2" />
      <!-- branch -->
      <path d="M8.5 9V6h8v3M8.5 15v3h8v-3" />
    </svg>
    <span>Circuit</span>
  </button>
  <button
    class="tab"
    class:active={circuitState.activeTab === 'results'}
    onclick={() => circuitState.activeTab = 'results'}
  >
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <!-- hash/number symbol -->
      <path d="M5 9h14M5 15h14M10 4l-2 16M16 4l-2 16" />
    </svg>
    <span>Results</span>
  </button>
</nav>

<style>
  .tabbar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    background: var(--bg-surface);
    border-top: 1px solid var(--border-subtle);
    padding: var(--sp-1) 0;
    padding-bottom: max(var(--sp-1), env(safe-area-inset-bottom));
    z-index: 100;
  }

  .tab {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: var(--sp-1) var(--sp-2);
    color: var(--text-muted);
    font-size: var(--text-xs);
    transition: color var(--transition-fast);
  }

  .tab.active {
    color: var(--accent);
  }

  .tab:hover {
    color: var(--text-secondary);
  }

  @media (min-width: 768px) {
    .tabbar {
      display: none;
    }
  }
</style>
