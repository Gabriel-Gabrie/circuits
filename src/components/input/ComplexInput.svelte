<script>
  import SegmentedControl from '../shared/SegmentedControl.svelte';
  import { Complex } from '../../lib/math/complex.js';

  let { value = null, onchange = () => {} } = $props();

  let mode = $state('phasor'); // 'phasor' | 'rect'

  // Phasor inputs
  let mag = $state('');
  let angle = $state('');

  // Rectangular inputs
  let real = $state('');
  let imag = $state('');

  // Initialize from existing value
  $effect(() => {
    if (value) {
      mag = value.magnitude.toFixed(4);
      angle = value.angle.toFixed(4);
      real = value.re.toFixed(4);
      imag = value.im.toFixed(4);
    }
  });

  let preview = $derived.by(() => {
    const c = buildComplex();
    if (!c) return null;
    return {
      phasor: c.toPhasor(4),
      rect: c.toRect(4)
    };
  });

  function buildComplex() {
    if (mode === 'phasor') {
      const m = parseFloat(mag);
      const a = parseFloat(angle);
      if (isNaN(m) || isNaN(a)) return null;
      return Complex.fromPhasor(m, a);
    } else {
      const r = parseFloat(real) || 0;
      const im = parseFloat(imag) || 0;
      if (real === '' && imag === '') return null;
      return new Complex(r, im);
    }
  }

  export function getValue() {
    return buildComplex();
  }

  // Sync between modes when switching
  function handleModeChange(newMode) {
    const c = buildComplex();
    mode = newMode;
    if (c) {
      if (newMode === 'phasor') {
        mag = c.magnitude.toFixed(4);
        angle = c.angle.toFixed(4);
      } else {
        real = c.re.toFixed(4);
        imag = c.im.toFixed(4);
      }
    }
  }

  const modeOptions = [
    { value: 'phasor', label: 'Mag\u2220\u00B0' },
    { value: 'rect', label: 'a + jb' }
  ];
</script>

<div class="complex-input">
  <SegmentedControl
    options={modeOptions}
    selected={mode}
    onchange={handleModeChange}
    compact
  />

  <div class="fields">
    {#if mode === 'phasor'}
      <div class="field">
        <label class="field-label">Magnitude
          <input type="number" step="any" bind:value={mag} placeholder="0" inputmode="decimal" />
        </label>
      </div>
      <div class="field">
        <label class="field-label">Angle (\u00B0)
          <input type="number" step="any" bind:value={angle} placeholder="0" inputmode="decimal" />
        </label>
      </div>
    {:else}
      <div class="field">
        <label class="field-label">Real
          <input type="number" step="any" bind:value={real} placeholder="0" inputmode="decimal" />
        </label>
      </div>
      <div class="field">
        <label class="field-label">Imaginary (j)
          <input type="number" step="any" bind:value={imag} placeholder="0" inputmode="decimal" />
        </label>
      </div>
    {/if}
  </div>

  {#if preview}
    <div class="preview">
      <span class="preview-val">{preview.phasor}</span>
      <span class="preview-sep">=</span>
      <span class="preview-val">{preview.rect}</span>
    </div>
  {/if}
</div>

<style>
  .complex-input {
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
  }

  .fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--sp-3);
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: var(--sp-1);
  }

  .field-label {
    font-size: var(--text-xs);
    color: var(--text-muted);
    font-weight: 500;
  }

  .preview {
    display: flex;
    align-items: center;
    gap: var(--sp-2);
    padding: var(--sp-2) var(--sp-3);
    background: var(--bg-primary);
    border-radius: var(--radius-sm);
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--text-secondary);
    justify-content: center;
    flex-wrap: wrap;
  }

  .preview-sep {
    color: var(--text-muted);
  }
</style>
