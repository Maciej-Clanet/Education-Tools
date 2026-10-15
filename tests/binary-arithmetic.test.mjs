import test from 'node:test'
import assert from 'node:assert/strict'
import { borrowedTopCells, longDivisionRows, migrateArithmeticPractice, subtractionSteps, divisionSteps } from '../javascript/core/binary-arithmetic-model.js'

test('every borrowing exchange is adjacent, conserves value and finishes with the correct answer', () => {
  for (let first = 0; first < 16; first++) {
    for (let second = 0; second <= first; second++) {
      const steps = subtractionSteps(first, second, 4)
      for (const [index, step] of steps.entries()) {
        const values = step.top.map(value => parseInt(value, 2))
        assert.equal(values.reduce((sum, value, i) => sum + value * 2 ** (3 - i), 0), first)
        if (step.phase === 'borrow') {
          assert.equal(step.to, step.from + 1)
          const before = steps[index - 1].top.map(value => parseInt(value, 2))
          assert.equal(values[step.from], before[step.from] - 1)
          assert.equal(values[step.to], before[step.to] + 2)
        }
      }
      assert.deepEqual(steps.at(-1).top, borrowedTopCells(first, second, 4))
      assert.equal(parseInt(steps.at(-1).answer.join(''), 2), first - second)
    }
  }
  assert.deepEqual(subtractionSteps(8,3,4).filter(s => s.phase === 'borrow').map(s => [s.from,s.to]), [[0,1],[1,2],[2,3]])
})

test('division brings each bit down before choosing its answer bit, including division by 101', () => {
  for (const [first,second] of [[15,3],[25,5],[13,3],[75,5],[0,5],[6,2]]) {
    const steps = divisionSteps(first,second)
    const brings = steps.filter(s => s.phase === 'bring')
    const decisions = steps.filter(s => s.phase === 'decide')
    assert.equal(brings.map(s => s.bit).join(''), first.toString(2))
    for (const [i,step] of brings.entries()) {
      assert.equal(step.quotient[i], '')
      assert.equal(step.current, step.before * 2 + Number(step.bit))
      assert.equal(decisions[i].remainder, step.current - Number(decisions[i].quotientBit) * second)
    }
    assert.equal(parseInt(steps.at(-1).quotient.join(''),2), Math.floor(first / second))
    assert.equal(steps.at(-1).remainder, first % second)
  }
})

test('borrowing through zeros shows 10 and preserves the value in every four-bit subtraction', () => {
  assert.deepEqual(borrowedTopCells(8, 3, 4), ['0', '1', '1', '10'])
  assert.deepEqual(borrowedTopCells(6, 1, 4), ['0', '1', '0', '10'])
  assert.throws(() => borrowedTopCells(1, 2, 4), RangeError)
  assert.throws(() => borrowedTopCells(2, -1, 4), RangeError)
  assert.throws(() => borrowedTopCells(16, 1, 4), RangeError)
  for (let first = 0; first < 16; first++) {
    for (let second = 0; second <= first; second++) {
      const top = borrowedTopCells(first, second, 4).map(value => parseInt(value, 2))
      const bottom = second.toString(2).padStart(4, '0').split('').map(Number)
      assert.equal(top.reduce((sum, value, i) => sum + value * 2 ** (3 - i), 0), first)
      const result = top.map((value, i) => value - bottom[i])
      assert.ok(result.every(value => value === 0 || value === 1))
      assert.equal(parseInt(result.join(''), 2), first - second)
    }
  }
})

test('long division gives the quotient and remainder, including zero bits in the answer', () => {
  assert.deepEqual(longDivisionRows(15, 3).map(row => row.quotientBit), ['0', '1', '0', '1'])
  for (let dividend = 0; dividend <= 255; dividend++) {
    for (let divisor = 1; divisor <= 15; divisor++) {
      const rows = longDivisionRows(dividend, divisor)
      const quotient = parseInt(rows.map(row => row.quotientBit).join(''), 2)
      assert.equal(quotient, Math.floor(dividend / divisor))
      assert.equal(rows.at(-1).remainder, dividend % divisor)
      assert.ok(rows.every(row => row.remainder >= 0 && row.remainder < divisor))
    }
  }
  assert.throws(() => longDivisionRows(10, 0), RangeError)
})

test('migration retains old working and result cells without treating borrow markers as new top values', () => {
  const oldSubtraction = {auxiliary:['', '1', '1', '1'], result:['0', '1', '0', '1']}
  const oldDivision = {divisionRows:[{quotientBit:'1',remainder:'0011'},{quotientBit:'0',remainder:'0011'},{quotientBit:'1',remainder:'0'}]}
  const state = {subtraction:{task:{first:8,second:3,answer:5,width:4},tableValues:oldSubtraction,status:'correct'},division:{task:{first:15,second:3,answer:5},tableValues:oldDivision,status:'correct'},addition:{inputValue:'saved'},retired:{note:'keep'}}
  migrateArithmeticPractice(state)
  assert.deepEqual(state.subtraction.tableValues.auxiliary,['1','0','0','0'])
  assert.deepEqual(state.subtraction.tableValues.result,oldSubtraction.result)
  assert.deepEqual(state.subtraction.legacyTableValues,oldSubtraction)
  assert.equal(state.subtraction.status,'empty')
  assert.equal(state.division.inputValue,'101')
  assert.deepEqual(state.division.tableValues,oldDivision)
  assert.equal(state.division.status,'correct')
  state.subtraction.tableValues.auxiliary[3]='10'
  const once=structuredClone(state)
  assert.deepEqual(migrateArithmeticPractice(state),once)
})
