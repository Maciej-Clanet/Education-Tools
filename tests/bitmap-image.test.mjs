import test from 'node:test'
import assert from 'node:assert/strict'
import { MONO_ARROW, COLOUR_ARROW, PRACTICE_TARGET, IMAGE_PALETTE, encodePixels, decodePixels, pixelRows, normaliseArtwork, mismatchedPixels } from '../javascript/data/bitmap-image-model.js'

test('the worked monochrome arrow round trips as four exact bytes', () => {
  const expected = '00011000001111000111111000011000'
  assert.equal(encodePixels(MONO_ARROW, 1), expected)
  assert.deepEqual(decodePixels(expected, 1), MONO_ARROW)
  assert.equal(expected.length / 8, 4)
  assert.deepEqual(pixelRows(MONO_ARROW, 8).map(row => row.join('')), ['00011000','00111100','01111110','00011000'])
})
test('reshaping changes row boundaries without changing any stored bit', () => {
  const reshaped = pixelRows(MONO_ARROW, 4)
  assert.equal(reshaped.length, 8)
  assert.deepEqual(reshaped.flat(), MONO_ARROW)
  assert.throws(() => pixelRows(MONO_ARROW, 5), RangeError)
})
test('both four-colour fixtures round trip in eight bytes and the palette has four gold pixels', () => {
  for (const pixels of [COLOUR_ARROW, PRACTICE_TARGET]) {
    const bits = encodePixels(pixels, 2)
    assert.equal(bits.length, 64)
    assert.deepEqual(decodePixels(bits, 2), pixels)
    assert.ok(pixels.every(value => IMAGE_PALETTE[value]))
  }
  assert.equal(COLOUR_ARROW.filter(value => value === 2).length, 4)
})
test('incomplete or out of range pixel data is rejected, including incomplete codes', () => {
  assert.throws(() => decodePixels('010', 2), RangeError)
  assert.throws(() => decodePixels('2', 1), RangeError)
  assert.throws(() => encodePixels([4], 2), RangeError)
  assert.throws(() => encodePixels([0.5], 2), RangeError)
})
test('saved work is bounded and never uses fractional or out of palette values', () => {
  const result = normaliseArtwork({ pixels: [3, -1, 8, 1.2, '2', 2] })
  assert.equal(result.pixels.length, 32)
  assert.deepEqual(result.pixels.slice(0, 6), [3,0,0,0,0,2])
  assert.deepEqual(mismatchedPixels(PRACTICE_TARGET, [...PRACTICE_TARGET]), [])
  assert.deepEqual(mismatchedPixels([0,1,2], [0,2,2]), [1])
})
