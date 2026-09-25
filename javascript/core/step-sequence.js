// Enhance an authored sequence without duplicating its readable, no-JS content.
export function initStepSequences(scope = document) {
  scope.querySelectorAll('[data-step-sequence]').forEach(root => {
    const panels = [...root.querySelectorAll('[data-step-panel]')]
    const links = [...root.querySelectorAll('[data-step-to]')]
    const previous = root.querySelector('[data-step-prev]')
    const next = root.querySelector('[data-step-next]')
    let index = 0
    function show(requested, animate = true) {
      index = Math.max(0, Math.min(panels.length - 1, requested))
      panels.forEach((panel, i) => { panel.hidden = i !== index })
      links.forEach((link, i) => {
        if (i === index) link.setAttribute('aria-current', 'step')
        else link.removeAttribute('aria-current')
      })
      previous.disabled = index === 0
      next.disabled = index === panels.length - 1
      root.querySelector('[data-step-status]').textContent = `Step ${index + 1} of ${panels.length} · ${panels[index].querySelector('h3').textContent}`
      if (animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        panels[index].animate([{ opacity: .35, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 260, easing: 'ease-out' })
      }
    }
    previous.addEventListener('click', () => show(index - 1))
    next.addEventListener('click', () => show(index + 1))
    root.querySelector('[data-step-reset]').addEventListener('click', () => show(0))
    links.forEach(link => link.addEventListener('click', () => show(Number(link.dataset.stepTo))))
    root.querySelector('[data-step-controls]').hidden = false
    root.querySelector('[data-step-navigation]').hidden = false
    show(0, false)
  })
}
