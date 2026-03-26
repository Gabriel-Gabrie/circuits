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
</script>

<div class="diagram-container">
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
</div>

<style>
  .diagram-container {
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

  @media (min-width: 768px) {
    .circuit-svg {
      min-width: unset;
      width: 100%;
    }
  }
</style>
