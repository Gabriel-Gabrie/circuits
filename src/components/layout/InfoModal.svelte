<script>
  let { onclose = () => {} } = $props();

  function handleKeydown(e) {
    if (e.key === 'Escape') onclose();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="modal-overlay" onclick={onclose}>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="modal-sheet" onclick={(e) => e.stopPropagation()}>
    <div class="modal-header">
      <h3 class="modal-title">3&#966; Analyzer</h3>
      <button class="modal-close" onclick={onclose} aria-label="Close">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>

    <div class="modal-body">
      <section class="info-section">
        <h4 class="section-heading">What is this?</h4>
        <p class="section-text">A tool for analyzing 3-phase AC circuits. Supports Y and Delta configurations for both source and load, balanced and unbalanced systems, and custom phase sequences.</p>
      </section>

      <section class="info-section">
        <h4 class="section-heading">How to use</h4>
        <ol class="steps">
          <li>Select a circuit configuration (Y-Y, Y-&#916;, &#916;-Y, &#916;-&#916;)</li>
          <li>Tap components on the diagram to enter values</li>
          <li>Press <strong>Calculate</strong> to see voltages, currents, and power</li>
        </ol>
      </section>

      <hr class="divider" />

      <section class="about-section">
        <p class="copyright">&copy; 2026 Gabriel Gabrie</p>
        <div class="links">
          <a href="https://gabrielgabrie.com" target="_blank" rel="noopener noreferrer" class="about-link">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            gabrielgabrie.com
          </a>
          <a href="https://buymeacoffee.com/gabrielgabrie" target="_blank" rel="noopener noreferrer" class="about-link support-link">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" stroke="none">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            Support the Developer
          </a>
        </div>
      </section>
    </div>
  </div>
</div>

<style>
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: var(--overlay);
    z-index: 200;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    animation: fadeIn 150ms ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }

  .modal-sheet {
    background: var(--bg-surface);
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    width: 100%;
    max-width: 480px;
    padding: var(--sp-4) var(--sp-4) var(--sp-6);
    animation: slideUp 250ms ease;
    max-height: 85vh;
    overflow-y: auto;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--sp-4);
  }

  .modal-title {
    font-size: var(--text-base);
    font-weight: 600;
  }

  .modal-close {
    color: var(--text-muted);
    padding: var(--sp-1);
    border-radius: var(--radius-sm);
  }

  .modal-close:hover {
    color: var(--text-primary);
    background: var(--bg-hover);
  }

  .modal-body {
    display: flex;
    flex-direction: column;
    gap: var(--sp-4);
  }

  .info-section {
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
  }

  .section-heading {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--text-primary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .section-text {
    font-size: var(--text-sm);
    color: var(--text-secondary);
    line-height: 1.5;
  }

  .steps {
    font-size: var(--text-sm);
    color: var(--text-secondary);
    line-height: 1.6;
    padding-left: var(--sp-5);
    display: flex;
    flex-direction: column;
    gap: var(--sp-1);
  }

  .divider {
    border: none;
    border-top: 1px solid var(--border-subtle);
    margin: 0;
  }

  .about-section {
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
    align-items: center;
    text-align: center;
  }

  .copyright {
    font-size: var(--text-xs);
    color: var(--text-muted);
  }

  .links {
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
    align-items: center;
  }

  .about-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: var(--text-sm);
    color: var(--accent);
    text-decoration: none;
    transition: opacity var(--transition-fast);
  }

  .about-link:hover {
    opacity: 0.8;
  }

  .support-link {
    color: var(--error);
  }

  @media (min-width: 768px) {
    .modal-overlay {
      align-items: center;
    }

    .modal-sheet {
      border-radius: var(--radius-lg);
      animation: none;
      padding-bottom: var(--sp-4);
    }
  }
</style>
