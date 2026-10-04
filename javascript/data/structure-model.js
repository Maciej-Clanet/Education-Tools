export const DEFAULT_STRUCTURE_CAPACITY = 5
export const MAX_STRUCTURE_CAPACITY = 6
export const MAX_STRUCTURE_LABEL_LENGTH = 12
export const INITIAL_STRUCTURE_ITEMS = Object.freeze(['A', 'B', 'C'])

export function normaliseStructureLabel(value) {
  return typeof value === 'string' ? value.trim().replace(/\s+/gu, ' ') : ''
}

function validLabel(value) {
  return value.length > 0 && Array.from(value).length <= MAX_STRUCTURE_LABEL_LENGTH
}

/** Items are stored bottom-to-top for a stack, front-to-rear for a queue. */
export function createStructureState(kind, { capacity = DEFAULT_STRUCTURE_CAPACITY, items = INITIAL_STRUCTURE_ITEMS } = {}) {
  if (kind !== 'stack' && kind !== 'queue') throw new RangeError('Expected stack or queue')
  if (!Number.isInteger(capacity) || capacity < 1 || capacity > MAX_STRUCTURE_CAPACITY) {
    throw new RangeError(`Capacity must be an integer from 1 to ${MAX_STRUCTURE_CAPACITY}`)
  }
  if (!Array.isArray(items) || items.length > capacity) throw new RangeError('Initial items must fit the capacity')
  const copy = items.map(normaliseStructureLabel)
  if (!copy.every(validLabel)) throw new RangeError('Each item needs a non-empty label of up to 12 code points')
  return Object.freeze({ kind, capacity, items: Object.freeze(copy) })
}

/** Pure operation: returns a new result without changing the supplied state. */
export function performStructureOperation(state, operation, value = '') {
  const current = createStructureState(state.kind, state)
  const isStack = current.kind === 'stack'
  const add = isStack ? 'push' : 'enqueue'
  const remove = isStack ? 'pop' : 'dequeue'
  if (![add, remove, 'peek'].includes(operation)) throw new RangeError(`Invalid ${current.kind} operation: ${operation}`)
  const count = current.items.length
  const endpoint = isStack ? 'top' : 'front'
  const answer = (ok, next, item, message, effect = 'none', index = -1) => Object.freeze({
    state: next,
    result: Object.freeze({ operation, ok, item, message, effect, index, count: next.items.length }),
  })

  if (operation === add) {
    const item = normaliseStructureLabel(value)
    if (!validLabel(item)) return answer(false, current, null, 'Enter an item label of 1 to 12 characters. Nothing changed.')
    if (count === current.capacity) {
      return answer(false, current, null, `Full: all ${current.capacity} places are occupied. ${isStack ? 'Push' : 'Enqueue'} cannot add ${item}; nothing changed.`)
    }
    const next = createStructureState(current.kind, { capacity: current.capacity, items: [...current.items, item] })
    return answer(true, next, item, `${isStack ? 'Push' : 'Enqueue'} added ${item} at the ${isStack ? 'top' : 'rear'}. ${next.items.length} ${next.items.length === 1 ? 'item' : 'items'} stored.`, 'add', count)
  }

  if (!count) {
    return answer(false, current, null, `Empty: there is no item to ${operation === 'peek' ? 'peek at' : 'remove'}. Nothing changed.`)
  }
  const index = isStack ? count - 1 : 0
  const item = current.items[index]
  if (operation === 'peek') {
    return answer(true, current, item, `Peek returned ${item} from the ${endpoint}. It is still stored; the count stays ${count}.`, 'peek', index)
  }
  const items = isStack ? current.items.slice(0, -1) : current.items.slice(1)
  const next = createStructureState(current.kind, { capacity: current.capacity, items })
  return answer(true, next, item, `${isStack ? 'Pop' : 'Dequeue'} removed ${item} from the ${endpoint}. ${next.items.length} ${next.items.length === 1 ? 'item remains' : 'items remain'}.`, 'remove', index)
}

export function describeStructure(state) {
  const count = state.items.length
  const order = state.kind === 'stack' ? 'bottom to top' : 'front to rear'
  if (!count) return `Empty ${state.kind}. Capacity ${state.capacity}; no items are stored.`
  const endpoints = state.kind === 'stack'
    ? `Top: ${state.items[count - 1]}.`
    : `Front: ${state.items[0]}. Rear: ${state.items[count - 1]}.`
  return `${state.kind === 'stack' ? 'Stack' : 'Queue'}, ${order}: ${state.items.join(', ')}. ${endpoints} ${count} of ${state.capacity} places occupied.`
}
