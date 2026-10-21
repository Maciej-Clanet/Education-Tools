import { nextKernelState } from '../core/kernel-visualiser.js'
import { twosFrames, pointFrames, floatAllocation } from '../core/negative-floating-model.js'

const element = (tag, className, text) => {
  const node = document.createElement(tag)
  node.className = className
  if (text !== undefined) node.textContent = text
  return node
}

function initDemo(host) {
  const kind = host.dataset.numberDemo
  const twos = kind === 'twos'
  const model = twos ? twosFrames(5) : null
  const frames = twos ? model.frames : pointFrames(kind)
  let state = { index: 0, playing: false }
  let timer = null
  let animations = []
  let visible = false
  const shell = element('div', 'nf-player')
  shell.setAttribute('role', 'group')
  shell.setAttribute('aria-label', twos ? "Write −5 in two's complement" : 'Move the binary point one place at a time')
  const board = element('div', 'nf-demo-board')
  let cells, carryCells, invertedCells, addCells, dot, digits, expression, value
  if (twos) {
    const wrap = element('div', 'nf-table-scroll')
    wrap.tabIndex = 0
    wrap.setAttribute('role','group')
    wrap.setAttribute('aria-label', 'Four steps for −5; scroll to see all eight places')
    const table = element('table','nf-calculation-table')
    table.append(element('caption','','Working place values; read the final first place as −128.'))
    const head = table.createTHead().insertRow()
    for (const label of ['Place value',128,64,32,16,8,4,2,1]) {
      const cell = element('th','',label); cell.scope = 'col'; head.append(cell)
    }
    let body = table.createTBody()
    const makeRow = (label, bits, rowClass = '') => {
      const row = body.insertRow()
      row.className = rowClass
      const heading = element('th','',label); heading.scope = 'row'; row.append(heading)
      const result = [...bits].map(bit => element('td', 'nf-bit', bit))
      row.append(...result)
      return result
    }
    makeRow('Step 1 · Positive 5', model.original)
    body = table.createTBody(); body.className = 'nf-addition-group'
    carryCells = makeRow('Carry (none needed)', '        ', 'nf-carry-row')
    invertedCells = makeRow('Step 2 · Invert bits', '········')
    addCells = makeRow('+ Step 3 · Add 1', '········', 'nf-fixed-add')
    cells = makeRow('= Step 4 · Result', '········', 'nf-current-row')
    wrap.append(table); board.append(wrap)
  } else {
    if (kind !== 'large') board.append(element('p', 'nf-caption', kind === 'scale'
      ? 'Each ×2 moves the point right and doubles the measurement.'
      : kind === 'decode' ? 'Use the exponent +3: multiply by 2 three times.'
        : 'Goal: one 1 before the point. Keep the measurement unchanged.'))
    const track = element('div', 'nf-point-track')
    digits = [...frames[0].digits].map(bit => element('span', 'nf-point-digit', bit))
    track.append(...digits)
    dot = element('span', 'nf-moving-point', '.')
    dot.setAttribute('aria-hidden', 'true')
    track.setAttribute('aria-hidden', 'true')
    track.append(dot)
    board.append(track)
    expression = element('p', 'nf-point-expression')
    value = element('p', 'nf-constant')
    board.append(expression, value)
  }
  const report = element('div', 'nf-demo-report')
  report.setAttribute('aria-live', 'polite')
  report.setAttribute('aria-atomic', 'true')
  const status = element('p', 'nf-step-status')
  const title = element('h3', 'nf-step-title')
  const detail = element('p', 'nf-step-detail')
  report.append(status, title, detail)
  const controls = element('div', 'nf-controls')
  const buttons = {}
  for (const [action, label] of [['previous','Previous step'], ['step','Next step'], ['play','Play'], ['reset','Reset']]) {
    const button = element('button', action === 'step' ? 'primary-link' : 'lesson-secondary-action', label)
    button.type = 'button'
    button.dataset.numberAction = action
    button.addEventListener('click', () => dispatch(action === 'play' && state.playing ? 'pause' : action))
    buttons[action] = button
    controls.append(button)
  }
  shell.append(board, report, controls)
  host.append(shell)
  host.classList.add('nf-enhanced')

  function cancelMotion() {
    animations.forEach(animation => animation.cancel())
    animations = []
  }
  function render(previousIndex, motion = false) {
    const frame = frames[state.index]
    const previous = frames[previousIndex]
    cancelMotion()
    if (twos) {
      const inverted = frames[1].bits
      invertedCells.forEach((cell,index) => {
        cell.textContent = state.index >= 1 ? inverted[index] : '·'
        cell.classList.toggle('nf-changed',state.index === 1)
        if (motion && state.index === 1) animations.push(cell.animate([{transform:'scaleY(1)'},{transform:'scaleY(0)',offset:.45},{transform:'scaleY(1)'}],{duration:420}))
      })
      addCells.forEach((cell,index) => {
        cell.textContent = state.index >= 2 ? '00000001'[index] : '·'
        cell.classList.toggle('nf-changed',state.index === 2 && index === 7)
      })
      cells.forEach((cell, index) => {
        cell.textContent = state.index >= 3 ? frame.bits[index] : '·'
        cell.classList.toggle('nf-changed', state.index >= 3 && frame.changed.includes(index))
        if (motion && state.index >= 3 && previous.bits[index] !== frame.bits[index]) {
          // Finite, requested teaching motion: remain available with reduced motion.
          animations.push(cell.animate([{ transform:'scaleY(1)' }, { transform:'scaleY(0)', offset:0.45 }, { transform:'scaleY(1)' }], { duration:420 }))
        }
      })
      carryCells.forEach((cell, index) => {
        cell.textContent = index === frame.carry ? '1 ↓' : ''
        cell.classList.toggle('nf-carry-active', index === frame.carry)
      })
      if (motion && frame.carry >= 0 && previous.carry >= 0 && previous.carry !== frame.carry) {
        const distance = carryCells[previous.carry].getBoundingClientRect().left - carryCells[frame.carry].getBoundingClientRect().left
        animations.push(carryCells[frame.carry].animate([{ transform:`translateX(${distance}px)` }, { transform:'translateX(0)' }], { duration:500, easing:'ease-in-out' }))
      }
    } else {
      const left = `${frame.point / frame.digits.length * 100}%`
      dot.style.left = left
      if (motion && frame.point !== previous.point) {
        animations.push(dot.animate([{ left:`${previous.point / frame.digits.length * 100}%` }, { left }], { duration:600, easing:'ease-in-out' }))
      }
      digits.forEach((digit, index) => digit.classList.toggle('nf-leading-zero', kind === 'small' && state.index === frames.length - 1 && index < 3))
      expression.replaceChildren(element('span', 'nf-mantissa', frame.mantissa))
      if (kind !== 'scale') {
        const multiplier = element('span', 'nf-exponent', '2')
        multiplier.append(element('sup', '', String(frame.exponent).replace('-', '−')))
        expression.append(document.createTextNode(' × '),multiplier)
      } else expression.append(element('small','',' (binary)'))
      value.textContent = kind === 'scale' ? `Measurement: ${frame.value} in denary.` : `Measurement stays at ${frame.value} in denary.`
    }
    status.textContent = `Step ${state.index + 1} of ${frames.length}`
    title.textContent = frame.title
    detail.textContent = frame.detail
    buttons.previous.setAttribute('aria-disabled', String(state.index === 0))
    buttons.step.setAttribute('aria-disabled', String(state.index === frames.length - 1))
    buttons.play.setAttribute('aria-disabled', String(state.index === frames.length - 1))
    buttons.play.textContent = state.playing ? 'Pause' : 'Play'
    buttons.play.setAttribute('aria-pressed', String(state.playing))
    host.dataset.step = String(state.index)
    host.dataset.playing = String(state.playing)
  }
  function dispatch(action) {
    clearTimeout(timer)
    const previous = state.index
    state = nextKernelState(state, action, frames.length)
    render(previous, previous !== state.index && action !== 'reset')
    if (state.playing) timer = setTimeout(() => dispatch('tick'), 1800)
  }
  const pause = () => { if (state.playing) dispatch('pause') }
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting
    if (!visible) pause()
  }, { threshold:0 }).observe(host)
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause() })
  window.addEventListener('pagehide', () => { pause(); cancelMotion() })
  // A slide change can precede IntersectionObserver delivery.
  window.addEventListener('hashchange', () => {
    if (!visible || (document.body.classList.contains('teacher-mode-active') && !location.hash.startsWith(`#${host.closest('section').id}`))) pause()
  })
  render(0)
}

export function initNumberDemos(root = document) {
  root.querySelectorAll('[data-number-demo]').forEach(initDemo)
  const signTool = root.querySelector('[data-float-sign]')
  if (signTool) {
    signTool.querySelector('.nf-sign-controls').hidden = false
    signTool.querySelectorAll('[data-sign]').forEach(button => button.addEventListener('click', () => {
      const negative = button.dataset.sign === '1'
      signTool.querySelector('[data-sign-bit]').textContent = negative ? '1' : '0'
      signTool.querySelector('[data-signed-value]').textContent = `${negative ? '−' : '+'}1.10101 × 2³ = ${negative ? '−' : '+'}13.25`
      signTool.querySelectorAll('[data-sign]').forEach(choice => choice.setAttribute('aria-pressed', String(choice === button)))
    }))
    signTool.querySelector('[data-signed-value]').setAttribute('aria-live', 'polite')
  }
  const allocation = root.querySelector('[data-allocation]')
  if (allocation) {
    const input = allocation.querySelector('input')
    const render = () => {
      const model = floatAllocation(Number(input.value))
      const strip = allocation.querySelector('[data-allocation-strip]')
      strip.replaceChildren(...['S', ...Array(model.exponentBits).fill('E'), ...Array(model.mantissaBits).fill('M')].map(type => {
        const bit = element('span', `nf-allocation-${type.toLowerCase()}`, type)
        return bit
      }))
      strip.setAttribute('aria-label', `One sign bit, ${model.exponentBits} exponent bits, ${model.mantissaBits} mantissa bits`)
      allocation.querySelector('[data-allocation-range]').textContent = `${model.exponentBits} exponent bits: exponents ${model.minExponent} to +${model.maxExponent}.`
      allocation.querySelector('[data-allocation-precision]').textContent = `${model.mantissaBits} mantissa bits: values near 1 are ${model.gap} apart.`
      const ticks = allocation.querySelector('[data-precision-ticks]')
      ticks.replaceChildren(...Array.from({ length:Math.round(1 / model.gap) + 1 }, () => element('i', '', '')))
      allocation.querySelector('[data-precision-line]').setAttribute('aria-label', `Values from 1 to 2, with a gap of ${model.gap}`)
    }
    allocation.querySelector('[data-allocation-controls]').hidden = false
    input.addEventListener('input', render)
    render()
  }
}
