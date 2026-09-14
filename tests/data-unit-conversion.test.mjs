import test from 'node:test'
import assert from 'node:assert/strict'
import { createConversionPlan as plan, conversionConvention } from '../javascript/core/data-unit-conversion.js'
import { nextKernelState } from '../javascript/core/kernel-visualiser.js'

test('representative conversions use the correct relationships and intermediate units', () => {
  const cases = [
    [3.5, 'GB', 'MB', 1000, 3500, ['×1,000']],
    [4096, 'MiB', 'GiB', 1000, 4, ['÷1,024']],
    [2, 'GiB', 'KiB', 1024, 2097152, ['×1,024', '×1,024']],
    [80, 'Mb', 'MB', 1024, 10, ['÷8']],
    [10, 'MB', 'Mb', 1000, 80, ['×8']],
    [16, 'Mb', 'KB', 1000, 2000, ['÷8', '×1,000']],
  ]
  for (const [value, from, to, base, result, operations] of cases) {
    const conversion = plan(value, from, to, base)
    assert.equal(conversion.result, result)
    assert.deepEqual(conversion.edges.map(edge => edge.operation), operations)
    assert.equal(conversion.from, from); assert.equal(conversion.to, to)
    assert.equal(conversion.frames[0].kind, 'locate')
    assert.equal(conversion.frames.at(-1).kind, 'result')
  }
  const mixed = plan(16, 'Mb', 'KB')
  assert.deepEqual(mixed.edges.map(edge => [edge.type, edge.to, edge.after]), [['bit-byte', 'MB', 2], ['prefix', 'KB', 2000]])
})

test('prefix selection applies only when needed and cannot contradict explicit binary units', () => {
  assert.equal(conversionConvention('Mb', 'MB').selectable, false)
  assert.equal(conversionConvention('MiB', 'GiB', 1000).base, 1024)
  assert.equal(conversionConvention('MB', 'GB').selectable, true)
  assert.equal(plan(1024, 'MB', 'GB', 1024).result, 1)
  assert.throws(() => plan(1, 'MiB', 'MB'), /one prefix system/)
  assert.throws(() => plan(1, 'GB', 'MB', 10), /convention/)
  assert.equal(plan(8000, 'b', 'KB').result, 1)
  assert.equal(plan(1, 'MB', 'b').result, 8000000)
  assert.equal(plan(1, 'Mb', 'Kb').result, 1000)
})

test('invalid and boundary inputs cannot produce misleading conversion states', () => {
  for (const value of ['', ' ', '-1', 'no', 'Infinity', '1e309', '1e-12', '1,2']) assert.throws(() => plan(value, 'B', 'KB'))
  assert.throws(() => plan(1, 'mb', 'MB'), /recognised/)
  assert.equal(plan(0, 'GB', 'B').result, 0)
  assert.equal(plan(25, 'MB', 'MB').edges.length, 0)
  assert.equal(plan('.5', 'GB', 'MB').result, 500)
})

test('guided route advances and reverses within bounds; reset returns to finding units', () => {
  const conversion = plan(2, 'GiB', 'KiB')
  let state = { index: 0, playing: false }
  state = nextKernelState(state, 'step', conversion.frames.length)
  assert.equal(conversion.frames[state.index].kind, 'direction')
  state = nextKernelState(state, 'previous', conversion.frames.length)
  assert.equal(state.index, 0)
  for (let i = 0; i < 20; i++) state = nextKernelState(state, 'step', conversion.frames.length)
  assert.equal(conversion.frames[state.index].kind, 'result')
  state = nextKernelState(state, 'reset', conversion.frames.length)
  assert.equal(conversion.frames[state.index].kind, 'locate')
})
