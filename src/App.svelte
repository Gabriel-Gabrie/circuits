<script>
  import Header from './components/layout/Header.svelte';
  import TabBar from './components/layout/TabBar.svelte';
  import CircuitDiagram from './components/diagram/CircuitDiagram.svelte';
  import ConfigPanel from './components/input/ConfigPanel.svelte';
  import InputModal from './components/input/InputModal.svelte';
  import ResultsPanel from './components/results/ResultsPanel.svelte';
  import { circuitState } from './lib/state/circuit.svelte.js';
  import { solveCircuit } from './lib/math/solver.js';

  let error = $state(null);

  function handleCalculate() {
    error = null;
    try {
      const results = solveCircuit(circuitState);
      circuitState.results = results;
      if (window.innerWidth < 768) {
        circuitState.activeTab = 'results';
      }
    } catch (e) {
      error = e.message;
    }
  }
</script>

<div class="app">
  <Header />

  <main class="main">
    <div class="main-content">
      <div class="diagram-section" class:hidden={circuitState.activeTab === 'results' && window.innerWidth < 768}>
        <CircuitDiagram />
        <ConfigPanel />
        <button class="calculate-btn" onclick={handleCalculate}>
          Calculate
        </button>
        {#if error}
          <div class="error">{error}</div>
        {/if}
      </div>

      <div class="results-section" class:hidden={circuitState.activeTab === 'diagram' && window.innerWidth < 768}>
        <ResultsPanel />
      </div>
    </div>
  </main>

  <TabBar />

  {#if circuitState.activeModal}
    <InputModal />
  {/if}
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
  }

  .main {
    flex: 1;
    padding: var(--sp-4);
    padding-bottom: calc(var(--sp-4) + 60px); /* space for tab bar */
  }

  .main-content {
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }

  .diagram-section {
    display: flex;
    flex-direction: column;
    gap: var(--sp-4);
  }

  .results-section {
    margin-top: var(--sp-4);
  }

  .hidden {
    display: none;
  }

  .calculate-btn {
    width: 100%;
    padding: var(--sp-3) var(--sp-6);
    background: var(--accent);
    color: #fff;
    font-weight: 600;
    font-size: var(--text-base);
    border-radius: var(--radius-md);
    transition: background var(--transition-fast), transform var(--transition-fast);
  }

  .calculate-btn:hover {
    background: var(--accent-hover);
  }

  .calculate-btn:active {
    transform: scale(0.98);
  }

  .error {
    color: var(--error);
    font-size: var(--text-sm);
    text-align: center;
    padding: var(--sp-2);
  }

  @media (min-width: 768px) {
    .main {
      padding-bottom: var(--sp-4);
    }

    .hidden {
      display: flex;
    }
  }
</style>
