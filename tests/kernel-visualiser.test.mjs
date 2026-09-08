import test from 'node:test'
import assert from 'node:assert/strict'
import { nextKernelState, evaluateMechanisms } from '../javascript/core/kernel-visualiser.js'

test('manual controls clamp at the ends and pause playback', () => {
  assert.deepEqual(nextKernelState({ index: 0, playing: false }, 'previous', 3), { index: 0, playing: false })
  assert.deepEqual(nextKernelState({ index: 2, playing: true }, 'step', 3), { index: 2, playing: false })
  assert.deepEqual(nextKernelState({ index: 1, playing: true }, 'previous', 3), { index: 0, playing: false })
})
test('play advances deterministically, stops at the end and reset returns to start', () => {
  let state = nextKernelState({ index: 0, playing: false }, 'play', 3)
  state = nextKernelState(state, 'tick', 3)
  assert.deepEqual(state, { index: 1, playing: true })
  state = nextKernelState(state, 'tick', 3)
  assert.deepEqual(state, { index: 2, playing: false })
  assert.deepEqual(nextKernelState(state, 'play', 3), state)
  assert.deepEqual(nextKernelState(state, 'reset', 3), { index: 0, playing: false })
})
test('paused ticks are inert and a single snapshot cannot play', () => {
  const state = { index: 1, playing: false }
  assert.deepEqual(nextKernelState(state, 'tick', 4), state)
  assert.deepEqual(nextKernelState({ index: 0, playing: false }, 'play', 1), { index: 0, playing: false })
  assert.deepEqual(nextKernelState({ index: 1, playing: true }, 'pause', 4), state)
})
test('multi-answer checking is order independent and identifies missing and extra roles', () => {
  assert.equal(evaluateMechanisms(['disk', 'files'], ['files', 'disk']).correct, true)
  assert.deepEqual(evaluateMechanisms(['files', 'driver'], ['files', 'disk']), { correct: false, missing: ['disk'], extra: ['driver'] })
  assert.equal(evaluateMechanisms([], ['memory']).correct, false)
  assert.equal(evaluateMechanisms(['memory', 'memory'], ['memory']).correct, true)
})
