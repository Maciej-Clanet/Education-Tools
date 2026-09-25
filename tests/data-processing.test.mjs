import test from 'node:test'
import assert from 'node:assert/strict'
import { parseValues, validateTemperature, convertTemperature, sortRecords, summarise, describeTrend } from '../javascript/core/data-processing.js'
import { checkRule } from '../javascript/core/validation-lab.js'
import { bookingRules, correctedBooking } from '../javascript/data/data-processing-examples.js'

test('numeric demonstrations handle rules, conversion and edited summaries', () => {
  assert.equal(validateTemperature(-30), true)
  assert.equal(validateTemperature(55), true)
  assert.equal(validateTemperature(91), false)
  assert.equal(convertTemperature(-40), -40)
  assert.deepEqual(summarise(parseValues(' -2, 0, 8 ')), { count: 3, total: 6, average: 2, minimum: -2, maximum: 8 })
  assert.equal(summarise([]), null)
  for (const input of ['', '1,,2', '1,no', 'Infinity', '1000001']) assert.throws(() => parseValues(input))
})

test('sorting preserves source records and trend analysis uses time order', () => {
  const records = [{ time: '11:00', temperature: 7 }, { time: '09:00', temperature: -2 }, { time: '10:00', temperature: 3 }]
  const original = structuredClone(records)
  assert.deepEqual(sortRecords(records).map(r => r.time), ['09:00', '10:00', '11:00'])
  assert.deepEqual(sortRecords(records, 'temperature', 'descending').map(r => r.temperature), [7, 3, -2])
  assert.deepEqual(records, original)
  assert.equal(describeTrend(records), 'Increasing')
  assert.equal(describeTrend([...records, { time: '12:00', temperature: 1 }]), 'Mixed')
  assert.equal(describeTrend([{ time: '09:00', temperature: 2 }]), 'Not enough readings to identify a trend')
})

test('booking rules reject missing, out-of-range, fractional and malformed values', () => {
  assert.equal(checkRule('   ', bookingRules.name), false)
  assert.equal(checkRule('Alex', bookingRules.name), true)
  for (const value of ['', '15', '19', 'Infinity', 'sixteen']) assert.equal(checkRule(value, bookingRules.age), false, value)
  for (const value of ['16', '17', '18']) assert.equal(checkRule(value, bookingRules.age), true, value)
  for (const value of ['', '2.5', 'two', '9007199254740993']) assert.equal(checkRule(value, bookingRules.tickets), false, value)
  for (const value of ['ST-20', 'ST-2040', '204', 'ST-ABC']) assert.equal(checkRule(value, bookingRules.studentId), false, value)
  for (const [field, value] of Object.entries(correctedBooking)) assert.equal(checkRule(value, bookingRules[field]), true, field)
  // A plausible but incorrect value still passes: these checks cannot establish truth.
  assert.equal(checkRule('ST-999', bookingRules.studentId), true)
})
