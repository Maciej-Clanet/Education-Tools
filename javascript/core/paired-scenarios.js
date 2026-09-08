// Native select pairs, following the OS-types lesson's classification/evidence activity.
export function evaluateScenarioPair(type, reason, acceptedPairs) {
  return acceptedPairs.some(pair => pair[0] === type && pair[1] === reason)
}

export function initPairedScenarios(configs, root = document) {
  root.querySelectorAll('[data-paired-scenario]').forEach(card => {
    const config = configs[card.dataset.pairedScenario]
    if (!config || card.dataset.scenarioReady) return
    card.dataset.scenarioReady = 'true'
    const type = card.querySelector('[data-choice="type"]')
    const reason = card.querySelector('[data-choice="reason"]')
    const feedback = card.querySelector('[data-pair-feedback]')
    card.querySelector('[data-check-pair]').addEventListener('click', () => {
      if (!type.value || !reason.value) {
        feedback.textContent = config.incompleteMessage ?? 'Choose both an interface and a reason.'
        return
      }
      const suitable = evaluateScenarioPair(type.value, reason.value, config.acceptedPairs)
      const verdict = suitable
        ? (config.successMessage ?? 'Suitable interface and reason.')
        : (config.retryMessage ?? 'Reconsider the interface and the reason together.')
      const explanation = config.explanationsByChoice?.[type.value] ?? config.explanation
      feedback.textContent = `${verdict} ${explanation}`
    })
    card.querySelectorAll('select').forEach(select => select.addEventListener('change', () => { feedback.textContent = '' }))
    card.querySelector('[data-reset-pair]').addEventListener('click', () => {
      type.value = ''; reason.value = ''; feedback.textContent = ''
    })
  })
}
