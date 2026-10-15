// Whole-number arithmetic used by the lesson's worked answers.
export function borrowedTopCells(first, second, width) {
  if (!Number.isInteger(first) || !Number.isInteger(second) || first < 0 || second < 0 || !Number.isInteger(width) || width < 1) {
    throw new RangeError("Use non-negative whole numbers and a positive column count.")
  }
  const top = first.toString(2).padStart(width, "0").split("").map(Number)
  const bottom = second.toString(2).padStart(width, "0").split("").map(Number)

  if (first < second || top.length !== width || bottom.length !== width) {
    throw new RangeError("Subtraction needs non-negative operands that fit the columns.")
  }

  for (let index = width - 1; index >= 0; index -= 1) {
    if (top[index] >= bottom[index]) continue
    let donor = index - 1
    while (donor >= 0 && top[donor] === 0) donor -= 1
    if (donor < 0) throw new RangeError("No column is available to borrow from.")
    top[donor] -= 1
    for (let between = donor + 1; between < index; between += 1) top[between] = 1
    top[index] += 2
  }
  return top.map(value => value.toString(2))
}

export function longDivisionRows(dividend, divisor) {
  if (!Number.isInteger(dividend) || dividend < 0 || !Number.isInteger(divisor) || divisor <= 0) {
    throw new RangeError("Use a non-negative dividend and a positive divisor.")
  }
  let remainder = 0
  return dividend.toString(2).split("").map(bit => {
    const before = remainder
    const current = remainder * 2 + Number(bit)
    const quotientBit = current >= divisor ? "1" : "0"
    remainder = current - Number(quotientBit) * divisor
    return { bit, before, current, quotientBit, remainder }
  })
}

// Each exchange moves one unit to the adjacent place, where it is worth two.
export function subtractionSteps(first, second, width) {
  borrowedTopCells(first, second, width) // Validate the operands with the practice model.
  const top = first.toString(2).padStart(width, "0").split("").map(Number)
  const bottom = second.toString(2).padStart(width, "0").split("").map(Number)
  const answer = Array(width).fill("")
  const steps = []
  const add = (phase, column, extra = {}) => steps.push({phase, column, top:top.map(n => n.toString(2)), answer:[...answer], ...extra})
  add("start", width - 1)
  for (let column = width - 1; column >= 0; column -= 1) {
    add("check", column, {needsBorrow:top[column] < bottom[column]})
    if (top[column] < bottom[column]) {
      let donor = column - 1
      while (top[donor] === 0) donor -= 1
      for (let from = donor; from < column; from += 1) {
        top[from] -= 1
        top[from + 1] += 2
        add("borrow", column, {from, to:from + 1})
      }
    }
    answer[column] = String(top[column] - bottom[column])
    add("subtract", column)
  }
  add("done", null)
  return steps
}

export function divisionSteps(dividend, divisor) {
  const rows = longDivisionRows(dividend, divisor)
  const quotient = Array(rows.length).fill("")
  const steps = [{phase:"start", column:0, quotient:[...quotient], remainder:0}]
  rows.forEach((row, column) => {
    steps.push({...row, phase:"bring", column, quotient:[...quotient], remainder:row.before})
    quotient[column] = row.quotientBit
    steps.push({...row, phase:"decide", column, quotient:[...quotient]})
  })
  steps.push({phase:"done", column:null, quotient:[...quotient], remainder:rows.at(-1).remainder})
  return steps
}

// Keep earlier working when a practice entry changes its row notation.
export function migrateArithmeticPractice(state) {
  const subtraction = state.subtraction
  if (subtraction?.task && subtraction.workingVersion !== 2) {
    state.subtraction = {
      ...subtraction,
      workingVersion: 2,
      legacyTableValues: subtraction.tableValues,
      tableValues: {
        auxiliary: subtraction.task.first.toString(2).padStart(subtraction.task.width, "0").split(""),
        result: subtraction.tableValues?.result ?? Array(subtraction.task.width).fill(""),
      },
      status: "empty",
      message: "Update the new top row after borrowing, then fill the answer row.",
    }
  }
  const division = state.division
  if (division?.task && division.workingVersion !== 2) {
    const rows = division.tableValues?.divisionRows
    const complete = Array.isArray(rows) && rows.length > 0 && rows.every(row => /^[01]$/.test(row?.quotientBit ?? ""))
    state.division = {
      ...division,
      workingVersion: 2,
      inputValue: division.inputValue || (complete ? rows.map(row => row.quotientBit).join("") : ""),
    }
  }
  return state
}
