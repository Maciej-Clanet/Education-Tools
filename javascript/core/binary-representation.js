// Small representation models shared by the teaching table and guided decoder.
export const BINARY_PLACE_VALUES = [128, 64, 32, 16, 8, 4, 2, 1]
export const DEFAULT_BINARY_PATTERN = '10101101'

export function placeValueState(pattern = DEFAULT_BINARY_PATTERN) {
  if (!/^[01]{8}$/.test(pattern)) throw new Error('Use exactly eight binary bits.')
  const selected = BINARY_PLACE_VALUES.filter((_, index) => pattern[index] === '1')
  return { pattern, selected, total: selected.reduce((sum, value) => sum + value, 0) }
}

export function togglePlaceBit(pattern, index) {
  placeValueState(pattern)
  if (!Number.isInteger(index) || index < 0 || index > 7) throw new Error('Choose a binary column.')
  return placeValueState([...pattern].map((bit, i) => i === index ? (bit === '1' ? '0' : '1') : bit).join(''))
}

export function bcdDecodingFrames(raw) {
  const bits = raw.replace(/\s/g, '')
  if (!/^(?:[01]{4})+$/.test(bits)) throw new Error('BCD needs complete four-bit groups.')
  const groups = bits.match(/.{4}/g)
  const digits = groups.map(group => parseInt(group, 2))
  if (digits.some(digit => digit > 9)) throw new Error('Invalid BCD digit: use 0000 through 1001.')
  const frames = [
    { grouped: false, revealed: 0, complete: false, text: 'First, split the bit string into groups of four.' },
    { grouped: true, revealed: 0, complete: false, text: `${groups.join(' | ')}: each group represents one decimal digit.` },
    ...groups.map((group, index) => ({
      grouped: true, revealed: index + 1, complete: false,
      text: `Group ${index + 1}: ${group} → ${digits[index]}. Keep this digit in position ${index + 1}.`,
    })),
    { grouped: true, revealed: groups.length, complete: true, text: `Write the digits together in order: ${digits.join('')}. Do not add them.` },
  ]
  return { bits, groups, digits, result: digits.join(''), frames }
}
