<script>
  import SegmentedControl from '../shared/SegmentedControl.svelte';
  import { Complex } from '../../lib/math/complex.js';

  let { value = null, defaultMode = 'rect', onchange = () => {} } = $props();

  // eslint-disable-next-line -- intentionally captures initial value; component is recreated per modal open
  let mode = $state(defaultMode);

  // Phasor inputs
  let mag = $state('');
  let angle = $state('');

  // Rectangular inputs
  let real = $state('');
  let imag = $state('');

  // Initialize from existing value
  $effect(() => {
    if (value) {
      mag = value.magnitude.toFixed(2);
      angle = value.angle.toFixed(2);
      real = value.re.toFixed(2);
      imag = value.im.toFixed(2);
    }
  });

  let preview = $derived.by(() => {
    const c = buildComplex();
    if (!c) return null;
    return {
      phasor: c.toPhasor(2),
      rect: c.toRect(2)
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
        mag = c.magnitude.toFixed(2);
        angle = c.angle.toFixed(2);
      } else {
        real = c.re.toFixed(2);
        imag = c.im.toFixed(2);
      }
    }
  }

  function toggleSign(field) {
    if (field === 'mag') {
      mag = mag.startsWith('-') ? mag.slice(1) : (mag && mag !== '0' ? '-' + mag : mag);
    } else if (field === 'angle') {
      angle = angle.startsWith('-') ? angle.slice(1) : (angle && angle !== '0' ? '-' + angle : angle);
    } else if (field === 'real') {
      real = real.startsWith('-') ? real.slice(1) : (real && real !== '0' ? '-' + real : real);
    } else if (field === 'imag') {
      imag = imag.startsWith('-') ? imag.slice(1) : (imag && imag !== '0' ? '-' + imag : imag);
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
          <div class="input-row">
            <input type="text" inputmode="decimal" bind:value={mag} placeholder="0" />
            <button type="button" class="sign-btn" onclick={() => toggleSign('mag')}>&plusmn;</button>
          </div>
        </label>
      </div>
      <div class="field">
        <label class="field-label">Angle ({'\u00B0'})
          <div class="input-row">
            <input type="text" inputmode="decimal" bind:value={angle} placeholder="0" />
            <button type="button" class="sign-btn" onclick={() => toggleSign('angle')}>&plusmn;</button>
          </div>
        </label>
      </div>
    {:else}
      <div class="field">
        <label class="field-label">Real
          <div class="input-row">
            <input type="text" inputmode="decimal" bind:value={real} placeholder="0" />
            <button type="button" class="sign-btn" onclick={() => toggleSign('real')}>&plusmn;</button>
          </div>
        </label>
      </div>
      <div class="field">
        <label class="field-label">Reactive (j)
          <div class="input-row">
            <input type="text" inputmode="decimal" bind:value={imag} placeholder="0" />
            <button type="button" class="sign-btn" onclick={() => toggleSign('imag')}>&plusmn;</button>
          </div>
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

  .input-row {
    display: flex;
    gap: 4px;
    margin-top: 4px;
  }

  .input-row input {
    flex: 1;
    min-width: 0;
  }

  .sign-btn {
    flex-shrink: 0;
    width: 36px;
    background: var(--bg-elevated);
    color: var(--text-secondary);
    border-radius: var(--radius-sm);
    font-size: var(--text-base);
    font-weight: 600;
    transition: background var(--transition-fast);
  }

  .sign-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
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
