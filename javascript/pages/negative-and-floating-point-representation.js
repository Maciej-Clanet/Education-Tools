import { initLessonPage } from "../core/lesson-shell.js"
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
    storageKey: "lesson-negative-and-floating-point-representation-quiz",
    passScore: 4,
    version: 2,
  },
  examPractice: {
    storageKey: "lesson-negative-and-floating-point-representation-exam-practice",
  },
}

const BIT_WIDTH = 8
const BYTE_SIZE = 2 ** BIT_WIDTH
const TWOS_TOOL_STORAGE_KEY = "lesson-negative-floating-twos-tool"
const TWOS_PRACTICE_STORAGE_KEY = "lesson-negative-floating-twos-practice"
const FLOAT_TOOL_STORAGE_KEY = "lesson-negative-floating-normaliser"
const TRADEOFF_STORAGE_KEY = "lesson-negative-floating-tradeoff"

const NEGATIVE_VALUES = [
  -3,
  -5,
  -9,
  -13,
  -18,
  -27,
  -42,
  -64,
  -85,
  -96,
  -127,
]

const NORMALISE_CASES = {
  large: {
    raw: "1101.01",
    sign: "0",
    movement: "Move the point 3 places left so the value starts 1.x.",
    normalised: "1.10101 x 2^3",
    significand: "1.10101",
    exponent: "+3",
  },
  fraction: {
    raw: "0.001101",
    sign: "0",
    movement: "Move the point 3 places right to reach the first 1.",
    normalised: "1.101 x 2^-3",
    significand: "1.101",
    exponent: "-3",
  },
  negative: {
    raw: "-101.1",
    sign: "1",
    movement: "Store the sign separately, then normalise the magnitude 101.1.",
    normalised: "-1.011 x 2^2",
    significand: "1.011",
    exponent: "+2",
  },
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
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

function toUnsignedByte(value) {
  return value.toString(2).padStart(BIT_WIDTH, "0")
}

function toTwosComplement(value) {
  const adjustedValue = value < 0 ? BYTE_SIZE + value : value
  return toUnsignedByte(adjustedValue)
}

function invertBits(bits) {
  return bits
    .split("")
    .map((bit) => (bit === "1" ? "0" : "1"))
    .join("")
}

function addOne(bits) {
  return toUnsignedByte((parseInt(bits, 2) + 1) % BYTE_SIZE)
}

function renderByteCells(container, bits) {
  if (!container) {
    return
  }

  container.replaceChildren()

  bits.split("").forEach((bit, index) => {
    const cell = createElement("span", "bit-cell", bit)
    cell.classList.toggle("is-sign", index === 0)
    cell.classList.toggle("is-one", bit === "1")
    cell.classList.toggle("is-zero", bit === "0")
    cell.setAttribute(
      "aria-label",
      index === 0
        ? `Sign bit ${bit}`
        : `Bit ${index + 1} has value ${bit}`
    )
    container.append(cell)
  })
}

function normaliseTwosValue(value) {
  const parsed = Number(value)

  if (!Number.isFinite(parsed)) {
    return -5
  }

  return clamp(Math.trunc(parsed), -128, 127)
}

function setText(root, role, value) {
  const element = root.querySelector(`[data-role='${role}']`)

  if (element) {
    element.textContent = value
  }
}

function renderTwosTool(tool, state) {
  const value = normaliseTwosValue(state.value)
  const bits = toTwosComplement(value)
  const byteRow = tool.querySelector("[data-role='twos-byte']")
  const rangeMarker = tool.querySelector("[data-role='twos-range-marker']")
  const input = tool.querySelector("[data-role='twos-input']")
  const slider = tool.querySelector("[data-role='twos-slider']")

  if (input) {
    input.value = value.toString()
  }

  if (slider) {
    slider.value = value.toString()
  }

  if (rangeMarker) {
    const percentage = ((value + 128) / 255) * 100
    rangeMarker.style.left = `${percentage}%`
    rangeMarker.textContent = value.toString()
  }

  renderByteCells(byteRow, bits)
  setText(tool, "twos-denary", value.toString())
  setText(tool, "twos-result", bits)
  setText(tool, "twos-sign", bits[0] === "1" ? "negative range" : "zero or positive")

  if (value < 0) {
    const magnitude = toUnsignedByte(Math.abs(value))
    const inverted = invertBits(magnitude)
    const result = addOne(inverted)

    setText(tool, "twos-magnitude", magnitude)
    setText(tool, "twos-invert", inverted)
    setText(tool, "twos-add-one", result)
    setText(
      tool,
      "twos-note",
      `To store ${value}, start with ${Math.abs(
        value
      )}, invert every bit, then add 1.`
    )
    return
  }

  setText(tool, "twos-magnitude", bits)
  setText(tool, "twos-invert", "not needed")
  setText(tool, "twos-add-one", bits)
  setText(
    tool,
    "twos-note",
    "For zero and positive values, the 8-bit pattern is the same as ordinary unsigned binary."
  )
}

function initTwosComplementTool() {
  const tool = document.querySelector("[data-role='twos-complement-tool']")

  if (!tool) {
    return
  }

  const form = tool.querySelector("[data-role='twos-form']")
  const input = tool.querySelector("[data-role='twos-input']")
  const slider = tool.querySelector("[data-role='twos-slider']")
  const state = {
    value: normaliseTwosValue(
      readStorage(TWOS_TOOL_STORAGE_KEY, { value: -5 }).value
    ),
  }

  function saveAndRender(value) {
    state.value = normaliseTwosValue(value)
    writeStorage(TWOS_TOOL_STORAGE_KEY, state)
    renderTwosTool(tool, state)
  }

  form?.addEventListener("submit", (event) => {
    event.preventDefault()
    saveAndRender(input?.value)
  })

  input?.addEventListener("input", () => {
    if (input.value === "" || input.value === "-") {
      return
    }

    saveAndRender(input.value)
  })

  slider?.addEventListener("input", () => {
    saveAndRender(slider.value)
  })

  renderTwosTool(tool, state)
}

function chooseRandomValue() {
  return NEGATIVE_VALUES[Math.floor(Math.random() * NEGATIVE_VALUES.length)]
}

function generatePracticeTask() {
  const value = chooseRandomValue()

  return {
    type: "encode",
    value,
    bits: toTwosComplement(value),
  }
}

function getDefaultPracticeTableValues() {
  return {
    magnitude: Array(BIT_WIDTH).fill(""),
    inverted: Array(BIT_WIDTH).fill(""),
    addOne: Array(BIT_WIDTH).fill(""),
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
      task: value.task,
      tableValues: normalisePracticeTableValues(value.tableValues),
      status: value.status ?? "empty",
      message:
        value.message ??
        "Fill the working table, then check your answer.",
    }
  }

  return {
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
  const table = createElement("div", "twos-practice-table")
  const headers = ["Step", "128", "64", "32", "16", "8", "4", "2", "1"]
  const rows = [
    { key: "magnitude", label: "positive number" },
    { key: "inverted", label: "invert bits" },
    { key: "addOne", label: "add 1" },
    { key: "result", label: "final answer" },
  ]

  headers.forEach((header) => {
    table.append(createElement("span", "row-label", header))
  })

  rows.forEach((row) => {
    table.append(createElement("span", "row-label", row.label))

    values[row.key].forEach((bit, index) => {
      table.append(createPracticeBitInput(row.key, row.label, index, bit))
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
      message: "Fill every table cell with 0 or 1 before checking.",
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

  container.append(list)
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

    if (tableWrap) {
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
      task: generatePracticeTask(),
      tableValues: getDefaultPracticeTableValues(),
      status: "empty",
      message: "Fill the working table, then check your answer.",
    }
    save()
    render()
    practice.querySelector("[data-twos-practice-row]")?.focus()
  })

  render()
}

function renderNormaliser(normaliser, selectedKey) {
  const selected = NORMALISE_CASES[selectedKey] ?? NORMALISE_CASES.large

  normaliser.querySelectorAll("[data-normalise-case]").forEach((button) => {
    button.classList.toggle(
      "is-active",
      button.dataset.normaliseCase === selectedKey
    )
  })

  setText(normaliser, "normalise-raw", selected.raw)
  setText(normaliser, "normalise-movement", selected.movement)
  setText(normaliser, "normalise-result", selected.normalised)
  setText(normaliser, "normalise-sign", selected.sign)
  setText(normaliser, "normalise-exponent", selected.exponent)
  setText(normaliser, "normalise-significand", selected.significand)
}

function initFloatingNormaliser() {
  const normaliser = document.querySelector("[data-role='floating-normaliser']")

  if (!normaliser) {
    return
  }

  let selectedKey =
    readStorage(FLOAT_TOOL_STORAGE_KEY, { selectedKey: "large" }).selectedKey ??
    "large"

  if (!NORMALISE_CASES[selectedKey]) {
    selectedKey = "large"
  }

  normaliser.querySelectorAll("[data-normalise-case]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedKey = button.dataset.normaliseCase ?? "large"
      writeStorage(FLOAT_TOOL_STORAGE_KEY, { selectedKey })
      renderNormaliser(normaliser, selectedKey)
    })
  })

  renderNormaliser(normaliser, selectedKey)
}

function renderTradeoff(tool, exponentBits) {
  const safeExponentBits = clamp(Number(exponentBits), 2, 5)
  const significandBits = 7 - safeExponentBits
  const rangeLevels = 2 ** safeExponentBits
  const precisionSteps = 2 ** significandBits
  const slider = tool.querySelector("[data-role='tradeoff-slider']")

  if (slider) {
    slider.value = safeExponentBits.toString()
  }

  tool.style.setProperty("--range-score", `${(safeExponentBits / 5) * 100}%`)
  tool.style.setProperty(
    "--precision-score",
    `${(significandBits / 5) * 100}%`
  )

  setText(tool, "tradeoff-exponent-bits", safeExponentBits.toString())
  setText(tool, "tradeoff-significand-bits", significandBits.toString())
  setText(tool, "tradeoff-range-levels", rangeLevels.toString())
  setText(tool, "tradeoff-precision-steps", precisionSteps.toString())
  setText(
    tool,
    "tradeoff-note",
    safeExponentBits >= 4
      ? "This setup favours range. It can scale further, but keeps fewer detail bits."
      : "This setup favours precision. It keeps more detail bits, but has less exponent range."
  )
}

function initFloatTradeoff() {
  const tool = document.querySelector("[data-role='float-tradeoff']")

  if (!tool) {
    return
  }

  const slider = tool.querySelector("[data-role='tradeoff-slider']")
  let exponentBits = clamp(
    Number(readStorage(TRADEOFF_STORAGE_KEY, { exponentBits: 3 }).exponentBits),
    2,
    5
  )

  slider?.addEventListener("input", () => {
    exponentBits = clamp(Number(slider.value), 2, 5)
    writeStorage(TRADEOFF_STORAGE_KEY, { exponentBits })
    renderTradeoff(tool, exponentBits)
  })

  renderTradeoff(tool, exponentBits)
}

initLessonPage(lessonConfig)
initTwosComplementTool()
initTwosPractice()
initFloatingNormaliser()
initFloatTradeoff()
