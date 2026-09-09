import test from 'node:test'
import assert from 'node:assert/strict'
import { nextArchitectureState, getArchitectureFrames } from '../javascript/core/architecture-visualiser.js'

test('mode switching and bounded step/reset select shared versus separate transfer states', () => {
  let state = { mode: 'von', index: 0 }
  state = nextArchitectureState(state, 'step', 'compare')
  assert.equal(getArchitectureFrames('compare', state.mode)[state.index].transfer, 'instruction')
  state = nextArchitectureState(state, 'step', 'compare')
  assert.equal(getArchitectureFrames('compare', state.mode)[state.index].transfer, 'data')
  assert.deepEqual(nextArchitectureState(state, 'step', 'compare'), state)
  state = nextArchitectureState(state, 'harvard', 'compare')
  assert.deepEqual(state, { mode: 'harvard', index: 0 })
  state = nextArchitectureState(state, 'step', 'compare')
  assert.equal(getArchitectureFrames('compare', state.mode)[state.index].transfer, 'both')
  assert.deepEqual(nextArchitectureState(state, 'reset', 'compare'), { mode: 'harvard', index: 0 })
})

test('program transitions finish at output and the split changes memory arrangement', () => {
  const frames = getArchitectureFrames('program', 'von')
  assert.equal(frames[1].transfer, 'instruction')
  assert.equal(frames[2].transfer, 'data')
  let state = { mode: 'von', index: 0 }
  for (let i = 0; i < frames.length + 2; i++) state = nextArchitectureState(state, 'step', 'program')
  assert.equal(frames[state.index].transfer, 'output')
  assert.equal(frames[state.index].output, '8')
  assert.equal(nextArchitectureState(state, 'previous', 'program').index, frames.length - 2)
  assert.deepEqual(nextArchitectureState(state, 'reset', 'program'), { mode: 'von', index: 0 })
  assert.deepEqual(getArchitectureFrames('split', 'von').map(frame => frame.mode), ['von', 'harvard'])
})
