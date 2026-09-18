// A scaled normal-flow content-box model; no padding, borders or layout overrides.
export function calculateSize({ parent = 600, value = 50, unit = '%', min = 0, max = Infinity } = {}) {
  const requested = unit === '%' ? parent * value / 100 : value
  const final = Math.max(min, Math.min(requested, max))
  return { parent, value, unit, requested, final, overflow: Math.max(0, final - parent), limit: final > requested ? 'minimum' : final < requested ? 'maximum' : 'none' }
}

export function initSizeExplorers(root = document) {
  root.querySelectorAll('[data-size-explorer]').forEach(host => {
    const parent = host.querySelector('[data-size-parent]')
    const mode = host.querySelector('[data-size-unit]')
    const width = host.querySelector('[data-size-value]')
    const memories = { px: 420, '%': 50 }
    const number = value => Number(value.toFixed(1)).toString()
    function render() {
      const unit = mode?.value ?? host.dataset.unit ?? '%'
      const value = Number(width?.value ?? host.dataset.value ?? 50)
      const result = calculateSize({ parent: Number(parent.value), value, unit, min: Number(host.dataset.min ?? 0), max: Number(host.dataset.max ?? Infinity) })
      if (width) memories[unit] = value
      const values = { parent: `${result.parent}px`, css: `${value}${unit}`, requested: `${number(result.requested)}px`, final: `${number(result.final)}px` }
      host.querySelectorAll('[data-size-output]').forEach(output => { output.textContent = values[output.dataset.sizeOutput] })
      parent.setAttribute('aria-valuetext', values.parent)
      width?.setAttribute('aria-valuetext', values.css)
      host.querySelector('[data-parent-rect]').setAttribute('width', result.parent)
      host.querySelector('[data-child-rect]').setAttribute('width', result.final)
      host.querySelector('[data-parent-edge]').setAttribute('x1', result.parent + 20)
      host.querySelector('[data-parent-edge]').setAttribute('x2', result.parent + 20)
      host.querySelector('[data-size-calculation]').textContent = unit === '%' ? `${result.parent} × ${value / 100} = ${number(result.requested)}px requested` : `${value}px requested — independent of the parent width`
      host.querySelector('[data-size-limit]').textContent = result.limit === 'maximum' ? `Capped at the maximum: ${number(result.final)}px.` : result.limit === 'minimum' ? `Raised to the minimum: ${number(result.final)}px.` : 'The requested width is within the limits.'
      host.querySelector('[data-size-overflow]').textContent = result.overflow ? `OVERFLOW: child is ${number(result.overflow)}px wider than its parent.` : `Fits: ${number(result.parent - result.final)}px of parent width remains.`
      host.dataset.overflow = String(result.overflow > 0)
    }
    mode?.addEventListener('change', () => {
      const percent = mode.value === '%'
      width.min = percent ? '10' : '100'; width.max = percent ? '100' : '700'
      width.step = percent ? '5' : '10'; width.value = memories[mode.value]
      render()
    })
    parent.addEventListener('input', render)
    width?.addEventListener('input', render)
    render()
  })
}
