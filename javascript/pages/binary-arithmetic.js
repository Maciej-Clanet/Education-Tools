import { initLessonPage } from "../core/lesson-shell.js"
import { readStorage, writeStorage } from "../core/storage.js"
import { borrowedTopCells, longDivisionRows, migrateArithmeticPractice } from "../core/binary-arithmetic-model.js"
import { initArithmeticDemos } from "./binary-arithmetic-demos.js"

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
    storageKey: "lesson-binary-arithmetic-quiz-v3",
    passScore: 5,
    totalQuestions: 6,
    version: 3,
  },
  examPractice: {
    storageKey: "lesson-binary-arithmetic-exam-practice",
  },
}

const PRACTICE_STORAGE_KEY = "lesson-binary-arithmetic-practice"
const EMPTY_FEEDBACK =
  "Type your answer in binary, then choose Check answer."

const PRACTICE_COPY = {
  addition: {
    symbol: "+",
    empty: "Fill the carry row and answer row, then check your working.",
    incorrect: "Not quite. Work from the right and check every carry.",
  },
  subtraction: {
    symbol: "-",
    empty: "Update the new top row after borrowing, then fill the answer row.",
    incorrect: "Not quite. Check whether any column needs to borrow.",
  },
  multiplication: {
    symbol: "×",
    empty: EMPTY_FEEDBACK,
    incorrect: "Not quite. Start with the rightmost bit of the second number. Add one zero for each place you move left.",
  },
  division: {
    symbol: "÷",
    empty:
      "Work from left to right. Type the answer in binary.",
    incorrect: "Not quite. Check by multiplying your quotient by the divisor.",
  },
  bcd: {
    symbol: "+",
    empty: "Type the BCD answer. Keep four bits for each decimal digit.",
    incorrect: "Not quite. Check whether the raw BCD digit needs correction.",
  },
}

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
  const width = isTablePracticeType(task.type) ? task.width : 1
  const firstBinary = toBinary(task.first, width)
  const secondBinary = toBinary(task.second, width)
  const helperText = task.type === "division"
    ? "These questions divide exactly. Work from left to right, then type the answer in binary."
    : task.type === "subtraction"
      ? "Update the new top row. Use 0, 1 or 10 in each cell. Then subtract from right to left."
      : task.type === "addition"
        ? "Write each carry above the column that receives it. Leave unused carry cells blank."
        : "Write one row for each bit of the second number, then add. Leading zeros are accepted."

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

function getPracticeWidth(task) {
  return task.type === "addition" ? Math.max(task.width, bitWidth(task.answer)) : task.width
}

function getAdditionCarryCells(first, second, width) {
  const cells = Array(width).fill("")
  let carry = 0
  for (let index = width - 1; index >= 0; index -= 1) {
    cells[index] = carry ? "1" : ""
    const place = width - 1 - index
    carry = ((first >> place) & 1) + ((second >> place) & 1) + carry >= 2 ? 1 : 0
  }
  return cells
}

function isTablePracticeType(type) {
  return type === "addition" || type === "subtraction"
}

function getCorrectMessage(task) {
  if (task.type === "bcd") return `Correct. ${task.first} + ${task.second} is ${decimalToBcd(task.answer)} in BCD.`
  return `Correct. ${toBinary(task.first)} ${PRACTICE_COPY[task.type].symbol} ${toBinary(task.second)} = ${toBinary(task.answer)}.`
}

function getDefaultPracticeState(type) {
  const task = generateTask(type)
  const width = getPracticeWidth(task)
  return {
    task,
    workingVersion: 2,
    inputValue: "",
    tableValues: isTablePracticeType(type) ? {
      auxiliary: type === "subtraction" ? toBinary(task.first, width).split("") : Array(width).fill(""),
      result: Array(width).fill(""),
    } : null,
    status: "empty",
    message: PRACTICE_COPY[type].empty,
  }
}

function createPracticeEntryTable(task, values) {
  const width = getPracticeWidth(task)
  const table = createElement("div", "binary-entry-table")
  table.style.setProperty("--working-columns", width)
  const original = toBinary(task.first, width).split("")
  const rows = [
    {label:"Place value", heading:true, cells:Array.from({length:width}, (_, i) => 2 ** (width - 1 - i))},
    ...(task.type === "subtraction" ? [{label:"Original",cells:original}] : []),
    {label:task.type === "addition" ? "Carry" : "New top",cells:values?.auxiliary ?? original,input:"auxiliary"},
    ...(task.type === "addition" ? [{label:"Top",cells:original}] : []),
    {label:task.type === "addition" ? "Add" : "Subtract",cells:toBinary(task.second, width).split("")},
    {label:"Answer",cells:values?.result ?? Array(width).fill(""),input:"result"},
  ]
  for (const row of rows) {
    table.append(createElement("span", `row-label${row.heading ? " ba-place-heading" : ""}`, row.label))
    row.cells.forEach((value, index) => {
      if (!row.input) { table.append(createElement("span", row.heading ? "ba-place-heading" : "", value)); return }
      const input = document.createElement("input")
      input.type = "text"
      input.inputMode = "numeric"
      input.autocomplete = "off"
      input.className = "practice-table-input"
      input.maxLength = task.type === "subtraction" && row.input === "auxiliary" ? 2 : 1
      input.value = value
      input.dataset.practiceRow = row.input
      input.dataset.practiceIndex = index
      input.setAttribute("aria-label", `${row.label}, ${2 ** (width - 1 - index)}s column`)
      table.append(input)
    })
  }
  return table
}

function createScratchTable(task, values = {}) {
  const wrapper = createElement("div", "ba-scratch")
  const heading = createElement("div", "ba-scratch-heading")
  heading.append(createElement("strong", "", "Working table"))
  const clear = createElement("button", "lesson-secondary-action", "Clear working")
  clear.type = "button"
  clear.dataset.scratchClear = ""
  heading.append(clear)
  const table = createElement("table", `ba-table ba-scratch-table${task.type === "division" ? " ba-scratch-division" : ""}`)
  const body = table.createTBody()
  const inputCell = (row, key, label, length = 1) => {
    const input = createElement("input", "ba-scratch-input")
    input.type = "text"
    input.inputMode = "numeric"
    input.autocomplete = "off"
    input.maxLength = length
    input.dataset.scratchKey = key
    input.value = values[key] ?? ""
    input.setAttribute("aria-label", label)
    row.insertCell().append(input)
  }
  const addHeading = labels => {
    const row = table.createTHead().insertRow()
    labels.forEach(text => {
      const cell = createElement("th", "", text)
      cell.scope = "col"
      row.append(cell)
    })
  }
  if (task.type === "division") {
    addHeading(["Bring down", "Current group", "Subtract", "Left over", "Answer bit"])
    toBinary(task.first).split("").forEach((bit, index) => {
      const row = body.insertRow()
      const label = createElement("th", "", bit)
      label.scope = "row"
      row.append(label)
      for (const [key, name, max] of [["current","Current group",4],["subtract","Subtract",3],["remainder","Left over",3],["bit","Answer bit",1]]) {
        inputCell(row, `${index}-${key}`, `Step ${index + 1}: ${name}`, max)
      }
    })
  } else {
    const width = task.type === "bcd" ? 5 : task.width
    addHeading(["Place value", ...Array.from({length:width}, (_, i) => 2 ** (width - 1 - i))])
    const addRow = (key, label, fixed, max = 1) => {
      const row = body.insertRow()
      const title = createElement("th", "", label)
      title.scope = "row"
      row.append(title)
      for (let i = 0; i < width; i += 1) {
        if (fixed) row.insertCell().textContent = fixed[i]
        else inputCell(row, `${key}-${i}`, `${label}, ${2 ** (width - 1 - i)}s column`, max)
      }
    }
    addRow("carry", "Carry", null, 2)
    if (task.type === "bcd") {
      addRow("first", "First digit", toBinary(task.first, width))
      addRow("second", "+ Second digit", toBinary(task.second, width))
      addRow("raw", "Raw sum")
      addRow("correction", "+ Correction")
      addRow("corrected", "After correction")
    } else {
      toBinary(task.second).split("").reverse().forEach((bit, shift) => {
        addRow(`partial-${shift}`, `Bit ${bit}: ${2 ** shift}s`)
      })
      addRow("sum", "Sum of rows")
    }
  }
  const note = task.type === "division"
    ? "Use one row per bit, from left to right. Subtract the divisor or 0. Read the answer bits down the last column."
    : task.type === "bcd"
      ? "Add 00110 for correction if needed, or 00000. After correction, the leftmost bit is the tens digit. Write the final BCD answer as four bits per digit."
      : "Start with the rightmost bit of the second number. Write each shifted row, then add the rows."
  wrapper.append(heading, table, createElement("p", "ba-scratch-note", note))
  return wrapper
}

function collectTableValues(form) {
  const values = {auxiliary:[],result:[]}
  form.querySelectorAll(".practice-table-input").forEach(input => {
    values[input.dataset.practiceRow][Number(input.dataset.practiceIndex)] = input.value
  })
  return values
}

function checkTable(task, values) {
  const width = getPracticeWidth(task)
  if (values.result.length !== width || !values.result.every(value => /^[01]$/.test(value))) {
    return {correct:false,message:"Fill every answer cell with 0 or 1."}
  }
  const answerCorrect = values.result.join("") === toBinary(task.answer, width)
  const expected = task.type === "addition"
    ? getAdditionCarryCells(task.first, task.second, width)
    : borrowedTopCells(task.first, task.second, width)
  const workingCorrect = expected.every((value, i) => {
    const given = values.auxiliary[i]
    return task.type === "addition" ? (given === "0" ? "" : given) === value : given === value
  })
  if (answerCorrect && workingCorrect) return {correct:true,message:getCorrectMessage(task)}
  if (answerCorrect) return {correct:false,message:task.type === "addition"
    ? "The answer row is correct. Check the carry row. A carry belongs above the next column on the left."
    : "The answer row is correct. Check the new top row: reduce the column you borrow from and write 10 in the column that receives it."}
  return {correct:false,message:PRACTICE_COPY[task.type].incorrect}
}

function renderWorking(task, container, reveal) {
  container.replaceChildren()
  container.hidden = !reveal || isTablePracticeType(task.type)
  if (container.hidden) return
  const list = createElement("ol", "practice-solution")
  const add = text => list.append(createElement("li", "", text))
  if (task.type === "multiplication") {
    toBinary(task.second).split("").reverse().forEach((bit, shift) => {
      add(`Bit ${bit}, ${2 ** shift}s place: ${bit === "1" ? toBinary(task.first << shift) : "0"}.`)
    })
    add(`Add the rows: ${toBinary(task.answer)}.`)
  } else if (task.type === "division") {
    longDivisionRows(task.first, task.second).forEach(row => {
      add(`Bring down ${row.bit}: current value ${toBinary(row.current)}. Write ${row.quotientBit}; ${row.quotientBit === "1" ? `subtract ${toBinary(task.second)}` : "do not subtract"}. Remainder ${toBinary(row.remainder)}.`)
    })
  } else {
    const raw = toBinary(task.answer, 4)
    add(`${decimalDigitToBcd(task.first)} + ${decimalDigitToBcd(task.second)} = ${raw}.`)
    add(task.answer > 9
      ? `${task.answer > 15 ? "There is a carry out of the four-bit group" : "The group is above 1001"}. Add 0110: ${raw} + 0110 = ${toBinary(task.answer + 6)}.`
      : "The group is at most 1001 and has no carry. No correction is needed.")
    add(`Write each decimal digit in four bits: ${decimalToBcd(task.answer)}.`)
  }
  const answer = createElement("details", "practice-worked-answer")
  answer.append(createElement("summary", "", "Worked answer"), list)
  container.append(answer)
}

function initPracticeGenerators() {
  const saved = readStorage(PRACTICE_STORAGE_KEY, {})
  const state = migrateArithmeticPractice(saved && typeof saved === "object" ? saved : {})
  const cards = [...document.querySelectorAll("[data-practice-type]")]
  const save = () => writeStorage(PRACTICE_STORAGE_KEY, state)

  cards.forEach(card => {
    const type = card.dataset.practiceType
    if (!state[type]?.task) state[type] = getDefaultPracticeState(type)
    const form = card.querySelector("[data-role=practice-form]")
    const input = card.querySelector("[data-role=practice-answer]")
    const feedback = card.querySelector("[data-role=practice-feedback]")
    const working = card.querySelector("[data-role=practice-working]")
    const entry = createElement("div", "practice-entry")
    entry.dataset.role = "practice-entry"
    form.insertBefore(entry, form.querySelector(".practice-answer-row"))
    if (!isTablePracticeType(type)) {
      const response = createElement("div", "ba-practice-response")
      const label = form.querySelector("label")
      label.className = "ba-final-answer-label"
      label.textContent = type === "bcd" ? "Final answer in BCD" : "Final answer in binary"
      response.append(label, form.querySelector(".practice-answer-row"), feedback, working)
      form.append(response)
      form.classList.add("has-scratch")
    }
    card.classList.toggle("is-table-practice", isTablePracticeType(type))
    input.hidden = isTablePracticeType(type)
    input.disabled = isTablePracticeType(type)

    function renderFeedback() {
      feedback.className = `practice-feedback${state[type].status === "empty" ? "" : ` is-${state[type].status}`}`
      feedback.textContent = state[type].message || PRACTICE_COPY[type].empty
      renderWorking(state[type].task, working, state[type].status === "correct")
    }
    function renderQuestion() {
      card.querySelector("[data-role=practice-question]").innerHTML = taskToQuestionHtml(state[type].task)
      if (isTablePracticeType(type)) entry.replaceChildren(createPracticeEntryTable(state[type].task, state[type].tableValues))
      else {
        entry.replaceChildren(createScratchTable(state[type].task, state[type].scratch))
        input.value = state[type].inputValue ?? ""
      }
      renderFeedback()
    }
    renderQuestion()

    form.addEventListener("submit", event => {
      event.preventDefault()
      const values = isTablePracticeType(type) ? collectTableValues(form) : state[type].tableValues
      const result = isTablePracticeType(type) ? checkTable(state[type].task, values) : parsePracticeAnswer(state[type].task, input.value)
      state[type] = {...state[type],tableValues:values,inputValue:input.value,status:result.correct ? "correct" : "incorrect",message:result.message}
      save()
      renderFeedback()
    })
    form.addEventListener("input", event => {
      if (event.target.matches(".ba-scratch-input")) {
        event.target.value = event.target.value.replace(/[^01]/g, "").slice(0, event.target.maxLength)
        state[type].scratch ??= {}
        state[type].scratch[event.target.dataset.scratchKey] = event.target.value
        save()
        return
      } else if (event.target.matches(".practice-table-input")) {
        event.target.value = event.target.value.replace(/[^01]/g, "").slice(0, event.target.maxLength)
        state[type].tableValues = collectTableValues(form)
      } else if (event.target === input) state[type].inputValue = input.value
      else return
      state[type].status = "empty"
      state[type].message = PRACTICE_COPY[type].empty
      save()
      renderFeedback()
    })
    form.addEventListener("click", event => {
      if (!event.target.closest("[data-scratch-clear]")) return
      state[type].scratch = {}
      form.querySelectorAll(".ba-scratch-input").forEach(cell => { cell.value = "" })
      save()
    })
    card.querySelector("[data-practice-action=new-question]").addEventListener("click", () => {
      state[type] = getDefaultPracticeState(type)
      save()
      renderQuestion()
      card.querySelector(".practice-table-input, [data-role=practice-answer]:not([hidden])")?.focus()
    })
  })
  save()
}

initLessonPage(lessonConfig)
initPracticeGenerators()
initArithmeticDemos()
