import { CHARACTER_LIMIT, MISMATCH_BYTES, MISMATCH_RESULTS } from '../data/character-encoding-data.js'

export function boundCharacterText(value, limit = CHARACTER_LIMIT) {
  // Iterate Unicode code points, so truncation never splits an emoji's surrogate pair.
  // Match TextEncoder's replacement of isolated UTF-16 surrogates.
  return Array.from(typeof value === 'string' ? value : '').slice(0, limit).map(character => {
    const point = character.codePointAt(0)
    return point >= 0xd800 && point <= 0xdfff ? '\uFFFD' : character
  }).join('')
}

export function characterName(character) {
  const names = { ' ': 'space', '\n': 'line feed', '\r': 'carriage return', '\t': 'tab', '\0': 'null', '\u001b': 'escape', '\u007f': 'delete', '\u0301': 'combining acute accent' }
  const point = character.codePointAt(0)
  return names[character] ?? (point < 32 || (point >= 128 && point <= 159) ? `control U+${point.toString(16).toUpperCase().padStart(4, '0')}` : character)
}

export function inspectCharacterText(value) {
  const text = boundCharacterText(value)
  const encoder = new TextEncoder()
  const characters = Array.from(text).map(character => {
    const point = character.codePointAt(0)
    return {
      character, name: characterName(character), point,
      codePoint: `U+${point.toString(16).toUpperCase().padStart(4, '0')}`,
      ascii: point <= 127,
      binary: point <= 127 ? point.toString(2).padStart(7, '0') : null,
      bytes: Array.from(encoder.encode(character)),
    }
  })
  return { text, characters, codePoints: characters.length, bytes: Array.from(encoder.encode(text)), unsupported: characters.filter(character => !character.ascii) }
}

export function decodeMismatch(encoding, Decoder = globalThis.TextDecoder) {
  if (!Object.hasOwn(MISMATCH_RESULTS, encoding)) throw new RangeError('Choose one of the two teaching decoders.')
  try { return new Decoder(encoding).decode(Uint8Array.from(MISMATCH_BYTES)) }
  catch { return MISMATCH_RESULTS[encoding] }
}
