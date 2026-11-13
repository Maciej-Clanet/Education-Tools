import { getTask, getRows, evaluate } from '../core/boolean-logic-model.js'

const element = (tag, className = '', text) => {
  const node = document.createElement(tag)
  node.className = className
  if (text !== undefined) node.textContent = text
  return node
}
const button = (text, action, primary = false) => {
  const node = element('button', `bl-button${primary ? ' bl-button-primary' : ''}`, text)
  node.type = 'button'
  node.dataset.booleanAction = action
  return node
}

function initHotel(host) {
  const values = { A: 0, B: 0 }
  let motion
  const ui = element('div', 'bl-hotel-demo')
  ui.dataset.booleanDemoUi = ''
  const controls = element('div', 'bl-hotel-checks')
  const views = ['Card is active', 'Card matches room 214'].map((label, index) => {
    const name = index ? 'B' : 'A'
    const control = button('', name)
    control.className = 'bl-input-toggle'
    control.dataset.booleanInput = name
    const text = element('span', 'bl-input-name', label)
    const value = element('strong', 'bl-input-value')
    control.append(text, value)
    control.addEventListener('click', () => { values[name] = 1 - values[name]; render(true) })
    controls.append(control)
    return { name, label, control, value }
  })
  const rule = element('p', 'bl-hotel-rule', 'Both checks must be true.')
  const result = element('p', 'bl-hotel-result')
  result.dataset.booleanResult = ''
  result.setAttribute('role', 'status')
  const reset = button('Reset inputs', 'reset')
  reset.addEventListener('click', () => { values.A = 0; values.B = 0; render(false) })
  controls.append(rule, result, reset)
  const scene = element('div', 'bl-door-scene')
  scene.setAttribute('aria-hidden', 'true')
  const frame = element('div', 'bl-door-frame')
  const door = element('div', 'bl-scene-door')
  door.append(element('span', 'bl-room-number', '214'))
  const lock = element('div', 'bl-door-lock')
  lock.append(element('span', 'bl-reader-light'), element('span', 'bl-reader-pad'), element('span', 'bl-metal-handle'))
  door.append(lock)
  const card = element('div', 'bl-scene-card')
  card.append(element('small', '', 'ROOM KEY'), element('strong', '', '214'), element('span', '', 'HOTEL'))
  frame.append(door)
  scene.append(frame, card)
  ui.append(controls, scene)
  host.append(ui)
  host.dataset.booleanReady = 'true'
  function render(animate) {
    motion?.cancel()
    const output = values.A && values.B
    const before = host.dataset.output === '1'
    host.dataset.output = String(output)
    scene.dataset.open = String(Boolean(output))
    card.dataset.active = String(Boolean(values.A))
    card.querySelector('strong').textContent = values.B ? '214' : '215'
    views.forEach(({ name, label, control, value }) => {
      control.dataset.state = String(values[name])
      control.setAttribute('aria-pressed', String(Boolean(values[name])))
      control.setAttribute('aria-label', `${label}: ${values[name] ? 'true' : 'false'}. Change this condition.`)
      value.textContent = values[name] ? 'TRUE · 1' : 'FALSE · 0'
    })
    result.textContent = output ? '1 · Door unlocks' : '0 · Door stays locked'
    result.dataset.state = String(output)
    if (animate && before !== Boolean(output) && door.animate) {
      // Teaching movement follows the lock decision, including with reduced motion.
      motion = door.animate([{ transform: `rotateY(${before ? -24 : 0}deg)` }, { transform: `rotateY(${output ? -24 : 0}deg)` }], { duration: 550, easing: 'ease-in-out' })
    }
  }
  render(false)
  document.addEventListener('visibilitychange', () => { if (document.hidden) motion?.cancel() })
  window.addEventListener('pagehide', () => motion?.cancel())
  if (typeof IntersectionObserver === 'function') new IntersectionObserver(entries => {
    if (!entries[0]?.isIntersecting) motion?.cancel()
  }).observe(host)
}

const tableTasks = { and: 'two-and', or: 'two-or', card: 'two-and-not-b', alarm: 'three-and-or', college: 'three-and-not-c' }
function initTable(host) {
  const kind = host.dataset.booleanTable
  const task = kind === 'not'
    ? { inputs: ['A'], label: 'NOT A', rows: getRows(['A']), columns: [{ id: 'output', label: 'NOT A', node: { op: 'NOT', input: 'A' } }] }
    : getTask(tableTasks[kind])
  const answers = task.rows.map(() => task.columns.map(() => ''))
  const values = { A: 0, B: 0, C: 0 }
  let shown = false, checked = false
  const ui = element('div', `bl-classroom bl-classroom--${kind}`)
  ui.dataset.booleanTableUi = ''
  const toggles = []
  if (kind === 'alarm') {
    const inputs = element('div', 'bl-row-toggles')
    for (const [name, label] of [['A', 'Alarm armed'], ['B', 'Door open'], ['C', 'Window open']]) {
      const control = button('', name)
      control.className = 'bl-input-toggle'
      control.dataset.booleanInput = name
      const value = element('strong', 'bl-input-value')
      control.append(element('span', 'bl-input-name', `${name} · ${label}`), value)
      control.addEventListener('click', () => { values[name] = 1 - values[name]; highlight() })
      inputs.append(control)
      toggles.push({ name, control, value })
    }
    ui.append(inputs)
  }
  const wrap = element('div', 'bl-table-wrap')
  wrap.tabIndex = 0
  wrap.setAttribute('role', 'region')
  wrap.setAttribute('aria-label', `Truth table for ${task.label}. Scroll sideways if needed.`)
  const table = element('table', 'bl-truth-table bl-class-table')
  table.dataset.booleanClassTable = ''
  table.append(element('caption', 'sr-only', `Complete the truth table for ${task.label}.`))
  const head = table.createTHead().insertRow()
  const names = [...task.inputs, ...task.columns.map(column => column.id === 'output' ? task.label : column.label)]
  names.forEach(name => { const th = element('th', '', name); th.scope = 'col'; head.append(th) })
  const body = table.createTBody()
  const cells = [], rows = []
  task.rows.forEach((inputs, row) => {
    const tr = body.insertRow()
    tr.dataset.row = String(row)
    rows.push(tr)
    task.inputs.forEach(name => tr.append(element('td', '', String(inputs[name]))))
    task.columns.forEach((column, col) => {
      const td = element('td', 'bl-answer-cell')
      const select = element('select', 'bl-answer-select')
      select.dataset.tableAnswer = ''
      select.dataset.row = String(row)
      select.dataset.column = column.id
      const name = column.id === 'output' ? task.label : column.label
      const label = `Row ${row + 1}, ${task.inputs.map(input => `${input} ${inputs[input]}`).join(', ')}. ${name}`
      select.setAttribute('aria-label', label)
      for (const value of ['', '0', '1']) { const option = element('option', '', value || '—'); option.value = value; select.append(option) }
      const mark = element('span', 'bl-answer-mark')
      mark.setAttribute('aria-hidden', 'true')
      select.addEventListener('change', () => { answers[row][col] = select.value; checked = false; render() })
      td.append(select, mark)
      tr.append(td)
      cells.push({ td, select, mark, row, col, label, expected: String(evaluate(column.node, inputs)) })
    })
  })
  wrap.append(table)
  const actions = element('div', 'bl-class-actions')
  const check = button('Check answer', 'check', true)
  const show = button('Show answers', 'show')
  const clear = button('Clear table', 'clear')
  check.addEventListener('click', () => { if (!shown) { checked = true; render() } })
  show.addEventListener('click', () => { shown = !shown; render() })
  clear.addEventListener('click', () => { answers.forEach(row => row.fill('')); shown = false; checked = false; render() })
  actions.append(check, show, clear)
  const status = element('p', 'bl-class-status')
  status.setAttribute('role', 'status')
  const selected = element('p', 'bl-selected-row')
  selected.setAttribute('role', 'status')
  ui.append(wrap, actions, status)
  if (kind === 'alarm') ui.append(selected)
  host.append(ui)
  host.dataset.enhanced = 'true'
  function render() {
    host.dataset.answersShown = String(shown)
    let correct = 0, missing = 0
    cells.forEach(({ td, select, mark, row, col, label, expected }) => {
      const answer = answers[row][col]
      const state = answer === '' ? 'missing' : answer === expected ? 'correct' : 'incorrect'
      correct += Number(state === 'correct'); missing += Number(state === 'missing')
      select.value = shown ? expected : answer
      select.disabled = shown
      select.setAttribute('aria-label', `${label}${shown ? '. Answer shown' : checked ? `. ${state}` : ''}`)
      mark.textContent = !shown && checked ? state === 'correct' ? '✓' : state === 'missing' ? '?' : '×' : ''
      if (!shown && checked) td.dataset.result = state
      else delete td.dataset.result
      if (!shown && checked && state !== 'correct') select.setAttribute('aria-invalid', 'true')
      else select.removeAttribute('aria-invalid')
    })
    show.textContent = shown ? 'Hide answers' : 'Show answers'
    show.setAttribute('aria-pressed', String(shown))
    check.setAttribute('aria-disabled', String(shown))
    status.textContent = shown ? 'Answers shown. Hide answers to return to your table.' : !checked ? '' : correct === cells.length ? 'Correct. All cells are correct.' : `${correct} of ${cells.length} cells are correct.${missing ? ` Fill ${missing} empty cells (?).` : ' Check the cells marked ×.'}`
  }
  function highlight() {
    const active = task.rows.findIndex(row => task.inputs.every(name => row[name] === values[name]))
    host.dataset.activeRow = String(active)
    toggles.forEach(({ name, control, value }) => {
      control.setAttribute('aria-pressed', String(Boolean(values[name])))
      control.dataset.state = String(values[name])
      value.textContent = `${values[name]} · ${values[name] ? 'true' : 'false'}`
    })
    rows.forEach((row, index) => {
      row.classList.toggle('is-active', index === active)
      if (index === active) row.setAttribute('aria-current', 'true')
      else row.removeAttribute('aria-current')
    })
    selected.textContent = `Highlighted row: A = ${values.A}, B = ${values.B}, C = ${values.C}.`
  }
  render()
  if (kind === 'alarm') highlight()
}

export function initBooleanDemos(root = document) {
  root.querySelectorAll('[data-boolean-demo="hotel"]:not([data-boolean-ready])').forEach(initHotel)
  root.querySelectorAll('[data-boolean-table]:not([data-enhanced])').forEach(initTable)
}
