// Measurements for the lesson's labelled, scaled reference diagrams.
export function unitReferences({ parentWidth = 400, viewportWidth = 800, viewportHeight = 400, rootSize = 16, localSize = 20, heightPercent = 50 } = {}) {
  return {
    parentWidth, viewportWidth, viewportHeight, rootSize, localSize, heightPercent,
    px: 50,
    percent: parentWidth / 2,
    vw: viewportWidth / 2,
    rem: rootSize * 2,
    em: localSize * 2,
    vh: viewportHeight * heightPercent / 100,
  }
}

export function initUnitReferenceVisuals(root = document) {
  root.querySelectorAll('[data-unit-visual]').forEach(host => {
    const controls = [...host.querySelectorAll('[data-reference]')]
    function render() {
      const state = unitReferences(Object.fromEntries(controls.map(control => [control.dataset.reference, Number(control.value)])))
      host.querySelectorAll('[data-measure]').forEach(output => { output.textContent = state[output.dataset.measure] })
      host.querySelectorAll('[data-measure-width]').forEach(rect => { rect.setAttribute('width', state[rect.dataset.measureWidth]) })
      host.querySelectorAll('[data-measure-height]').forEach(rect => { rect.setAttribute('height', state[rect.dataset.measureHeight]) })
      // Ruler marks use the same visual scale in both font-reference branches.
      host.querySelectorAll('[data-font-ruler]').forEach(rect => { rect.setAttribute('width', state[rect.dataset.fontRuler] * 4) })
    }
    controls.forEach(control => control.addEventListener('change', render))
    render()
  })
}
