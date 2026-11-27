import test from 'node:test'
import assert from 'node:assert/strict'
import { TIMING_BITS, signalReads, skewState } from '../javascript/core/transmission-timing.js'
import { COMPARISON_BITS, COMPARISON_RATES, COMPARISON_TRAVEL_TIME, comparisonFrame } from '../javascript/core/transmission-comparison.js'

test('the fixed signal is read at centres, including repeated equal bits', () => {
  assert.equal(TIMING_BITS, '11110001')
  assert.deepEqual(signalReads(1, .49), [])
  assert.deepEqual(signalReads(1, .5), [{ time: .5, bit: '1' }])
  assert.equal(signalReads(1, 3.5).map(r => r.bit).join(''), '1111')
  assert.equal(signalReads(1, 4.5).map(r => r.bit).join(''), '11110')
  assert.deepEqual(signalReads().map(r => r.time), [.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5])
  assert.equal(signalReads().map(r => r.bit).join(''), TIMING_BITS)
})

test('changing only the read interval changes the decoded result', () => {
  assert.deepEqual(signalReads(2).map(r => r.time), [1, 3, 5, 7])
  assert.equal(signalReads(2).map(r => r.bit).join(''), '110?')
  assert.equal(signalReads(2).at(-1).bit, '?', 'A read on the changing signal is not a reliable value')
  assert.equal(signalReads(.5).map(r => r.bit).join(''), '1111111100000011')
  assert.equal(signalReads(.5).length, 16)
  assert.equal(signalReads(.5, .24).length, 0)
  assert.equal(signalReads(.5, .25).length, 1)
})

test('skew stores the old fourth value at an early read and does not repair it on arrival', () => {
  assert.equal(skewState(0).current, '0000')
  assert.equal(skewState(1).current, '1010')
  assert.equal(skewState(1.24).stored, null)
  assert.equal(skewState(1.25).stored, '1010')
  const afterArrival = skewState(1.8)
  assert.equal(afterArrival.current, '1011')
  assert.equal(afterArrival.stored, '1010')
  assert.equal(skewState(2.2).stored, '1010')
})

test('reading later or removing the extra delay produces the correct group', () => {
  assert.equal(skewState(1.99, true, true).stored, null)
  assert.equal(skewState(2, true, true).stored, '1011')
  assert.equal(skewState(1.25, false).stored, '1011')
  assert.deepEqual(skewState(1.25, false).arrivals, [1, 1, 1, 1])
})

test('serial rate changes the finish order without changing travel delay', () => {
  const expected = [[1, 4.5, 'parallel'], [2, 2.5, 'parallel'], [4, 1.5, 'tie'], [8, 1, 'serial']]
  assert.deepEqual(COMPARISON_RATES, expected.map(x => x[0]))
  for (const [rate, finish, winner] of expected) {
    const model = comparisonFrame(rate, 100)
    assert.equal(model.finish.serial, finish)
    assert.equal(model.finish.parallel, 1.5)
    assert.equal(model.first, winner)
    for (const kind of ['serial', 'parallel']) {
      assert.equal(model.paths[kind].map(b => b.value).join(''), COMPARISON_BITS)
      assert.ok(model.paths[kind].every(b => b.received))
      for (const bit of model.paths[kind]) assert.equal(bit.arrivedAt - bit.sentAt, COMPARISON_TRAVEL_TIME)
    }
  }
})

test('comparison boundaries separate sending, travel and receipt and bound the time', () => {
  const before = comparisonFrame(1, 1.49)
  assert.equal(before.paths.serial.filter(b => b.received).length, 0)
  assert.equal(before.paths.serial[0].travelling, true)
  const firstArrival = comparisonFrame(1, 1.5)
  assert.equal(firstArrival.paths.serial.filter(b => b.received).length, 1)
  assert.equal(firstArrival.paths.parallel.filter(b => b.received).length, 4)
  assert.equal(firstArrival.paths.serial[0].travelling, false)
  assert.equal(comparisonFrame(8, 1).paths.serial.filter(b => b.received).length, 4)
  assert.equal(comparisonFrame(8, 1).paths.parallel.filter(b => b.received).length, 0)
  assert.equal(comparisonFrame(1, -1).time, 0)
  assert.equal(comparisonFrame(1, Infinity).time, 0)
  assert.equal(comparisonFrame(8, 99).time, 1.5)
  assert.equal(comparisonFrame('invalid', 0).serialRate, 1)
})
