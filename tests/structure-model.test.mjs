import test from 'node:test'
import assert from 'node:assert/strict'
import { createStructureState, performStructureOperation, describeStructure, normaliseStructureLabel } from '../javascript/data/structure-model.js'

test('stack additions and removals follow LIFO; peek returns the top without removal', () => {
  let state = createStructureState('stack')
  state = performStructureOperation(state, 'push', 'D').state
  const peeked = performStructureOperation(state, 'peek')
  assert.equal(peeked.result.item, 'D')
  assert.deepEqual(peeked.state, state)
  const removed = []
  while (state.items.length) {
    const result = performStructureOperation(state, 'pop')
    removed.push(result.result.item)
    state = result.state
  }
  assert.deepEqual(removed, ['D', 'C', 'B', 'A'])
})

test('queue operations preserve FIFO across removal, new arrival and peek', () => {
  let state = createStructureState('queue')
  const first = performStructureOperation(state, 'dequeue')
  assert.equal(first.result.item, 'A')
  state = performStructureOperation(first.state, 'enqueue', 'D').state
  const peeked = performStructureOperation(state, 'peek')
  assert.equal(peeked.result.item, 'B')
  assert.deepEqual(peeked.state, state)
  const removed = []
  while (state.items.length) {
    const result = performStructureOperation(state, 'dequeue')
    removed.push(result.result.item)
    state = result.state
  }
  assert.deepEqual(removed, ['B', 'C', 'D'])
})

test('full and empty operations leave bounded state unchanged and return no item', () => {
  for (const kind of ['stack', 'queue']) {
    const full = createStructureState(kind, { capacity: 3 })
    const result = performStructureOperation(full, kind === 'stack' ? 'push' : 'enqueue', 'D')
    assert.equal(result.result.ok, false)
    assert.equal(result.result.item, null)
    assert.deepEqual(result.state, full)
    assert.match(result.result.message, /Full/)
    const empty = createStructureState(kind, { items: [] })
    for (const operation of ['peek', kind === 'stack' ? 'pop' : 'dequeue']) {
      const attempted = performStructureOperation(empty, operation)
      assert.equal(attempted.result.ok, false)
      assert.equal(attempted.result.item, null)
      assert.deepEqual(attempted.state, empty)
      assert.match(attempted.result.message, /Empty/)
    }
  }
})

test('operations do not mutate input arrays or earlier states; duplicate labels are allowed', () => {
  const items = ['A', 'B']
  const state = createStructureState('queue', { items })
  items.push('C')
  assert.deepEqual(state.items, ['A', 'B'])
  const added = performStructureOperation(state, 'enqueue', 'B').state
  assert.deepEqual(state.items, ['A', 'B'])
  assert.deepEqual(added.items, ['A', 'B', 'B'])
  assert.ok(Object.isFrozen(state) && Object.isFrozen(state.items))
  assert.throws(() => state.items.push('Z'), TypeError)
})

test('labels, capacity and operation names are validated without losing valid text', () => {
  assert.equal(normaliseStructureLabel('  Print\njob  '), 'Print job')
  const state = createStructureState('stack')
  for (const value of ['', '   ', 'abcdefghijklm', null]) {
    const result = performStructureOperation(state, 'push', value)
    assert.equal(result.result.ok, false)
    assert.deepEqual(result.state, state)
  }
  assert.equal(performStructureOperation(state, 'push', '😀'.repeat(12)).result.ok, true)
  assert.equal(performStructureOperation(state, 'push', '<b>X</b>').result.item, '<b>X</b>')
  assert.throws(() => createStructureState('list'), RangeError)
  for (const capacity of [0, 7, 2.5, NaN]) assert.throws(() => createStructureState('stack', { capacity, items: [] }), RangeError)
  assert.throws(() => createStructureState('queue', { capacity: 1, items: ['A', 'B'] }), RangeError)
  assert.throws(() => performStructureOperation(state, 'enqueue', 'D'), RangeError)
})

test('descriptions identify real ends in single-item and empty structures', () => {
  assert.match(describeStructure(createStructureState('stack')), /bottom to top: A, B, C\. Top: C/)
  const singleton = createStructureState('queue', { items: ['A'] })
  assert.match(describeStructure(singleton), /Front: A\. Rear: A/)
  assert.match(describeStructure(createStructureState('queue', { items: [] })), /Empty queue/)
})
