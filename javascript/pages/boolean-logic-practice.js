import { readStorage, writeStorage } from '../core/storage.js'
import { getTask, nextTask, blankAnswers, checkTask, normalisePracticeState } from '../core/boolean-logic-model.js'

export const BOOLEAN_PRACTICE_STORAGE_KEY = 'lesson-boolean-logic-practice-v1'

function element(tag, className = '', text) {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (text !== undefined) node.textContent = text
  return node
}

function button(text, attribute, className = 'bl-button') {
  const node = element('button', className, text)
  node.type = 'button'
  node.setAttribute(attribute, '')
  return node
}

export function initBooleanPractice(root = document) {
  const host = root.querySelector('[data-boolean-practice]')
  if (!host || host.dataset.enhanced === 'true') return
  host.dataset.enhanced = 'true'
  host.setAttribute('data-no-slide-advance', '')
  const state = normalisePracticeState(readStorage(BOOLEAN_PRACTICE_STORAGE_KEY, null))
  const save = () => writeStorage(BOOLEAN_PRACTICE_STORAGE_KEY, state)
  const current = () => state.modes[state.inputCount]
  let task
  let answerControls = []

  const ui = element('div', 'bl-practice-ui')
  ui.setAttribute('data-boolean-practice-ui', '')
  const toolbar = element('div', 'bl-practice-toolbar')
  const modeLabel = element('label', 'bl-practice-mode', 'Inputs ')
  const mode = element('select')
  mode.setAttribute('data-practice-mode', '')
  for (const count of [2, 3]) {
    const option = element('option', '', `${count} inputs · ${2 ** count} rows`)
    option.value = String(count)
    mode.append(option)
  }
  mode.value = String(state.inputCount)
  modeLabel.append(mode)
  const newButton = button('New question', 'data-practice-new')
  toolbar.append(modeLabel, newButton)
  const instruction = element('p', 'bl-practice-instruction', 'Choose 0 or 1 in each empty cell. Complete the working columns before the final column.')
  const tableWrap = element('div', 'bl-table-wrap')
  tableWrap.tabIndex = 0
  tableWrap.setAttribute('role', 'region')
  tableWrap.setAttribute('aria-label', 'Truth-table question. Scroll sideways if needed.')
  const table = element('table', 'bl-truth-table bl-practice-table')
  table.setAttribute('data-practice-table', '')
  tableWrap.append(table)
  const actions = element('div', 'bl-practice-actions')
  const checkButton = button('Check answer', 'data-practice-check', 'bl-button bl-button-primary')
  const clearButton = button('Clear answers', 'data-practice-clear')
  actions.append(checkButton, clearButton)
  const feedback = element('p', 'bl-feedback')
  feedback.setAttribute('role', 'status')
  feedback.setAttribute('aria-live', 'polite')
  feedback.setAttribute('data-practice-feedback', '')
  ui.append(toolbar, instruction, tableWrap, actions, feedback)
  host.append(ui)
  const fallback = host.querySelector('[data-boolean-practice-fallback]')
  if (fallback) fallback.hidden = true

  function renderFeedback() {
    const result = current().checked ? checkTask(task, current().answers) : null
    feedback.classList.toggle('is-correct', result?.allCorrect === true)
    feedback.classList.toggle('is-incorrect', Boolean(result && !result.allCorrect))
    if (!result) feedback.textContent = 'Your answers save on this device. Each input setting keeps its own question.'
    else if (result.allCorrect) feedback.textContent = `Correct. All ${result.total} cells are correct.`
    else {
      const messages = [`${result.correct} of ${result.total} cells are correct.`]
      if (result.missing) messages.push(`Fill ${result.missing} empty ${result.missing === 1 ? 'cell' : 'cells'} (?).`)
      if (result.incorrect) messages.push(`Check ${result.incorrect} ${result.incorrect === 1 ? 'cell' : 'cells'} marked ×.`)
      feedback.textContent = messages.join(' ')
    }
    for (const { select, cell, mark, row, column, label } of answerControls) {
      const status = result?.cells[row][column].status
      if (status) cell.dataset.result = status
      else delete cell.dataset.result
      mark.textContent = status === 'correct' ? '✓' : status === 'incorrect' ? '×' : status === 'missing' ? '?' : ''
      select.setAttribute('aria-label', `${label}${status ? `. ${status === 'incorrect' ? 'Try again' : status === 'missing' ? 'Answer missing' : 'Correct'}` : ''}`)
      if (status && status !== 'correct') select.setAttribute('aria-invalid', 'true')
      else select.removeAttribute('aria-invalid')
    }
  }

  function makeHead() {
    const head = element('thead')
    const row = element('tr')
    for (const name of [...task.inputs, ...task.columns.map(column => column.id === 'output' ? task.label : column.label)]) {
      const th = element('th', '', name)
      th.scope = 'col'
      row.append(th)
    }
    head.append(row)
    return head
  }

  function renderTask() {
    task = getTask(current().taskId)
    host.dataset.taskId = task.id
    host.dataset.inputCount = String(state.inputCount)
    instruction.textContent = task.columns.length > 1
      ? 'Choose 0 or 1 in each empty cell. Complete the working columns before the final column.'
      : 'Choose 0 or 1 for each output. Keep the input values as shown.'
    const caption = element('caption', 'sr-only', `Complete the truth table for ${task.label}.`)
    const body = element('tbody')
    answerControls = []
    task.rows.forEach((inputs, rowIndex) => {
      const row = element('tr')
      for (const name of task.inputs) row.append(element('td', 'bl-given', String(inputs[name])))
      task.columns.forEach((column, columnIndex) => {
        const cell = element('td', 'bl-answer-cell')
        const select = element('select', 'bl-answer-select')
        select.setAttribute('data-practice-answer', '')
        select.dataset.row = String(rowIndex)
        select.dataset.column = column.id
        const label = `Row ${rowIndex + 1}: ${task.inputs.map(name => `${name} ${inputs[name]}`).join(', ')}. ${column.id === 'output' ? task.label : column.label}`
        select.setAttribute('aria-label', label)
        for (const value of ['', '0', '1']) {
          const option = element('option', '', value === '' ? '—' : value)
          option.value = value
          select.append(option)
        }
        select.value = current().answers[rowIndex][columnIndex]
        const mark = element('span', 'bl-answer-mark')
        mark.setAttribute('aria-hidden', 'true')
        cell.append(select, mark)
        select.addEventListener('change', () => {
          current().answers[rowIndex][columnIndex] = select.value
          current().checked = false
          save()
          renderFeedback()
        })
        answerControls.push({ select, cell, mark, row: rowIndex, column: columnIndex, label })
        row.append(cell)
      })
      body.append(row)
    })
    table.replaceChildren(caption, makeHead(), body)
    renderFeedback()
  }

  mode.addEventListener('change', () => {
    state.inputCount = mode.value === '3' ? 3 : 2
    save()
    renderTask()
  })
  newButton.addEventListener('click', () => {
    const next = nextTask(state.inputCount, current().taskId)
    state.modes[state.inputCount] = { taskId: next.id, answers: blankAnswers(next), checked: false }
    save()
    renderTask()
  })
  clearButton.addEventListener('click', () => {
    current().answers = blankAnswers(task)
    current().checked = false
    save()
    renderTask()
  })
  checkButton.addEventListener('click', () => {
    current().checked = true
    save()
    renderFeedback()
  })
  renderTask()
}
