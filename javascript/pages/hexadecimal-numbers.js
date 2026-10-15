import { initLessonPage } from "../core/lesson-shell.js"
import { initLiveCodeExamples } from "../core/live-code-example.js"
import { readStorage, writeStorage } from "../core/storage.js"

const lessonConfig = {
  lessonId: "hexadecimal-numbers",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-c",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Binary and BCD",
        description: "Previous in C1 Number systems.",
        status: "Live",
        href: "../topics/binary-and-bcd.html",
      },
      next: {
        title: "Binary arithmetic",
        description: "Next in C1 Number systems.",
        status: "Live",
        href: "../topics/binary-arithmetic.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-hexadecimal-numbers-quiz-v3",
    passScore: 8,
    totalQuestions: 10,
    version: 3,
  },
  examPractice: {
    storageKey: "lesson-hexadecimal-numbers-exam-practice",
  },
}

// New question types must not inherit answers from the former binary workshop.
const HEX_PRACTICE_STORAGE_KEY = "lesson-hexadecimal-practice-v2"
const PRACTICE_MODES = ["binaryToHex", "hexToBinary", "hexToDenary", "denaryToHex"]
const DEFAULT_FEEDBACK = "Type your answer, then check it."

const liveCodeExamples = [{
  id: "hex-colours",
  title: "Change a hex colour",
  defaultSplit: 56,
  sources: [{
    id: "css",
    type: "css",
    label: "CSS",
    code: `h3 { color: #253442; }

.card { background-color: #FFF4E6; }

button { background-color: #FF8000; }`,
  }],
  scaffold: {
    html: `<article class="card"><h3>Study group</h3><p>Build your skills together.</p><button>Join the group</button></article>`,
    css: `body { margin: 0; padding: 16px; font: 18px/1.5 system-ui, sans-serif; color: #253442; background: #FFFFFF; }
.card { padding: 16px; border: 2px solid #253442; border-radius: 16px; }
h3 { margin: 0 0 8px; font-size: 24px; }
p { margin: 8px 0 12px; }
button { padding: 8px 16px; border: 2px solid #253442; border-radius: 8px; color: #253442; font: inherit; }`,
  },
}]

// Retired demonstrations leave their saved state untouched.
const SECTION_ALIASES = {
  "compact-binary": "nibbles",
  converter: "base-sixteen",
  "padding-binary": "binary-to-hex",
  summary: "mistakes",
}

function resolveSectionAlias() {
  const section = SECTION_ALIASES[window.location.hash.slice(1)]
  if (!section) return
  window.history.replaceState(null, "", "#" + section)
  document.getElementById(section)?.scrollIntoView()
}

function initHexTables() {
  document.querySelectorAll("[data-hex-table]").forEach((table) => {
    const rows = [...table.tBodies[0].rows]
    rows.forEach((row) => {
      const cell = row.cells[0]
      const choice = document.createElement("button")
      choice.type = "button"
      choice.className = "hx-row-choice"
      choice.textContent = cell.textContent
      choice.setAttribute("aria-label", `Highlight denary ${cell.textContent}, binary ${row.cells[1].textContent}, hex ${row.cells[2].textContent}`)
      choice.setAttribute("aria-pressed", "false")
      cell.replaceChildren(choice)
      row.addEventListener("click", () => {
        const selected = !row.classList.contains("is-selected")
        rows.forEach((other) => {
          const active = other === row && selected
          other.classList.toggle("is-selected", active)
          other.querySelector("button").setAttribute("aria-pressed", String(active))
        })
      })
    })
  })
}

function cleanHex(value) {
  return String(value ?? "")
    .trim()
    .replace(/^0x/i, "")
    .replace(/[\s_]/g, "")
    .toUpperCase()
}

function initBinaryWorking() {
  const table = document.querySelector(".hx-binary-reference")
  if (!table) return
  const inputs = [...table.querySelectorAll("[data-binary-working-bit]")]
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/[^01]/g, "").slice(0, 1)
    })
  })
  const clear = table.querySelector("[data-clear-binary-working]")
  clear.hidden = false
  clear.addEventListener("click", () => {
    inputs.forEach((input) => { input.value = "" })
    inputs[0]?.focus()
  })
}

function isPracticeValue(value) {
  return Number.isInteger(value) && value >= 16 && value <= 255
}

function createPracticeQuestion(previousValue) {
  // Skip the previous value so New question always changes the number.
  const hasPrevious = isPracticeValue(previousValue)
  let value = Math.floor(Math.random() * (hasPrevious ? 239 : 240)) + 16
  if (hasPrevious && value >= previousValue) value += 1
  return { value, answer: "", checked: null, feedback: DEFAULT_FEEDBACK }
}

function getQuestionFromState(mode, question) {
  const hex = question.value.toString(16).toUpperCase()
  const binary = question.value.toString(2).padStart(8, "0").replace(/(.{4})(.{4})/, "$1 $2")
  if (mode === "binaryToHex") {
    return {
      prompt: binary,
      answer: hex,
      sourceBase: "binary",
      targetBase: "hex",
      label: "Binary to hexadecimal",
      answerLabel: "Your hex answer",
      placeholder: "Example: AF",
      hint: "Write one hex digit for each group of four bits.",
      retry: "Check each group of four bits in the table.",
    }
  }
  if (mode === "hexToBinary") {
    return {
      prompt: hex,
      answer: binary,
      sourceBase: "hex",
      targetBase: "binary",
      label: "Hexadecimal to binary",
      answerLabel: "Your eight-bit binary answer",
      placeholder: "Example: 1010 1111",
      hint: "Write four bits for each hex digit.",
      retry: "Write four bits for each hex digit. Keep zeros at the start.",
    }
  }
  if (mode === "denaryToHex") {
    return {
      prompt: String(question.value),
      answer: hex,
      sourceBase: "denary",
      targetBase: "hex",
      label: "Denary (decimal) to hexadecimal",
      answerLabel: "Your hex answer",
      placeholder: "Example: AF",
      hint: "Use binary to convert the number to hex.",
      retry: "Convert to binary first. Then use one hex digit per four bits.",
    }
  }
  return {
    prompt: hex,
    answer: String(question.value),
    sourceBase: "hex",
    targetBase: "denary",
    label: "Hexadecimal to denary (decimal)",
    answerLabel: "Your denary (decimal) answer",
    placeholder: "Example: 175",
    hint: "Use the 16s and 1s columns.",
    retry: "Multiply the left digit value by 16. Add the right digit value.",
  }
}

function checkPracticeAnswer(mode, question) {
  const display = getQuestionFromState(mode, question)
  const toHex = display.targetBase === "hex"
  const toBinary = display.targetBase === "binary"
  const given = toHex
    ? cleanHex(question.answer)
    : toBinary ? question.answer.replace(/[\s_]/g, "") : question.answer.trim()
  const valid = toHex
    ? /^[0-9A-F]+$/.test(given)
    : toBinary ? /^[01]{8}$/.test(given) : /^[0-9]+$/.test(given)
  const correct = valid && Number.parseInt(given, toHex ? 16 : toBinary ? 2 : 10) === question.value
  return {
    ...question,
    checked: correct,
    feedback: correct
      ? `Correct. ${display.prompt} ${display.sourceBase} = ${display.answer} ${display.targetBase}.`
      : display.retry,
  }
}

function initPractice() {
  const practice = document.querySelector("[data-role='hex-practice']")
  if (!practice) return

  const saved = readStorage(HEX_PRACTICE_STORAGE_KEY, {})
  const state = {
    mode: PRACTICE_MODES.includes(saved?.mode) ? saved.mode : PRACTICE_MODES[0],
    questions: {},
  }
  PRACTICE_MODES.forEach((mode) => {
    const previous = saved?.questions?.[mode]
    const question = isPracticeValue(previous?.value)
      ? { value: previous.value, answer: typeof previous.answer === "string" ? previous.answer : "", checked: null, feedback: DEFAULT_FEEDBACK }
      : createPracticeQuestion()
    state.questions[mode] = typeof previous?.checked === "boolean"
      ? checkPracticeAnswer(mode, question)
      : question
  })

  const tabs = [...practice.querySelectorAll("[data-practice-mode]")]
  const input = practice.querySelector("[data-role='practice-answer']")
  const feedback = practice.querySelector("[data-role='practice-feedback']")
  const card = practice.querySelector("[data-role='practice-card']")

  function render() {
    const question = state.questions[state.mode]
    const display = getQuestionFromState(state.mode, question)
    tabs.forEach((tab) => {
      const selected = tab.dataset.practiceMode === state.mode
      tab.setAttribute("aria-selected", String(selected))
      tab.tabIndex = selected ? 0 : -1
      if (selected) card.setAttribute("aria-labelledby", tab.id)
    })
    practice.querySelector("[data-role='practice-mode']").textContent = display.label
    practice.querySelector("[data-role='practice-question']").textContent = display.prompt
    practice.querySelector("[data-role='practice-hint']").textContent = display.hint
    practice.querySelector("label[for='hex-practice-answer']").textContent = display.answerLabel
    input.value = question.answer
    input.placeholder = display.placeholder
    input.inputMode = state.mode === "hexToDenary" ? "numeric" : "text"
    feedback.textContent = question.feedback
    for (const element of [feedback, card]) {
      element.classList.toggle("is-correct", question.checked === true)
      element.classList.toggle("is-incorrect", question.checked === false)
    }
  }

  function saveAndRender() {
    writeStorage(HEX_PRACTICE_STORAGE_KEY, state)
    render()
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      state.mode = tab.dataset.practiceMode
      saveAndRender()
    })
    tab.addEventListener("keydown", (event) => {
      const next = {
        ArrowRight: (index + 1) % tabs.length,
        ArrowLeft: (index + tabs.length - 1) % tabs.length,
        Home: 0,
        End: tabs.length - 1,
      }[event.key]
      if (next === undefined) return
      event.preventDefault()
      tabs[next].focus()
      tabs[next].click()
    })
  })

  input.addEventListener("input", () => {
    Object.assign(state.questions[state.mode], {answer: input.value, checked: null, feedback: DEFAULT_FEEDBACK})
    saveAndRender()
  })
  practice.querySelector("[data-action='check-practice']").addEventListener("click", () => {
    state.questions[state.mode] = checkPracticeAnswer(state.mode, state.questions[state.mode])
    saveAndRender()
  })
  practice.querySelector("[data-action='new-practice']").addEventListener("click", () => {
    state.questions[state.mode] = createPracticeQuestion(state.questions[state.mode].value)
    saveAndRender()
  })

  practice.querySelector("[role='tablist']").hidden = false
  render()
}

resolveSectionAlias()
initLessonPage(lessonConfig)
initHexTables()
initLiveCodeExamples(liveCodeExamples)
initPractice()
initBinaryWorking()
window.addEventListener("hashchange", resolveSectionAlias)
