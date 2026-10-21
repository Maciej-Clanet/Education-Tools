import { initLessonPage } from "../core/lesson-shell.js"
import { initNumberDemos } from "./negative-floating-demos.js"
import { initFractionPractice } from "./negative-floating-practice.js"
import { readStorage, writeStorage } from "../core/storage.js"

const lessonConfig = {
  lessonId: "negative-and-floating-point-representation",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-c",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Binary arithmetic",
        description: "Previous in C1 Number systems.",
        status: "Live",
        href: "../topics/binary-arithmetic.html",
      },
      next: {
        title: "Character sets, ASCII, and Unicode",
        description: "Next in C2 Text representation.",
        status: "Live",
        href: "../topics/character-sets-ascii-and-unicode.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-negative-and-floating-point-representation-quiz-v3",
    passScore: 6,
    version: 3,
  },
  examPractice: {
    storageKey: "lesson-negative-and-floating-point-representation-exam-practice",
  },
}

const BIT_WIDTH = 8
const TWOS_PRACTICE_STORAGE_KEY = "lesson-negative-floating-twos-practice"
const NEGATIVE_VALUES = [-3, -5, -9, -13, -18, -27, -42, -64, -85, -96, -127]
const toUnsignedByte = value => value.toString(2).padStart(8, "0")
const toTwosComplement = value => toUnsignedByte(value < 0 ? 256 + value : value)
const invertBits = bits => [...bits].map(bit => bit === "1" ? "0" : "1").join("")
const addOne = bits => toUnsignedByte((parseInt(bits, 2) + 1) % 256)
function createElement(tagName, className, textContent) {
  const element = document.createElement(tagName)
  element.className = className
  if (textContent !== undefined) element.textContent = textContent
  return element
}

function chooseRandomValue(previous) {
  const choices = NEGATIVE_VALUES.filter(value => value !== previous)
  return choices[Math.floor(Math.random() * choices.length)]
}

function generatePracticeTask(previous) {
  const value = chooseRandomValue(previous)

  return {
    type: "encode",
    value,
    bits: toTwosComplement(value),
  }
}

function getDefaultPracticeTableValues() {
  return {
    magnitude: Array(BIT_WIDTH).fill(""),
    carry: Array(BIT_WIDTH).fill(""),
    inverted: Array(BIT_WIDTH).fill(""),
    addOne: [..."00000001"],
    result: Array(BIT_WIDTH).fill(""),
  }
}

function normalisePracticeState(value) {
  if (
    value &&
    typeof value === "object" &&
    value.task &&
    value.task.type === "encode"
  ) {
    return {
      ...value,
      practiceVersion: 2,
      // Retain the formerly editable add-one row as well as the original work.
      ...(value.practiceVersion !== 2 ? { legacyTableValues: value.legacyTableValues ?? value.tableValues } : {}),
      task: value.task,
      tableValues: normalisePracticeTableValues(value.tableValues),
      status: value.status ?? "empty",
      message:
        value.message ??
        "Fill the working table, then check your answer.",
    }
  }

  return {
    practiceVersion: 2,
    task: generatePracticeTask(),
    tableValues: getDefaultPracticeTableValues(),
    status: "empty",
    message: "Fill the working table, then check your answer.",
  }
}

function getPracticePrompt(task) {
  return `Represent ${task.value} in 8-bit two's complement.`
}

function normalisePracticeTableValues(value) {
  const fallback = getDefaultPracticeTableValues()
  const rows = Object.keys(fallback)

  rows.forEach((rowName) => {
    if (rowName === "addOne") return
    if (!Array.isArray(value?.[rowName])) {
      return
    }

    fallback[rowName] = Array.from({ length: BIT_WIDTH }, (_, index) =>
      value[rowName][index] === "1"
        ? "1"
        : value[rowName][index] === "0"
          ? "0"
          : ""
    )
  })

  return fallback
}

function createPracticeBitInput(rowName, rowLabel, index, value) {
  const input = document.createElement("input")
  input.type = "text"
  input.inputMode = "numeric"
  input.autocomplete = "off"
  input.maxLength = 1
  input.value = value ?? ""
  if (rowName === "addOne") {
    input.readOnly = true
    input.tabIndex = -1
  }
  input.dataset.twosPracticeRow = rowName
  input.dataset.twosPracticeIndex = index.toString()
  input.setAttribute(
    "aria-label",
    `${rowLabel} bit ${index + 1} in the two's complement working table`
  )
  return input
}

function createTwosPracticeTable(tableValues) {
  const values = normalisePracticeTableValues(tableValues)
  const table = createElement("table", "nf-calculation-table twos-practice-table")
  table.append(createElement("caption", "", "Working place values; read the final first place as −128."))
  const headers = ["Place value", "128", "64", "32", "16", "8", "4", "2", "1"]
  const rows = [
    { key: "magnitude", label: "Step 1 · Positive number" },
    { key: "carry", label: "Carry (optional)" },
    { key: "inverted", label: "Step 2 · Invert bits" },
    { key: "addOne", label: "+ Step 3 · Add 1" },
    { key: "result", label: "= Step 4 · Final answer" },
  ]
  const head = table.createTHead().insertRow()
  headers.forEach((header) => {
    const cell = createElement("th", "", header)
    cell.scope = "col"
    head.append(cell)
  })
  let body = table.createTBody()
  rows.forEach((row) => {
    if (row.key === "carry") {
      body = table.createTBody()
      body.className = "nf-addition-group"
    }
    const tr = body.insertRow()
    tr.className = row.key === "addOne" ? "nf-fixed-add" : row.key === "carry" ? "nf-carry-row" : ""
    const heading = createElement("th", "", row.label)
    heading.scope = "row"
    tr.append(heading)
    values[row.key].forEach((bit, index) => {
      tr.insertCell().append(createPracticeBitInput(row.key, row.label, index, bit))
    })
  })

  return table
}

function collectTwosPracticeTableValues(form) {
  const values = getDefaultPracticeTableValues()

  form.querySelectorAll("[data-twos-practice-row]").forEach((input) => {
    const rowName = input.dataset.twosPracticeRow
    const index = Number(input.dataset.twosPracticeIndex)

    if (!values[rowName] || !Number.isInteger(index)) {
      return
    }

    values[rowName][index] = input.value
  })

  return values
}

function sanitisePracticeBitInput(input) {
  input.value = input.value.replace(/[^01]/g, "").slice(0, 1)
}

function bitRowToString(row) {
  return row.join("")
}

function expectedPracticeRows(task) {
  const magnitude = toUnsignedByte(Math.abs(task.value))
  const inverted = invertBits(magnitude)

  return {
    magnitude,
    inverted,
    addOne: "00000001",
    result: addOne(inverted),
  }
}

function rowIsComplete(row) {
  return (
    row.length === BIT_WIDTH &&
    row.every((bit) => bit === "0" || bit === "1")
  )
}

function parseTwosPracticeAnswer(task, tableValues) {
  const values = normalisePracticeTableValues(tableValues)
  const expected = expectedPracticeRows(task)
  const rows = Object.keys(expected)

  if (!rows.every((rowName) => rowIsComplete(values[rowName]))) {
    return {
      correct: false,
      message: "Complete steps 1, 2 and 4 with 0 or 1. The carry row is optional.",
    }
  }

  const userRows = Object.fromEntries(
    rows.map((rowName) => [
      rowName,
      bitRowToString(values[rowName]),
    ])
  )

  if (rows.every((rowName) => userRows[rowName] === expected[rowName])) {
    return {
      correct: true,
      message: `Correct. ${task.value} is ${expected.result} in 8-bit two's complement.`,
    }
  }

  if (userRows.magnitude !== expected.magnitude) {
    return {
      correct: false,
      message: `Check the positive number row. Start with the 8-bit binary version of ${Math.abs(
        task.value
      )}.`,
    }
  }

  if (userRows.inverted !== expected.inverted) {
    return {
      correct: false,
      message: "The positive number row is right. Now invert every bit.",
    }
  }

  if (userRows.addOne !== expected.addOne) {
    return {
      correct: false,
      message: "The add 1 row should show 00000001.",
    }
  }

  return {
    correct: false,
    message: "The setup rows are right. Check the final binary addition.",
  }
}

function renderPracticeWorking(container, task, reveal) {
  if (!container) {
    return
  }

  container.replaceChildren()
  container.hidden = !reveal

  if (!reveal) {
    return
  }

  const list = createElement("ol", "twos-working-list")
  const expected = expectedPracticeRows(task)
  const steps = [
    `Write ${Math.abs(task.value)} as ${expected.magnitude}.`,
    `Invert the bits to get ${expected.inverted}.`,
    `Add 00000001 to get ${expected.result}.`,
  ]

  steps.forEach((step) => {
    list.append(createElement("li", "", step))
  })

  const details = createElement("details", "exam-guidance")
  details.append(createElement("summary", "", "Show worked answer"), list)
  container.append(details)
}

function initTwosPractice() {
  const practice = document.querySelector("[data-role='twos-practice']")

  if (!practice) {
    return
  }

  const form = practice.querySelector("[data-role='twos-practice-form']")
  const prompt = practice.querySelector("[data-role='twos-practice-prompt']")
  const tableWrap = practice.querySelector("[data-role='twos-practice-table']")
  const feedback = practice.querySelector("[data-role='twos-practice-feedback']")
  const working = practice.querySelector("[data-role='twos-practice-working']")
  const newButton = practice.querySelector("[data-action='new-twos-question']")
  let state = normalisePracticeState(
    readStorage(TWOS_PRACTICE_STORAGE_KEY, null)
  )

  function save() {
    writeStorage(TWOS_PRACTICE_STORAGE_KEY, state)
  }

  function render() {
    if (prompt) {
      prompt.textContent = getPracticePrompt(state.task)
    }

    if (tableWrap && !tableWrap.children.length) {
      tableWrap.replaceChildren(createTwosPracticeTable(state.tableValues))
    }

    if (feedback) {
      feedback.className = "practice-feedback"
      feedback.classList.toggle("is-correct", state.status === "correct")
      feedback.classList.toggle("is-incorrect", state.status === "incorrect")
      feedback.textContent = state.message
    }

    renderPracticeWorking(working, state.task, state.status === "correct")
  }

  form?.addEventListener("submit", (event) => {
    event.preventDefault()

    const tableValues = collectTwosPracticeTableValues(form)
    const result = parseTwosPracticeAnswer(state.task, tableValues)

    state = {
      ...state,
      practiceVersion: 2,
      tableValues,
      status: result.correct ? "correct" : "incorrect",
      message: result.message,
    }
    save()
    render()
  })

  form?.addEventListener("input", (event) => {
    const input = event.target.closest("[data-twos-practice-row]")

    if (!input) {
      return
    }

    sanitisePracticeBitInput(input)

    state = {
      ...state,
      tableValues: collectTwosPracticeTableValues(form),
      status: "empty",
      message: "Keep going, then check your table.",
    }
    save()

    if (feedback) {
      feedback.className = "practice-feedback"
      feedback.textContent = state.message
    }

    if (working) {
      renderPracticeWorking(working, state.task, false)
    }
  })

  newButton?.addEventListener("click", () => {
    state = {
      ...state,
      practiceVersion: 2,
      task: generatePracticeTask(state.task.value),
      tableValues: getDefaultPracticeTableValues(),
      status: "empty",
      message: "Fill the working table, then check your answer.",
    }
    save()
    tableWrap?.replaceChildren()
    render()
    practice.querySelector("[data-twos-practice-row]")?.focus()
  })

  render()
}


initLessonPage(lessonConfig)
initTwosPractice()
initFractionPractice()
initNumberDemos()
