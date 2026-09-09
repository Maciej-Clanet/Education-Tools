import test from 'node:test'
import assert from 'node:assert/strict'
import { memoryWorkloads, scheduleMemoryAccess, nextMemoryLabState } from '../javascript/core/memory-access-model.js'

test('shared and separate paths conserve requests and obey their transfer capacity', () => {
  const workload = { instructions: 2, data: 3 }
  const shared = scheduleMemoryAccess(workload, 'von')
  const separate = scheduleMemoryAccess(workload, 'harvard')
  assert.equal(shared.length, 5)
  assert.equal(separate.length, 3)
  assert.ok(shared.every(slot => slot.length === 1))
  assert.ok(separate.every(slot => slot.filter(id => id.startsWith('I')).length <= 1 && slot.filter(id => id.startsWith('D')).length <= 1))
  assert.deepEqual(shared.flat().sort(), separate.flat().sort())
  assert.equal(new Set(shared.flat()).size, 5)
  assert.deepEqual(scheduleMemoryAccess(memoryWorkloads.instructions, 'von'), scheduleMemoryAccess(memoryWorkloads.instructions, 'harvard'))
})

test('step/finish clamp at completion and reset or workload changes clear progress', () => {
  const start = { workload: 'balanced', slot: 0 }
  const stepped = nextMemoryLabState(start, { type: 'step' })
  assert.equal(stepped.slot, 1)
  const finished = nextMemoryLabState(stepped, { type: 'finish' })
  assert.equal(finished.slot, 6)
  assert.deepEqual(nextMemoryLabState(finished, { type: 'step' }), finished)
  assert.deepEqual(nextMemoryLabState(finished, { type: 'reset' }), start)
  assert.deepEqual(nextMemoryLabState(finished, { type: 'workload', value: 'instructions' }), { workload: 'instructions', slot: 0 })
  assert.equal(start.slot, 0)
})
