// Progressive enhancement: all steps remain readable without JavaScript.
export function initLessonWalkthroughs(root = document) {
  root.querySelectorAll('[data-lesson-walkthrough]').forEach((walkthrough) => {
    if (walkthrough.dataset.walkthroughReady) return
    const steps = [...walkthrough.querySelectorAll('[data-walkthrough-step]')]
    const controls = walkthrough.querySelector('[data-walkthrough-controls]')
    const status = walkthrough.querySelector('[data-walkthrough-status]')
    const previous = walkthrough.querySelector('[data-walkthrough-prev]')
    const next = walkthrough.querySelector('[data-walkthrough-next]')
    const reset = walkthrough.querySelector('[data-walkthrough-reset]')
    if (!steps.length || !controls || !status || !previous || !next || !reset) return
    let index = 0
    const show = (requested) => {
      index = Math.max(0, Math.min(steps.length - 1, requested))
      steps.forEach((step, stepIndex) => { step.hidden = stepIndex !== index })
      status.textContent = `Step ${index + 1} of ${steps.length}: ${steps[index].dataset.walkthroughStep}`
      // Keep focus on the navigation button even at the end of a sequence.
      previous.setAttribute('aria-disabled', String(index === 0))
      next.setAttribute('aria-disabled', String(index === steps.length - 1))
      reset.setAttribute('aria-disabled', String(index === 0))
    }
    previous.addEventListener('click', () => { if (index > 0) show(index - 1) })
    next.addEventListener('click', () => { if (index < steps.length - 1) show(index + 1) })
    reset.addEventListener('click', () => show(0))
    walkthrough.dataset.walkthroughReady = 'true'
    controls.hidden = false
    show(0)
  })
}
