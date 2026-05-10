import { initLessonPage } from "../core/lesson-shell.js"
import { readStorage, removeStorage, writeStorage } from "../core/storage.js"

const lessonConfig = {
  lessonId: "binary-and-bcd",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-c",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Units of digital data",
        description: "Previous in C1 Number systems.",
        status: "Live",
        href: "../topics/units-of-digital-data.html",
      },
      next: {
        title: "Hexadecimal numbers",
        description: "Next in C1 Number systems.",
        status: "Live",
        href: "../topics/hexadecimal-numbers.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-binary-and-bcd-quiz",
    passScore: 4,
    version: 2,
  },
  examPractice: {
    storageKey: "lesson-binary-and-bcd-exam-practice",
  },
}

const BIT_VALUES = [128, 64, 32, 16, 8, 4, 2, 1]
const SIMULATOR_STORAGE_KEY = "lesson-binary-and-bcd-simulator"
const PRACTICE_STORAGE_KEY = "lesson-binary-and-bcd-practice"
const SCRATCH_STORAGE_KEY = "lesson-binary-and-bcd-scratch"
const DEFAULT_FEEDBACK =
  "Your feedback will appear here after you check an answer."

const DENARY_TO_BINARY_TASKS = [5, 12, 19, 27, 34, 49, 78, 101]
const BINARY_TO_DENARY_TASKS = [
  "00000110",
  "00011001",
  "00101110",
  "01001011",
  "01011001",
  "01100100",
  "01110110",
  "01111011",
]

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function toEightBitBinary(value) {
  return value.toString(2).padStart(8, "0")
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

function normaliseTarget(value) {
  const parsed = Number(value)

  if (!Number.isFinite(parsed)) {
    return 173
  }

  return clamp(Math.trunc(parsed), 0, 255)
}

function getIncludedExpression(bits) {
  const selectedValues = bits
    .map((bit, index) => (bit === "1" ? BIT_VALUES[index] : null))
    .filter((value) => value !== null)

  if (selectedValues.length === 0) {
    return "No columns are switched on, so the value is 0."
  }

  return `${selectedValues.join(" + ")} = ${selectedValues.reduce(
    (total, value) => total + value,
    0
  )}.`
}

function buildConversionSteps(target) {
  const bits = Array(BIT_VALUES.length).fill("")
  const steps = [
    {
      type: "start",
      currentIndex: -1,
      bits: [...bits],
      remainder: target,
      status: `Start with ${target} and test each place value from left to right.`,
      note: "If a value fits, write 1 and subtract it. If it does not, write 0.",
    },
  ]

  let remainder = target

  BIT_VALUES.forEach((placeValue, index) => {
    const before = remainder
    const fits = before >= placeValue

    if (fits) {
      remainder -= placeValue
    }

    bits[index] = fits ? "1" : "0"

    steps.push({
      type: "decision",
      currentIndex: index,
      placeValue,
      bits: [...bits],
      remainder,
      status: fits
        ? `${placeValue} fits into ${before}. Write 1 and subtract ${placeValue}.`
        : `${placeValue} does not fit into ${before}. Write 0 and keep the remainder.`,
      note: fits
        ? `The new remainder is ${remainder}. Move to the next column.`
        : `The remainder is still ${remainder}. Move to the next column.`,
    })
  })

  const binaryAnswer = bits.join("")

  steps.push({
    type: "complete",
    currentIndex: -1,
    bits: [...bits],
    remainder,
    status: `${target} is ${binaryAnswer} in 8-bit binary.`,
    note: getIncludedExpression(bits),
  })

  return steps
}

function createSimulatorCell(value, index, step) {
  const bit = step.bits[index] || "-"
  const cell = createElement("article", "binary-sim-cell")
  cell.classList.toggle("is-current", step.currentIndex === index)
  cell.classList.toggle("is-one", bit === "1")
  cell.classList.toggle("is-zero", bit === "0")

  const label = createElement("small", "", value.toString())
  const bitValue = createElement("strong", "", bit)
  const helperText =
    step.currentIndex === index
      ? "testing"
      : bit === "-"
        ? "waiting"
        : bit === "1"
          ? "use"
          : "skip"
  const helper = createElement("small", "", helperText)

  cell.append(label, bitValue, helper)
  return cell
}

function normaliseSimulatorState(value) {
  const target = normaliseTarget(value?.target ?? 173)
  const maxStep = buildConversionSteps(target).length - 1
  const stepIndex = Number.isInteger(value?.stepIndex) ? value.stepIndex : 0

  return {
    target,
    stepIndex: clamp(stepIndex, 0, maxStep),
  }
}

function initConversionSimulator() {
  const simulator = document.querySelector(
    "[data-role='binary-conversion-simulator']"
  )

  if (!simulator) {
    return
  }

  const form = simulator.querySelector("[data-role='binary-sim-form']")
  const input = simulator.querySelector("[data-role='binary-sim-target-input']")
  const grid = simulator.querySelector("[data-role='binary-sim-grid']")
  const counter = simulator.querySelector("[data-role='binary-sim-counter']")
  const remainder = simulator.querySelector("[data-role='binary-sim-remainder']")
  const result = simulator.querySelector("[data-role='binary-sim-result']")
  const action = simulator.querySelector("[data-role='binary-sim-action']")
  const note = simulator.querySelector("[data-role='binary-sim-note']")
  const previousButton = simulator.querySelector("[data-sim-action='previous']")
  const nextButton = simulator.querySelector("[data-sim-action='next']")

  let state = normaliseSimulatorState(
    readStorage(SIMULATOR_STORAGE_KEY, { target: 173, stepIndex: 0 })
  )

  function saveState() {
    writeStorage(SIMULATOR_STORAGE_KEY, state)
  }

  function render() {
    const steps = buildConversionSteps(state.target)
    state.stepIndex = clamp(state.stepIndex, 0, steps.length - 1)

    const step = steps[state.stepIndex]
    const currentBits = step.bits.map((bit) => bit || "-").join("")

    if (input) {
      input.value = state.target.toString()
    }

    grid?.replaceChildren(
      ...BIT_VALUES.map((value, index) => createSimulatorCell(value, index, step))
    )

    if (counter) {
      counter.textContent = `Step ${state.stepIndex + 1} of ${steps.length}`
    }

    if (remainder) {
      remainder.textContent = step.remainder.toString()
    }

    if (result) {
      result.textContent = currentBits
    }

    if (action) {
      action.textContent = step.status
    }

    if (note) {
      note.textContent = step.note
    }

    if (previousButton) {
      previousButton.disabled = state.stepIndex === 0
    }

    if (nextButton) {
      nextButton.disabled = state.stepIndex === steps.length - 1
    }
  }

  form?.addEventListener("submit", (event) => {
    event.preventDefault()
    state = {
      target: normaliseTarget(input?.value ?? 173),
      stepIndex: 0,
    }
    saveState()
    render()
  })

  simulator.querySelectorAll("[data-sim-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const steps = buildConversionSteps(state.target)
      const actionType = button.dataset.simAction

      if (actionType === "previous") {
        state.stepIndex = Math.max(state.stepIndex - 1, 0)
      }

      if (actionType === "next") {
        state.stepIndex = Math.min(state.stepIndex + 1, steps.length - 1)
      }

      if (actionType === "reset") {
        state.stepIndex = 0
      }

      saveState()
      render()
    })
  })

  render()
}

function buildPracticeTasks() {
  const denaryTasks = DENARY_TO_BINARY_TASKS.map((value, index) => ({
    id: `denary-${index + 1}`,
    number: index + 1,
    part: "denary",
    level: index < 3 ? "Warm-up" : index < 6 ? "Core" : "Challenge",
    mode: "denary-to-binary",
    value,
    answer: toEightBitBinary(value),
    prompt: `Convert denary ${value} to binary.`,
    placeholder: "e.g. 00110101",
    note: "Binary answer",
  }))

  const binaryTasks = BINARY_TO_DENARY_TASKS.map((value, index) => ({
    id: `binary-${index + 1}`,
    number: index + 1,
    part: "binary",
    level: index < 3 ? "Warm-up" : index < 6 ? "Core" : "Challenge",
    mode: "binary-to-denary",
    value,
    answer: parseInt(value, 2),
    prompt: `Convert binary ${value} to denary.`,
    placeholder: "e.g. 105",
    note: "Denary answer",
  }))

  return [...denaryTasks, ...binaryTasks]
}

function createTaskCard(task) {
  const card = createElement("article", "conversion-task-card")
  card.dataset.taskId = task.id
  card.dataset.mode = task.mode
  card.dataset.part = task.part
  card.dataset.answer = task.answer.toString()

  const top = createElement("div", "conversion-task-top")
  const label = createElement("span", "conversion-task-label", task.level)
  const title = createElement(
    "h3",
    "conversion-task-title",
    `Question ${task.number}`
  )
  const prompt = createElement("p", "conversion-task-note")
  prompt.innerHTML =
    task.mode === "denary-to-binary"
      ? `Convert denary <strong>${task.value}</strong> to binary.`
      : `Convert binary <code>${task.value}</code> to denary.`
  top.append(label, title, prompt)

  const form = createElement("form", "conversion-task-form")
  form.dataset.taskId = task.id

  const inputLabel = createElement(
    "label",
    "sr-only",
    `Answer for ${task.prompt}`
  )
  inputLabel.setAttribute("for", `binary-practice-${task.id}`)

  const answerRow = createElement("div", "conversion-answer-row")
  const input = document.createElement("input")
  input.id = `binary-practice-${task.id}`
  input.className = "conversion-task-input"
  input.type = "text"
  input.inputMode = task.mode === "denary-to-binary" ? "numeric" : "decimal"
  input.autocomplete = "off"
  input.placeholder = task.placeholder

  const button = createElement("button", "primary-link", "Check")
  button.type = "submit"

  answerRow.append(input, button)
  form.append(inputLabel, answerRow)

  const feedback = createElement("p", "conversion-feedback", DEFAULT_FEEDBACK)
  feedback.setAttribute("aria-live", "polite")

  card.append(top, form, feedback)
  return card
}

function getPracticeStatus(feedback) {
  if (feedback.classList.contains("is-correct")) {
    return "correct"
  }

  if (feedback.classList.contains("is-incorrect")) {
    return "incorrect"
  }

  return "empty"
}

function resetPracticeCard(card, feedback) {
  card.classList.remove("is-correct", "is-incorrect")
  feedback.className = "conversion-feedback"
  feedback.textContent = DEFAULT_FEEDBACK
}

function setPracticeFeedback(card, feedback, status, message) {
  card.classList.remove("is-correct", "is-incorrect")
  feedback.className = "conversion-feedback"
  feedback.textContent = message

  if (status === "correct") {
    card.classList.add("is-correct")
    feedback.classList.add("is-correct")
    return
  }

  if (status === "incorrect") {
    card.classList.add("is-incorrect")
    feedback.classList.add("is-incorrect")
  }
}

function validatePracticeAnswer(task, rawValue) {
  const trimmed = rawValue.trim()

  if (!trimmed) {
    return {
      valid: false,
      message: "Enter an answer before checking.",
    }
  }

  if (task.mode === "denary-to-binary") {
    const cleaned = cleanBinary(trimmed)

    if (!/^[01]+$/.test(cleaned)) {
      return {
        valid: false,
        message: "Use only 0s and 1s for a binary answer.",
      }
    }

    const numericValue = parseInt(cleaned, 2)

    if (numericValue === task.value) {
      return {
        valid: true,
        correct: true,
        message: `Correct. ${task.value} can be written as ${task.answer}.`,
      }
    }

    return {
      valid: true,
      correct: false,
      message: `Not quite. Rebuild the 8-bit table for ${task.value}.`,
    }
  }

  if (!/^\d+$/.test(trimmed)) {
    return {
      valid: false,
      message: "Use denary digits only for this answer.",
    }
  }

  const numericAnswer = Number(trimmed)

  if (numericAnswer === task.answer) {
    return {
      valid: true,
      correct: true,
      message: `Correct. ${task.value} is ${task.answer} in denary.`,
    }
  }

  return {
    valid: true,
    correct: false,
    message: "Not quite. Add only the place values above the 1 bits.",
  }
}

function initPracticeZone() {
  const practice = document.querySelector("[data-role='binary-practice']")

  if (!practice) {
    return
  }

  const denaryGrid = practice.querySelector("[data-role='denary-practice-grid']")
  const binaryGrid = practice.querySelector("[data-role='binary-practice-grid']")
  const overallProgress = practice.querySelector("[data-role='practice-progress']")
  const denaryProgress = practice.querySelector("[data-role='denary-progress']")
  const binaryProgress = practice.querySelector("[data-role='binary-progress']")
  const completion = practice.querySelector("[data-role='practice-completion']")
  const resetButton = practice.querySelector(
    "[data-action='reset-binary-practice']"
  )
  const tasks = buildPracticeTasks()
  const taskMap = new Map(tasks.map((task) => [task.id, task]))
  const completedTaskIds = new Set()

  function getCards() {
    return Array.from(practice.querySelectorAll(".conversion-task-card"))
  }

  function updateProgress() {
    const denaryTotal = DENARY_TO_BINARY_TASKS.length
    const binaryTotal = BINARY_TO_DENARY_TASKS.length
    const denaryCorrect = getCards().filter(
      (card) =>
        card.dataset.part === "denary" &&
        card.classList.contains("is-correct")
    ).length
    const binaryCorrect = getCards().filter(
      (card) =>
        card.dataset.part === "binary" &&
        card.classList.contains("is-correct")
    ).length
    const totalCorrect = denaryCorrect + binaryCorrect
    const totalTasks = tasks.length

    completedTaskIds.clear()
    getCards().forEach((card) => {
      if (card.classList.contains("is-correct") && card.dataset.taskId) {
        completedTaskIds.add(card.dataset.taskId)
      }
    })

    if (overallProgress) {
      overallProgress.textContent = `${totalCorrect} / ${totalTasks} completed`
    }

    if (denaryProgress) {
      denaryProgress.textContent = `${denaryCorrect} / ${denaryTotal} correct`
    }

    if (binaryProgress) {
      binaryProgress.textContent = `${binaryCorrect} / ${binaryTotal} correct`
    }

    if (completion) {
      completion.hidden = totalCorrect !== totalTasks
    }
  }

  function saveState() {
    const state = { tasks: {} }

    getCards().forEach((card) => {
      const input = card.querySelector(".conversion-task-input")
      const feedback = card.querySelector(".conversion-feedback")

      state.tasks[card.dataset.taskId] = {
        inputValue: input?.value ?? "",
        status: feedback ? getPracticeStatus(feedback) : "empty",
        message: feedback?.textContent.trim() || DEFAULT_FEEDBACK,
      }
    })

    writeStorage(PRACTICE_STORAGE_KEY, state)
  }

  function restoreState() {
    const state = readStorage(PRACTICE_STORAGE_KEY, { tasks: {} })

    Object.entries(state.tasks ?? {}).forEach(([taskId, taskState]) => {
      const card = practice.querySelector(`[data-task-id="${CSS.escape(taskId)}"]`)
      const input = card?.querySelector(".conversion-task-input")
      const feedback = card?.querySelector(".conversion-feedback")
      const button = card?.querySelector("button")

      if (!card || !input || !feedback || !button) {
        return
      }

      input.value = taskState.inputValue ?? ""

      if (taskState.status === "correct") {
        input.disabled = true
        button.disabled = true
        button.textContent = "Correct"
        setPracticeFeedback(
          card,
          feedback,
          "correct",
          taskState.message || "Correct."
        )
        return
      }

      input.disabled = false
      button.disabled = false
      button.textContent = "Check"

      if (taskState.status === "incorrect") {
        setPracticeFeedback(
          card,
          feedback,
          "incorrect",
          taskState.message || "Not quite."
        )
        return
      }

      resetPracticeCard(card, feedback)
    })
  }

  denaryGrid?.replaceChildren(
    ...tasks
      .filter((task) => task.part === "denary")
      .map((task) => createTaskCard(task))
  )
  binaryGrid?.replaceChildren(
    ...tasks
      .filter((task) => task.part === "binary")
      .map((task) => createTaskCard(task))
  )
  restoreState()
  updateProgress()

  practice.addEventListener("submit", (event) => {
    const form = event.target.closest(".conversion-task-form")

    if (!form) {
      return
    }

    event.preventDefault()

    const taskId = form.dataset.taskId
    const task = taskId ? taskMap.get(taskId) : null
    const card = form.closest(".conversion-task-card")
    const input = form.querySelector(".conversion-task-input")
    const feedback = card?.querySelector(".conversion-feedback")
    const button = form.querySelector("button")

    if (!task || !card || !input || !feedback || !button) {
      return
    }

    const result = validatePracticeAnswer(task, input.value)

    if (!result.valid) {
      setPracticeFeedback(card, feedback, "incorrect", result.message)
      updateProgress()
      saveState()
      return
    }

    if (result.correct) {
      input.disabled = true
      button.disabled = true
      button.textContent = "Correct"
      setPracticeFeedback(card, feedback, "correct", result.message)
    } else {
      setPracticeFeedback(card, feedback, "incorrect", result.message)
    }

    updateProgress()
    saveState()
  })

  practice.addEventListener("input", (event) => {
    const input = event.target.closest(".conversion-task-input")

    if (!input || input.disabled) {
      return
    }

    const card = input.closest(".conversion-task-card")
    const feedback = card?.querySelector(".conversion-feedback")

    if (!card || !feedback) {
      return
    }

    resetPracticeCard(card, feedback)
    updateProgress()
    saveState()
  })

  resetButton?.addEventListener("click", () => {
    getCards().forEach((card) => {
      const input = card.querySelector(".conversion-task-input")
      const feedback = card.querySelector(".conversion-feedback")
      const button = card.querySelector("button")

      if (input) {
        input.disabled = false
        input.value = ""
      }

      if (button) {
        button.disabled = false
        button.textContent = "Check"
      }

      if (feedback) {
        resetPracticeCard(card, feedback)
      }
    })

    completedTaskIds.clear()
    removeStorage(PRACTICE_STORAGE_KEY)
    updateProgress()
  })
}

function initScratchTable() {
  const scratch = document.querySelector("[data-role='binary-scratch']")

  if (!scratch) {
    return
  }

  const inputs = Array.from(scratch.querySelectorAll("[data-scratch-bit]"))
  const clearButton = scratch.querySelector("[data-action='clear-scratch']")

  function saveState() {
    writeStorage(SCRATCH_STORAGE_KEY, {
      bits: inputs.map((input) => input.value),
    })
  }

  function restoreState() {
    const state = readStorage(SCRATCH_STORAGE_KEY, { bits: [] })

    inputs.forEach((input, index) => {
      const bit = state.bits?.[index]
      input.value = bit === "0" || bit === "1" ? bit : ""
    })

  }

  inputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/[^01]/g, "").slice(0, 1)
      saveState()

      if (input.value && index < inputs.length - 1) {
        inputs[index + 1].focus()
      }
    })

    input.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft" && index > 0) {
        event.preventDefault()
        inputs[index - 1].focus()
      }

      if (event.key === "ArrowRight" && index < inputs.length - 1) {
        event.preventDefault()
        inputs[index + 1].focus()
      }
    })
  })

  clearButton?.addEventListener("click", () => {
    inputs.forEach((input) => {
      input.value = ""
    })
    removeStorage(SCRATCH_STORAGE_KEY)
    inputs[0]?.focus()
  })

  restoreState()
}

initLessonPage(lessonConfig)
initConversionSimulator()
initPracticeZone()
initScratchTable()
