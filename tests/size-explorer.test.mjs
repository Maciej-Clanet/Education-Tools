import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateSize } from '../javascript/core/size-explorer.js'
import { evaluateScenarioPair } from '../javascript/core/paired-scenarios.js'
import { sizingScenarioConfigs } from '../javascript/data/css-sizing-scenarios.js'

test('percentage widths respond to the parent while pixel widths can overflow', () => {
  assert.equal(calculateSize({ parent: 600, value: 50 }).final, 300)
  assert.equal(calculateSize({ parent: 800, value: 50 }).final, 400)
  const fixed = calculateSize({ parent: 300, value: 420, unit: 'px' })
  assert.equal(fixed.final, 420)
  assert.equal(fixed.overflow, 120)
})
test('upper and lower limits constrain a requested width without forcing a fit', () => {
  const cap = calculateSize({ parent: 800, value: 80, max: 600 })
  assert.equal(cap.requested, 640)
  assert.equal(cap.final, 600)
  assert.equal(cap.limit, 'maximum')
  const floor = calculateSize({ parent: 400, value: 50, min: 300 })
  assert.equal(floor.requested, 200)
  assert.equal(floor.final, 300)
  assert.equal(floor.limit, 'minimum')
  assert.equal(calculateSize({ parent: 400, value: 80, min: 600 }).overflow, 200)
  assert.equal(calculateSize({ parent: 400, value: 80, max: 600 }).final, 320)
})
test('scenario feedback distinguishes a width request from its upper limit', () => {
  assert.equal(evaluateScenarioPair('article', 'ceiling', sizingScenarioConfigs.article.acceptedPairs), true)
  assert.equal(evaluateScenarioPair('share', 'ceiling', sizingScenarioConfigs.article.acceptedPairs), false)
  assert.equal(evaluateScenarioPair('hero', 'height', sizingScenarioConfigs.hero.acceptedPairs), true)
})
