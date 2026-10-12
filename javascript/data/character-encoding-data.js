export const CHARACTER_LIMIT = 40

export const UTF8_FIXTURES = [
  { text: 'A', codePoint: 0x41, bytes: [0x41] },
  { text: 'é', codePoint: 0xe9, bytes: [0xc3, 0xa9] },
  { text: '漢', codePoint: 0x6f22, bytes: [0xe6, 0xbc, 0xa2] },
  { text: '😀', codePoint: 0x1f600, bytes: [0xf0, 0x9f, 0x98, 0x80] },
]

export const MISMATCH_BYTES = Object.freeze([0x63, 0x61, 0x66, 0xc3, 0xa9])
export const MISMATCH_RESULTS = Object.freeze({ 'utf-8': 'café', 'windows-1252': 'cafÃ©' })
