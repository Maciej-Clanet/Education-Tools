import test from 'node:test'
import assert from 'node:assert/strict'
import { createConversionPlan as plan, conversionConvention, BYTE_UNITS, BINARY_UNITS } from '../javascript/core/data-unit-conversion.js'
import { nextKernelState } from '../javascript/core/kernel-visualiser.js'

test('byte-prefix conversions use the selected scale and preserve intermediate units', () => {
  const cases = [
    [3.5, 'GB', 'MB', 1000, 3500, ['×1,000']],
    [2, 'GB', 'KB', 1000, 2000000, ['×1,000', '×1,000']],
    [4096, 'MiB', 'GiB', 1024, 4, ['÷1,024']],
    [2, 'GiB', 'KiB', 1024, 2097152, ['×1,024', '×1,024']],
    [4500, 'MB', 'GB', 1000, 4.5, ['÷1,000']],
  ]
  for (const [value, from, to, base, result, operations] of cases) {
    const conversion = plan(value, from, to, base)
    assert.equal(conversion.result, result)
    assert.deepEqual(conversion.edges.map(edge => edge.operation), operations)
    assert.deepEqual(conversion.rail, base === 1024 ? BINARY_UNITS : BYTE_UNITS)
    assert.equal(conversion.from, from); assert.equal(conversion.to, to)
    assert.equal(conversion.frames[0].kind, 'locate')
    assert.equal(conversion.frames.at(-1).kind, 'result')
  }
  assert.deepEqual(plan(2, 'GB', 'KB').edges.map(edge => [edge.to, edge.after]), [['MB', 2000], ['KB', 2000000]])
})

test('system and byte labels must agree', () => {
  assert.equal(conversionConvention('MiB', 'GiB').base, 1024)
  assert.equal(conversionConvention('MB', 'GB').base, 1000)
  assert.throws(() => plan(1024, 'MB', 'GB', 1024), /matching/)
  assert.throws(() => plan(1, 'MiB', 'MB'), /matching/)
  assert.throws(() => plan(1, 'GB', 'MB', 10), /Choose Decimal/)
  assert.equal(plan(1000, 'B', 'KB').result, 1)
})

test('invalid and boundary inputs cannot produce misleading conversion states', () => {
  for (const value of ['', ' ', '-1', 'no', 'Infinity', '1e309', '1e-12', '1,2']) assert.throws(() => plan(value, 'B', 'KB'))
  assert.throws(() => plan(1, 'unknown', 'MB'), /byte unit/)
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
