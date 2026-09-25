// Small rule checks shared by editable teaching forms. Authored rules only.
export function checkRule(value, rule) {
  const text = String(value).trim()
  if (rule.kind === 'presence') return text.length > 0
  if (rule.kind === 'range') return text !== '' && Number.isFinite(Number(text)) && Number(text) >= rule.minimum && Number(text) <= rule.maximum
  if (rule.kind === 'integer') return /^[+-]?\d+$/.test(text) && Number.isSafeInteger(Number(text))
  if (rule.kind === 'format') return new RegExp(rule.pattern).test(text)
  return false
}

export function initValidationLab(rules, corrected, scope = document) {
  scope.querySelectorAll('[data-validation-lab]').forEach(form => {
    const cards = [...form.querySelectorAll('[data-rule]')]
    const summary = form.querySelector('[data-validation-summary]')
    function summarise() {
      const tested = cards.filter(card => card.dataset.state)
      const passed = tested.filter(card => card.dataset.state === 'pass').length
      summary.textContent = tested.length
        ? `${tested.length} of ${cards.length} checked · ${passed} passed · ${tested.length - passed} failed.${passed === cards.length ? ' All four rules pass. This does not prove the details are accurate.' : ''}`
        : 'No rules tested yet.'
    }
    function clear(card) {
      delete card.dataset.state
      card.querySelector('[data-rule-result]').textContent = 'Not checked'
    }
    function test(card) {
      const rule = rules[card.dataset.rule]
      const passed = checkRule(card.querySelector('input').value, rule)
      card.dataset.state = passed ? 'pass' : 'fail'
      card.querySelector('[data-rule-result]').textContent = `${passed ? '✓ PASS' : '✕ FAIL'} · ${passed ? rule.pass : rule.fail}`
    }
    cards.forEach(card => {
      card.querySelector('[data-test-rule]').addEventListener('click', () => { test(card); summarise() })
      card.querySelector('input').addEventListener('input', () => { clear(card); summarise() })
    })
    form.addEventListener('submit', event => { event.preventDefault(); cards.forEach(test); summarise() })
    form.addEventListener('reset', () => { cards.forEach(clear); summarise() })
    form.querySelector('[data-valid-booking]').addEventListener('click', () => {
      cards.forEach(card => { card.querySelector('input').value = corrected[card.dataset.rule]; clear(card) })
      summary.textContent = 'Corrected example loaded. Test the rules again.'
    })
  })
}
