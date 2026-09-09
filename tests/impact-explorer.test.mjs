import test from 'node:test'
import assert from 'node:assert/strict'
import { evaluateImpactSelection, createImpactState, updateImpactState } from '../javascript/core/impact-explorer.js'

test('impact reasoning accepts multiple supported links and suggests others without requiring them', () => {
  const scenario = { acceptedPairs: [['access', 'benefit'], ['productivity', 'benefit']] }
  assert.deepEqual(evaluateImpactSelection(['access'], 'benefit', scenario), { complete: true, supported: true, additional: ['productivity'] })
  assert.equal(evaluateImpactSelection(['access', 'productivity'], 'benefit', scenario).supported, true)
  assert.equal(evaluateImpactSelection(['access', 'security'], 'benefit', scenario).supported, false)
  assert.equal(evaluateImpactSelection(['access'], 'concern', scenario).supported, false)
  assert.equal(evaluateImpactSelection([], 'benefit', scenario).complete, false)
  assert.equal(evaluateImpactSelection(['access'], '', scenario).complete, false)
  assert.equal(evaluateImpactSelection(['security'], 'both', { acceptedPairs: [['security', 'both']] }).supported, true)
})

test('navigation retains responses, changes clear feedback, and reset affects only the current consequence', () => {
  const initial = createImpactState(2)
  let state = updateImpactState(initial, { type: 'choose', factors: ['access', 'productivity'], impact: 'benefit' })
  state = updateImpactState(state, { type: 'check' })
  state = updateImpactState(state, { type: 'move', offset: 1 })
  state = updateImpactState(state, { type: 'choose', factors: ['cost'], impact: 'concern' })
  assert.equal(updateImpactState(state, { type: 'move', offset: 1 }).index, 1)
  state = updateImpactState(state, { type: 'reset' })
  assert.deepEqual(state.responses[1], { factors: [], impact: '', checked: false })
  state = updateImpactState(state, { type: 'move', offset: -1 })
  assert.deepEqual(state.responses[0], { factors: ['access', 'productivity'], impact: 'benefit', checked: true })
  state = updateImpactState(state, { type: 'choose', factors: ['access'], impact: 'benefit' })
  assert.equal(state.responses[0].checked, false)
  assert.equal(updateImpactState(state, { type: 'move', offset: -1 }).index, 0)
  assert.deepEqual(initial.responses[0], { factors: [], impact: '', checked: false })
})
