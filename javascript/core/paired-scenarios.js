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
        feedback.textContent = 'Choose both an interface and a reason.'
        return
      }
      feedback.textContent = `${evaluateScenarioPair(type.value, reason.value, config.acceptedPairs) ? 'Suitable interface and reason.' : 'Reconsider the interface and the reason together.'} ${config.explanation}`
    })
    card.querySelectorAll('select').forEach(select => select.addEventListener('change', () => { feedback.textContent = '' }))
    card.querySelector('[data-reset-pair]').addEventListener('click', () => {
      type.value = ''; reason.value = ''; feedback.textContent = ''
    })
  })
}
