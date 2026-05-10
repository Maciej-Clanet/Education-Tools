import { initLessonPage } from "../core/lesson-shell.js"
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
    storageKey: "lesson-hexadecimal-numbers-quiz",
    passScore: 4,
    version: 1,
  },
  examPractice: {
    storageKey: "lesson-hexadecimal-numbers-exam-practice",
  },
}

const HEX_DIGITS = "0123456789ABCDEF".split("")
const HEX_EXPLORER_STORAGE_KEY = "lesson-hexadecimal-nibble-explorer"
const HEX_PRACTICE_STORAGE_KEY = "lesson-hexadecimal-practice"
const DEFAULT_FEEDBACK = "Type your answer, then check it."

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

function toFourBitBinary(value) {
  return value.toString(2).padStart(4, "0")
}

function toEightBitBinary(value) {
  return value.toString(2).padStart(8, "0")
}

function formatBinaryNibbles(binaryValue) {
  return binaryValue.match(/.{1,4}/g)?.join(" ") ?? binaryValue
}

function normaliseHexDigit(value) {
  const digit = String(value ?? "").trim().toUpperCase().charAt(0)
  return HEX_DIGITS.includes(digit) ? digit : "A"
}

function cleanBinary(value) {
  return String(value ?? "").trim().replace(/[\s_]/g, "")
}

function cleanHex(value) {
  return String(value ?? "")
    .trim()
    .replace(/^0x/i, "")
    .replace(/[\s_]/g, "")
    .toUpperCase()
}

function getRandomByte() {
  return Math.floor(Math.random() * 240) + 16
}

function getQuestionFromState(state) {
  const mode = state.mode === "binaryToHex" ? "binaryToHex" : "hexToBinary"
  const value = Number.isInteger(state.value) ? state.value : getRandomByte()
  const binary = toEightBitBinary(value)
  const hex = value.toString(16).toUpperCase().padStart(2, "0")

  if (mode === "binaryToHex") {
    return {
      mode,
      value,
      prompt: formatBinaryNibbles(binary),
      answer: hex,
      label: "Binary to hexadecimal",
      placeholder: "Example: AF",
      hint: "Group the binary into two 4-bit nibbles, then map each nibble to one hex digit.",
    }
  }

  return {
    mode,
    value,
    prompt: hex,
    answer: binary,
    label: "Hexadecimal to binary",
    placeholder: "Example: 1010 1111",
    hint: "Convert each hex digit into its own 4-bit binary nibble.",
  }
}

function renderExplorer(explorer, selectedDigit) {
  const digit = normaliseHexDigit(selectedDigit)
  const denaryValue = HEX_DIGITS.indexOf(digit)
  const binaryValue = toFourBitBinary(denaryValue)
  const buttons = explorer.querySelector("[data-role='hex-digit-buttons']")
  const bits = explorer.querySelector("[data-role='nibble-bits']")

  if (buttons && buttons.children.length === 0) {
    HEX_DIGITS.forEach((hexDigit) => {
      const button = createElement("button", "hex-digit-button", hexDigit)
      button.type = "button"
      button.dataset.hexDigit = hexDigit
      button.addEventListener("click", () => {
        writeStorage(HEX_EXPLORER_STORAGE_KEY, { digit: hexDigit })
        renderExplorer(explorer, hexDigit)
      })
      buttons.append(button)
    })
  }

  explorer.querySelectorAll("[data-hex-digit]").forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.hexDigit === digit)
    button.setAttribute(
      "aria-pressed",
      button.dataset.hexDigit === digit ? "true" : "false"
    )
  })

  if (bits) {
    bits.replaceChildren()

    const placeValues = [8, 4, 2, 1]
    placeValues.forEach((placeValue, index) => {
      const bit = binaryValue[index]
      const cell = createElement("span", bit === "1" ? "is-on" : "is-off")
      const placeValueLabel = createElement("strong", "", placeValue.toString())
      const bitLabel = createElement("em", "", bit)
      cell.append(placeValueLabel, bitLabel)
      bits.append(cell)
    })
  }

  const digitLabel = explorer.querySelector("[data-role='explorer-hex']")
  const binaryLabel = explorer.querySelector("[data-role='explorer-binary']")
  const denaryLabel = explorer.querySelector("[data-role='explorer-denary']")

  if (digitLabel) {
    digitLabel.textContent = digit
  }

  if (binaryLabel) {
    binaryLabel.textContent = binaryValue
  }

  if (denaryLabel) {
    denaryLabel.textContent = denaryValue.toString()
  }
}

function initHexExplorer() {
  const explorer = document.querySelector("[data-role='hex-explorer']")

  if (!explorer) {
    return
  }

  const savedState = readStorage(HEX_EXPLORER_STORAGE_KEY, { digit: "A" })
  renderExplorer(explorer, savedState?.digit)
}

function createPracticeState() {
  return {
    mode: Math.random() > 0.5 ? "binaryToHex" : "hexToBinary",
    value: getRandomByte(),
    feedback: DEFAULT_FEEDBACK,
    answer: "",
    checked: null,
  }
}

function renderPractice(practice, state) {
  const question = getQuestionFromState(state)
  const input = practice.querySelector("[data-role='practice-answer']")
  const feedback = practice.querySelector("[data-role='practice-feedback']")
  const card = practice.querySelector("[data-role='practice-card']")

  practice.querySelector("[data-role='practice-mode']").textContent =
    question.label
  practice.querySelector("[data-role='practice-question']").textContent =
    question.prompt
  practice.querySelector("[data-role='practice-hint']").textContent =
    question.hint

  if (input) {
    input.value = state.answer ?? ""
    input.placeholder = question.placeholder
  }

  if (feedback) {
    feedback.textContent = state.feedback || DEFAULT_FEEDBACK
    feedback.classList.toggle("is-correct", state.checked === true)
    feedback.classList.toggle("is-incorrect", state.checked === false)
  }

  if (card) {
    card.classList.toggle("is-correct", state.checked === true)
    card.classList.toggle("is-incorrect", state.checked === false)
  }
}

function checkPracticeAnswer(state) {
  const question = getQuestionFromState(state)
  const given =
    question.mode === "hexToBinary"
      ? cleanBinary(state.answer)
      : cleanHex(state.answer)
  const expected =
    question.mode === "hexToBinary"
      ? question.answer
      : cleanHex(question.answer)

  if (given === expected) {
    return {
      ...state,
      checked: true,
      feedback:
        question.mode === "hexToBinary"
          ? `Correct. ${question.prompt} maps to ${formatBinaryNibbles(question.answer)}.`
          : `Correct. ${question.prompt} maps to ${question.answer}.`,
    }
  }

  return {
    ...state,
    checked: false,
    feedback:
      question.mode === "hexToBinary"
        ? "Not quite. Convert each hex digit into a separate 4-bit nibble."
        : "Not quite. Split the binary into 4-bit groups, then map each group to a hex digit.",
  }
}

function initPractice() {
  const practice = document.querySelector("[data-role='hex-practice']")

  if (!practice) {
    return
  }

  let state = readStorage(HEX_PRACTICE_STORAGE_KEY, createPracticeState())
  state = {
    ...createPracticeState(),
    ...state,
  }

  const input = practice.querySelector("[data-role='practice-answer']")

  function saveAndRender(nextState) {
    state = nextState
    writeStorage(HEX_PRACTICE_STORAGE_KEY, state)
    renderPractice(practice, state)
  }

  input?.addEventListener("input", () => {
    saveAndRender({
      ...state,
      answer: input.value,
      checked: null,
      feedback: DEFAULT_FEEDBACK,
    })
  })

  practice
    .querySelector("[data-action='check-practice']")
    ?.addEventListener("click", () => {
      saveAndRender(checkPracticeAnswer(state))
    })

  practice
    .querySelector("[data-action='new-practice']")
    ?.addEventListener("click", () => {
      saveAndRender(createPracticeState())
    })

  renderPractice(practice, state)
}

initLessonPage(lessonConfig)
initHexExplorer()
initPractice()
