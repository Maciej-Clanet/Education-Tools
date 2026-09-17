import test from 'node:test'
import assert from 'node:assert/strict'
import { unitReferences } from '../javascript/core/css-unit-references.js'
import { unitScenarioConfigs } from '../javascript/data/css-unit-scenarios.js'
import { evaluateScenarioPair } from '../javascript/core/paired-scenarios.js'

test('width references react independently to their parent and viewport', () => {
  const initial = unitReferences()
  const parent = unitReferences({ parentWidth: 240 })
  assert.equal(initial.percent, 200)
  assert.equal(parent.percent, 120)
  assert.equal(parent.vw, initial.vw)
  const viewport = unitReferences({ viewportWidth: 600 })
  assert.equal(viewport.vw, 300)
  assert.equal(viewport.percent, initial.percent)
  assert.equal(viewport.px, 50)
})

test('font references and viewport height follow their selected rulers', () => {
  const root = unitReferences({ rootSize: 20 })
  assert.equal(root.rem, 40)
  assert.equal(root.em, 40)
  const local = unitReferences({ localSize: 30 })
  assert.equal(local.em, 60)
  assert.equal(local.rem, 32)
  assert.equal(unitReferences({ viewportHeight: 600 }).vh, 300)
  assert.equal(unitReferences({ viewportHeight: 600, heightPercent: 100 }).vh, 600)
})

test('unit chooser matches each intention to its unit and reference', () => {
  for (const [id, unit, reference] of [['border','px','pixel'],['image','%','container'],['heading','rem','root'],['button','em','local'],['hero','vh','height'],['banner','vw','width']]) {
    assert.equal(evaluateScenarioPair(unit, reference, unitScenarioConfigs[id].acceptedPairs), true)
  }
  assert.equal(evaluateScenarioPair('vw','container',unitScenarioConfigs.image.acceptedPairs), false)
})
