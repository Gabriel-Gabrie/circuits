<script>
  import SourceY from './svg/SourceY.svelte';
  import SourceDelta from './svg/SourceDelta.svelte';
  import LoadY from './svg/LoadY.svelte';
  import LoadDelta from './svg/LoadDelta.svelte';
  import WireLines from './svg/WireLines.svelte';
  import NeutralWire from './svg/NeutralWire.svelte';
  import { circuitState, sourceIsY, loadIsY, hasNeutral } from '../../lib/state/circuit.svelte.js';

  let isSourceY = $derived(sourceIsY(circuitState.config));
  let isLoadY = $derived(loadIsY(circuitState.config));
  let showNeutral = $derived(hasNeutral(circuitState.config));

  let showScrollHint = $state(true);

  function handleScroll(e) {
    if (e.target.scrollLeft > 10) {
      showScrollHint = false;
    }
  }
</script>

<div class="diagram-container" class:show-hint={showScrollHint} onscroll={handleScroll}>
  <svg viewBox="-50 0 700 {showNeutral ? 410 : 360}" class="circuit-svg" xmlns="http://www.w3.org/2000/svg">
    <!-- Source side -->
    {#if isSourceY}
      <SourceY />
    {:else}
      <SourceDelta />
    {/if}

    <!-- Line wires with impedances -->
    <WireLines />

    <!-- Load side -->
    {#if isLoadY}
      <LoadY />
    {:else}
      <LoadDelta />
    {/if}

    <!-- Neutral wire (Y-Y only) -->
    {#if showNeutral}
      <NeutralWire />
    {/if}
  </svg>
  {#if showScrollHint}
    <div class="scroll-hint">
      <span class="scroll-arrow">&rsaquo;</span>
    </div>
  {/if}
</div>

<style>
  .diagram-container {
    position: relative;
    background: var(--bg-surface);
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-subtle);
    padding: var(--sp-3);
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
  }

  .circuit-svg {
    min-width: 700px;
    height: auto;
  }

  .scroll-hint {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 36px;
    background: linear-gradient(to right, transparent, var(--bg-surface) 70%);
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    animation: pulse-hint 1.5s ease-in-out infinite;
  }

  .scroll-arrow {
    font-size: 24px;
    color: var(--text-secondary);
    font-weight: 700;
  }

  :global([data-theme="dark"]) .scroll-hint {
    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.08) 70%);
  }

  :global([data-theme="light"]) .scroll-hint {
    background: linear-gradient(to right, transparent, rgba(0, 0, 0, 0.06) 70%);
  }

  @keyframes pulse-hint {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }

  @media (min-width: 768px) {
    .circuit-svg {
      min-width: unset;
      width: 100%;
    }

    .scroll-hint {
      display: none;
    }
  }
</style>
