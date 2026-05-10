import { initLessonPage } from "../core/lesson-shell.js"
import { readStorage, writeStorage } from "../core/storage.js"

const lessonConfig = {
  lessonId: "binary-arithmetic",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-c",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Hexadecimal numbers",
        description: "Previous in C1 Number systems.",
        status: "Live",
        href: "../topics/hexadecimal-numbers.html",
      },
      next: {
        title: "Negative and floating point representation",
        description: "Next in C1 Number systems.",
        status: "Live",
        href: "../topics/negative-and-floating-point-representation.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-binary-arithmetic-quiz",
    passScore: 4,
    version: 2,
  },
  examPractice: {
    storageKey: "lesson-binary-arithmetic-exam-practice",
  },
}

const PRACTICE_STORAGE_KEY = "lesson-binary-arithmetic-practice"
const EMPTY_FEEDBACK =
  "Generate a question, then type the answer in binary."

const PRACTICE_COPY = {
  addition: {
    symbol: "+",
    empty: "Fill the carry row and result row, then check your working.",
    incorrect: "Not quite. Work from the right and check every carry.",
  },
  subtraction: {
    symbol: "-",
    empty: "Fill the borrow row and result row, then check your working.",
    incorrect: "Not quite. Check whether any column needs to borrow.",
  },
  multiplication: {
    symbol: "x",
    empty: EMPTY_FEEDBACK,
    incorrect: "Not quite. Use the 1 bits in the multiplier to build partial products.",
  },
  division: {
    symbol: "/",
    empty:
      "Fill the quotient-bit and new-remainder cells, then check your working.",
    incorrect: "Not quite. Check by multiplying your quotient by the divisor.",
  },
  bcd: {
    symbol: "+",
    empty: "Generate a question, then type the corrected BCD result.",
    incorrect: "Not quite. Check whether the raw BCD digit needs correction.",
  },
}

const SUBTRACTION_STEPS = [
  {
    top: ["1", "0", "0", "0"],
    subtract: ["0", "0", "1", "1"],
    result: ["", "", "", ""],
    activeCells: ["result-3"],
    note: "Start at the 1s column. The first problem is 0 - 1, so a borrow is needed.",
  },
  {
    top: ["0", "1", "1", "10"],
    subtract: ["0", "0", "1", "1"],
    result: ["", "", "", "1"],
    activeCells: ["top-0", "top-1", "top-2", "top-3", "result-3"],
    changedCells: ["top-0", "top-1", "top-2", "top-3"],
    note: "The 2s and 4s columns are 0, so the borrow travels from the 8s column. The 1s column becomes binary 10, so 10 - 1 gives 1.",
  },
  {
    top: ["0", "1", "1", "10"],
    subtract: ["0", "0", "1", "1"],
    result: ["", "", "0", "1"],
    activeCells: ["result-2"],
    note: "Move to the 2s column. After the borrow chain, it has 1 left. 1 - 1 gives 0.",
  },
  {
    top: ["0", "1", "1", "10"],
    subtract: ["0", "0", "1", "1"],
    result: ["", "1", "0", "1"],
    activeCells: ["result-1"],
    note: "Move to the 4s column. It now has 1, and the bottom row has 0, so the result bit is 1.",
  },
  {
    top: ["0", "1", "1", "10"],
    subtract: ["0", "0", "1", "1"],
    result: ["0", "1", "0", "1"],
    activeCells: ["result-0"],
    note: "Finish in the 8s column. 0 - 0 gives 0, so 1000 - 0011 = 0101.",
  },
]

const DIVISION_ROWS = [
  {
    place: "100",
    before: "1111",
    shiftedDivisor: "1100",
    fits: "yes",
    quotientBit: "1",
    after: "0011",
  },
  {
    place: "010",
    before: "0011",
    shiftedDivisor: "0110",
    fits: "no",
    quotientBit: "0",
    after: "0011",
  },
  {
    place: "001",
    before: "0011",
    shiftedDivisor: "0011",
    fits: "yes",
    quotientBit: "1",
    after: "0000",
  },
]

const DIVISION_STEPS = [
  {
    visibleRows: 0,
    activeRow: -1,
    quotient: "---",
    remainder: "1111",
    note:
      "Set up 1111 / 11. The quotient will have three places: 100, 010, and 001.",
  },
  {
    visibleRows: 1,
    activeRow: 0,
    quotient: "1--",
    remainder: "0011",
    note:
      "Try 11 shifted left two places: 1100. It fits into 1111, so write 1 in the 100 quotient place and subtract to leave 0011.",
  },
  {
    visibleRows: 2,
    activeRow: 1,
    quotient: "10-",
    remainder: "0011",
    note:
      "Shift the divisor one place right: 0110. It is too large for the current remainder 0011, so write 0 in the 010 quotient place.",
  },
  {
    visibleRows: 3,
    activeRow: 2,
    quotient: "101",
    remainder: "0000",
    note:
      "Try the unshifted divisor: 0011. It fits exactly into 0011, so write 1 in the 001 quotient place and subtract to leave 0000.",
  },
  {
    visibleRows: 3,
    activeRow: -1,
    quotient: "101",
    remainder: "0000",
    note:
      "The quotient bits are 101 and the remainder is 0. Check: 11 x 101 = 1111.",
  },
]

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function toBinary(value, minWidth = 1) {
  return value.toString(2).padStart(minWidth, "0")
}

function bitWidth(...values) {
  return Math.max(...values.map((value) => value.toString(2).length), 1)
}

function cleanBinary(value) {
  return value.trim().replace(/[\s_]/g, "")
}

function createElement(tagName, className, textContent) {
  const element = document.createElement(tagName)

  if (className) {
    element.className = className
  }

  if (textContent !== undefined) {
    element.textContent = textContent
  }

  return element
}

function decimalDigitToBcd(value) {
  return toBinary(value, 4)
}

function decimalToBcd(value) {
  return value
    .toString()
    .split("")
    .map((digit) => decimalDigitToBcd(Number(digit)))
    .join(" ")
}

function generateAdditionTask() {
  const first = randomInt(3, 15)
  const second = randomInt(2, 15)
  const answer = first + second
  const width = Math.max(4, bitWidth(first, second))

  return {
    type: "addition",
    first,
    second,
    answer,
    width,
  }
}

function generateSubtractionTask() {
  const first = randomInt(5, 15)
  const second = randomInt(1, first - 1)
  const answer = first - second

  return {
    type: "subtraction",
    first,
    second,
    answer,
    width: 4,
  }
}

function generateMultiplicationTask() {
  const first = randomInt(2, 15)
  const second = [2, 3, 4, 5][randomInt(0, 3)]
  const answer = first * second

  return {
    type: "multiplication",
    first,
    second,
    answer,
    width: Math.max(4, bitWidth(first, second, answer)),
  }
}

function generateDivisionTask() {
  const divisor = [2, 3, 4, 5][randomInt(0, 3)]
  const quotient = randomInt(2, 15)
  const dividend = divisor * quotient

  return {
    type: "division",
    first: dividend,
    second: divisor,
    answer: quotient,
    width: Math.max(4, bitWidth(dividend, divisor, quotient)),
  }
}

function generateBcdTask() {
  const first = randomInt(0, 9)
  const second = randomInt(0, 9)
  const answer = first + second

  return {
    type: "bcd",
    first,
    second,
    answer,
    width: answer > 9 ? 8 : 4,
  }
}

function generateTask(type) {
  if (type === "addition") {
    return generateAdditionTask()
  }

  if (type === "subtraction") {
    return generateSubtractionTask()
  }

  if (type === "multiplication") {
    return generateMultiplicationTask()
  }

  if (type === "division") {
    return generateDivisionTask()
  }

  return generateBcdTask()
}

function taskToQuestionHtml(task) {
  if (task.type === "bcd") {
    const firstBcd = decimalDigitToBcd(task.first)
    const secondBcd = decimalDigitToBcd(task.second)

    return `
      <p>Add the BCD digits <code>${firstBcd}</code> and <code>${secondBcd}</code>.</p>
      <small>${task.first} + ${task.second}. Type the corrected BCD result, grouped if needed.</small>
    `
  }

  const symbol = PRACTICE_COPY[task.type].symbol
  const firstBinary = toBinary(task.first, task.width)
  const secondBinary = toBinary(task.second, task.type === "division" ? 1 : task.width)
  const label = task.type === "division" ? "quotient" : "answer"
  const helperText =
    task.type === "division" && task.second === 2
      ? "This is a / 10 question, so shifting right once is the quickest method. Fill the quotient-bit and new-remainder cells."
      : task.type === "division"
        ? `This is a / ${secondBinary} question. Test shifted copies of the divisor, write each quotient bit, and record each new remainder.`
        : `Type the ${label} in binary. Leading zeros are accepted.`

  return `
    <p>Calculate <code>${firstBinary} ${symbol} ${secondBinary}</code>.</p>
    <small>${helperText}</small>
  `
}

function binaryAnswerIsCorrect(task, cleanedAnswer) {
  if (!/^[01]+$/.test(cleanedAnswer)) {
    return false
  }

  if (task.type === "bcd") {
    const expected = decimalToBcd(task.answer).replace(/\s/g, "")
    const accepted = new Set([expected])

    if (expected.length === 4) {
      accepted.add(expected.padStart(8, "0"))
    }

    return accepted.has(cleanedAnswer)
  }

  return parseInt(cleanedAnswer, 2) === task.answer
}

function parsePracticeAnswer(task, value) {
  const cleaned = cleanBinary(value)

  if (!cleaned) {
    return {
      valid: false,
      correct: false,
      message: "Enter an answer before checking.",
    }
  }

  if (!/^[01]+$/.test(cleaned)) {
    return {
      valid: false,
      correct: false,
      message: "Use only 0s and 1s in the answer.",
    }
  }

  const correct = binaryAnswerIsCorrect(task, cleaned)

  return {
    valid: true,
    correct,
    message: correct
      ? getCorrectMessage(task)
      : PRACTICE_COPY[task.type].incorrect,
  }
}

function isTablePracticeType(type) {
  return type === "addition" || type === "subtraction"
}

function isDivisionPracticeType(type) {
  return type === "division"
}

function isStructuredPracticeType(type) {
  return isTablePracticeType(type) || isDivisionPracticeType(type)
}

function getPracticeWidth(task) {
  if (task.type === "addition") {
    return Math.max(task.width, bitWidth(task.answer))
  }

  return task.width
}

function getResultCells(task) {
  return toBinary(task.answer, getPracticeWidth(task)).split("")
}

function getAuxiliaryCells(task) {
  if (task.type === "addition") {
    return getAdditionCarryCells(task.first, task.second, getPracticeWidth(task))
  }

  return getBorrowMarkerCells(task.first, task.second, getPracticeWidth(task))
}

function normaliseAuxiliaryCell(value) {
  return value === "1" ? "1" : ""
}

function cellsMatch(userCells, expectedCells, mode) {
  if (!Array.isArray(userCells) || userCells.length !== expectedCells.length) {
    return false
  }

  return expectedCells.every((expectedCell, index) => {
    const userCell = userCells[index] ?? ""

    if (mode === "auxiliary") {
      return normaliseAuxiliaryCell(userCell) === expectedCell
    }

    return userCell === expectedCell
  })
}

function tableValuesAreComplete(values, expectedLength) {
  return (
    Array.isArray(values?.result) &&
    values.result.length === expectedLength &&
    values.result.every((value) => value === "0" || value === "1")
  )
}

function parseTablePracticeAnswer(task, tableValues) {
  const expectedResult = getResultCells(task)
  const expectedAuxiliary = getAuxiliaryCells(task)

  if (!tableValuesAreComplete(tableValues, expectedResult.length)) {
    return {
      correct: false,
      message: "Fill every result cell with 0 or 1 before checking.",
    }
  }

  const resultCorrect = cellsMatch(tableValues.result, expectedResult, "result")
  const auxiliaryCorrect = cellsMatch(
    tableValues.auxiliary ?? [],
    expectedAuxiliary,
    "auxiliary"
  )

  if (resultCorrect && auxiliaryCorrect) {
    return {
      correct: true,
      message: getCorrectMessage(task),
    }
  }

  if (resultCorrect) {
    return {
      correct: false,
      message:
        task.type === "addition"
          ? "The result row is right. Check the carry row as well."
          : "The result row is right. Check the borrow row as well.",
    }
  }

  return {
    correct: false,
    message: PRACTICE_COPY[task.type].incorrect,
  }
}

function buildDivisionRows(task) {
  const quotientBits = toBinary(task.answer)
  let remainder = task.first

  return quotientBits.split("").map((_, index) => {
    const shift = quotientBits.length - 1 - index
    const shiftedDivisor = task.second << shift
    const fits = remainder >= shiftedDivisor
    const quotientBit = fits ? "1" : "0"
    const nextRemainder = fits ? remainder - shiftedDivisor : remainder
    const row = {
      place: toBinary(1 << shift, quotientBits.length),
      before: toBinary(remainder, task.width),
      shiftedDivisor: toBinary(shiftedDivisor, task.width),
      quotientBit,
      after: toBinary(nextRemainder, task.width),
    }

    remainder = nextRemainder
    return row
  })
}

function getDefaultDivisionTableValues(task) {
  return {
    divisionRows: buildDivisionRows(task).map(() => ({
      quotientBit: "",
      remainder: "",
    })),
  }
}

function divisionValuesAreComplete(tableValues, rowCount) {
  if (!Array.isArray(tableValues?.divisionRows)) {
    return false
  }

  if (tableValues.divisionRows.length < rowCount) {
    return false
  }

  return Array.from({ length: rowCount }).every((_, index) => {
    const row = tableValues.divisionRows[index]
    const quotientBit = row?.quotientBit
    const remainder = cleanBinary(row?.remainder ?? "")
    return (
      (quotientBit === "0" || quotientBit === "1") &&
      remainder.length > 0 &&
      /^[01]+$/.test(remainder)
    )
  })
}

function parseDivisionPracticeAnswer(task, tableValues) {
  const expectedRows = buildDivisionRows(task)

  if (!divisionValuesAreComplete(tableValues, expectedRows.length)) {
    return {
      correct: false,
      message:
        "Fill every quotient bit and new remainder cell before checking.",
    }
  }

  const rowsCorrect = expectedRows.every((expectedRow, index) => {
    const userRow = tableValues.divisionRows[index]
    const userRemainder = cleanBinary(userRow.remainder)

    return (
      userRow.quotientBit === expectedRow.quotientBit &&
      parseInt(userRemainder, 2) === parseInt(expectedRow.after, 2)
    )
  })

  if (rowsCorrect) {
    return {
      correct: true,
      message: getCorrectMessage(task),
    }
  }

  const quotientBits = tableValues.divisionRows
    .map((row) => row?.quotientBit ?? "")
    .join("")
  const expectedQuotient = toBinary(task.answer)

  if (quotientBits === expectedQuotient) {
    return {
      correct: false,
      message:
        "The quotient bits are right. Check the remainder after each subtract step.",
    }
  }

  return {
    correct: false,
    message: PRACTICE_COPY.division.incorrect,
  }
}

function getCorrectMessage(task) {
  if (task.type === "bcd") {
    return `Correct. ${task.first} + ${task.second} is ${decimalToBcd(
      task.answer
    )} in BCD.`
  }

  const symbol = PRACTICE_COPY[task.type].symbol
  const firstBinary = toBinary(task.first, task.width)
  const secondBinary = toBinary(task.second, task.type === "division" ? 1 : task.width)
  const answerBinary = toBinary(task.answer, task.type === "subtraction" ? task.width : 1)

  return `Correct. ${firstBinary} ${symbol} ${secondBinary} = ${answerBinary}.`
}

function createWorkingTable(rows, columns) {
  const table = createElement("div", "binary-working-table")
  table.style.setProperty("--working-columns", columns.toString())

  rows.forEach((row) => {
    const label = createElement("span", `row-label ${row.isResult ? "result-label" : ""}`)
    label.textContent = row.label
    table.append(label)

    row.cells.forEach((cell) => {
      table.append(createElement("span", "", cell))
    })
  })

  return table
}

function createPracticeTableInput(rowName, index, value) {
  const input = document.createElement("input")
  input.className = "practice-table-input"
  input.type = "text"
  input.inputMode = "numeric"
  input.maxLength = 1
  input.autocomplete = "off"
  input.value = value ?? ""
  input.dataset.practiceRow = rowName
  input.dataset.practiceIndex = index.toString()
  input.setAttribute(
    "aria-label",
    `${rowName} bit ${index + 1} in the working table`
  )
  return input
}

function appendPracticeTableRow(table, row) {
  const label = createElement(
    "span",
    `row-label ${row.isResult ? "result-label" : ""}`,
    row.label
  )
  table.append(label)

  row.cells.forEach((cell, index) => {
    if (row.inputName) {
      table.append(createPracticeTableInput(row.inputName, index, cell))
      return
    }

    table.append(createElement("span", "", cell))
  })
}

function createPracticeEntryTable(task, tableValues) {
  const width = getPracticeWidth(task)
  const table = createElement("div", "binary-entry-table")
  table.style.setProperty("--working-columns", width.toString())

  const top = toBinary(task.first, width).split("")
  const bottom = toBinary(task.second, width).split("")
  const auxiliaryLabel = task.type === "addition" ? "carry" : "borrow"

  const rows = [
    {
      label: auxiliaryLabel,
      cells: tableValues?.auxiliary ?? Array(width).fill(""),
      inputName: "auxiliary",
    },
    { label: "top", cells: top },
    {
      label: task.type === "addition" ? "bottom" : "subtract",
      cells: bottom,
    },
    {
      label: "result",
      cells: tableValues?.result ?? Array(width).fill(""),
      inputName: "result",
      isResult: true,
    },
  ]

  rows.forEach((row) => appendPracticeTableRow(table, row))
  return table
}

function collectPracticeTableValues(form) {
  const values = {
    auxiliary: [],
    result: [],
  }

  form.querySelectorAll(".practice-table-input").forEach((input) => {
    const rowName = input.dataset.practiceRow
    const index = Number(input.dataset.practiceIndex)

    if (!rowName || !Number.isInteger(index)) {
      return
    }

    values[rowName][index] = input.value
  })

  return values
}

function getDivisionCurrentRemainder(task, tableValues, index) {
  if (index === 0) {
    return toBinary(task.first, task.width)
  }

  const previousRemainder = cleanBinary(
    tableValues?.divisionRows?.[index - 1]?.remainder ?? ""
  )

  return previousRemainder || "-"
}

function createDivisionPracticeTable(task, tableValues) {
  const expectedRows = buildDivisionRows(task)
  const table = createElement("div", "division-practice-table")

  const headers = [
    "Place",
    "Current remainder",
    "Shifted divisor",
    "Quotient bit",
    "New remainder",
  ]

  headers.forEach((header) => {
    table.append(createElement("span", "row-label", header))
  })

  expectedRows.forEach((row, index) => {
    table.append(createElement("span", "", row.place))
    const currentRemainder = createElement(
      "span",
      "division-current-remainder",
      getDivisionCurrentRemainder(task, tableValues, index)
    )
    currentRemainder.dataset.divisionCurrentRemainderRow = index.toString()
    table.append(currentRemainder)
    table.append(createElement("span", "", row.shiftedDivisor))

    const quotientInput = createPracticeTableInput(
      "quotientBit",
      index,
      tableValues?.divisionRows?.[index]?.quotientBit ?? ""
    )
    quotientInput.dataset.practiceDivisionField = "quotientBit"
    quotientInput.dataset.practiceDivisionRow = index.toString()
    quotientInput.setAttribute(
      "aria-label",
      `Quotient bit for division row ${index + 1}`
    )
    table.append(quotientInput)

    const remainderInput = document.createElement("input")
    remainderInput.className = "practice-table-input"
    remainderInput.type = "text"
    remainderInput.inputMode = "numeric"
    remainderInput.autocomplete = "off"
    remainderInput.value = tableValues?.divisionRows?.[index]?.remainder ?? ""
    remainderInput.dataset.practiceDivisionField = "remainder"
    remainderInput.dataset.practiceDivisionRow = index.toString()
    remainderInput.setAttribute(
      "aria-label",
      `New remainder for division row ${index + 1}`
    )
    table.append(remainderInput)
  })

  return table
}

function syncDivisionCurrentRemainders(form, task, tableValues) {
  form
    .querySelectorAll("[data-division-current-remainder-row]")
    .forEach((cell) => {
      const index = Number(cell.dataset.divisionCurrentRemainderRow)

      if (!Number.isInteger(index)) {
        return
      }

      cell.textContent = getDivisionCurrentRemainder(task, tableValues, index)
    })
}

function collectDivisionPracticeValues(form) {
  const values = { divisionRows: [] }

  form.querySelectorAll("[data-practice-division-field]").forEach((input) => {
    const index = Number(input.dataset.practiceDivisionRow)
    const field = input.dataset.practiceDivisionField

    if (!Number.isInteger(index) || !field) {
      return
    }

    if (!values.divisionRows[index]) {
      values.divisionRows[index] = {
        quotientBit: "",
        remainder: "",
      }
    }

    values.divisionRows[index][field] = input.value
  })

  return values
}

function sanitisePracticeTableInput(input) {
  input.value = input.value.replace(/[^01]/g, "").slice(0, 1)
}

function sanitiseDivisionPracticeInput(input) {
  input.value = input.value.replace(/[^01]/g, "")

  if (input.dataset.practiceDivisionField === "quotientBit") {
    input.value = input.value.slice(0, 1)
  }
}

function getAdditionCarryCells(first, second, width) {
  const carryCells = Array(width).fill("")
  let carry = 0

  for (let index = width - 1; index >= 0; index -= 1) {
    carryCells[index] = carry ? "1" : ""
    const firstBit = (first >> (width - 1 - index)) & 1
    const secondBit = (second >> (width - 1 - index)) & 1
    const total = firstBit + secondBit + carry
    carry = total >= 2 ? 1 : 0
  }

  return carryCells
}

function getBorrowNotes(first, second, width) {
  const notes = []
  let borrow = 0

  for (let position = 0; position < width; position += 1) {
    const firstBit = (first >> position) & 1
    const secondBit = (second >> position) & 1
    const adjustedTop = firstBit - borrow

    if (adjustedTop < secondBit) {
      notes.push(`Borrow needed in the ${toBinary(1 << position)} column.`)
      borrow = 1
    } else {
      borrow = 0
    }
  }

  return notes
}

function getBorrowMarkerCells(first, second, width) {
  const borrowCells = Array(width).fill("")
  let borrow = 0

  for (let position = 0; position < width; position += 1) {
    const index = width - 1 - position
    const firstBit = (first >> position) & 1
    const secondBit = (second >> position) & 1
    const adjustedTop = firstBit - borrow

    if (adjustedTop < secondBit) {
      borrowCells[index] = "1"
      borrow = 1
    } else {
      borrow = 0
    }
  }

  return borrowCells
}

function appendChipRow(container, values) {
  const row = createElement("div", "working-chip-row")

  values.forEach((value) => {
    row.append(createElement("span", "", value))
  })

  container.append(row)
}

function renderAdditionWorking(task, container) {
  const width = Math.max(task.width, bitWidth(task.answer))
  const first = toBinary(task.first, width).split("")
  const second = toBinary(task.second, width).split("")
  const answer = toBinary(task.answer, width).split("")
  const carry = getAdditionCarryCells(task.first, task.second, width)

  container.append(
    createWorkingTable(
      [
        { label: "carry", cells: carry },
        { label: "top", cells: first },
        { label: "bottom", cells: second },
        { label: "result", cells: answer, isResult: true },
      ],
      width
    )
  )
}

function renderSubtractionWorking(task, container) {
  const width = task.width
  const first = toBinary(task.first, width).split("")
  const second = toBinary(task.second, width).split("")
  const answer = toBinary(task.answer, width).split("")
  const notes = getBorrowNotes(task.first, task.second, width)

  container.append(
    createWorkingTable(
      [
        { label: "top", cells: first },
        { label: "subtract", cells: second },
        { label: "result", cells: answer, isResult: true },
      ],
      width
    )
  )

  appendChipRow(
    container,
    notes.length > 0 ? notes : ["No borrow was needed for this subtraction."]
  )
}

function renderMultiplicationWorking(task, container) {
  const multiplierBits = toBinary(task.second).split("").reverse()
  const partials = []

  multiplierBits.forEach((bit, shift) => {
    if (bit === "1") {
      partials.push({
        label: `${toBinary(task.first)} shifted ${shift}`,
        value: task.first << shift,
      })
    }
  })

  const width = Math.max(bitWidth(task.answer), ...partials.map((item) => bitWidth(item.value)))
  const visual = createElement("div", "partial-product-visual")

  partials.forEach((partial) => {
    visual.append(createElement("span", "partial-label", partial.label))
    visual.append(createElement("code", "", toBinary(partial.value, width)))
  })

  visual.append(createElement("span", "partial-label result-label", "add"))
  visual.append(createElement("code", "", toBinary(task.answer, width)))
  container.append(visual)
}

function renderDivisionWorking(task, container) {
  appendChipRow(container, [
    `${toBinary(task.second)} x ${toBinary(task.answer)} = ${toBinary(task.first)}`,
    `${task.second} x ${task.answer} = ${task.first} in denary`,
  ])

  const note = createElement(
    "p",
    "practice-working-note",
    "Division can be checked by multiplying the divisor by the quotient."
  )
  container.append(note)
}

function renderBcdWorking(task, container) {
  const rawBinary = toBinary(task.answer, task.answer > 15 ? 5 : 4)
  const expected = decimalToBcd(task.answer)
  const needsCorrection = task.answer > 9

  appendChipRow(container, [
    `${decimalDigitToBcd(task.first)} + ${decimalDigitToBcd(task.second)} = ${rawBinary}`,
    needsCorrection ? "Raw result is not a valid BCD digit." : "Raw result is already valid BCD.",
    needsCorrection ? "Add 0110 to correct." : "No correction needed.",
    `BCD result: ${expected}`,
  ])
}

function renderWorking(task, container, reveal) {
  container.replaceChildren()
  const shouldShow = reveal && !isTablePracticeType(task.type)
  container.hidden = !shouldShow

  if (!shouldShow) {
    return
  }

  if (task.type === "multiplication") {
    renderMultiplicationWorking(task, container)
    return
  }

  if (task.type === "division") {
    renderDivisionWorking(task, container)
    return
  }

  renderBcdWorking(task, container)
}

function normalisePracticeState(value) {
  return value && typeof value === "object" ? value : {}
}

function getDefaultPracticeState(type) {
  const task = generateTask(type)

  return {
    task,
    inputValue: "",
    tableValues: isTablePracticeType(type)
      ? {
          auxiliary: Array(getPracticeWidth(task)).fill(""),
          result: Array(getPracticeWidth(task)).fill(""),
        }
      : isDivisionPracticeType(type)
        ? getDefaultDivisionTableValues(task)
        : null,
    status: "empty",
    message: PRACTICE_COPY[type].empty,
  }
}

function initPracticeGenerators() {
  const cards = Array.from(document.querySelectorAll("[data-practice-type]"))

  if (cards.length === 0) {
    return
  }

  const state = normalisePracticeState(readStorage(PRACTICE_STORAGE_KEY, {}))

  cards.forEach((card) => {
    const type = card.dataset.practiceType

    if (!type || !PRACTICE_COPY[type]) {
      return
    }

    if (!state[type]?.task) {
      state[type] = getDefaultPracticeState(type)
    }
  })

  function saveState() {
    writeStorage(PRACTICE_STORAGE_KEY, state)
  }

  function renderCard(card) {
    const type = card.dataset.practiceType
    const cardState = state[type]
    const question = card.querySelector("[data-role='practice-question']")
    const input = card.querySelector("[data-role='practice-answer']")
    const feedback = card.querySelector("[data-role='practice-feedback']")
    const working = card.querySelector("[data-role='practice-working']")
    const form = card.querySelector("[data-role='practice-form']")
    const answerRow = form?.querySelector(".practice-answer-row")

    if (
      !type ||
      !cardState ||
      !question ||
      !input ||
      !feedback ||
      !working ||
      !form ||
      !answerRow
    ) {
      return
    }

    question.innerHTML = taskToQuestionHtml(cardState.task)

    let entry = form.querySelector("[data-role='practice-entry']")

    if (!entry) {
      entry = createElement("div", "practice-entry")
      entry.dataset.role = "practice-entry"
      form.insertBefore(entry, answerRow)
    }

    card.classList.toggle("is-table-practice", isStructuredPracticeType(type))

    if (isTablePracticeType(type)) {
      input.value = ""
      entry.hidden = false
      entry.replaceChildren(
        createPracticeEntryTable(cardState.task, cardState.tableValues)
      )
    } else if (isDivisionPracticeType(type)) {
      input.value = ""
      entry.hidden = false
      entry.replaceChildren(
        createDivisionPracticeTable(cardState.task, cardState.tableValues)
      )
    } else {
      input.value = cardState.inputValue ?? ""
      entry.hidden = true
      entry.replaceChildren()
    }

    feedback.className = "practice-feedback"
    if (cardState.status === "correct") {
      feedback.classList.add("is-correct")
    }
    if (cardState.status === "incorrect") {
      feedback.classList.add("is-incorrect")
    }
    feedback.textContent = cardState.message || PRACTICE_COPY[type].empty

    renderWorking(cardState.task, working, cardState.status === "correct")
  }

  cards.forEach((card) => {
    renderCard(card)

    const type = card.dataset.practiceType
    const form = card.querySelector("[data-role='practice-form']")
    const input = card.querySelector("[data-role='practice-answer']")
    const newQuestionButton = card.querySelector(
      "[data-practice-action='new-question']"
    )

    form?.addEventListener("submit", (event) => {
      event.preventDefault()

      if (!type || !state[type]) {
        return
      }

      const tableValues = isTablePracticeType(type)
        ? collectPracticeTableValues(form)
        : isDivisionPracticeType(type)
          ? collectDivisionPracticeValues(form)
          : null
      const result = isTablePracticeType(type)
        ? parseTablePracticeAnswer(state[type].task, tableValues)
        : isDivisionPracticeType(type)
          ? parseDivisionPracticeAnswer(state[type].task, tableValues)
          : parsePracticeAnswer(state[type].task, input?.value ?? "")

      state[type] = {
        ...state[type],
        inputValue: isStructuredPracticeType(type) ? "" : input?.value ?? "",
        tableValues,
        status: result.correct ? "correct" : "incorrect",
        message: result.message,
      }

      saveState()
      renderCard(card)
    })

    input?.addEventListener("input", () => {
      if (!type || !state[type] || isStructuredPracticeType(type)) {
        return
      }

      state[type] = {
        ...state[type],
        inputValue: input.value,
        status: "empty",
        message: PRACTICE_COPY[type].empty,
      }

      saveState()
      renderCard(card)
    })

    form?.addEventListener("input", (event) => {
      const tableInput = event.target.closest(".practice-table-input")

      if (
        !tableInput ||
        !type ||
        !state[type] ||
        !isStructuredPracticeType(type)
      ) {
        return
      }

      if (isDivisionPracticeType(type)) {
        sanitiseDivisionPracticeInput(tableInput)
      } else {
        sanitisePracticeTableInput(tableInput)
      }

      const tableValues = isDivisionPracticeType(type)
        ? collectDivisionPracticeValues(form)
        : collectPracticeTableValues(form)

      state[type] = {
        ...state[type],
        inputValue: "",
        tableValues,
        status: "empty",
        message: PRACTICE_COPY[type].empty,
      }

      if (isDivisionPracticeType(type)) {
        syncDivisionCurrentRemainders(form, state[type].task, tableValues)
      }

      const feedback = card.querySelector("[data-role='practice-feedback']")
      const working = card.querySelector("[data-role='practice-working']")

      if (feedback) {
        feedback.className = "practice-feedback"
        feedback.textContent = PRACTICE_COPY[type].empty
      }

      if (working) {
        renderWorking(state[type].task, working, false)
      }

      saveState()
    })

    newQuestionButton?.addEventListener("click", () => {
      if (!type) {
        return
      }

      state[type] = getDefaultPracticeState(type)
      saveState()
      renderCard(card)
      card
        .querySelector(".practice-table-input, [data-role='practice-answer']")
        ?.focus()
    })
  })

  saveState()
}

function createSubtractionStepCell(rowName, index, value, step) {
  const cell = createElement("span", "", value)
  const key = `${rowName}-${index}`
  cell.classList.toggle("is-current", step.activeCells?.includes(key))
  cell.classList.toggle("is-changed", step.changedCells?.includes(key))
  return cell
}

function renderSubtractionStepTable(table, step) {
  table.replaceChildren()
  table.style.setProperty("--working-columns", "4")

  const rows = [
    { key: "top", label: "top", cells: step.top },
    { key: "subtract", label: "subtract", cells: step.subtract },
    { key: "result", label: "result", cells: step.result, isResult: true },
  ]

  rows.forEach((row) => {
    table.append(
      createElement(
        "span",
        `row-label ${row.isResult ? "result-label" : ""}`,
        row.label
      )
    )

    row.cells.forEach((cell, index) => {
      table.append(createSubtractionStepCell(row.key, index, cell, step))
    })
  })
}

function initSubtractionVisualiser() {
  const visualiser = document.querySelector(
    "[data-role='subtraction-visualiser']"
  )

  if (!visualiser) {
    return
  }

  const table = visualiser.querySelector("[data-role='subtraction-step-table']")
  const note = visualiser.querySelector("[data-role='subtraction-step-note']")
  const counter = visualiser.querySelector(
    "[data-role='subtraction-step-counter']"
  )
  const previousButton = visualiser.querySelector(
    "[data-subtraction-step='previous']"
  )
  const nextButton = visualiser.querySelector("[data-subtraction-step='next']")
  let stepIndex = 0

  function render() {
    const step = SUBTRACTION_STEPS[stepIndex]

    if (table) {
      renderSubtractionStepTable(table, step)
    }

    if (note) {
      note.textContent = step.note
    }

    if (counter) {
      counter.textContent = `Step ${stepIndex + 1} of ${
        SUBTRACTION_STEPS.length
      }`
    }

    if (previousButton) {
      previousButton.disabled = stepIndex === 0
    }

    if (nextButton) {
      nextButton.disabled = stepIndex === SUBTRACTION_STEPS.length - 1
    }
  }

  visualiser.querySelectorAll("[data-subtraction-step]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.subtractionStep

      if (action === "previous") {
        stepIndex = Math.max(stepIndex - 1, 0)
      }

      if (action === "next") {
        stepIndex = Math.min(stepIndex + 1, SUBTRACTION_STEPS.length - 1)
      }

      if (action === "reset") {
        stepIndex = 0
      }

      render()
    })
  })

  render()
}

function createDivisionStepCell(value, rowIndex, step) {
  const cell = createElement("span", "", value)
  cell.classList.toggle("is-active", rowIndex === step.activeRow)
  cell.classList.toggle(
    "is-complete",
    rowIndex < step.visibleRows && rowIndex !== step.activeRow
  )
  return cell
}

function renderDivisionStepTable(table, step) {
  table.replaceChildren()

  const headers = [
    "Place",
    "Remainder",
    "Shifted divisor",
    "Fits?",
    "Write bit",
    "New remainder",
  ]

  headers.forEach((header) => {
    table.append(createElement("span", "row-label", header))
  })

  DIVISION_ROWS.forEach((row, rowIndex) => {
    const isVisible = rowIndex < step.visibleRows
    const cells = isVisible
      ? [
          row.place,
          row.before,
          row.shiftedDivisor,
          row.fits,
          row.quotientBit,
          row.after,
        ]
      : [row.place, "-", "-", "-", "-", "-"]

    cells.forEach((cell) => {
      table.append(createDivisionStepCell(cell, rowIndex, step))
    })
  })
}

function initDivisionVisualiser() {
  const visualiser = document.querySelector("[data-role='division-visualiser']")

  if (!visualiser) {
    return
  }

  const table = visualiser.querySelector("[data-role='division-step-table']")
  const note = visualiser.querySelector("[data-role='division-step-note']")
  const counter = visualiser.querySelector("[data-role='division-step-counter']")
  const quotient = visualiser.querySelector("[data-role='division-step-quotient']")
  const remainder = visualiser.querySelector(
    "[data-role='division-step-remainder']"
  )
  const previousButton = visualiser.querySelector(
    "[data-division-step='previous']"
  )
  const nextButton = visualiser.querySelector("[data-division-step='next']")
  let stepIndex = 0

  function render() {
    const step = DIVISION_STEPS[stepIndex]

    if (table) {
      renderDivisionStepTable(table, step)
    }

    if (note) {
      note.textContent = step.note
    }

    if (counter) {
      counter.textContent = `Step ${stepIndex + 1} of ${DIVISION_STEPS.length}`
    }

    if (quotient) {
      quotient.textContent = step.quotient
    }

    if (remainder) {
      remainder.textContent = step.remainder
    }

    if (previousButton) {
      previousButton.disabled = stepIndex === 0
    }

    if (nextButton) {
      nextButton.disabled = stepIndex === DIVISION_STEPS.length - 1
    }
  }

  visualiser.querySelectorAll("[data-division-step]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.divisionStep

      if (action === "previous") {
        stepIndex = Math.max(stepIndex - 1, 0)
      }

      if (action === "next") {
        stepIndex = Math.min(stepIndex + 1, DIVISION_STEPS.length - 1)
      }

      if (action === "reset") {
        stepIndex = 0
      }

      render()
    })
  })

  render()
}

initLessonPage(lessonConfig)
initSubtractionVisualiser()
initDivisionVisualiser()
initPracticeGenerators()
