import test from 'node:test'
import assert from 'node:assert/strict'
import { buildBackupSets, recoveryIndices, restoreBackupSets, nextBackupState } from '../javascript/core/backup-model.js'

test('backup sets distinguish changed-since-previous from changed-since-full and keep latest versions', () => {
  const files = ['a', 'b', 'c']
  const days = [{ label: 'baseline', changed: [] }, { label: 'one', changed: ['a'] }, { label: 'two', changed: ['b'] }, { label: 'three', changed: ['a'] }]
  const original = structuredClone(days)
  const full = buildBackupSets(files, days, 'full')
  const incremental = buildBackupSets(files, days, 'incremental')
  const differential = buildBackupSets(files, days, 'differential')
  assert.deepEqual(full[3].files, { a: 3, b: 2, c: 1 })
  assert.deepEqual(incremental[3].files, { a: 3 })
  assert.deepEqual(differential[3].files, { a: 3, b: 2 })
  assert.deepEqual(recoveryIndices(full), [3])
  assert.deepEqual(recoveryIndices(incremental), [0, 1, 2, 3])
  assert.deepEqual(recoveryIndices(differential), [0, 3])
  for (const sets of [full, incremental, differential]) assert.deepEqual(restoreBackupSets(sets), { a: 3, b: 2, c: 1 })
  assert.deepEqual(days, original)
})

test('unchanged days, baseline-only recovery and switching/reset retain sensible state', () => {
  const sets = buildBackupSets(['a'], [{ label: 'start', changed: [] }, { label: 'same', changed: [] }], 'incremental')
  assert.deepEqual(sets[1].files, {})
  assert.deepEqual(restoreBackupSets(sets), { a: 1 })
  assert.deepEqual(recoveryIndices(sets.slice(0, 1)), [0])
  const recovered = nextBackupState({ strategy: 'incremental', recovered: false }, { type: 'restore' })
  assert.deepEqual(recovered, { strategy: 'incremental', recovered: true })
  assert.deepEqual(nextBackupState(recovered, { type: 'select', strategy: 'differential' }), { strategy: 'differential', recovered: false })
  assert.deepEqual(nextBackupState(recovered, { type: 'reset' }), { strategy: 'full', recovered: false })
})
