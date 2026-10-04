import { createStructureState, describeStructure } from '../../javascript/data/structure-model.js'

const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])

/** Authored initial diagram; the browser enhances it without a stored session. */
export function structureExplorerMarkup({ kind, id, capacity = 5, items = ['A', 'B', 'C'] }) {
  if (!/^[a-z][a-z0-9-]*$/i.test(id ?? '')) throw new TypeError('Use a unique HTML-safe explorer id')
  const state = createStructureState(kind, { capacity, items })
  const stack = kind === 'stack'
  const add = stack ? 'Push' : 'Enqueue'
  const remove = stack ? 'Pop' : 'Dequeue'
  const indices = Array.from({ length: capacity }, (_, index) => index)
  if (stack) indices.reverse()
  const slots = indices.map(index => {
    const item = state.items[index]
    const top = index === state.items.length - 1 && item !== undefined
    const front = index === 0 && item !== undefined
    return `<div class="sx-slot${item !== undefined ? ' sx-occupied' : ''}" data-sx-slot="${index}">${stack
      ? `<span class="sx-marker">${top ? 'Top →' : ''}</span><span class="sx-item">${item === undefined ? '·' : escape(item)}</span>`
      : `<span class="sx-marker sx-front">${front ? 'Front' : ''}</span><span class="sx-item">${item === undefined ? '·' : escape(item)}</span><span class="sx-marker sx-rear">${top ? 'Rear' : ''}</span>`}</div>`
  }).join('')
  const next = stack ? state.items.at(-1) : state.items[0]
  const status = next === undefined ? `The ${kind} is empty. Add an item to begin.` : `${remove} would remove ${next}. Peek would return ${next} while leaving it stored.`
  return `<div id="${escape(id)}" class="structure-explorer" data-structure-explorer="${kind}" data-sx-capacity="${capacity}" data-sx-initial="${escape(JSON.stringify(state.items))}" data-no-slide-advance>
  <div class="sx-heading"><strong>${stack ? 'Stack' : 'Queue'}</strong><span><b data-sx-count>${state.items.length}</b> / ${capacity} items <span class="sx-limit">· teaching limit</span></span></div>
  <div class="sx-layout">
    <div class="sx-visual">
      <div class="sx-diagram sx-${kind}" data-sx-diagram role="img" aria-label="${escape(describeStructure(state))}" style="--sx-capacity:${capacity}"><div class="sx-slots" data-sx-slots aria-hidden="true">${slots}</div><p class="sx-empty" data-sx-empty${state.items.length ? ' hidden' : ''}>Empty · no ${stack ? 'top item' : 'front or rear item'}</p></div>
      <p class="sx-direction">${stack ? 'Bottom: first added · top: most recently added' : 'Removal at the front ← items ← addition at the rear'}</p>
    </div>
    <div class="sx-controls" data-sx-controls hidden>
      <form class="sx-add-form" data-sx-form>
        <label for="${escape(id)}-item">Item label <span>· up to 12 characters</span></label>
        <div class="sx-entry"><input id="${escape(id)}-item" data-sx-input value="D" maxlength="24" autocomplete="off" spellcheck="false"><button type="submit" class="primary-link" data-sx-operation="${add.toLowerCase()}">${add}</button></div>
      </form>
      <div class="sx-actions"><button type="button" class="lesson-secondary-action" data-sx-operation="${remove.toLowerCase()}">${remove}</button><button type="button" class="lesson-secondary-action" data-sx-operation="peek">Peek</button><button type="button" class="lesson-secondary-action" data-sx-operation="reset">Reset</button></div>
      <div class="sx-output"><div><strong data-sx-result-label>Returned item</strong><span data-sx-result-note>No operation yet</span></div><output class="sx-result" data-sx-result aria-label="Operation result">—</output></div>
    </div>
  </div>
  <p class="sx-status" data-sx-status role="status" aria-live="polite" aria-atomic="true">${escape(status)}</p>
</div>`
}
