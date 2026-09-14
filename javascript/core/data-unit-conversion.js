// A small unit model for guided data conversions, not a general maths parser.
export const BYTE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB']
export const BINARY_UNITS = ['B', 'KiB', 'MiB', 'GiB', 'TiB']
export const BIT_UNITS = ['b', 'Kb', 'Mb', 'Gb', 'Tb']
export const CONVERSION_UNITS = [...BIT_UNITS, ...BYTE_UNITS, ...BINARY_UNITS.slice(1)]

export function describeUnit(symbol) {
  if (BYTE_UNITS.includes(symbol)) return { symbol, rank: BYTE_UNITS.indexOf(symbol), bits: false, binary: false }
  if (BINARY_UNITS.includes(symbol)) return { symbol, rank: BINARY_UNITS.indexOf(symbol), bits: false, binary: true }
  if (BIT_UNITS.includes(symbol)) return { symbol, rank: BIT_UNITS.indexOf(symbol), bits: true, binary: false }
  throw new Error('Choose a recognised data unit. Letter case matters.')
}

export function conversionConvention(from, to, selectedBase = 1000) {
  const a = describeUnit(from), b = describeUnit(to)
  const binary = a.binary || b.binary
  if (binary && [a, b].some(unit => unit.rank > 0 && !unit.binary)) {
    throw new Error('Use one prefix system at a time. Convert through B to compare decimal and binary units.')
  }
  const needsPrefix = a.rank !== b.rank
  const selectable = needsPrefix && !binary
  if (selectable && ![1000, 1024].includes(Number(selectedBase))) throw new Error('Choose a prefix convention.')
  return { base: binary ? 1024 : selectable ? Number(selectedBase) : 1000, binary, selectable, needsPrefix }
}

export function formatDataNumber(value) {
  return new Intl.NumberFormat('en-GB', { maximumSignificantDigits: 12 }).format(value)
}

export function createConversionPlan(rawValue, from, to, selectedBase = 1000) {
  const text = String(rawValue).trim()
  if (!/^(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(text)) throw new Error('Enter a non-negative number, such as 3.5 or 4096.')
  const value = Number(text)
  if (!Number.isFinite(value) || value > 1e12 || (value > 0 && value < 1e-9)) throw new Error('Use a value from 0.000000001 to 1,000,000,000,000, or zero.')
  const convention = conversionConvention(from, to, selectedBase)
  const source = describeUnit(from), target = describeUnit(to)
  const byteUnits = convention.binary ? BINARY_UNITS : BYTE_UNITS
  const edges = []
  let current = from, rank = source.rank, amount = value
  const add = (next, factor, type) => {
    const result = amount * factor
    if (!Number.isFinite(result)) throw new Error('That result is too large. Try a smaller starting value.')
    edges.push({ from: current, to: next, factor, type, operation: `${factor < 1 ? '÷' : '×'}${formatDataNumber(factor < 1 ? 1 / factor : factor)}`, before: amount, after: result })
    current = next; amount = result
  }
  // For two bit units, stay on the bit prefix rail. Otherwise use the byte rail.
  const rail = source.bits && target.bits ? BIT_UNITS : byteUnits
  if (source.bits && !target.bits) add(byteUnits[rank], 1 / 8, 'bit-byte')
  while (rank !== target.rank) {
    const direction = Math.sign(target.rank - rank)
    rank += direction
    add(rail[rank], direction > 0 ? 1 / convention.base : convention.base, 'prefix')
  }
  if (!source.bits && target.bits) add(to, 8, 'bit-byte')
  const factor = edges.reduce((product, edge) => product * edge.factor, 1)
  const direction = factor < 1 ? 'larger' : factor > 1 ? 'smaller' : 'same'
  const frames = [{ kind: 'locate' }, { kind: 'direction' }]
  if (!edges.length) frames.push({ kind: 'unchanged' })
  edges.forEach((_, edge) => frames.push({ kind: 'jump', edge }))
  edges.forEach((_, edge) => frames.push({ kind: 'calculate', edge }))
  frames.push({ kind: 'result' })
  return { value, from, to, ...convention, edges, frames, result: amount, direction, rail }
}
