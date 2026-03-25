<script>
  let { label = '', checked = false, onchange = () => {} } = $props();
</script>

<label class="toggle">
  <span class="toggle-label">{label}</span>
  <button
    class="toggle-track"
    class:active={checked}
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onclick={() => onchange(!checked)}
  >
    <span class="toggle-thumb"></span>
  </button>
</label>

<style>
  .toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sp-3);
    cursor: pointer;
  }

  .toggle-label {
    font-size: var(--text-sm);
    color: var(--text-secondary);
    user-select: none;
  }

  .toggle-track {
    position: relative;
    width: 40px;
    height: 22px;
    background: var(--bg-hover);
    border-radius: var(--radius-full);
    transition: background var(--transition-fast);
    flex-shrink: 0;
  }

  .toggle-track.active {
    background: var(--accent);
  }

  .toggle-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 18px;
    height: 18px;
    background: var(--text-primary);
    border-radius: 50%;
    transition: transform var(--transition-fast);
  }

  .toggle-track.active .toggle-thumb {
    transform: translateX(18px);
  }
</style>
