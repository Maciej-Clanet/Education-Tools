// A bounded, fixed-size integer array for a classroom example. No persistence.
export function updateArrayValue(values, index, value) {
  if (!Array.isArray(values) || !Number.isInteger(index) || index < 0 || index >= values.length) {
    return { ok: false, message: 'Choose an index within the array.' }
  }
  // Number('') is zero, so check the text before conversion.
  const text = String(value).trim()
  if (!/^\d+$/.test(text) || !Number.isSafeInteger(Number(text)) || Number(text) > 9999) {
    return { ok: false, message: 'Enter a whole-number count from 0 to 9999 for this example.' }
  }
  const next = [...values]
  next[index] = Number(text)
  return { ok: true, values: next, previous: values[index], value: next[index] }
}
