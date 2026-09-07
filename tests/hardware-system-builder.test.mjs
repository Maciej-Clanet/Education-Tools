import test from 'node:test'
import assert from 'node:assert/strict'
import { evaluateHardwareBuild, builderOptions } from '../javascript/pages/hardware-system-builder.js'
const office = { cpu: 'office', board: 'a', ram: '16', gpu: 'integrated', display: 'dual', psu: '450' }
const design = { cpu: 'media', board: 'a', ram: '32', gpu: 'design', display: 'design', psu: '650' }
test('office build meets requirements for £525 without dedicated graphics', () => {
  const result = evaluateHardwareBuild('office', office)
  assert.equal(result.total, 525); assert.equal(result.valid, true); assert.equal(result.remaining, 75)
})
test('design build meets requirements within budget', () => {
  const result = evaluateHardwareBuild('design', design)
  assert.equal(result.total, 1030); assert.equal(result.valid, true)
})
test('missing or unrecognised choices cannot pass', () => {
  assert.equal(evaluateHardwareBuild('office', {}).valid, false)
  assert.equal(evaluateHardwareBuild('office', { ...office, cpu: 'unknown' }).valid, false)
})
test('budget and inefficient office spending are explained', () => {
  const result = evaluateHardwareBuild('office', design)
  assert.equal(result.remaining, -430); assert.ok(result.issues.some(x => x.includes('Over budget')))
  assert.ok(result.advice.some(x => x.includes('little benefit')))
})
test('electrical compatibility and absent integrated graphics are detected', () => {
  const result = evaluateHardwareBuild('office', { ...office, cpu: 'premium', ram: '32-ddr5' })
  for (const term of ['sockets', 'generation', 'no integrated']) assert.ok(result.issues.some(x => x.includes(term)))
})
test('case fit, power capacity and connector checks remain independent', () => {
  const result = evaluateHardwareBuild('design', { ...design, gpu: 'high', psu: '300' })
  for (const term of ['clearance', 'power connection', 'PSU capacity']) assert.ok(result.issues.some(x => x.includes(term)))
})
test('design workload rejects an otherwise valid office build', () => {
  const result = evaluateHardwareBuild('design', office)
  for (const term of ['media CPU', '32 GB', '8 GB', '1440p']) assert.ok(result.issues.some(x => x.includes(term)))
})
test('every option contributes its exact price to the displayed total', () => {
  for (const [field, options] of Object.entries(builderOptions)) {
    const original = options.find(x => x.id === office[field])
    for (const option of options) assert.equal(evaluateHardwareBuild('office', { ...office, [field]: option.id }).total, 525 - original.price + option.price)
  }
})
