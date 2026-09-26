import test from 'node:test'
import assert from 'node:assert/strict'
import { nextArchitectureState, getArchitectureFrames } from '../javascript/core/architecture-visualiser.js'

test('manual controls stop playback and remain bounded; replay returns to the beginning', () => {
  for (const kind of ['program', 'shared', 'concurrent']) {
    const initial = { index: 0, playing: false }
    assert.deepEqual(nextArchitectureState(initial, 'previous', kind), initial)
    let state = nextArchitectureState(initial, 'play', kind)
    state = nextArchitectureState(state, 'tick', kind)
    assert.equal(state.index, 1)
    state = nextArchitectureState(state, 'pause', kind)
    assert.deepEqual(nextArchitectureState(state, 'tick', kind), state)
    assert.equal(nextArchitectureState({ ...state, playing: true }, 'step', kind).playing, false)
    state = nextArchitectureState(state, 'play', kind)
    for (let i = 0; i < 20; i++) state = nextArchitectureState(state, 'tick', kind)
    assert.deepEqual(state, { index: getArchitectureFrames(kind).length - 1, playing: false })
    assert.deepEqual(nextArchitectureState(state, 'step', kind), state)
    assert.deepEqual(nextArchitectureState(state, 'play', kind), { index: 0, playing: true })
    assert.deepEqual(nextArchitectureState(state, 'reset', kind), initial)
  }
})

test('the small program receives both values before calculating and displaying eight', () => {
  const frames = getArchitectureFrames('program')
  const transfers = frames.flatMap(frame => frame.transfers)
  assert.deepEqual(transfers.map(transfer => transfer.kind), ['instruction', 'data', 'instruction', 'data', 'instruction'])
  assert.deepEqual(transfers.filter(transfer => transfer.kind === 'data').map(transfer => transfer.text), ['5', '3'])
  assert.ok(transfers.every(transfer => transfer.lane === 'shared'))
  const calculation = frames.findIndex(frame => frame.active.includes('alu'))
  assert.equal(frames[calculation - 1].working, '5 and 3')
  assert.equal(frames[calculation].working, '5 + 3 = 8')
  assert.ok(frames.slice(0, -1).every(frame => frame.output === '—'))
  assert.equal(frames.at(-1).output, '8')
})

test('one shared path queues data; separate paths carry independent requests together', () => {
  const shared = getArchitectureFrames('shared')
  assert.ok(shared.every(frame => frame.transfers.length <= 1))
  const busy = shared.find(frame => frame.transfers[0]?.kind === 'instruction')
  assert.equal(busy.requests.data, 'Waiting')
  assert.deepEqual(shared.at(-1).requests, { instruction: 'Received', data: 'Received' })
  const separate = getArchitectureFrames('concurrent').find(frame => frame.transfers.length === 2)
  assert.deepEqual(separate.transfers.map(transfer => transfer.lane), ['instruction', 'data'])
  assert.equal(separate.transfers[0].text, 'Next instruction')
  assert.equal(separate.transfers[1].text, 'Current data')
})
