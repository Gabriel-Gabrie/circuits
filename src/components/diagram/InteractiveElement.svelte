<script>
  let { hasValue = false, dimmed = false, x = 0, y = 0, width = 44, height = 44, onclick = () => {}, children } = $props();
</script>

<g
  class="interactive"
  class:has-value={hasValue}
  class:dimmed={dimmed}
  role="button"
  tabindex={dimmed ? -1 : 0}
  onclick={dimmed ? undefined : onclick}
  onkeydown={dimmed ? undefined : (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onclick(); } }}
>
  <!-- Transparent hit area for easier tapping -->
  <rect
    x={x}
    y={y}
    {width}
    {height}
    fill="transparent"
    class="hit-area"
  />
  {@render children?.()}
</g>

<style>
  .interactive {
    cursor: pointer;
    outline: none;
  }

  .interactive:hover :global(.component-body),
  .interactive:focus-visible :global(.component-body) {
    filter: brightness(1.3);
  }

  .interactive:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  .has-value :global(.value-dot) {
    opacity: 1;
  }

  .hit-area {
    cursor: pointer;
  }

  .dimmed {
    opacity: 0.3;
    pointer-events: none;
    cursor: default;
  }
</style>
