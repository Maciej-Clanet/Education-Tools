import { initLessonPage } from "../core/lesson-shell.js"
import { readStorage, writeStorage } from "../core/storage.js"
import { initLessonWalkthroughs } from "../core/lesson-walkthrough.js"
import { initCodeSnippets } from "../core/code-snippets.js"

const lessonConfig = {
  lessonId: "matrices-and-arrays",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-d",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Arrays, lists, and data types",
        description: "Previous in D1 Data structures.",
        status: "Live",
        href: "../topics/arrays-lists-and-data-types.html",
      },
      next: {
        title: "Multi-dimensional arrays and memory order",
        description: "Next in D2 Indices and matrices.",
        status: "Live",
        href: "../topics/multi-dimensional-arrays-and-memory-order.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-matrices-and-arrays-quiz",
    passScore: 4,
  },
  examPractice: {
    storageKey: "lesson-matrices-and-arrays-exam-practice",
  },
}

const PRACTICE_STORAGE_KEY = "lesson-matrices-and-arrays-operation-practice"
const PRACTICE_TYPES = ["addition", "scalar", "multiplication"]

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomChoice(values) {
  return values[randomInt(0, values.length - 1)]
}

function createMatrix(rows, columns, minValue, maxValue) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => randomInt(minValue, maxValue))
  )
}

function addMatrices(left, right) {
  return left.map((row, rowIndex) =>
    row.map((value, columnIndex) => value + right[rowIndex][columnIndex])
  )
}

function multiplyByScalar(scalar, matrix) {
  return matrix.map((row) => row.map((value) => value * scalar))
}

function multiplyMatrices(left, right) {
  return left.map((row) =>
    Array.from({ length: right[0].length }, (_, columnIndex) =>
      row.reduce(
        (total, value, itemIndex) => total + value * right[itemIndex][columnIndex],
        0
      )
    )
  )
}

function flattenMatrix(matrix) {
  return matrix.flat()
}

function getMatrixDimensions(matrix) {
  return `${matrix.length} × ${matrix[0].length}`
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value)
}

function isValidMatrix(matrix) {
  if (!Array.isArray(matrix) || matrix.length === 0) {
    return false
  }

  const columnCount = Array.isArray(matrix[0]) ? matrix[0].length : 0

  if (columnCount === 0) {
    return false
  }

  return matrix.every(
    (row) =>
      Array.isArray(row) &&
      row.length === columnCount &&
      row.every((value) => isFiniteNumber(value))
  )
}

function matricesShareShape(left, right) {
  return (
    left.length === right.length && left[0].length === right[0].length
  )
}

function createAdditionQuestion() {
  const rows = randomChoice([2, 2, 3])
  const columns = randomChoice([2, 3])
  const left = createMatrix(rows, columns, 1, 6)
  const right = createMatrix(rows, columns, 1, 6)

  return {
    type: "addition",
    left,
    right,
    answer: addMatrices(left, right),
  }
}

function createScalarQuestion() {
  const rows = randomChoice([2, 2, 3])
  const columns = randomChoice([2, 3])
  const scalar = randomChoice([2, 3, 4])
  const matrix = createMatrix(rows, columns, 1, 5)

  return {
    type: "scalar",
    scalar,
    matrix,
    answer: multiplyByScalar(scalar, matrix),
  }
}

function createMultiplicationQuestion() {
  const dimensions = randomChoice([
    { rowsA: 2, columnsA: 2, rowsB: 2, columnsB: 2 },
    { rowsA: 2, columnsA: 3, rowsB: 3, columnsB: 2 },
  ])
  const left = createMatrix(dimensions.rowsA, dimensions.columnsA, 1, 4)
  const right = createMatrix(dimensions.rowsB, dimensions.columnsB, 1, 4)

  return {
    type: "multiplication",
    left,
    right,
    answer: multiplyMatrices(left, right),
  }
}

function createPracticeQuestion(type) {
  if (type === "addition") {
    return createAdditionQuestion()
  }

  if (type === "scalar") {
    return createScalarQuestion()
  }

  return createMultiplicationQuestion()
}

function defaultPracticeMessage(type) {
  if (type === "addition") {
    return "Add matching positions, then run a quick check."
  }

  if (type === "scalar") {
    return "Multiply every element by the scalar, then run a quick check."
  }

  return "Work row by column, then run a quick check."
}

function createFeedback(type, tone = "neutral", message, checkedCells = []) {
  return {
    tone,
    message: message ?? defaultPracticeMessage(type),
    checkedCells,
  }
}

function createPracticeEntry(type, message) {
  const question = createPracticeQuestion(type)

  return {
    question,
    answers: Array(flattenMatrix(question.answer).length).fill(""),
    feedback: createFeedback(type, "neutral", message),
    ...(type === "multiplication" ? { scratch: "" } : {}),
  }
}

function isValidQuestion(type, question) {
  if (!question || question.type !== type) {
    return false
  }

  if (type === "addition") {
    return (
      isValidMatrix(question.left) &&
      isValidMatrix(question.right) &&
      isValidMatrix(question.answer) &&
      matricesShareShape(question.left, question.right) &&
      matricesShareShape(question.left, question.answer)
    )
  }

  if (type === "scalar") {
    return (
      isFiniteNumber(question.scalar) &&
      isValidMatrix(question.matrix) &&
      isValidMatrix(question.answer) &&
      matricesShareShape(question.matrix, question.answer)
    )
  }

  return (
    isValidMatrix(question.left) &&
    isValidMatrix(question.right) &&
    isValidMatrix(question.answer) &&
    question.left[0].length === question.right.length &&
    question.answer.length === question.left.length &&
    question.answer[0].length === question.right[0].length
  )
}

function normaliseAnswers(question, answers) {
  const totalCells = flattenMatrix(question.answer).length

  if (!Array.isArray(answers)) {
    return Array(totalCells).fill("")
  }

  return Array.from({ length: totalCells }, (_, index) =>
    typeof answers[index] === "string" ? answers[index] : ""
  )
}

function normaliseFeedback(type, feedback, totalCells) {
  const allowedTones = new Set(["neutral", "correct", "incorrect", "warning"])
  const checkedCells = Array.from({ length: totalCells }, (_, index) => {
    const state = feedback?.checkedCells?.[index]

    return state === "correct" || state === "incorrect" ? state : ""
  })

  return {
    tone: allowedTones.has(feedback?.tone) ? feedback.tone : "neutral",
    message:
      typeof feedback?.message === "string" && feedback.message.trim()
        ? feedback.message
        : defaultPracticeMessage(type),
    checkedCells,
  }
}

function normalisePracticeState(value) {
  const source = value && typeof value === "object" ? value : {}

  return Object.fromEntries(
    PRACTICE_TYPES.map((type) => {
      const entry = source[type]

      if (!entry || !isValidQuestion(type, entry.question)) {
        return [type, createPracticeEntry(type)]
      }

      const totalCells = flattenMatrix(entry.question.answer).length

      return [
        type,
        {
          question: entry.question,
          answers: normaliseAnswers(entry.question, entry.answers),
          feedback: normaliseFeedback(type, entry.feedback, totalCells),
          ...(type === "multiplication" ? { scratch: typeof entry.scratch === "string" ? entry.scratch : "" } : {}),
        },
      ]
    })
  )
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

function createMatrixDisplay(matrix, options = {}) {
  const display = createElement("div", "matrix-display")
  display.style.setProperty("--matrix-columns", String(matrix[0].length))

  if (options.label) {
    display.append(createElement("span", "matrix-display__label", options.label))
  }

  const body = createElement("div", "matrix-display__body")
  const grid = createElement("div", "matrix-grid")

  matrix.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
      const cellIndex = rowIndex * row.length + columnIndex

      if (options.interactive) {
        const input = document.createElement("input")
        input.type = "text"
        input.inputMode = "numeric"
        input.autocomplete = "off"
        input.spellcheck = false
        input.className = "matrix-answer-cell"
        input.dataset.matrixAnswer = String(cellIndex)
        input.value = options.answers?.[cellIndex] ?? ""
        const checkedState = options.checkedCells?.[cellIndex]
        input.setAttribute(
          "aria-label",
          `${options.label ?? "Answer"} row ${rowIndex + 1} column ${columnIndex + 1}${checkedState ? `: ${checkedState}` : ""}`
        )

        if (options.checkedCells?.[cellIndex] === "correct") {
          input.classList.add("is-correct")
        }

        if (options.checkedCells?.[cellIndex] === "incorrect") {
          input.classList.add("is-incorrect")
          input.setAttribute("aria-invalid", "true")
        }

        grid.append(input)
        return
      }

      const cell = createElement("span", "matrix-grid__cell", String(value))
      const extraClass = options.cellClasses?.[cellIndex]

      if (extraClass) {
        cell.classList.add(extraClass)
      }

      grid.append(cell)
    })
  })

  body.append(grid)
  display.append(body)
  return display
}

function createOperator(value) {
  return createElement("span", "matrix-equation__operator", value)
}

function createToken(value) {
  return createElement("span", "matrix-equation__token", value)
}

function getPracticePrompt(type, question) {
  if (type === "addition") {
    return `Add the two ${getMatrixDimensions(question.left)} matrices. The answer keeps the same ${getMatrixDimensions(question.answer)} shape.`
  }

  if (type === "scalar") {
    return `Multiply every element in the ${getMatrixDimensions(question.matrix)} matrix by ${question.scalar}. The answer keeps the same shape.`
  }

  return `Multiply the ${getMatrixDimensions(question.left)} matrix by the ${getMatrixDimensions(question.right)} matrix. The answer will be ${getMatrixDimensions(question.answer)}.`
}

function createPracticeEquation(type, entry) {
  const equation = createElement("div", "matrix-practice-equation")
  const answerDisplay = createMatrixDisplay(entry.question.answer, {
    label: "Your answer",
    interactive: true,
    answers: entry.answers,
    checkedCells: entry.feedback.checkedCells,
  })

  if (type === "addition") {
    equation.append(
      createMatrixDisplay(entry.question.left, { label: "Matrix A" }),
      createOperator("+"),
      createMatrixDisplay(entry.question.right, { label: "Matrix B" }),
      createOperator("="),
      answerDisplay
    )

    return equation
  }

  if (type === "scalar") {
    equation.append(
      createToken(String(entry.question.scalar)),
      createOperator("×"),
      createMatrixDisplay(entry.question.matrix, { label: "Matrix" }),
      createOperator("="),
      answerDisplay
    )

    return equation
  }

  equation.append(
    createMatrixDisplay(entry.question.left, { label: "Matrix A" }),
    createOperator("×"),
    createMatrixDisplay(entry.question.right, { label: "Matrix B" }),
    createOperator("="),
    answerDisplay
  )

  return equation
}

function createPracticeWorkspace(type, entry) {
  const fragment = document.createDocumentFragment()
  const question = createElement("div", "matrix-practice-question")
  question.append(
    createElement("p", "matrix-practice-copy", getPracticePrompt(type, entry.question)),
    createPracticeEquation(type, entry)
  )
  if (type !== "multiplication") {
    fragment.append(question)
    return fragment
  }

  const layout = createElement("div", "ma-practice-layout")
  const scratch = createElement("div", "ma-scratch")
  const heading = createElement("div", "ma-scratch-heading")
  const label = createElement("label", "", "Working out")
  label.htmlFor = "matrix-multiplication-working"
  const clear = createElement("button", "lesson-secondary-action", "Clear working")
  clear.type = "button"
  clear.dataset.matrixScratchClear = ""
  heading.append(label, clear)
  const input = createElement("textarea", "ma-scratch-input")
  input.id = label.htmlFor
  input.dataset.matrixScratch = ""
  input.value = entry.scratch
  input.rows = 5
  input.spellcheck = false
  input.placeholder = "Row 1, column 1:\n(… × …) + (… × …) = …"
  input.setAttribute("aria-describedby", "matrix-working-note")
  const note = createElement("p", "ma-scratch-note", "Working saves with this question. New question starts fresh.")
  note.id = "matrix-working-note"
  scratch.append(heading, input, note)
  layout.append(question, scratch)
  fragment.append(layout)

  return fragment
}

function getFeedbackClassName(tone) {
  if (tone === "correct") {
    return "is-correct"
  }

  if (tone === "incorrect") {
    return "is-incorrect"
  }

  if (tone === "warning") {
    return "is-warning"
  }

  return ""
}

function createSuccessMessage(type) {
  if (type === "addition") {
    return "Correct. You added the matching positions properly."
  }

  if (type === "scalar") {
    return "Correct. You multiplied every element by the scalar."
  }

  return "Correct. You combined rows and columns properly."
}

function createRetryMessage(type, incorrectCount) {
  const cellWord = incorrectCount === 1 ? "cell needs" : "cells need"

  if (type === "addition") {
    return `Not quite. ${incorrectCount} ${cellWord} another look. Add matching positions only.`
  }

  if (type === "scalar") {
    return `Not quite. ${incorrectCount} ${cellWord} another look. Multiply every element by the same scalar.`
  }

  return `Not quite. ${incorrectCount} ${cellWord} another look. Check each row-by-column calculation again.`
}

function initOperationPractice() {
  const practiceCards = Object.fromEntries(
    Array.from(document.querySelectorAll("[data-matrix-practice]")).map((card) => [
      card.dataset.matrixPractice,
      card,
    ])
  )

  if (Object.keys(practiceCards).length === 0) {
    return
  }

  let state = normalisePracticeState(readStorage(PRACTICE_STORAGE_KEY, {}))

  function saveState() {
    writeStorage(PRACTICE_STORAGE_KEY, state)
  }

  function updateStatus(type) {
    const card = practiceCards[type]
    const status = card?.querySelector("[data-role='matrix-practice-status']")

    if (!status) {
      return
    }

    status.className = "matrix-practice-status"
    const toneClass = getFeedbackClassName(state[type].feedback.tone)

    if (toneClass) {
      status.classList.add(toneClass)
    }

    status.textContent = state[type].feedback.message
  }

  function renderPractice(type) {
    const card = practiceCards[type]
    const workspace = card?.querySelector("[data-role='matrix-practice-workspace']")

    if (!card || !workspace) {
      return
    }

    workspace.replaceChildren(createPracticeWorkspace(type, state[type]))

    const scratch = workspace.querySelector("[data-matrix-scratch]")
    scratch?.addEventListener("input", () => {
      state[type].scratch = scratch.value
      saveState()
    })
    workspace.querySelector("[data-matrix-scratch-clear]")?.addEventListener("click", () => {
      state[type].scratch = ""
      scratch.value = ""
      saveState()
    })

    workspace.querySelectorAll("[data-matrix-answer]").forEach((input) => {
      input.addEventListener("input", () => {
        const index = Number.parseInt(input.dataset.matrixAnswer ?? "-1", 10)

        if (index < 0) {
          return
        }

        state[type].answers[index] = input.value

        if (
          state[type].feedback.tone !== "neutral" ||
          state[type].feedback.checkedCells.some(Boolean)
        ) {
          state[type].feedback = createFeedback(
            type,
            "neutral",
            "Answer changed. Check again when ready."
          )
          updateStatus(type)
          card
            .querySelectorAll(".matrix-answer-cell")
            .forEach((field) => {
              field.classList.remove("is-correct", "is-incorrect")
              field.removeAttribute("aria-invalid")
              field.setAttribute("aria-label", field.getAttribute("aria-label").replace(/: (?:correct|incorrect)$/, ""))
            })
        }

        saveState()
      })
    })

    updateStatus(type)
  }

  function evaluatePractice(type) {
    const entry = state[type]
    const answers = entry.answers.map((value) => value.trim())
    const expected = flattenMatrix(entry.question.answer)

    if (answers.some((value) => value === "")) {
      entry.feedback = createFeedback(
        type,
        "warning",
        "Fill every result cell before checking."
      )
      saveState()
      updateStatus(type)
      return
    }

    const checkedCells = answers.map((value, index) =>
      /^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(value) && Number(value) === expected[index] ? "correct" : "incorrect"
    )
    const incorrectCount = checkedCells.filter(
      (cellState) => cellState === "incorrect"
    ).length

    entry.feedback =
      incorrectCount === 0
        ? createFeedback(type, "correct", createSuccessMessage(type), checkedCells)
        : createFeedback(
            type,
            "incorrect",
            createRetryMessage(type, incorrectCount),
            checkedCells
          )

    saveState()
    renderPractice(type)
  }

  function clearPractice(type) {
    const question = state[type].question

    state[type] = {
      question,
      answers: Array(flattenMatrix(question.answer).length).fill(""),
      feedback: createFeedback(
        type,
        "neutral",
        "Answer cells cleared. Fill the matrix and check when ready."
      ),
      ...(type === "multiplication" ? { scratch: state[type].scratch } : {}),
    }

    saveState()
    renderPractice(type)
  }

  function createNewPractice(type) {
    state[type] = createPracticeEntry(
      type,
      "New question ready. Fill the matrix and check when ready."
    )
    saveState()
    renderPractice(type)
  }

  Object.entries(practiceCards).forEach(([type, card]) => {
    card
      .querySelector("[data-matrix-practice-action='check']")
      ?.addEventListener("click", () => {
        evaluatePractice(type)
      })

    card
      .querySelector("[data-matrix-practice-action='clear']")
      ?.addEventListener("click", () => {
        clearPractice(type)
      })

    card
      .querySelector("[data-matrix-practice-action='new']")
      ?.addEventListener("click", () => {
        createNewPractice(type)
      })

    renderPractice(type)
  })

  saveState()
}

function initMatrixMatching() {
  const host = document.querySelector("[data-matrix-matching]")
  if (!host) return

  const grids = Object.fromEntries(
    Array.from(host.querySelectorAll("[data-match-grid]")).map((grid) => [grid.dataset.matchGrid, grid])
  )
  const cellsA = Array.from(grids.a.children)
  const cellsB = Array.from(grids.b.children)
  const columnsA = Number(grids.a.dataset.columns)
  const columnsB = Number(grids.b.dataset.columns)
  const resultCells = Array.from(grids.result.children)
  const initialIndex = resultCells.findIndex((cell) => cell.classList.contains("ma-target"))

  const buttons = resultCells.map((cell, index) => {
    const row = Math.floor(index / columnsB)
    const column = index % columnsB
    const button = createElement("button", "matrix-grid__cell ma-result-cell", cell.textContent)
    button.type = "button"
    button.setAttribute("aria-label", `Select result row ${row + 1}, column ${column + 1}`)
    button.addEventListener("click", () => selectCell(index))
    cell.replaceWith(button)
    return button
  })

  function selectCell(index) {
    const row = Math.floor(index / columnsB)
    const column = index % columnsB
    cellsA.forEach((cell, i) => cell.classList.toggle("ma-row", Math.floor(i / columnsA) === row))
    cellsB.forEach((cell, i) => cell.classList.toggle("ma-column", i % columnsB === column))
    buttons.forEach((button, i) => {
      button.classList.toggle("ma-target", i === index)
      button.setAttribute("aria-pressed", String(i === index))
      button.textContent = i === index ? "?" : "·"
    })
    host.querySelector("[data-match-row-label]").textContent = `Row ${row + 1} · ${columnsA} values across`
    host.querySelector("[data-match-column-label]").textContent = `Column ${column + 1} · ${cellsB.length / columnsB} values down`
    host.querySelector("[data-match-status]").textContent = `Row ${row + 1} of A × column ${column + 1} of B`
  }

  selectCell(initialIndex < 0 ? 0 : initialIndex)
  host.querySelector("[data-match-instruction]").hidden = false
}

// Optional playback uses the shared walkthrough's authored, printable states.
// Manual navigation always pauses; teaching steps remain available with reduced motion.
function initMatrixPlayback() {
  const host = document.querySelector("[data-matrix-playback]")
  if (!host) return
  const play = host.querySelector("[data-matrix-play]")
  const next = host.querySelector("[data-walkthrough-next]")
  const reset = host.querySelector("[data-walkthrough-reset]")
  const section = host.closest("[data-lesson-section]")
  let timer = null
  let advancing = false

  function pause() {
    clearInterval(timer)
    timer = null
    play.textContent = "Play steps"
    play.setAttribute("aria-pressed", "false")
  }

  function visible() {
    const rect = host.getBoundingClientRect()
    return !document.hidden && rect.width > 0 && rect.height > 0 &&
      rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth
  }

  play.addEventListener("click", () => {
    if (timer !== null) { pause(); return }
    if (!visible()) return
    if (next.getAttribute("aria-disabled") === "true") reset.click()
    play.textContent = "Pause steps"
    play.setAttribute("aria-pressed", "true")
    timer = setInterval(() => {
      if (!visible()) { pause(); return }
      advancing = true
      next.click()
      advancing = false
      if (next.getAttribute("aria-disabled") === "true") pause()
    }, 3500)
  })
  host.querySelectorAll("[data-walkthrough-prev], [data-walkthrough-next], [data-walkthrough-reset]")
    .forEach(button => button.addEventListener("click", () => { if (!advancing) pause() }))
  new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) pause()
  }).observe(host)
  new MutationObserver(() => { if (!visible()) pause() })
    .observe(section, { attributes: true, attributeFilter: ["class", "hidden", "style"] })
  document.addEventListener("visibilitychange", () => { if (document.hidden) pause() })
  window.addEventListener("pagehide", pause)
  window.addEventListener("hashchange", () => { if (!visible()) pause() })
}

initLessonPage(lessonConfig)
initOperationPractice()
initMatrixMatching()
initLessonWalkthroughs()
initMatrixPlayback()
initCodeSnippets()
