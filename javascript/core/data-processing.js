// Small numeric operations shared by the processing demonstrations.
export function parseValues(text) {
  const tokens = text.trim().split(',').map(value => value.trim())
  if (tokens.length > 24 || tokens.some(value => value === '' || !Number.isFinite(Number(value)))) {
    throw new Error('Enter 1–24 numbers separated by commas; do not leave an empty value.')
  }
  const values = tokens.map(Number)
  if (values.some(value => Math.abs(value) > 1000000)) throw new Error('Use values between −1,000,000 and 1,000,000 for this demonstration.')
  return values
}

export function validateTemperature(value) {
  return Number.isFinite(value) && value >= -30 && value <= 55
}

export function convertTemperature(value) {
  return value * 9 / 5 + 32
}

export function sortRecords(records, field = 'time', direction = 'ascending') {
  const sign = direction === 'descending' ? -1 : 1
  return [...records].sort((a, b) => sign * (field === 'temperature'
    ? a.temperature - b.temperature : a.time.localeCompare(b.time)))
}

export function summarise(values) {
  if (!values.length) return null
  const total = values.reduce((sum, value) => sum + value, 0)
  return { count: values.length, total, average: total / values.length,
    minimum: Math.min(...values), maximum: Math.max(...values) }
}

export function describeTrend(records) {
  const ordered = sortRecords(records)
  if (ordered.length < 2) return 'Not enough readings to identify a trend'
  const changes = ordered.slice(1).map((record, i) => record.temperature - ordered[i].temperature)
  if (changes.every(value => value === 0)) return 'Steady'
  if (changes.every(value => value >= 0)) return 'Increasing'
  if (changes.every(value => value <= 0)) return 'Decreasing'
  return 'Mixed'
}
