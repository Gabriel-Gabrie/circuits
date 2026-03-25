<script>
  import { circuitState } from '../../lib/state/circuit.svelte.js';
</script>

<nav class="tabbar">
  <button
    class="tab"
    class:active={circuitState.activeTab === 'diagram'}
    onclick={() => circuitState.activeTab = 'diagram'}
  >
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18M3 9h6M3 15h6" />
    </svg>
    <span>Circuit</span>
  </button>
  <button
    class="tab"
    class:active={circuitState.activeTab === 'results'}
    onclick={() => circuitState.activeTab = 'results'}
  >
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 20V10M6 20V4M18 20v-6" stroke-linecap="round"/>
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
