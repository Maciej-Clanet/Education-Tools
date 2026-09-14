import test from 'node:test'
import assert from 'node:assert/strict'
import { initialMemoryExplorerState, nextMemoryExplorerState as next, memoryExplorerResult as result } from '../javascript/core/shared-memory-explorer.js'

test('UMA view changes keep equivalent access; count changes clear stale access', () => {
  let state = initialMemoryExplorerState()
  assert.equal(state.architecture, 'uma')
  state = next(state, { type:'processor', value:1 })
  state = next(state, { type:'access' })
  assert.equal(result(state).kind, 'uniform')
  state = next(state, { type:'view', value:'logical' })
  assert.equal(state.view, 'logical')
  assert.equal(result(state).kind, 'uniform')
  state = next(state, { type:'count', value:8 })
  state = next(state, { type:'processor', value:7 })
  state = next(state, { type:'count', value:2 })
  assert.ok(state.processor < state.count)
  assert.equal(result(state).kind, 'ready')
})
test('NUMA supports both local and remote directions, locality action and reset', () => {
  let state = next(initialMemoryExplorerState(), { type:'architecture', value:'numa' })
  assert.equal(state.architecture, 'numa')
  for (const task of [0,1]) for (const data of [0,1]) {
    state = next(next(state,{type:'task',value:task}),{type:'data',value:data})
    assert.equal(result(state).kind, 'ready')
    state = next(state,{type:'access'})
    assert.equal(result(state).kind,task===data?'local':'remote')
  }
  state = next(next(state,{type:'task',value:0}),{type:'data',value:1})
  state = next(state,{type:'near'})
  assert.equal(state.task,1)
  assert.equal(result(state).kind,'local')
  state = next(state,{type:'reset'})
  assert.deepEqual(state,initialMemoryExplorerState())
})
