export const CHARACTER_LIMIT = 40

export const UTF8_FIXTURES = [
  { text: 'A', codePoint: 0x41, bytes: [0x41] },
  { text: 'é', codePoint: 0xe9, bytes: [0xc3, 0xa9] },
  { text: '漢', codePoint: 0x6f22, bytes: [0xe6, 0xbc, 0xa2] },
  { text: '😀', codePoint: 0x1f600, bytes: [0xf0, 0x9f, 0x98, 0x80] },
]

export const MISMATCH_BYTES = Object.freeze([0x63, 0x61, 0x66, 0xc3, 0xa9])
export const MISMATCH_RESULTS = Object.freeze({ 'utf-8': 'café', 'windows-1252': 'cafÃ©' })

export const CHARACTER_TASKS = [
  {
    title: 'An existing ticket printer',
    scenario: 'The printer receives messages such as TICKET 21. Its connection already expects standard ASCII.',
    facts: 'Required text: A–Z, digits and spaces. All are available in standard ASCII.',
    answer: 'ascii',
    explanation: 'Standard ASCII already covers every required symbol and matches the existing receiver. There is no coverage problem to solve in this case.',
  },
  {
    title: 'An international membership register',
    scenario: 'The register must preserve members’ names, including José and 李, when records move between systems.',
    facts: 'Standard ASCII does not include é or 李. Unicode includes both.',
    answer: 'unicode',
    explanation: 'Use Unicode support with an agreed encoding such as UTF-8. This preserves the actual names; replacing unsupported letters would change the data.',
  },
  {
    title: 'A name becomes garbled',
    scenario: 'A sender saves café as UTF-8. The text arrives unchanged, but a receiver using Windows-1252 displays cafÃ©.',
    facts: 'The sender already supports the required characters. The receiver uses a different decoder.',
    answer: 'decoder',
    explanation: 'Decode the original data as UTF-8 to match the sender. Character coverage is already sufficient; changing the font or removing the accent would not correct the interpretation.',
  },
]
