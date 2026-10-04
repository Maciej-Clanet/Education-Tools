import test from 'node:test'
import assert from 'node:assert/strict'
import { boundCharacterText, characterName, inspectCharacterText, decodeMismatch } from '../javascript/core/character-encoding.js'
import { UTF8_FIXTURES, MISMATCH_BYTES } from '../javascript/data/character-encoding-data.js'

test('every UTF-8 worked fixture matches the actual encoded bytes and code point', () => {
  for (const fixture of UTF8_FIXTURES) {
    const result = inspectCharacterText(fixture.text)
    assert.equal(result.codePoints, 1)
    assert.equal(result.characters[0].point, fixture.codePoint)
    assert.deepEqual(result.bytes, fixture.bytes)
  }
  assert.equal(inspectCharacterText('Aé漢😀').bytes.length, 10)
  assert.equal(inspectCharacterText('Aé漢😀').codePoints, 4)
  assert.deepEqual(inspectCharacterText('Hi!').bytes, [0x48, 0x69, 0x21])
})

test('ASCII includes controls through 127, while 128 and accented text are outside it', () => {
  const result = inspectCharacterText('\0\t\n\rA a0\u007f\u0080é')
  assert.deepEqual(result.unsupported.map(item => item.point), [128, 233])
  assert.equal(result.characters.find(item => item.point === 127).binary, '1111111')
  assert.equal(result.characters.find(item => item.point === 65).binary, '1000001')
  assert.equal(characterName('\n'), 'line feed')
  assert.equal(characterName(' '), 'space')
  assert.equal(inspectCharacterText('Hi\nA').codePoints, 4)
  assert.equal(inspectCharacterText('Hi\nA').bytes.length, 4)
})

test('code points and UTF-8 bytes are not grapheme or UTF-16-unit counts', () => {
  assert.equal(inspectCharacterText('😀').codePoints, 1)
  assert.equal(inspectCharacterText('😀').bytes.length, 4)
  assert.equal(inspectCharacterText('é').codePoints, 1)
  assert.equal(inspectCharacterText('e\u0301').codePoints, 2)
  assert.equal(inspectCharacterText('e\u0301').bytes.length, 3)
})

test('bounded text preserves pairs, handles invalid input and matches encoder replacement', () => {
  const input = 'A'.repeat(39) + '😀' + 'B'
  assert.equal(boundCharacterText(input), 'A'.repeat(39) + '😀')
  assert.equal(Array.from(boundCharacterText(input)).length, 40)
  assert.equal(boundCharacterText(null), '')
  assert.equal(boundCharacterText('\ud800'), '\ufffd')
  assert.deepEqual(inspectCharacterText('\ud800').bytes, [0xef, 0xbf, 0xbd])
  assert.deepEqual(inspectCharacterText('').bytes, [])
})

test('fixed bytes reproduce the named mismatch with a native or absent decoder', () => {
  assert.equal(decodeMismatch('utf-8'), 'café')
  assert.equal(decodeMismatch('windows-1252'), 'cafÃ©')
  assert.equal(decodeMismatch('utf-8', null), 'café')
  assert.equal(decodeMismatch('windows-1252', null), 'cafÃ©')
  assert.deepEqual(MISMATCH_BYTES, [0x63, 0x61, 0x66, 0xc3, 0xa9])
  assert.throws(() => decodeMismatch('ascii'), RangeError)
})
