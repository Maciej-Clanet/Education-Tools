import { initLessonPage } from "../core/lesson-shell.js"
import { readStorage, removeStorage, writeStorage } from "../core/storage.js"

const lessonConfig = {
  lessonId: "units-of-digital-data",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-c",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Interrupts and register handling",
        description: "Previous in B3 Registers and register handling.",
        status: "Live",
        href: "../topics/interrupts-and-register-handling.html",
      },
      next: {
        title: "Binary and BCD",
        description: "Next in C1 Number systems.",
        status: "Live",
        href: "../topics/binary-and-bcd.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-units-of-digital-data-quiz",
    passScore: 4,
    version: 2,
  },
  examPractice: {
    storageKey: "lesson-units-of-digital-data-exam-practice",
  },
}

const PRACTICE_STORAGE_KEY = "lesson-units-of-digital-data-practice"
const DEFAULT_FEEDBACK =
  "Your feedback will appear here after you check an answer."

const UNIT_POWERS = {
  B: 0,
  KB: 1,
  MB: 2,
  GB: 3,
  TB: 4,
}

const ALLOWED_TARGET_SYMBOLS = {
  B: ["B"],
  KB: ["KB", "KiB"],
  MB: ["MB", "MiB"],
  GB: ["GB", "GiB"],
  TB: ["TB", "TiB"],
}

const ALLOWED_TARGET_WORDS = {
  B: ["byte", "bytes"],
  KB: ["kilobyte", "kilobytes", "kibibyte", "kibibytes"],
  MB: ["megabyte", "megabytes", "mebibyte", "mebibytes"],
  GB: ["gigabyte", "gigabytes", "gibibyte", "gibibytes"],
  TB: ["terabyte", "terabytes", "tebibyte", "tebibytes"],
}

const PRACTICE_TASKS = [
  { id: 1, level: "Warm-up", value: 2048, from: "KB", to: "MB" },
  { id: 2, level: "Warm-up", value: 3, from: "MB", to: "KB" },
  { id: 3, level: "Warm-up", value: 5120, from: "B", to: "KB" },
  { id: 4, level: "Core", value: 1.5, from: "GB", to: "MB" },
  { id: 5, level: "Core", value: 6144, from: "MB", to: "GB" },
  { id: 6, level: "Core", value: 750, from: "MB", to: "GB" },
  { id: 7, level: "Core", value: 12288, from: "KB", to: "MB" },
  { id: 8, level: "Core", value: 0.5, from: "GB", to: "KB" },
  { id: 9, level: "Challenge", value: 256, from: "MB", to: "B" },
  { id: 10, level: "Challenge", value: 2.5, from: "GB", to: "B" },
  { id: 11, level: "Challenge", value: 1.2, from: "TB", to: "GB" },
  { id: 12, level: "Challenge", value: 1048576, from: "B", to: "MB" },
]

function convertUnit(value, fromUnit, toUnit, base) {
  const powerDifference = UNIT_POWERS[fromUnit] - UNIT_POWERS[toUnit]
  return value * base ** powerDifference
}

function enhanceTask(task) {
  return {
    ...task,
    decimalAnswer: convertUnit(task.value, task.from, task.to, 1000),
    binaryAnswer: convertUnit(task.value, task.from, task.to, 1024),
  }
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-GB", {
    maximumFractionDigits: 3,
  }).format(value)
}

function getDirectionHint(fromUnit, toUnit) {
  const stepDifference = UNIT_POWERS[toUnit] - UNIT_POWERS[fromUnit]
  const stepCount = Math.abs(stepDifference)
  const stepWord = stepCount === 1 ? "step" : "steps"

  if (stepDifference > 0) {
    return `Hint: ${toUnit} is a larger unit, so divide ${stepCount} ${stepWord}.`
  }

  return `Hint: ${toUnit} is a smaller unit, so multiply ${stepCount} ${stepWord}.`
}

function parseAnswer(rawValue, expectedUnit) {
  const cleanedValue = rawValue.trim().replaceAll(",", "")

  if (!cleanedValue) {
    return { valid: false }
  }

  const match = cleanedValue.match(
    /^([-+]?(?:\d+\.?\d*|\.\d+))(?:\s*([a-zA-Z]+))?$/
  )

  if (!match) {
    return { valid: false }
  }

  const value = Number(match[1])
  const suppliedUnit = match[2]

  if (!Number.isFinite(value)) {
    return { valid: false }
  }

  if (suppliedUnit && !unitMatchesTarget(suppliedUnit, expectedUnit)) {
    return { valid: false }
  }

  return { valid: true, value }
}

function unitMatchesTarget(suppliedUnit, expectedUnit) {
  return (
    ALLOWED_TARGET_SYMBOLS[expectedUnit].includes(suppliedUnit) ||
    ALLOWED_TARGET_WORDS[expectedUnit].includes(suppliedUnit.toLowerCase())
  )
}

function almostEqual(first, second) {
  return Math.abs(first - second) < 1e-9
}

function isAcceptedAnswer(userValue, expectedValue) {
  if (almostEqual(userValue, expectedValue)) {
    return true
  }

  const roundedAnswers = [2, 3].map((places) =>
    Number(expectedValue.toFixed(places))
  )

  return roundedAnswers.some((roundedValue) =>
    almostEqual(userValue, roundedValue)
  )
}

function answerMatchesTask(userValue, task) {
  const possibleAnswers = [task.decimalAnswer, task.binaryAnswer]

  return possibleAnswers.some((expected) => isAcceptedAnswer(userValue, expected))
}

function createTaskCard(task) {
  const card = document.createElement("article")
  card.className = "practice-task-card"
  card.dataset.taskId = task.id.toString()

  const top = document.createElement("div")
  top.className = "practice-task-top"

  const label = document.createElement("span")
  label.className = "practice-task-label"
  label.textContent = task.level

  const title = document.createElement("h3")
  title.className = "practice-task-title"
  title.textContent = `Convert ${formatNumber(task.value)} ${task.from} to ${task.to}`

  const note = document.createElement("p")
  note.className = "practice-task-note"
  note.textContent = `Type the answer in ${task.to}.`

  top.append(label, title, note)

  const form = document.createElement("form")
  form.className = "practice-task-form"
  form.dataset.taskId = task.id.toString()

  const inputLabel = document.createElement("label")
  inputLabel.className = "sr-only"
  inputLabel.setAttribute("for", `practice-task-${task.id}`)
  inputLabel.textContent = `Answer for conversion task ${task.id}`

  const answerWrap = document.createElement("div")
  answerWrap.className = "practice-answer-wrap"

  const input = document.createElement("input")
  input.id = `practice-task-${task.id}`
  input.className = "practice-task-input"
  input.type = "text"
  input.inputMode = "decimal"
  input.autocomplete = "off"
  input.placeholder = "Enter your answer"

  const unit = document.createElement("span")
  unit.className = "practice-unit-pill"
  unit.textContent = task.to

  answerWrap.append(input, unit)

  const button = document.createElement("button")
  button.className = "primary-link"
  button.type = "submit"
  button.textContent = "Check answer"

  form.append(inputLabel, answerWrap, button)

  const hint = document.createElement("p")
  hint.className = "practice-task-hint"
  hint.textContent = getDirectionHint(task.from, task.to)

  const feedback = document.createElement("p")
  feedback.className = "practice-feedback is-empty"
  feedback.setAttribute("aria-live", "polite")
  feedback.textContent = DEFAULT_FEEDBACK

  card.append(top, form, hint, feedback)
  return card
}

function getFeedbackStatus(feedback) {
  if (feedback.classList.contains("is-correct")) {
    return "correct"
  }

  if (feedback.classList.contains("is-incorrect")) {
    return "incorrect"
  }

  return "empty"
}

function resetCardState(card, feedback) {
  card.classList.remove("is-correct", "is-incorrect")
  feedback.className = "practice-feedback is-empty"
  feedback.textContent = DEFAULT_FEEDBACK
}

function setFeedback(card, feedback, state, message) {
  card.classList.remove("is-correct", "is-incorrect")
  feedback.className = "practice-feedback"
  feedback.textContent = message

  if (state === "correct") {
    card.classList.add("is-correct")
    feedback.classList.add("is-correct")
    return
  }

  card.classList.add("is-incorrect")
  feedback.classList.add("is-incorrect")
}

function initPracticeZone() {
  const practice = document.querySelector("[data-role='unit-practice']")

  if (!practice) {
    return
  }

  const taskGrid = practice.querySelector("[data-role='practice-task-grid']")
  const progress = practice.querySelector("[data-role='practice-progress']")
  const resetButton = practice.querySelector("[data-action='reset-practice']")
  const tasks = PRACTICE_TASKS.map((task) => enhanceTask(task))
  const completedTaskIds = new Set()

  function updateProgress() {
    if (progress) {
      progress.textContent = `${completedTaskIds.size} / ${tasks.length} completed`
    }
  }

  function saveState() {
    const state = { tasks: {} }

    taskGrid?.querySelectorAll(".practice-task-card").forEach((card) => {
      const input = card.querySelector(".practice-task-input")
      const feedback = card.querySelector(".practice-feedback")

      state.tasks[card.dataset.taskId] = {
        inputValue: input?.value ?? "",
        status: feedback ? getFeedbackStatus(feedback) : "empty",
        message: feedback?.textContent.trim() || DEFAULT_FEEDBACK,
      }
    })

    writeStorage(PRACTICE_STORAGE_KEY, state)
  }

  function restoreState() {
    const savedState = readStorage(PRACTICE_STORAGE_KEY, { tasks: {} })

    Object.entries(savedState.tasks ?? {}).forEach(([taskId, taskState]) => {
      const card = taskGrid?.querySelector(`[data-task-id="${taskId}"]`)

      if (!card) {
        return
      }

      const input = card.querySelector(".practice-task-input")
      const feedback = card.querySelector(".practice-feedback")

      if (input) {
        input.value = taskState.inputValue ?? ""
      }

      if (!feedback) {
        return
      }

      if (taskState.status === "correct") {
        completedTaskIds.add(Number(taskId))
        setFeedback(card, feedback, "correct", taskState.message)
        return
      }

      completedTaskIds.delete(Number(taskId))

      if (taskState.status === "incorrect") {
        setFeedback(card, feedback, "incorrect", taskState.message)
        return
      }

      resetCardState(card, feedback)
    })
  }

  taskGrid?.replaceChildren(...tasks.map((task) => createTaskCard(task)))
  restoreState()
  updateProgress()

  taskGrid?.addEventListener("submit", (event) => {
    event.preventDefault()

    const form = event.target.closest(".practice-task-form")

    if (!form) {
      return
    }

    const taskId = Number(form.dataset.taskId)
    const task = tasks.find((item) => item.id === taskId)
    const card = form.closest(".practice-task-card")
    const input = form.querySelector(".practice-task-input")
    const feedback = card?.querySelector(".practice-feedback")

    if (!task || !card || !input || !feedback) {
      return
    }

    const parsedAnswer = parseAnswer(input.value, task.to)

    if (!parsedAnswer.valid) {
      completedTaskIds.delete(task.id)
      setFeedback(
        card,
        feedback,
        "incorrect",
        `Type a number, or a number with the matching unit ${task.to}.`
      )
      updateProgress()
      saveState()
      return
    }

    if (answerMatchesTask(parsedAnswer.value, task)) {
      completedTaskIds.add(task.id)
      setFeedback(
        card,
        feedback,
        "correct",
        `Correct. Decimal: ${formatNumber(task.decimalAnswer)} ${task.to}. Binary: ${formatNumber(task.binaryAnswer)} ${task.to}.`
      )
    } else {
      completedTaskIds.delete(task.id)
      setFeedback(
        card,
        feedback,
        "incorrect",
        `Not quite. Accepted answers include ${formatNumber(task.decimalAnswer)} ${task.to} using base 1000 and ${formatNumber(task.binaryAnswer)} ${task.to} using base 1024.`
      )
    }

    updateProgress()
    saveState()
  })

  taskGrid?.addEventListener("input", (event) => {
    const input = event.target.closest(".practice-task-input")

    if (!input) {
      return
    }

    const card = input.closest(".practice-task-card")
    const taskId = Number(card?.dataset.taskId)
    const feedback = card?.querySelector(".practice-feedback")

    if (!card || !feedback) {
      return
    }

    completedTaskIds.delete(taskId)
    resetCardState(card, feedback)
    updateProgress()
    saveState()
  })

  resetButton?.addEventListener("click", () => {
    completedTaskIds.clear()

    taskGrid?.querySelectorAll(".practice-task-card").forEach((card) => {
      const input = card.querySelector(".practice-task-input")
      const feedback = card.querySelector(".practice-feedback")

      if (input) {
        input.value = ""
      }

      if (feedback) {
        resetCardState(card, feedback)
      }
    })

    removeStorage(PRACTICE_STORAGE_KEY)
    updateProgress()
  })
}

initLessonPage(lessonConfig)
initPracticeZone()
