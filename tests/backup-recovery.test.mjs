import test from 'node:test'
import assert from 'node:assert/strict'
import { comparisonFrame } from '../javascript/core/backup-comparison.js'
import { initialRecoveryState, updateRecoveryState } from '../javascript/core/recovery-lab.js'
import { backupExample } from '../javascript/data/backup-example.js'
import { collegeRecovery } from '../javascript/data/recovery-scenario.js'
import { backupStrategyScenarios } from '../javascript/data/backup-strategy-scenarios.js'
import { evaluateScenarioPair } from '../javascript/core/paired-scenarios.js'

test('simultaneous comparison exposes the change in reference point on Wednesday', () => {
  const monday = comparisonFrame(backupExample, -1)
  assert.equal(monday.index, 0)
  assert.deepEqual(monday.sets.full.files, monday.sets.incremental.files)
  assert.deepEqual(monday.sets.full.files, monday.sets.differential.files)
  const wednesday = comparisonFrame(backupExample, 2)
  assert.deepEqual(wednesday.sets.incremental.files, { 'contacts.csv': 2 })
  assert.deepEqual(wednesday.sets.differential.files, { 'attendance.csv': 2, 'contacts.csv': 2 })
  const last = comparisonFrame(backupExample, 99)
  assert.equal(last.index, 3)
  assert.equal(Object.keys(last.sets.full.files).length, 4)
  assert.equal(Object.keys(last.sets.incremental.files).length, 1)
  assert.equal(Object.keys(last.sets.differential.files).length, 3)
})

test('recovery cannot advance without a known, usable point and does not skip verification', () => {
  const act = (state, type, copy) => updateRecoveryState(state, { type, copy }, collegeRecovery)
  const initial = initialRecoveryState()
  assert.deepEqual(act(initial, 'previous'), initial)
  let state = act(initial, 'next')
  assert.equal(state.step, 1)
  for (const copy of ['', 'unknown', 'friday']) {
    state = act(act(state, 'select', copy), 'next')
    assert.equal(state.step, 1)
    assert.ok(state.feedback)
  }
  state = act(act(state, 'select', 'thursday'), 'next')
  assert.equal(state.step, 2)
  assert.equal(collegeRecovery.steps[state.step].service, 'Awaiting checks')
  state = act(state, 'next')
  assert.equal(state.step, 3)
  assert.equal(collegeRecovery.steps[state.step].service, 'Ready to reopen')
  state = act(state, 'next')
  assert.equal(state.step, 4)
  assert.deepEqual(act(state, 'next'), state)
  assert.equal(act(state, 'previous').step, 3)
  assert.deepEqual(act(state, 'reset'), initial)
})

test('strategy feedback enforces the stated loss limit and both location requirements', () => {
  const accepted = (scenario, choice, reason) => evaluateScenarioPair(choice, reason, backupStrategyScenarios[scenario].acceptedPairs)
  assert.equal(accepted('frequency', 'hourly', 'recent'), true)
  assert.equal(accepted('frequency', 'daily', 'resources'), false)
  assert.equal(accepted('frequency', 'weekly', 'resources'), false)
  assert.equal(accepted('location', 'both', 'balance'), true)
  assert.equal(accepted('location', 'onsite', 'local'), false)
  assert.equal(accepted('location', 'offsite', 'site'), false)
})
