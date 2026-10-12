import test from 'node:test'
import assert from 'node:assert/strict'
import { updateArrayValue } from '../javascript/core/array-model.js'

test('updates one slot without changing length or mutating the source', () => {
  const source = Object.freeze([3, 8, 2, 12, 5, 4])
  const result = updateArrayValue(source, 3, '17')
  assert.deepEqual(result, { ok: true, values: [3, 8, 2, 17, 5, 4], previous: 12, value: 17 })
  assert.deepEqual(source, [3, 8, 2, 12, 5, 4])
})

test('rejects out-of-range and non-integer indices without creating properties', () => {
  const source = Object.freeze([1, 2, 3])
  for (const index of [-1, 3, 1.5, NaN, Infinity, '1', '__proto__']) {
    assert.equal(updateArrayValue(source, index, 5).ok, false, String(index))
  }
  assert.equal(updateArrayValue([], 0, 5).ok, false)
  assert.equal(updateArrayValue(null, 0, 5).ok, false)
  assert.deepEqual(source, [1, 2, 3])
})

test('invalid counts do not become zero, decimals or exponential numbers', () => {
  for (const value of ['', ' ', '-1', '1.5', '1e2', 'Infinity', '<img>', '10000', null, undefined]) {
    assert.equal(updateArrayValue([4], 0, value).ok, false, String(value))
  }
})

test('accepts both count boundaries and normalises numeric input', () => {
  for (const [input, output] of [['0', 0], ['9999', 9999], [' 42 ', 42], ['0042', 42]]) {
    assert.deepEqual(updateArrayValue([3], 0, input).values, [output])
  }
})
