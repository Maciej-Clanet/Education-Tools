import test from 'node:test'
import assert from 'node:assert/strict'
import { getRows, evaluate, formatExpression, taskDefinitions, getTask, nextTask, blankAnswers, checkTask, normalisePracticeState } from '../javascript/core/boolean-logic-model.js'

test('input rows cover every setting once, in binary order', () => {
  assert.deepEqual(getRows(['A']), [{ A: 0 }, { A: 1 }])
  assert.deepEqual(getRows(['A', 'B']).map(row => `${row.A}${row.B}`), ['00', '01', '10', '11'])
  assert.deepEqual(getRows(['A', 'B', 'C']).map(row => `${row.A}${row.B}${row.C}`), ['000', '001', '010', '011', '100', '101', '110', '111'])
  for (const names of [[], ['A', 'A'], ['D'], ['A', 'B', 'C', 'D']]) assert.throws(() => getRows(names), RangeError)
})

test('all question outputs agree with independently specified truth-table results', () => {
  const expected = {
    'two-and': '0001', 'two-or': '0111', 'two-and-not-b': '0010', 'two-or-not-b': '1011',
    'two-not-a-and': '0100', 'two-not-a-or': '1101', 'two-both-not-and': '1000', 'two-both-not-or': '1110',
    'three-and-or': '00000111', 'three-or-and': '00011111', 'three-or-not': '00101010',
    'three-and-then-or': '01010111', 'three-all-and': '00000001', 'three-all-or': '01111111',
    'three-not-b-or': '01011101', 'three-not-b-and': '01000101', 'three-and-not-c': '00000010',
    'three-or-not-c': '10111111',
  }
  assert.equal(taskDefinitions.length, Object.keys(expected).length)
  for (const definition of taskDefinitions) {
    const task = getTask(definition.id)
    assert.equal(task.rows.map(row => evaluate(task.expression, row)).join(''), expected[task.id], task.id)
    assert.ok(task.columns.length <= 3)
    assert.equal(task.columns.at(-1).id, 'output')
    // Every named input must affect the result for at least one other fixed setting.
    for (const name of task.inputs) {
      assert.ok(task.rows.some(row => evaluate(task.expression, row) !== evaluate(task.expression, { ...row, [name]: 1 - row[name] })), `${task.id}: ${name} is meaningful`)
    }
  }
})

test('expression labels retain grouping and the model rejects unsupported input', () => {
  assert.equal(formatExpression({ op: 'AND', left: 'A', right: { op: 'OR', left: 'B', right: 'C' } }), 'A AND (B OR C)')
  assert.equal(formatExpression({ op: 'AND', left: 'A', right: { op: 'NOT', input: 'B' } }), 'A AND (NOT B)')
  assert.equal(formatExpression({ op: 'OR', left: { op: 'NOT', input: 'A' }, right: 'B' }), '(NOT A) OR B')
  assert.equal(formatExpression({ op: 'NOT', input: 'A' }), 'NOT A')
  assert.equal(formatExpression({ op: 'NOT', input: { op: 'AND', left: 'A', right: 'B' } }), 'NOT (A AND B)')
  assert.equal(evaluate({ op: 'NOT', input: 'A' }, { A: false }), 1)
  assert.equal(evaluate({ op: 'NOT', input: 'A' }, { A: true }), 0)
  assert.throws(() => evaluate('A', { A: 'false' }), TypeError)
  assert.throws(() => evaluate({ op: 'XOR', left: 'A', right: 'B' }, { A: 1, B: 0 }), TypeError)
  assert.throws(() => getTask('missing'), RangeError)
})

test('generation stays within the selected input count and excludes the current task', () => {
  for (const definition of taskDefinitions) {
    for (const randomValue of [0, 0.1, 0.5, 0.999999999, 1, -1, NaN]) {
      const task = nextTask(definition.inputCount, definition.id, () => randomValue)
      assert.equal(task.inputCount, definition.inputCount)
      assert.notEqual(task.id, definition.id)
    }
  }
  assert.throws(() => nextTask(1), RangeError)
})

test('checking distinguishes missing cells, incorrect values and valid zeros', () => {
  for (const definition of taskDefinitions) {
    const task = getTask(definition.id)
    const empty = checkTask(task, blankAnswers(task))
    assert.equal(empty.missing, task.rows.length * task.columns.length)
    assert.equal(empty.allCorrect, false)
    const answers = task.rows.map(row => task.columns.map(column => String(evaluate(column.node, row))))
    const complete = checkTask(task, answers)
    assert.equal(complete.allCorrect, true)
    assert.equal(complete.missing, 0)
    answers[0][0] = String(1 - Number(answers[0][0]))
    const wrong = checkTask(task, answers)
    assert.equal(wrong.incorrect, 1)
    assert.equal(wrong.complete, true)
    answers[0][0] = ''
    assert.equal(checkTask(task, answers).missing, 1)
  }
})

test('saved modes remain independent and malformed data cannot become a different task answer', () => {
  const saved = {
    inputCount: 3,
    modes: {
      2: { taskId: 'two-or', answers: [['0'], ['1'], ['1'], ['1']], checked: true },
      3: { taskId: 'three-and-or', answers: [[1, 0], ['bad', null]], checked: false },
    },
  }
  const state = normalisePracticeState(saved)
  assert.equal(state.inputCount, 3)
  assert.equal(state.modes[2].taskId, 'two-or')
  assert.deepEqual(state.modes[2].answers, saved.modes[2].answers)
  assert.equal(state.modes[2].checked, true)
  assert.deepEqual(state.modes[3].answers[0], ['1', '0'])
  assert.deepEqual(state.modes[3].answers[1], ['', ''])
  state.modes[2].answers[0][0] = '1'
  assert.equal(saved.modes[2].answers[0][0], '0', 'normalisation copies answers')
  for (const invalid of [null, [], true, 'bad', { inputCount: 9 }, { modes: { 2: { taskId: 'three-and-or', answers: [[1]], checked: true } } }]) {
    const normalised = normalisePracticeState(invalid)
    assert.equal(normalised.inputCount, 2)
    assert.equal(normalised.modes[2].taskId, 'two-and')
    assert.equal(normalised.modes[2].answers[0][0], '')
    assert.equal(normalised.modes[2].checked, false)
  }
})
