import test from 'node:test'
import assert from 'node:assert/strict'
import { nextEmulationPathState as next } from '../javascript/core/emulation-path-explorer.js'
import { emulationExamples, emulationScenarios } from '../javascript/data/emulation-examples.js'
import { evaluateScenarioPair } from '../javascript/core/paired-scenarios.js'

test('example and mode changes restart a bounded path; reset retains context', () => {
  let state = { example:'retro', view:'emulated', index:0 }
  state = next(state,{type:'step'})
  assert.equal(state.index,1)
  state = next(state,{type:'example',value:'arm'})
  assert.equal(state.example,'arm'); assert.equal(state.index,0)
  state = next(state,{type:'view',value:'native'})
  assert.equal(state.view,'native')
  for(let i=0;i<20;i++)state=next(state,{type:'step'})
  assert.equal(state.index,emulationExamples.arm.native.length-1)
  state=next(state,{type:'reset'})
  assert.deepEqual(state,{example:'arm',view:'native',index:0})
  state=next(state,{type:'previous'})
  assert.equal(state.index,0)
})
test('scenario feedback supports qualified recommendations', () => {
  assert.equal(evaluateScenarioPair('validate','timing',emulationScenarios.industrial.acceptedPairs),true)
  assert.equal(evaluateScenarioPair('emulate','timing',emulationScenarios.industrial.acceptedPairs),false)
  assert.equal(evaluateScenarioPair('emulate','early',emulationScenarios.developer.acceptedPairs),true)
  assert.equal(evaluateScenarioPair('validate','early',emulationScenarios.developer.acceptedPairs),true)
})
