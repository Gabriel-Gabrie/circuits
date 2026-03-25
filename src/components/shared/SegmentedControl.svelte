<script>
  /** @type {{ options: {value: string, label: string}[], selected: string, onchange: (value: string) => void, compact?: boolean }} */
  let { options = [], selected = '', onchange = () => {}, compact = false } = $props();
</script>

<div class="segmented" class:compact>
  {#each options as opt}
    <button
      class="segment"
      class:active={selected === opt.value}
      onclick={() => onchange(opt.value)}
    >
      {opt.label}
    </button>
  {/each}
</div>

<style>
  .segmented {
    display: flex;
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
    padding: 3px;
    gap: 2px;
  }

  .segment {
    flex: 1;
    padding: var(--sp-2) var(--sp-3);
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--text-secondary);
    border-radius: calc(var(--radius-md) - 2px);
    transition: all var(--transition-fast);
    white-space: nowrap;
  }

  .segment:hover {
    color: var(--text-primary);
  }

  .segment.active {
    background: var(--bg-elevated);
    color: var(--text-primary);
    box-shadow: 0 1px 3px var(--shadow);
  }

  .compact .segment {
    padding: var(--sp-1) var(--sp-2);
    font-size: var(--text-xs);
  }
</style>
