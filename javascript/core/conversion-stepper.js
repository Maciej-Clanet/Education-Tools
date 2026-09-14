import { BYTE_UNITS, BINARY_UNITS, describeUnit, createConversionPlan, formatDataNumber as number } from './data-unit-conversion.js'
import { nextKernelState } from './kernel-visualiser.js'
import { dataConversionExamples } from '../data/data-conversion-examples.js'

function element(tag, className = '', text) {
  const node = document.createElement(tag)
  node.className = className
  if (text !== undefined) node.textContent = text
  return node
}

function unitNode(symbol, plan, active) {
  const node = element('span', 'du-rung')
  node.dataset.unit = symbol
  node.append(element('strong', '', symbol))
  const labels = []
  if (symbol === plan.from) { node.dataset.start = ''; labels.push('Start') }
  if (symbol === plan.to) { node.dataset.target = ''; labels.push('Target') }
  if (labels.length) node.append(element('small', '', labels.join(' + ')))
  if (symbol === active) { node.setAttribute('aria-current', 'step'); node.append(element('small', '', 'Current')) }
  return node
}

function drawLadder(host, plan, active) {
  const units = plan.rail
  const ladder = element('div', 'du-ladder')
  ladder.setAttribute('aria-label', 'Larger units to the right; smaller units to the left')
  units.forEach((unit, index) => {
    if (index) {
      const edge = element('span', 'du-link')
      edge.append(element('span', '', `÷${plan.base} →`), element('span', '', `← ×${plan.base}`))
      ladder.append(edge)
    }
    ladder.append(unitNode(unit, plan, active))
  })
  host.replaceChildren(ladder)
}

function frameCopy(plan, frame) {
  const edge = plan.edges[frame.edge]
  switch (frame.kind) {
    case 'locate': return ['Find the start and target', `${number(plan.value)} ${plan.from} → ? ${plan.to}`, 'The data stays the same. Find the labelled start and target units on the ladder.']
    case 'direction': {
      const explanation = plan.direction === 'larger' ? 'Larger pieces mean fewer pieces: the final number should be smaller.' : plan.direction === 'smaller' ? 'Smaller pieces mean more pieces: the final number should be larger.' : 'The units match, so the number stays the same.'
      return ['Which direction?', plan.direction === 'same' ? 'Same unit' : `${plan.to} is a ${plan.direction} unit`, explanation + (plan.edges.length ? ` ${plan.direction === 'larger' ? 'Divide' : 'Multiply'} along the route.` : '')]
    }
    case 'jump': return [`Count the jumps: ${frame.edge + 1} of ${plan.edges.length}`, `${edge.from} → ${edge.to}`, `PREFIX STEP · one adjacent unit change uses ${plan.base}.`]
    case 'calculate': return [`Apply relationship ${frame.edge + 1} of ${plan.edges.length}`, `${number(edge.before)} ${edge.from} ${edge.operation}${frame.edge < plan.edges.length - 1 ? ` = ${number(edge.after)} ${edge.to}` : ` = ? ${edge.to}`}`, `Use ${plan.base} for this prefix step. ${frame.edge < plan.edges.length - 1 ? 'Carry this intermediate amount into the next step.' : 'Calculate, then reveal the answer with its target unit.'}`]
    case 'unchanged': return ['No jumps needed', `${plan.from} → ${plan.to}`, 'The start and target units are identical. No multiplication or division is needed.']
    case 'result': {
      const formatted = number(plan.result)
      const rounded = Number(formatted.replaceAll(',', '')) !== plan.result
      return ['Answer and sense check', `${rounded ? '≈ ' : ''}${formatted} ${plan.to}`, `${number(plan.value)} ${plan.from} represents the same amount. ${plan.value === 0 ? 'Zero stays zero in every unit.' : plan.direction === 'same' ? 'Same unit, same number.' : `Unit became ${plan.direction}; number became ${plan.direction === 'larger' ? 'smaller' : 'larger'}. ✓ Sensible.`}${rounded ? ' Display rounded to 12 significant digits.' : ''}`]
    }
  }
}

export function initConversionSteppers(root = document) {
  root.querySelectorAll('[data-conversion-stepper]').forEach(host => {
    if (host.dataset.stepperReady) return
    host.dataset.stepperReady = 'true'
    const demo = dataConversionExamples[host.dataset.conversionStepper]
    const initial = demo ?? dataConversionExamples.binary
    let plan = null, state = { index: 0, playing: false }
    const form = host.querySelector('form')
    const query = selector => host.querySelector(selector)
    const board = query('[data-convert-board]')
    function showPending() {
      plan = null; state = { index: 0, playing: false }; board.hidden = true
      query('[data-convert-message]').classList.remove('sr-only')
      query('[data-convert-message]').textContent = 'Choose a conversion, then start to follow its route.'
      query('[data-convert-action=previous]').disabled = true
      query('[data-convert-action=step]').disabled = true
    }
    function syncSystem(fromRank, toRank) {
      const base = Number(query('[data-convert-base]').value)
      const units = base === 1024 ? BINARY_UNITS : BYTE_UNITS
      for (const [selector, rank] of [['[data-convert-from]', fromRank], ['[data-convert-to]', toRank]]) {
        const select = query(selector)
        select.replaceChildren(...units.map(symbol => {
          const option = element('option', '', symbol); option.value = symbol; return option
        }))
        select.value = units[rank]
      }
      query('[data-convert-convention-note]').textContent = base === 1024 ? 'Binary-prefix byte units: each adjacent step uses 1024.' : 'Decimal byte units: each adjacent step uses 1000.'
    }
    function render() {
      if (!plan) return
      board.hidden = false
      query('[data-convert-message]').classList.add('sr-only')
      const frame = plan.frames[state.index], edge = plan.edges[frame.edge]
      const active = frame.kind === 'result' ? plan.to : edge ? frame.kind === 'jump' ? edge.to : edge.from : plan.from
      drawLadder(query('[data-convert-ladder]'), plan, active)
      const route = query('[data-convert-route]')
      route.replaceChildren()
      if (['jump', 'calculate', 'result'].includes(frame.kind)) {
        route.append(element('span', '', plan.from))
        plan.edges.forEach((item, index) => {
          const segment = element('span', 'du-route-segment')
          segment.textContent = ` ${frame.kind === 'jump' ? '→' : item.operation + ' →'} ${item.to}`
          if (index === frame.edge) segment.setAttribute('aria-current', 'step')
          route.append(segment)
        })
      }
      const [title, expression, explanation] = frameCopy(plan, frame)
      query('[data-convert-stage]').textContent = `${state.index + 1} / ${plan.frames.length} · ${title}`
      query('[data-convert-expression]').textContent = expression
      query('[data-convert-explanation]').textContent = explanation
      query('[data-convert-message]').textContent = `${title}. ${expression}. ${explanation}`
      query('[data-convert-action=previous]').disabled = state.index === 0
      query('[data-convert-action=step]').disabled = state.index === plan.frames.length - 1
      query('[data-convert-shortcut]').hidden = !(frame.kind === 'result' && plan.edges.length > 1)
      const exponent = ['', '', '²', '³', '⁴'][plan.edges.length] ?? ''
      query('[data-convert-shortcut]').textContent = `After walking the route: ${number(plan.value)} ${plan.direction === 'larger' ? '÷' : '×'} ${plan.base}${exponent} ${plan.direction === 'larger' ? 'divides' : 'multiplies'} across ${plan.edges.length} prefix steps.`
    }
    function start(config) {
      try {
        plan = createConversionPlan(config.value, config.from, config.to, config.base)
        state = { index: 0, playing: false }; render()
      } catch (error) {
        showPending(); query('[data-convert-message]').textContent = error.message
      }
    }
    function reset() {
      if (demo) { start(initial); return }
      query('[data-convert-value]').value = initial.value
      query('[data-convert-base]').value = initial.base
      syncSystem(describeUnit(initial.from).rank, describeUnit(initial.to).rank)
      showPending()
    }
    host.querySelectorAll('[data-convert-action]').forEach(button => button.addEventListener('click', () => {
      const action = button.dataset.convertAction
      if (action === 'reset') { reset(); return }
      if (plan) { state = nextKernelState(state, action, plan.frames.length); render() }
    }))
    if (form) {
      form.addEventListener('submit', event => {
        event.preventDefault()
        start({ value: query('[data-convert-value]').value, from: query('[data-convert-from]').value, to: query('[data-convert-to]').value, base: query('[data-convert-base]').value })
      })
      form.addEventListener('input', event => {
        if (event.target.matches('[data-convert-base]')) syncSystem(describeUnit(query('[data-convert-from]').value).rank, describeUnit(query('[data-convert-to]').value).rank)
        showPending()
      })
      host.addEventListener('conversion:load', event => {
        const config = event.detail
        query('[data-convert-value]').value = config.value
        query('[data-convert-base]').value = config.base ?? 1000
        syncSystem(describeUnit(config.from).rank, describeUnit(config.to).rank)
        start(config)
        query('[data-convert-action=step]').focus({ preventScroll: true })
      })
    }
    reset()
  })
}
