import { readStorage, writeStorage } from './storage.js'
import { nextKernelState } from './kernel-visualiser.js'
import { buildPacketJourney, DEFAULT_PACKET_MESSAGE, PACKET_CASES } from '../data/packet-journey-model.js'

const DRAFT_KEY = 'lesson-packet-journey-v1'
function element(tag, className, text) {
  const node = document.createElement(tag)
  node.className = className
  if (text !== undefined) node.textContent = text
  return node
}

function initFields(root) {
  root.querySelectorAll('[data-packet-fields]').forEach(tool => {
    const buttons = [...tool.querySelectorAll('[data-packet-field]')]
    const panels = [...tool.querySelectorAll('[data-field-panel]')]
    const show = key => {
      buttons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.packetField === key)))
      panels.forEach(p => { p.hidden = p.dataset.fieldPanel !== key })
    }
    buttons.forEach(b => b.addEventListener('click', () => show(b.dataset.packetField)))
    show('source')
  })
}

function initJourney(root) {
  const tool = root.querySelector('[data-packet-simulator]')
  if (!tool) return
  const saved = readStorage(DRAFT_KEY, {})
  // Preserve the original learner-authored message, without rewriting the old store.
  const legacy = readStorage('lesson-packet-switching-simulator', {})
  const input = tool.querySelector('[data-packet-message]')
  const condition = tool.querySelector('[data-packet-case]')
  input.value = typeof saved?.message === 'string' ? saved.message : typeof legacy?.message === 'string' ? legacy.message : DEFAULT_PACKET_MESSAGE
  input.value = Array.from(input.value).slice(0, 120).join('')
  condition.value = PACKET_CASES.includes(saved?.scenario) ? saved.scenario : 'normal'
  let journey = buildPacketJourney(input.value, condition.value)
  let state = { index: 0, playing: false }
  const previous = tool.querySelector('[data-journey-prev]')
  const next = tool.querySelector('[data-journey-next]')
  const reset = tool.querySelector('[data-journey-reset]')
  const eventBox = tool.querySelector('[data-journey-events]')
  const receivedBox = tool.querySelector('[data-journey-received]')

  function render(animateLast = false) {
    const frame = journey.frames[state.index]
    previous.setAttribute('aria-disabled', String(state.index === 0))
    reset.setAttribute('aria-disabled', String(state.index === 0))
    next.setAttribute('aria-disabled', String(state.index === journey.frames.length - 1))
    next.textContent = ['loss', 'damage'].includes(condition.value) && state.index === journey.frames.length - 2 ? 'Resend missing data' : 'Next event'
    tool.querySelector('[data-journey-step]').textContent = `Step ${state.index + 1} of ${journey.frames.length}`
    tool.querySelector('[data-journey-status]').textContent = frame.status
    input.setAttribute('aria-invalid', String(!journey.packets.length))
    const labels = { accepted: 'Accepted', lost: 'Lost', rejected: 'Check failed', resent: 'Resent · accepted' }
    eventBox.replaceChildren(...frame.arrivals.map((event, i) => {
      const card = element('div', `pk-event pk-piece--${event.id}${['lost', 'rejected'].includes(event.outcome) ? ' is-problem' : ''}${animateLast && i === frame.arrivals.length - 1 ? ' pk-new-event' : ''}`)
      card.append(element('strong', '', `Packet ${event.id}`), element('span', '', labels[event.outcome]))
      return card
    }))
    if (!frame.arrivals.length) eventBox.append(element('p', 'pk-empty', 'No packet has travelled yet.'))
    receivedBox.replaceChildren(...journey.packets.map(packet => {
      const present = frame.received.includes(packet.id)
      const card = element('div', `pk-piece pk-piece--${packet.id}${present ? '' : ' is-missing'}`)
      card.append(element('strong', '', `Position ${packet.id}`), element('span', '', present ? packet.payload : 'Waiting'))
      return card
    }))
    tool.querySelector('[data-journey-message]').textContent = frame.complete ? `Rebuilt message: ${frame.message}` : 'The message is not complete yet.'
  }
  function move(action) {
    const oldArrivals = journey.frames[state.index].arrivals.length
    state = nextKernelState(state, action, journey.frames.length)
    render(action === 'step' && journey.frames[state.index].arrivals.length > oldArrivals)
  }
  function prepare() {
    journey = buildPacketJourney(input.value, condition.value)
    state = nextKernelState(state, 'reset', journey.frames.length)
    writeStorage(DRAFT_KEY, { message: input.value, scenario: condition.value })
    render()
  }
  previous.addEventListener('click', () => move('previous'))
  next.addEventListener('click', () => move('step'))
  reset.addEventListener('click', () => move('reset'))
  input.addEventListener('input', prepare)
  condition.addEventListener('change', prepare)
  tool.querySelector('[data-simulator-controls]').hidden = false
  tool.dataset.simulatorReady = 'true'
  render()
}

function initOrdering(root) {
  root.querySelectorAll('[data-order-task]').forEach(tool => {
    const selects = [...tool.querySelectorAll('[data-order-slot]')]
    const feedback = tool.querySelector('[data-order-feedback]')
    const clearFeedback = () => {
      feedback.textContent = ''
      selects.forEach(s => { s.classList.remove('is-correct', 'is-incorrect'); s.removeAttribute('aria-invalid') })
    }
    selects.forEach(s => s.addEventListener('change', clearFeedback))
    tool.querySelector('[data-check-order]').addEventListener('click', () => {
      clearFeedback()
      if (selects.some(s => !s.value)) { feedback.textContent = 'Choose a packet for all three positions.'; return }
      const correct = selects.every(s => s.value === s.dataset.orderSlot)
      selects.forEach(s => {
        const matches = s.value === s.dataset.orderSlot
        s.classList.add(matches ? 'is-correct' : 'is-incorrect')
        s.setAttribute('aria-invalid', String(!matches))
      })
      feedback.textContent = correct ? 'Correct: MEET AT THE GATE AT FOUR. Sequence information restores the original order.' : 'Not yet. Use each packet once and follow the sequence numbers, not the arrival order.'
    })
    tool.querySelector('[data-reset-order]').addEventListener('click', () => { selects.forEach(s => { s.value = '' }); clearFeedback() })
  })
}

export function initPacketActivities(root = document) {
  initFields(root)
  initJourney(root)
  initOrdering(root)
}
