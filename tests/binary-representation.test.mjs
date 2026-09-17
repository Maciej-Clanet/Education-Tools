import test from 'node:test'
import assert from 'node:assert/strict'
import { placeValueState, togglePlaceBit, bcdDecodingFrames } from '../javascript/core/binary-representation.js'
import { nextKernelState } from '../javascript/core/kernel-visualiser.js'

test('interactive place values preserve eight positions and update selected terms and total', () => {
  const initial = placeValueState()
  assert.deepEqual(initial, { pattern: '10101101', selected: [128, 32, 8, 4, 1], total: 173 })
  const toggled = togglePlaceBit(initial.pattern, 1)
  assert.equal(toggled.pattern, '11101101')
  assert.equal(toggled.total, 237)
  assert.deepEqual(toggled.selected, [128, 64, 32, 8, 4, 1])
  let state = toggled
  for (let index = 0; index < 8; index++) if (state.pattern[index] === '1') state = togglePlaceBit(state.pattern, index)
  assert.deepEqual(state, { pattern: '00000000', selected: [], total: 0 })
  for (let index = 0; index < 8; index++) state = togglePlaceBit(state.pattern, index)
  assert.equal(state.pattern, '11111111')
  assert.equal(state.total, 255)
  assert.deepEqual(placeValueState(), initial)
})

test('BCD reveals groups, individual digits and then the result, preserving digit order', () => {
  for (const [input, expected] of [['0010 0111', '27'], ['0010 1000 0100 1001', '2849']]) {
    const model = bcdDecodingFrames(input)
    assert.equal(model.result, expected)
    assert.equal(model.frames[0].grouped, false)
    assert.equal(model.frames[1].grouped, true)
    assert.equal(model.frames[1].revealed, 0)
    let state = { index: 0, playing: false }
    for (let i = 0; i < 20; i++) state = nextKernelState(state, 'step', model.frames.length)
    assert.equal(model.frames[state.index].complete, true)
    assert.equal(model.frames[state.index].revealed, expected.length)
    state = nextKernelState(state, 'previous', model.frames.length)
    assert.equal(model.frames[state.index].complete, false)
    state = nextKernelState(state, 'reset', model.frames.length)
    assert.equal(state.index, 0)
    assert.equal(nextKernelState(state, 'previous', model.frames.length).index, 0)
  }
})

test('BCD model rejects invalid decimal digit codes and incomplete groups', () => {
  assert.throws(() => bcdDecodingFrames('1010'), /Invalid BCD/)
  assert.throws(() => bcdDecodingFrames('0010 1111'), /Invalid BCD/)
  assert.throws(() => bcdDecodingFrames('001'), /complete four-bit/)
})
