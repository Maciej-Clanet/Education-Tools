// Guided byte-prefix conversions. Bit/byte relationships are taught separately.
export const BYTE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB']
export const BINARY_UNITS = ['B', 'KiB', 'MiB', 'GiB', 'TiB']

export function describeUnit(symbol) {
  if (BYTE_UNITS.includes(symbol)) return { symbol, rank: BYTE_UNITS.indexOf(symbol), binary: false }
  if (BINARY_UNITS.includes(symbol)) return { symbol, rank: BINARY_UNITS.indexOf(symbol), binary: true }
  throw new Error('Choose a byte unit from the selected system.')
}

export function conversionConvention(from, to, selectedBase) {
  const a = describeUnit(from), b = describeUnit(to)
  const base = selectedBase === undefined ? (a.binary || b.binary ? 1024 : 1000) : Number(selectedBase)
  if (![1000, 1024].includes(base)) throw new Error('Choose Decimal (1000) or Binary prefixes (1024).')
  const binary = base === 1024
  if ([a, b].some(unit => unit.rank > 0 && unit.binary !== binary)) {
    throw new Error('Choose byte units matching the selected system.')
  }
  return { base, binary }
}

export function formatDataNumber(value) {
  return new Intl.NumberFormat('en-GB', { maximumSignificantDigits: 12 }).format(value)
}

export function createConversionPlan(rawValue, from, to, selectedBase) {
  const text = String(rawValue).trim()
  if (!/^(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(text)) throw new Error('Enter a non-negative number, such as 3.5 or 4096.')
  const value = Number(text)
  if (!Number.isFinite(value) || value > 1e12 || (value > 0 && value < 1e-9)) throw new Error('Use a value from 0.000000001 to 1,000,000,000,000, or zero.')
  const convention = conversionConvention(from, to, selectedBase)
  const source = describeUnit(from), target = describeUnit(to)
  const rail = convention.binary ? BINARY_UNITS : BYTE_UNITS
  const edges = []
  let current = from, rank = source.rank, amount = value
  while (rank !== target.rank) {
    const direction = Math.sign(target.rank - rank)
    rank += direction
    const factor = direction > 0 ? 1 / convention.base : convention.base
    const result = amount * factor
    if (!Number.isFinite(result)) throw new Error('That result is too large. Try a smaller starting value.')
    edges.push({ from: current, to: rail[rank], factor, type: 'prefix', operation: `${direction > 0 ? '÷' : '×'}${formatDataNumber(convention.base)}`, before: amount, after: result })
    current = rail[rank]; amount = result
  }
  const direction = target.rank > source.rank ? 'larger' : target.rank < source.rank ? 'smaller' : 'same'
  const frames = [{ kind: 'locate' }, { kind: 'direction' }]
  if (!edges.length) frames.push({ kind: 'unchanged' })
  edges.forEach((_, edge) => frames.push({ kind: 'jump', edge }))
  edges.forEach((_, edge) => frames.push({ kind: 'calculate', edge }))
  frames.push({ kind: 'result' })
  return { value, from, to, ...convention, edges, frames, result: amount, direction, rail }
}
