import { evaluateScenarioPair } from './paired-scenarios.js'

// Accept supported single or multiple links; extra relevant links are teaching
// feedback, not an artificial requirement to select every possible factor.
export function evaluateImpactSelection(factors, impact, scenario) {
  if (!factors.length || !impact) return { complete: false, supported: false, additional: [] }
  const supported = factors.every(factor => evaluateScenarioPair(factor, impact, scenario.acceptedPairs))
  const additional = [...new Set(scenario.acceptedPairs.filter(pair => pair[1] === impact).map(pair => pair[0]))]
    .filter(factor => !factors.includes(factor))
  return { complete: true, supported, additional }
}

export function createImpactState(count) {
  return { index: 0, responses: Array.from({ length: count }, () => ({ factors: [], impact: '', checked: false })) }
}

export function updateImpactState(state, action) {
  if (action.type === 'move') return { ...state, index: Math.max(0, Math.min(state.responses.length - 1, state.index + action.offset)) }
  return { ...state, responses: state.responses.map((response, index) => {
    if (index !== state.index) return response
    if (action.type === 'choose') return { factors: [...action.factors], impact: action.impact, checked: false }
    if (action.type === 'check') return { ...response, checked: true }
    if (action.type === 'reset') return { factors: [], impact: '', checked: false }
    return response
  }) }
}

export function initImpactExplorers(scenarios, root = document) {
  if (!scenarios.length) return
  root.querySelectorAll('[data-impact-explorer]').forEach(host => {
    if (host.dataset.impactReady) return
    host.dataset.impactReady = 'true'
    let state = createImpactState(scenarios.length)
    const form = host.querySelector('[data-impact-form]')
    const factors = [...form.querySelectorAll('[name="factor"]')]
    const impacts = [...form.querySelectorAll('[name="impact"]')]
    const heading = host.querySelector('[data-impact-statement]')
    const feedback = host.querySelector('[data-impact-feedback]')
    const previous = host.querySelector('[data-impact-prev]')
    const next = host.querySelector('[data-impact-next]')
    const labels = Object.fromEntries(factors.map(input => [input.value, input.parentElement.querySelector('strong').textContent]))
    function render(focus = false) {
      const scenario = scenarios[state.index]
      const response = state.responses[state.index]
      heading.textContent = scenario.statement
      host.querySelector('[data-impact-progress]').textContent = `Consequence ${state.index + 1} of ${scenarios.length}`
      factors.forEach(input => { input.checked = response.factors.includes(input.value) })
      impacts.forEach(input => { input.checked = response.impact === input.value })
      previous.disabled = state.index === 0
      next.disabled = state.index === scenarios.length - 1
      feedback.textContent = ''
      if (response.checked) {
        const result = evaluateImpactSelection(response.factors, response.impact, scenario)
        feedback.textContent = !result.complete ? 'Choose at least one factor and an overall impact before checking.'
          : `${result.supported ? 'Supported reasoning.' : 'Reconsider the selected factors and overall impact using the evidence in this statement.'} ${scenario.explanation}${result.supported && result.additional.length ? ` Also consider: ${result.additional.map(factor => labels[factor]).join(', ')}.` : ''}`
      }
      if (focus) heading.focus()
    }
    form.addEventListener('change', () => {
      state = updateImpactState(state, { type: 'choose', factors: factors.filter(input => input.checked).map(input => input.value), impact: impacts.find(input => input.checked)?.value ?? '' })
      render()
    })
    form.addEventListener('submit', event => {
      event.preventDefault(); state = updateImpactState(state, { type: 'check' }); render()
    })
    form.addEventListener('reset', event => {
      event.preventDefault(); state = updateImpactState(state, { type: 'reset' }); render()
    })
    for (const [button, offset] of [[previous, -1], [next, 1]]) button.addEventListener('click', () => {
      state = updateImpactState(state, { type: 'move', offset }); render(true)
    })
    render()
  })
}
