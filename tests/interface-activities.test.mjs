import test from 'node:test'
import assert from 'node:assert/strict'
import { resolveTeachingCommand, initSimulatedTerminals } from '../javascript/core/simulated-terminal.js'
import { evaluateScenarioPair, initPairedScenarios } from '../javascript/core/paired-scenarios.js'

const commands = [{ command: 'Get-Item | Select-Object Name', output: 'Example item' }]

test('teaching commands match whole predefined entries with harmless case/spacing differences', () => {
  assert.deepEqual(resolveTeachingCommand('  GET-ITEM|  Select-Object   Name ', commands), { supported: true, output: 'Example item' })
  assert.equal(resolveTeachingCommand('Get-Item', commands).supported, false)
})

test('unknown commands, extra statements, interpolation and markup stay unsupported text', () => {
  for (const command of ['Get-Item | Select-Object Name; Remove-Item x', 'Get-Item\nGet-Process', '$(Get-Item)', '<img src=x onerror=alert(1)>', '__proto__', 'constructor']) {
    const result = resolveTeachingCommand(command, commands)
    assert.equal(result.supported, false)
    assert.match(result.output, /only supports/)
  }
})

test('scenario answers match accepted pairs, including justified alternative styles', () => {
  const pairs = [['menu', 'guided'], ['gui', 'guided'], ['cli', 'automation']]
  assert.equal(evaluateScenarioPair('gui', 'guided', pairs), true)
  assert.equal(evaluateScenarioPair('menu', 'guided', pairs), true)
  assert.equal(evaluateScenarioPair('gui', 'automation', pairs), false)
  assert.equal(evaluateScenarioPair('', '', pairs), false)
})

function control(textContent = '') {
  const handlers = {}
  return { textContent, value: '', dataset: {},
    addEventListener(type, listener) { handlers[type] = listener },
    fire(type, detail = {}) { handlers[type]?.({ preventDefault() {}, ...detail }) },
    focus() {},
  }
}

test('paired scenarios support configurable feedback, conditional explanations and reset', () => {
  const type = control(), reason = control(), feedback = control(), check = control(), reset = control()
  const nodes = { '[data-choice="type"]': type, '[data-choice="reason"]': reason, '[data-pair-feedback]': feedback, '[data-check-pair]': check, '[data-reset-pair]': reset }
  const card = { dataset: { pairedScenario: 'choice' }, querySelector: selector => nodes[selector], querySelectorAll: () => [type, reason] }
  initPairedScenarios({ choice: {
    acceptedPairs: [['a', 'fit'], ['b', 'price']], incompleteMessage: 'Incomplete',
    successMessage: 'Supported priority', retryMessage: 'Check evidence', explanation: 'Fallback',
    explanationsByChoice: { a: 'Check recurring costs.', b: 'Check migration costs.' },
  } }, { querySelectorAll: () => [card] })
  check.fire('click')
  assert.equal(feedback.textContent, 'Incomplete')
  type.value = 'b'; reason.value = 'price'; check.fire('click')
  assert.equal(feedback.textContent, 'Supported priority Check migration costs.')
  reason.value = 'fit'; reason.fire('change')
  assert.equal(feedback.textContent, '')
  check.fire('click')
  assert.equal(feedback.textContent, 'Check evidence Check migration costs.')
  reset.fire('click')
  assert.equal(type.value, '')
  assert.equal(reason.value, '')
  assert.equal(feedback.textContent, '')
})

test('existing interface scenario defaults remain available without new configuration', () => {
  const type = control(), reason = control(), feedback = control(), check = control(), reset = control()
  const nodes = { '[data-choice="type"]': type, '[data-choice="reason"]': reason, '[data-pair-feedback]': feedback, '[data-check-pair]': check, '[data-reset-pair]': reset }
  const card = { dataset: { pairedScenario: 'original' }, querySelector: selector => nodes[selector], querySelectorAll: () => [type, reason] }
  initPairedScenarios({ original: { acceptedPairs: [['gui', 'visual']], explanation: 'Visual work.' } }, { querySelectorAll: () => [card] })
  check.fire('click')
  assert.match(feedback.textContent, /interface and a reason/)
  type.value = 'gui'; reason.value = 'visual'; check.fire('click')
  assert.equal(feedback.textContent, 'Suitable interface and reason. Visual work.')
})

test('terminal starts ready, appends runs, loads learned commands and resets independently', () => {
  function fixture() {
    const form = control(), input = control(), output = control(), status = control(), reset = control(), example = control()
    example.dataset.terminalExample = commands[0].command
    const elements = { form, input, '[data-terminal-output]': output, '[data-terminal-status]': status, '[data-terminal-reset]': reset }
    return { form, input, output, status, reset, example, host: {
      dataset: { simulatedTerminal: 'demo', currentCommand: commands[0].command },
      querySelector: selector => elements[selector], querySelectorAll: () => [example],
    } }
  }
  const first = fixture(), second = fixture()
  initSimulatedTerminals({ demo: { prompt: 'PS>', commands } }, { querySelectorAll: () => [first.host, second.host] })
  assert.equal(first.input.value, commands[0].command)
  assert.equal(first.output.textContent, 'PS>')
  first.example.fire('click')
  assert.equal(first.input.value, commands[0].command)
  assert.equal(first.output.textContent, 'PS>')
  first.form.fire('submit')
  const firstRun = `PS> ${commands[0].command}\nExample item\n\nPS>`
  assert.equal(first.output.textContent, firstRun)
  assert.equal(first.input.value, '')
  assert.equal(second.output.textContent, 'PS>')
  first.input.value = 'unfinished'
  first.input.fire('keydown', { key: 'ArrowUp' })
  assert.equal(first.input.value, commands[0].command)
  first.input.fire('keydown', { key: 'ArrowDown' })
  assert.equal(first.input.value, 'unfinished')
  first.example.fire('click')
  assert.equal(first.output.textContent, firstRun)
  first.form.fire('submit')
  assert.equal(first.output.textContent, firstRun.slice(0, -3) + firstRun)
  first.input.value = '<script>arbitrary()</script>'
  first.form.fire('submit')
  assert.match(first.status.textContent, /only supports/)
  assert.ok(first.output.textContent.endsWith('PS>'))
  first.reset.fire('click')
  assert.equal(first.output.textContent, 'PS>')
  assert.equal(first.input.value, commands[0].command)
  first.input.value = ''
  first.input.fire('keydown', { key: 'ArrowUp' })
  assert.equal(first.input.value, '')
})
