import { createStructureState, describeStructure, performStructureOperation } from '../data/structure-model.js'

function element(tag, className, text = '') {
  const node = document.createElement(tag)
  node.className = className
  node.textContent = text
  return node
}

export function initStructureExplorers(root = document) {
  root.querySelectorAll('[data-structure-explorer]').forEach(host => {
    if (host.dataset.sxReady) return
    const kind = host.dataset.structureExplorer
    const stack = kind === 'stack'
    let initial
    try {
      initial = createStructureState(kind, {
        capacity: Number(host.dataset.sxCapacity || 5),
        items: JSON.parse(host.dataset.sxInitial || '["A","B","C"]'),
      })
    } catch { return } // Invalid authoring leaves the readable static example intact.
    let state = initial
    let motions = []
    let flights = []
    const diagram = host.querySelector('[data-sx-diagram]')
    const slots = host.querySelector('[data-sx-slots]')
    const input = host.querySelector('[data-sx-input]')
    const output = host.querySelector('[data-sx-result]')
    const outputLabel = host.querySelector('[data-sx-result-label]')
    const outputNote = host.querySelector('[data-sx-result-note]')
    const status = host.querySelector('[data-sx-status]')
    const add = stack ? 'push' : 'enqueue'

    function clearMotion() {
      motions.forEach(animation => animation.cancel())
      flights.forEach(node => node.remove())
      motions = []
      flights = []
    }
    function motion(node, frames) {
      if (node && typeof node.animate === 'function') motions.push(node.animate(frames, { duration: 220, easing: 'ease-out' }))
    }
    function returnItem(item, origin) {
      if (!origin || typeof output.animate !== 'function') return
      const destination = output.getBoundingClientRect()
      const ghost = element('div', 'structure-explorer-flight', item)
      ghost.setAttribute('aria-hidden', 'true')
      Object.assign(ghost.style, { left: `${origin.left}px`, top: `${origin.top}px`, width: `${origin.width}px`, height: `${origin.height}px` })
      document.body.append(ghost)
      flights.push(ghost)
      const x = destination.left + destination.width / 2 - origin.left - origin.width / 2
      const y = destination.top + destination.height / 2 - origin.top - origin.height / 2
      const animation = ghost.animate([
        { transform: 'translate(0, 0) scale(1)', opacity: .95 },
        { transform: `translate(${x}px, ${y}px) scale(${destination.width / origin.width}, ${destination.height / origin.height})`, opacity: .15 },
      ], { duration: 300, easing: 'ease-out' })
      motions.push(animation)
      animation.finished.then(() => ghost.remove(), () => ghost.remove())
    }
    function render() {
      const indices = Array.from({ length: state.capacity }, (_, index) => index)
      if (stack) indices.reverse()
      slots.replaceChildren(...indices.map(index => {
        const item = state.items[index]
        const occupied = item !== undefined
        const slot = element('div', `sx-slot${occupied ? ' sx-occupied' : ''}`)
        slot.dataset.sxSlot = String(index)
        const last = occupied && index === state.items.length - 1
        if (stack) slot.append(element('span', 'sx-marker', last ? 'Top →' : ''))
        else slot.append(element('span', 'sx-marker sx-front', occupied && index === 0 ? 'Front' : ''))
        slot.append(element('span', 'sx-item', occupied ? item : '·'))
        if (!stack) slot.append(element('span', 'sx-marker sx-rear', last ? 'Rear' : ''))
        return slot
      }))
      host.querySelector('[data-sx-count]').textContent = String(state.items.length)
      host.querySelector('[data-sx-empty]').hidden = state.items.length !== 0
      diagram.setAttribute('aria-label', describeStructure(state))
    }
    function act(operation) {
      clearMotion()
      host.dataset.sxLastOperation = operation
      if (operation === 'reset') {
        state = initial
        input.value = 'D'
        outputLabel.textContent = 'Returned item'
        output.textContent = '—'
        outputNote.textContent = 'No operation yet'
        status.textContent = `Reset: ${describeStructure(state)}`
        render()
        return
      }
      const sourceIndex = stack ? state.items.length - 1 : 0
      const origin = slots.querySelector(`[data-sx-slot="${sourceIndex}"] .sx-item`)?.getBoundingClientRect()
      const { state: next, result } = performStructureOperation(state, operation, input.value)
      state = next
      render()
      status.textContent = result.message
      // A previous result is never mistaken for the result of a failed operation.
      output.textContent = result.ok && result.effect !== 'add' ? result.item : '—'
      outputLabel.textContent = result.effect === 'peek' ? 'Peeked item' : result.effect === 'remove' ? 'Removed item' : 'Returned item'
      outputNote.textContent = !result.ok ? 'No item returned' : result.effect === 'peek' ? 'Still in the structure' : result.effect === 'remove' ? 'No longer stored' : 'Add does not remove an item'
      if (result.effect === 'add') {
        motion(slots.querySelector(`[data-sx-slot="${result.index}"] .sx-item`), [{ transform: stack ? 'translateY(-22px)' : 'translateX(22px)', opacity: .3 }, { transform: 'translate(0)', opacity: 1 }])
      } else if (result.ok) {
        returnItem(result.item, origin)
        if (result.effect === 'peek') {
          motion(slots.querySelector(`[data-sx-slot="${result.index}"] .sx-item`), [{ outline: '3px solid currentColor', outlineOffset: '3px' }, { outline: '0px solid currentColor', outlineOffset: '0px' }])
        }
      }
    }
    host.querySelector('[data-sx-form]').addEventListener('submit', event => { event.preventDefault(); act(add) })
    host.querySelectorAll('button[data-sx-operation]').forEach(button => {
      if (button.type !== 'submit') button.addEventListener('click', () => act(button.dataset.sxOperation))
    })
    // Native Enter submits this form and stays inside the current teaching slide.
    input.addEventListener('keydown', event => { if (event.key === 'Enter') event.stopPropagation() })
    host.querySelector('[data-sx-controls]').hidden = false
    host.dataset.sxReady = 'true'
    render()
  })
}
