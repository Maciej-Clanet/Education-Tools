import { initLessonPage } from "../core/lesson-shell.js"
import { readStorage, writeStorage } from "../core/storage.js"

const lessonConfig = {
  lessonId: "character-sets-ascii-and-unicode",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-c",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Negative and floating point representation",
        description: "Previous in C1 Number systems.",
        status: "Live",
        href: "../topics/negative-and-floating-point-representation.html",
      },
      next: {
        title: "Image storage: bitmap and vector images",
        description: "Next in C3 Image representation.",
        status: "Live",
        href: "../topics/bitmap-image-storage.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-character-sets-ascii-and-unicode-quiz",
    passScore: 4,
    version: 2,
  },
  examPractice: {
    storageKey: "lesson-character-sets-ascii-and-unicode-exam-practice",
  },
}

const INSPECTOR_STORAGE_KEY = "lesson-character-sets-inspector"
const PRACTICE_STORAGE_KEY = "lesson-character-sets-practice"
const DEFAULT_TEXT = "Code 65 = A"
const ASCII_PRACTICE_MESSAGES = [
  { text: "HELLO", ascii: true },
  { text: "Room 204", ascii: true },
  { text: "Total: \u00A312", ascii: false },
  { text: "Cafe", ascii: true },
  { text: "Caf\u00E9", ascii: false },
  { text: "Omega \u03A9", ascii: false },
  { text: "Line 1\nLine 2", ascii: true },
  { text: "\u6F22 character", ascii: false },
]

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

function toBinary(value, width = 8) {
  return value.toString(2).padStart(width, "0")
}

function toHex(value, width = 4) {
  return value.toString(16).toUpperCase().padStart(width, "0")
}

function visibleCharacter(character) {
  if (character === " ") {
    return "space"
  }

  if (character === "\n") {
    return "line feed"
  }

  if (character === "\t") {
    return "tab"
  }

  return character
}

function getUtf8Bytes(character) {
  if (!window.TextEncoder) {
    return []
  }

  return Array.from(new TextEncoder().encode(character))
}

function renderInspectorRows(table, text) {
  table.replaceChildren()

  const headers = [
    "Character",
    "Code point",
    "Denary",
    "Binary",
    "UTF-8 bytes",
    "ASCII?",
  ]

  headers.forEach((header) => {
    table.append(createElement("span", "row-label", header))
  })

  Array.from(text).forEach((character) => {
    const codePoint = character.codePointAt(0)
    const isAscii = codePoint <= 127
    const binary = isAscii ? toBinary(codePoint, 7) : "outside ASCII"
    const utf8Bytes = getUtf8Bytes(character)
      .map((byte) => toHex(byte, 2))
      .join(" ")

    table.append(
      createElement("span", "character-cell", visibleCharacter(character))
    )
    table.append(createElement("code", "", `U+${toHex(codePoint)}`))
    table.append(createElement("span", "", codePoint.toString()))
    table.append(createElement("code", "", binary))
    table.append(createElement("code", "", utf8Bytes || "n/a"))
    table.append(
      createElement(
        "span",
        isAscii ? "status-chip is-yes" : "status-chip is-no",
        isAscii ? "yes" : "no"
      )
    )
  })
}

function renderInspectorSummary(tool, text) {
  const characters = Array.from(text)
  const asciiCount = characters.filter(
    (character) => character.codePointAt(0) <= 127
  ).length
  const byteCount = getUtf8Bytes(text).length
  const allAscii = asciiCount === characters.length

  const characterCount = tool.querySelector(
    "[data-role='inspector-character-count']"
  )
  const asciiStatus = tool.querySelector("[data-role='inspector-ascii-status']")
  const utf8Count = tool.querySelector("[data-role='inspector-utf8-count']")
  const note = tool.querySelector("[data-role='inspector-note']")

  if (characterCount) {
    characterCount.textContent = characters.length.toString()
  }

  if (asciiStatus) {
    asciiStatus.textContent = allAscii
      ? "ASCII can store every character"
      : "Unicode is needed"
  }

  if (utf8Count) {
    utf8Count.textContent = byteCount.toString()
  }

  if (note) {
    note.textContent = allAscii
      ? "Every character in this text is inside the first 128 ASCII codes."
      : "At least one character is outside ASCII, so a wider standard such as Unicode is needed."
  }
}

function initCharacterInspector() {
  const tool = document.querySelector("[data-role='character-inspector']")

  if (!tool) {
    return
  }

  const input = tool.querySelector("[data-role='inspector-input']")
  const table = tool.querySelector("[data-role='inspector-table']")
  const buttons = tool.querySelectorAll("[data-inspector-sample]")
  const state = {
    text:
      readStorage(INSPECTOR_STORAGE_KEY, { text: DEFAULT_TEXT }).text ??
      DEFAULT_TEXT,
  }

  function saveAndRender(text) {
    state.text = text
    writeStorage(INSPECTOR_STORAGE_KEY, state)

    if (input) {
      input.value = text
    }

    if (table) {
      renderInspectorRows(table, text)
    }

    renderInspectorSummary(tool, text)
  }

  input?.addEventListener("input", () => {
    saveAndRender(input.value)
  })

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      saveAndRender(button.dataset.inspectorSample ?? DEFAULT_TEXT)
      input?.focus()
    })
  })

  saveAndRender(state.text)
}

function choosePracticeTask() {
  return ASCII_PRACTICE_MESSAGES[
    Math.floor(Math.random() * ASCII_PRACTICE_MESSAGES.length)
  ]
}

function normalisePracticeState(value) {
  if (value && typeof value === "object" && value.task) {
    return {
      task: value.task,
      choice: value.choice ?? "",
      status: value.status ?? "empty",
      message:
        value.message ??
        "Decide whether standard ASCII can store every character.",
    }
  }

  return {
    task: choosePracticeTask(),
    choice: "",
    status: "empty",
    message: "Decide whether standard ASCII can store every character.",
  }
}

function renderPractice(practice, state) {
  const message = practice.querySelector("[data-role='ascii-practice-message']")
  const feedback = practice.querySelector("[data-role='ascii-practice-feedback']")
  const buttons = practice.querySelectorAll("[data-ascii-choice]")

  if (message) {
    message.textContent = state.task.text
  }

  buttons.forEach((button) => {
    button.classList.toggle(
      "is-selected",
      button.dataset.asciiChoice === state.choice
    )
  })

  if (feedback) {
    feedback.className = "practice-feedback"
    feedback.classList.toggle("is-correct", state.status === "correct")
    feedback.classList.toggle("is-incorrect", state.status === "incorrect")
    feedback.textContent = state.message
  }
}

function initAsciiPractice() {
  const practice = document.querySelector("[data-role='ascii-practice']")

  if (!practice) {
    return
  }

  let state = normalisePracticeState(readStorage(PRACTICE_STORAGE_KEY, null))
  const checkButton = practice.querySelector("[data-action='check-ascii-practice']")
  const newButton = practice.querySelector("[data-action='new-ascii-practice']")

  function save() {
    writeStorage(PRACTICE_STORAGE_KEY, state)
  }

  practice.querySelectorAll("[data-ascii-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      state = {
        ...state,
        choice: button.dataset.asciiChoice ?? "",
        status: "empty",
        message: "Choice saved. Check when you are ready.",
      }
      save()
      renderPractice(practice, state)
    })
  })

  checkButton?.addEventListener("click", () => {
    if (!state.choice) {
      state = {
        ...state,
        status: "incorrect",
        message: "Choose yes or no before checking.",
      }
      save()
      renderPractice(practice, state)
      return
    }

    const saysAscii = state.choice === "yes"
    const correct = saysAscii === state.task.ascii

    state = {
      ...state,
      status: correct ? "correct" : "incorrect",
      message: correct
        ? state.task.ascii
          ? "Correct. Every character in this message is part of standard ASCII."
          : "Correct. At least one character needs Unicode."
        : state.task.ascii
          ? "Not quite. This message only uses standard ASCII characters."
          : "Not quite. Look for a character outside the 128 standard ASCII codes.",
    }
    save()
    renderPractice(practice, state)
  })

  newButton?.addEventListener("click", () => {
    state = {
      task: choosePracticeTask(),
      choice: "",
      status: "empty",
      message: "Decide whether standard ASCII can store every character.",
    }
    save()
    renderPractice(practice, state)
  })

  renderPractice(practice, state)
}

initLessonPage(lessonConfig)
initCharacterInspector()
initAsciiPractice()
