// A small expression tree keeps the lesson independent of code execution.
const and = (left, right) => ({ op: 'AND', left, right })
const or = (left, right) => ({ op: 'OR', left, right })
const not = input => ({ op: 'NOT', input })

export function getRows(names) {
  if (!Array.isArray(names) || names.length < 1 || names.length > 3 ||
      new Set(names).size !== names.length || names.some(name => !['A', 'B', 'C'].includes(name))) {
    throw new RangeError('Use one to three distinct inputs: A, B and C.')
  }
  return Array.from({ length: 2 ** names.length }, (_, index) =>
    Object.fromEntries(names.map((name, position) => [name, (index >> (names.length - position - 1)) & 1])))
}

export function evaluate(node, inputs) {
  if (typeof node === 'string' && ['A', 'B', 'C'].includes(node)) {
    if (![0, 1, false, true].includes(inputs?.[node])) throw new TypeError(`Input ${node} must be 0 or 1.`)
    return Number(Boolean(inputs[node]))
  }
  if (!node || typeof node !== 'object') throw new TypeError('Invalid Boolean expression.')
  if (node.op === 'NOT') return 1 - evaluate(node.input, inputs)
  if (node.op !== 'AND' && node.op !== 'OR') throw new TypeError('Use AND, OR and NOT.')
  const left = evaluate(node.left, inputs)
  const right = evaluate(node.right, inputs)
  return node.op === 'AND' ? Number(Boolean(left && right)) : Number(Boolean(left || right))
}

export function formatExpression(node) {
  if (typeof node === 'string' && ['A', 'B', 'C'].includes(node)) return node
  if (!node || typeof node !== 'object') throw new TypeError('Invalid Boolean expression.')
  if (node.op === 'NOT') return `NOT ${typeof node.input === 'string' ? formatExpression(node.input) : `(${formatExpression(node.input)})`}`
  if (!['AND', 'OR'].includes(node.op)) throw new TypeError('Use AND, OR and NOT.')
  const part = child => typeof child === 'string' ? formatExpression(child) : `(${formatExpression(child)})`
  return `${part(node.left)} ${node.op} ${part(node.right)}`
}

function define(id, inputCount, expression, helpers = []) {
  return { id, inputCount, expression, helpers }
}

export const taskDefinitions = [
  define('two-and', 2, and('A', 'B')),
  define('two-or', 2, or('A', 'B')),
  define('two-and-not-b', 2, and('A', not('B')), [not('B')]),
  define('two-or-not-b', 2, or('A', not('B')), [not('B')]),
  define('two-not-a-and', 2, and(not('A'), 'B'), [not('A')]),
  define('two-not-a-or', 2, or(not('A'), 'B'), [not('A')]),
  define('two-both-not-and', 2, and(not('A'), not('B')), [not('A'), not('B')]),
  define('two-both-not-or', 2, or(not('A'), not('B')), [not('A'), not('B')]),
  define('three-and-or', 3, and('A', or('B', 'C')), [or('B', 'C')]),
  define('three-or-and', 3, or('A', and('B', 'C')), [and('B', 'C')]),
  define('three-or-not', 3, and(or('A', 'B'), not('C')), [or('A', 'B'), not('C')]),
  define('three-and-then-or', 3, or(and('A', 'B'), 'C'), [and('A', 'B')]),
  define('three-all-and', 3, and(and('A', 'B'), 'C'), [and('A', 'B')]),
  define('three-all-or', 3, or(or('A', 'B'), 'C'), [or('A', 'B')]),
  define('three-not-b-or', 3, or(and('A', not('B')), 'C'), [not('B'), and('A', not('B'))]),
  define('three-not-b-and', 3, and(or('A', not('B')), 'C'), [not('B'), or('A', not('B'))]),
  define('three-and-not-c', 3, and(and('A', 'B'), not('C')), [and('A', 'B'), not('C')]),
  define('three-or-not-c', 3, or(or('A', 'B'), not('C')), [or('A', 'B'), not('C')]),
]

export function getTask(id) {
  const definition = taskDefinitions.find(task => task.id === id)
  if (!definition) throw new RangeError('Unknown truth-table task.')
  const inputs = ['A', 'B', 'C'].slice(0, definition.inputCount)
  return {
    ...definition,
    inputs,
    label: formatExpression(definition.expression),
    columns: [
      ...definition.helpers.map((node, index) => ({ id: `work-${index + 1}`, label: formatExpression(node), node })),
      { id: 'output', label: 'Output', node: definition.expression },
    ],
    rows: getRows(inputs),
  }
}

export function nextTask(inputCount, previousId, random = Math.random) {
  if (inputCount !== 2 && inputCount !== 3) throw new RangeError('Choose two or three inputs.')
  const choices = taskDefinitions.filter(task => task.inputCount === inputCount && task.id !== previousId)
  const value = Number(random())
  const index = Math.floor((Number.isFinite(value) ? Math.min(Math.max(value, 0), 0.9999999999999999) : 0) * choices.length)
  return getTask(choices[index].id)
}

export function blankAnswers(task) {
  return task.rows.map(() => task.columns.map(() => ''))
}

export function checkTask(task, answers) {
  const cells = task.rows.map((row, rowIndex) => task.columns.map((column, columnIndex) => {
    const answer = answers?.[rowIndex]?.[columnIndex]
    const expected = evaluate(column.node, row)
    const present = answer === '0' || answer === '1' || answer === 0 || answer === 1
    return { expected, status: !present ? 'missing' : Number(answer) === expected ? 'correct' : 'incorrect' }
  }))
  const flat = cells.flat()
  const correct = flat.filter(cell => cell.status === 'correct').length
  const missing = flat.filter(cell => cell.status === 'missing').length
  const total = flat.length
  const incorrect = total - correct - missing
  return { cells, correct, missing, incorrect, total, complete: missing === 0, allCorrect: correct === total }
}

export function normalisePracticeState(saved) {
  const result = { version: 1, inputCount: saved?.inputCount === 3 ? 3 : 2, modes: {} }
  for (const count of [2, 3]) {
    const previous = saved?.modes?.[count]
    const validTask = taskDefinitions.find(task => task.id === previous?.taskId && task.inputCount === count)
    const task = getTask(validTask?.id ?? taskDefinitions.find(item => item.inputCount === count).id)
    const answers = task.rows.map((_, row) => task.columns.map((_, column) => {
      const value = validTask ? previous?.answers?.[row]?.[column] : ''
      return value === '0' || value === '1' ? value : value === 0 || value === 1 ? String(value) : ''
    }))
    result.modes[count] = { taskId: task.id, answers, checked: Boolean(validTask && previous?.checked === true) }
  }
  return result
}
