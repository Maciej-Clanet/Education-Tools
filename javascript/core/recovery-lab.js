export const initialRecoveryState = () => ({ step: 0, copy: '', feedback: '' })

export function updateRecoveryState(state, action, scenario) {
  if (action.type === 'reset') return initialRecoveryState()
  if (action.type === 'previous') return { ...state, step: Math.max(0, state.step - 1), feedback: '' }
  if (action.type === 'select' && state.step === 1) return { ...state, copy: action.copy, feedback: '' }
  if (action.type !== 'next' || state.step >= scenario.steps.length - 1) return state
  if (state.step === 1) {
    const copy = scenario.copies.find(item => item.id === state.copy)
    if (!copy) return { ...state, feedback: 'Choose a recovery point before restoring.' }
    if (!copy.usable) return { ...state, feedback: 'This newer copy contains the damage. Choose the checked copy from before the corruption.' }
  }
  return { ...state, step: state.step + 1, feedback: '' }
}

export function initRecoveryLabs(scenario, root = document) {
  root.querySelectorAll('[data-recovery-lab]').forEach(host => {
    if (host.dataset.recoveryReady) return
    host.dataset.recoveryReady = 'true'
    let state = initialRecoveryState()
    const next = host.querySelector('[data-recovery-next]')
    const previous = host.querySelector('[data-recovery-prev]')
    const fields = [...host.querySelectorAll('[data-recovery-copy]')]
    function render() {
      const step = scenario.steps[state.step]
      host.dataset.recoveryStep = String(state.step)
      host.querySelector('[data-recovery-heading]').textContent = step.heading
      host.querySelector('[data-recovery-explanation]').textContent = step.text
      host.querySelector('[data-recovery-status]').textContent = `Step ${state.step + 1} of ${scenario.steps.length} · ${step.title}`
      host.querySelector('[data-recovery-feedback]').textContent = state.feedback
      host.querySelector('[data-recovery-options]').hidden = state.step !== 1
      fields.forEach(input => { input.checked = input.value === state.copy })
      host.querySelectorAll('[data-recovery-position]').forEach((item, index) => {
        if (index === state.step) item.setAttribute('aria-current', 'step')
        else item.removeAttribute('aria-current')
      })
      for (const part of ['source', 'recovery', 'service']) host.querySelector(`[data-recovery-${part}]`).textContent = step[part]
      host.querySelector('[data-recovery-loss]').hidden = state.step < 2
      next.disabled = state.step === scenario.steps.length - 1
      next.textContent = step.action || 'Recovery complete'
      previous.disabled = state.step === 0
    }
    function dispatch(action) { state = updateRecoveryState(state, action, scenario); render() }
    fields.forEach(input => input.addEventListener('change', () => dispatch({ type: 'select', copy: input.value })))
    next.addEventListener('click', () => dispatch({ type: 'next' }))
    previous.addEventListener('click', () => dispatch({ type: 'previous' }))
    host.querySelector('[data-recovery-reset]').addEventListener('click', () => dispatch({ type: 'reset' }))
    host.querySelector('[data-recovery-controls]').hidden = false
    host.querySelector('[data-recovery-interactive]').hidden = false
    host.querySelector('[data-recovery-fallback]').hidden = true
    render()
  })
}
