import test from 'node:test'
import assert from 'node:assert/strict'
import { distributeWork, memoryRoute, classifyArchitecture } from '../javascript/core/scaling-activities.js'
test('work distribution preserves all units across supported node counts', () => {
  for (const count of [1, 2, 4]) {
    const work = distributeWork(count)
    assert.equal(work.length, count)
    assert.deepEqual(work.map(tasks => tasks.length), Array(count).fill(12 / count))
    assert.deepEqual(work.flat().sort((a,b) => a-b), Array.from({length:12},(_,i)=>i+1))
  }
})
test('both NUMA regions support local and remote access', () => {
  for (const cpu of ['A','B']) for (const ram of ['A','B']) {
    const route = memoryRoute(cpu,ram)
    assert.equal(route.local,cpu===ram)
    assert.equal(route.stops.includes('Interconnect'),cpu!==ram)
    assert.equal(route.stops.at(-1),`RAM ${ram}`)
  }
})
test('classifier requires both architectural levels in the overlap case', () => {
  assert.equal(classifyArchitecture('overlap',['numa','cluster']),true)
  assert.equal(classifyArchitecture('overlap',['cluster']),false)
  assert.equal(classifyArchitecture('overlap',['cluster','numa','uma']),false)
  assert.equal(classifyArchitecture('uma',['uma']),true)
  assert.equal(classifyArchitecture('numa',[]),false)
})
