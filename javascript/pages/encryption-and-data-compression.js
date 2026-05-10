import { initLessonPage } from "../core/lesson-shell.js"
import { readStorage, writeStorage } from "../core/storage.js"

const lessonConfig = {
  lessonId: "encryption-and-data-compression",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-e",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Packet data, packet switching, and protocols",
        description: "Previous in E1 Transmitting data.",
        status: "Live",
        href: "../topics/packet-data-packet-switching-and-protocols.html",
      },
      next: {
        title: "Error detection methods",
        description: "Next in E2 Error detection.",
        status: "Live",
        href: "../topics/error-detection-methods.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-encryption-and-data-compression-quiz",
    passScore: 4,
    version: 1,
  },
  examPractice: {
    storageKey: "lesson-encryption-and-data-compression-exam-practice",
  },
}

const CIPHER_STORAGE_KEY = "lesson-encryption-cipher-tool"
const VIGENERE_SQUARE_STORAGE_KEY = "lesson-vigenere-square-tool"
const COMPRESSION_STORAGE_KEY = "lesson-encryption-compression-tool"
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const VIGENERE_EXAMPLE_PAIRS = [
  { key: "K", plain: "C", cipher: "M" },
  { key: "E", plain: "A", cipher: "E" },
  { key: "Y", plain: "T", cipher: "R" },
]
const DEFAULT_CIPHER_STATE = {
  mode: "caesar",
  plain: "MEET AT 4",
  shift: 3,
  key: "CODE",
}
const DEFAULT_VIGENERE_SQUARE_STATE = {
  mode: "encode",
  step: 1,
}
const DEFAULT_COMPRESSION_STATE = {
  fileType: "document",
  tolerance: 0,
}
const FILE_TYPES = {
  document: {
    label: "Document",
    baseSize: 10,
    exactRequired: true,
    losslessRatio: 0.7,
    lossyRatio: 0.55,
    note:
      "Documents usually need lossless compression because the exact words, layout, and data must be preserved.",
  },
  photo: {
    label: "Photo",
    baseSize: 18,
    exactRequired: false,
    losslessRatio: 0.74,
    lossyRatio: 0.28,
    note:
      "Photos can often use lossy compression if a small quality loss is acceptable for a much smaller file.",
  },
  video: {
    label: "Video",
    baseSize: 180,
    exactRequired: false,
    losslessRatio: 0.8,
    lossyRatio: 0.18,
    note:
      "Video files are large, so lossy compression is common when reduced bandwidth and faster streaming matter.",
  },
  program: {
    label: "Program file",
    baseSize: 24,
    exactRequired: true,
    losslessRatio: 0.62,
    lossyRatio: 0.5,
    note:
      "Program files must stay exact. If bits are removed or changed, the software may fail or become unsafe.",
  },
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

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function normaliseShift(value) {
  const parsed = Number(value)

  if (!Number.isFinite(parsed)) {
    return DEFAULT_CIPHER_STATE.shift
  }

  return clamp(Math.trunc(parsed), 1, 25)
}

function sanitiseKey(value) {
  const letters = String(value ?? "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "")

  return letters || DEFAULT_CIPHER_STATE.key
}

function getLetterIndex(character) {
  return ALPHABET.indexOf(character.toUpperCase())
}

function shiftLetter(character, shift) {
  const index = getLetterIndex(character)

  if (index === -1) {
    return character
  }

  return ALPHABET[(index + shift + ALPHABET.length) % ALPHABET.length]
}

function getCipherSteps(plain, mode, shift, key) {
  const cleanKey = sanitiseKey(key)
  let keyIndex = 0

  return plain
    .toUpperCase()
    .split("")
    .map((character) => {
      const plainIndex = getLetterIndex(character)

      if (plainIndex === -1) {
        return {
          plain: character,
          key: "-",
          shift: "-",
          cipher: character,
        }
      }

      const keyLetter = cleanKey[keyIndex % cleanKey.length]
      const currentShift =
        mode === "vigenere" ? getLetterIndex(keyLetter) : shift
      keyIndex += 1

      return {
        plain: character,
        key: mode === "vigenere" ? keyLetter : `+${shift}`,
        shift: `+${currentShift}`,
        cipher: shiftLetter(character, currentShift),
      }
    })
}

function setText(root, role, text) {
  const element = root.querySelector(`[data-role='${role}']`)

  if (element) {
    element.textContent = text
  }
}

function renderAlphabetShift(container, shift) {
  container.replaceChildren()

  ALPHABET.split("").forEach((letter, index) => {
    const pair = createElement("span", "alphabet-pair")
    pair.append(
      createElement("strong", "", letter),
      createElement("em", "", ALPHABET[(index + shift) % ALPHABET.length])
    )
    container.append(pair)
  })
}

function renderCipherSteps(container, steps) {
  container.replaceChildren()

  const visibleSteps = steps.filter((step) => step.shift !== "-").slice(0, 12)

  if (!visibleSteps.length) {
    container.textContent = "Letters in the plaintext will appear here."
    return
  }

  const header = createElement("div", "cipher-step-row cipher-step-row--head")
  header.append(
    createElement("span", "", "Plain"),
    createElement("span", "", "Key"),
    createElement("span", "", "Shift"),
    createElement("span", "", "Cipher")
  )
  container.append(header)

  visibleSteps.forEach((step) => {
    const row = createElement("div", "cipher-step-row")
    row.append(
      createElement("span", "", step.plain),
      createElement("span", "", step.key),
      createElement("span", "", step.shift),
      createElement("strong", "", step.cipher)
    )
    container.append(row)
  })
}

function normaliseVigenereSquareMode(value) {
  return value === "decode" ? "decode" : "encode"
}

function normaliseVigenereSquareStep(value) {
  const parsed = Number(value)

  if (!Number.isFinite(parsed)) {
    return DEFAULT_VIGENERE_SQUARE_STATE.step
  }

  return clamp(Math.trunc(parsed), 1, VIGENERE_EXAMPLE_PAIRS.length)
}

function renderVigenereSquare(tool, state) {
  const container = tool.querySelector("[data-role='vigenere-square']")

  if (!container) {
    return
  }

  const mode = normaliseVigenereSquareMode(state.mode)
  const step = normaliseVigenereSquareStep(state.step)
  const activePair = VIGENERE_EXAMPLE_PAIRS[step - 1]
  const table = createElement("table")
  const thead = createElement("thead")
  const headRow = createElement("tr")
  const corner = createElement("th", "square-corner", "Key / Plain")
  corner.scope = "col"
  headRow.append(corner)

  ALPHABET.split("").forEach((letter) => {
    const heading = createElement("th", "", letter)
    heading.scope = "col"
    heading.classList.toggle("is-active-column", letter === activePair.plain)
    headRow.append(heading)
  })

  thead.append(headRow)
  table.append(thead)

  const tbody = createElement("tbody")
  ALPHABET.split("").forEach((rowLetter, rowIndex) => {
    const row = createElement("tr")
    row.classList.toggle("is-active-row", rowLetter === activePair.key)

    const rowHeading = createElement("th", "", rowLetter)
    rowHeading.scope = "row"
    row.append(rowHeading)

    ALPHABET.split("").forEach((columnLetter, columnIndex) => {
      const cell = createElement(
        "td",
        "",
        ALPHABET[(rowIndex + columnIndex) % ALPHABET.length]
      )
      cell.classList.toggle(
        "is-active-column",
        columnLetter === activePair.plain
      )
      cell.classList.toggle(
        "is-active-cell",
        rowLetter === activePair.key && columnLetter === activePair.plain
      )
      row.append(cell)
    })

    tbody.append(row)
  })

  table.append(tbody)
  container.replaceChildren(table)

  const slider = tool.querySelector("[data-role='vigenere-square-step']")

  if (slider) {
    slider.value = step.toString()
  }

  tool.querySelectorAll("[data-vigenere-square-mode]").forEach((button) => {
    const isSelected = button.dataset.vigenereSquareMode === mode
    button.classList.toggle("is-selected", isSelected)
    button.setAttribute("aria-pressed", String(isSelected))
  })

  setText(tool, "vigenere-step-number", `${step} of 3`)
  setText(tool, "vigenere-step-key", activePair.key)
  setText(
    tool,
    "vigenere-source-label",
    mode === "encode" ? "Plaintext column" : "Find ciphertext"
  )
  setText(
    tool,
    "vigenere-result-label",
    mode === "encode" ? "Ciphertext" : "Plaintext column"
  )
  setText(
    tool,
    "vigenere-step-source",
    mode === "encode" ? activePair.plain : activePair.cipher
  )
  setText(
    tool,
    "vigenere-step-result",
    mode === "encode" ? activePair.cipher : activePair.plain
  )
  setText(
    tool,
    "vigenere-step-note",
    mode === "encode"
      ? `Encoding step ${step}: use key row ${activePair.key} and plaintext column ${activePair.plain}. ` +
          `Their intersection is ciphertext ${activePair.cipher}.`
      : `Decoding step ${step}: use key row ${activePair.key}, find ciphertext ${activePair.cipher} in that row, ` +
          `then read plaintext ${activePair.plain} from the column heading.`
  )
}

function initVigenereSquareTool() {
  const tool = document.querySelector("[data-role='vigenere-square-tool']")

  if (!tool) {
    return
  }

  const state = {
    ...DEFAULT_VIGENERE_SQUARE_STATE,
    ...readStorage(VIGENERE_SQUARE_STORAGE_KEY, DEFAULT_VIGENERE_SQUARE_STATE),
  }

  function saveAndRender() {
    state.mode = normaliseVigenereSquareMode(state.mode)
    state.step = normaliseVigenereSquareStep(state.step)
    writeStorage(VIGENERE_SQUARE_STORAGE_KEY, state)
    renderVigenereSquare(tool, state)
  }

  tool.querySelectorAll("[data-vigenere-square-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state.mode = button.dataset.vigenereSquareMode
      saveAndRender()
    })
  })

  tool
    .querySelector("[data-role='vigenere-square-step']")
    ?.addEventListener("input", (event) => {
      state.step = event.target.value
      saveAndRender()
    })

  saveAndRender()
}

function renderCipherTool(tool, state) {
  const mode = state.mode === "vigenere" ? "vigenere" : "caesar"
  const shift = normaliseShift(state.shift)
  const key = sanitiseKey(state.key)
  const plain = String(state.plain ?? "")
  const steps = getCipherSteps(plain, mode, shift, key)
  const output = steps.map((step) => step.cipher).join("")
  const plainInput = tool.querySelector("[data-role='cipher-plain']")
  const shiftInput = tool.querySelector("[data-role='caesar-shift']")
  const keyInput = tool.querySelector("[data-role='vigenere-key']")
  const alphabet = tool.querySelector("[data-role='alphabet-shift']")
  const stepContainer = tool.querySelector("[data-role='cipher-steps']")

  if (plainInput && plainInput.value !== plain) {
    plainInput.value = plain
  }

  if (shiftInput) {
    shiftInput.value = shift.toString()
    shiftInput.disabled = mode !== "caesar"
  }

  if (keyInput) {
    keyInput.value = key
    keyInput.disabled = mode !== "vigenere"
  }

  tool.querySelectorAll("[data-cipher-mode]").forEach((button) => {
    const isSelected = button.dataset.cipherMode === mode
    button.classList.toggle("is-selected", isSelected)
    button.setAttribute("aria-pressed", String(isSelected))
  })

  if (alphabet) {
    renderAlphabetShift(alphabet, mode === "caesar" ? shift : 0)
    alphabet.classList.toggle("is-muted", mode === "vigenere")
  }

  if (stepContainer) {
    renderCipherSteps(stepContainer, steps)
  }

  setText(tool, "cipher-mode-label", mode === "caesar" ? "Caesar" : "Vigenere")
  setText(tool, "cipher-output", output || "-")
  setText(
    tool,
    "cipher-key-summary",
    mode === "caesar" ? `Shift ${shift}` : `Keyword ${key}`
  )
  setText(
    tool,
    "cipher-note",
    mode === "caesar"
      ? "Caesar uses one fixed shift, so repeated letters keep a visible pattern."
      : "Vigenere uses the keyword to change the shift from letter to letter."
  )
}

function initCipherTool() {
  const tool = document.querySelector("[data-role='cipher-tool']")

  if (!tool) {
    return
  }

  const state = {
    ...DEFAULT_CIPHER_STATE,
    ...readStorage(CIPHER_STORAGE_KEY, DEFAULT_CIPHER_STATE),
  }

  function saveAndRender() {
    state.shift = normaliseShift(state.shift)
    state.key = sanitiseKey(state.key)
    writeStorage(CIPHER_STORAGE_KEY, state)
    renderCipherTool(tool, state)
  }

  tool.querySelector("[data-role='cipher-plain']")?.addEventListener("input", (event) => {
    state.plain = event.target.value
    saveAndRender()
  })

  tool.querySelector("[data-role='caesar-shift']")?.addEventListener("input", (event) => {
    state.shift = event.target.value
    saveAndRender()
  })

  tool.querySelector("[data-role='vigenere-key']")?.addEventListener("input", (event) => {
    state.key = event.target.value
    saveAndRender()
  })

  tool.querySelectorAll("[data-cipher-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state.mode = button.dataset.cipherMode
      saveAndRender()
    })
  })

  renderCipherTool(tool, state)
}

function normaliseFileType(value) {
  return FILE_TYPES[value] ? value : DEFAULT_COMPRESSION_STATE.fileType
}

function normaliseTolerance(value) {
  const parsed = Number(value)

  if (!Number.isFinite(parsed)) {
    return DEFAULT_COMPRESSION_STATE.tolerance
  }

  return clamp(Math.trunc(parsed), 0, 100)
}

function getCompressionRecommendation(fileType, tolerance) {
  const file = FILE_TYPES[fileType]
  const canUseLossy = !file.exactRequired && tolerance >= 25
  const type = canUseLossy ? "Lossy" : "Lossless"
  const toleranceFactor = canUseLossy ? 1 - tolerance / 180 : 1
  const ratio = canUseLossy
    ? Math.max(0.08, file.lossyRatio * toleranceFactor)
    : file.losslessRatio
  const size = file.baseSize * ratio

  return {
    type,
    size,
    recoverability: canUseLossy ? "Some detail lost" : "Exact original",
    note: canUseLossy
      ? `${file.label} can use lossy compression here because the tolerance is high enough to trade some quality for a smaller file.`
      : file.note,
  }
}

function renderCompressionTool(tool, state) {
  const fileType = normaliseFileType(state.fileType)
  const tolerance = normaliseTolerance(state.tolerance)
  const recommendation = getCompressionRecommendation(fileType, tolerance)
  const slider = tool.querySelector("[data-role='quality-tolerance']")
  const meter = tool.querySelector("[data-role='size-meter-fill']")
  const meterWidth =
    (recommendation.size / FILE_TYPES[fileType].baseSize) * 100

  tool.querySelectorAll("[data-file-type]").forEach((button) => {
    const isSelected = button.dataset.fileType === fileType
    button.classList.toggle("is-selected", isSelected)
    button.setAttribute("aria-pressed", String(isSelected))
  })

  if (slider) {
    slider.value = tolerance.toString()
  }

  if (meter) {
    meter.style.width = `${clamp(meterWidth, 6, 100)}%`
  }

  setText(tool, "compression-choice", recommendation.type)
  setText(tool, "recommended-type", recommendation.type)
  setText(tool, "estimated-size", `${recommendation.size.toFixed(1)} MB`)
  setText(tool, "recoverability", recommendation.recoverability)
  setText(
    tool,
    "compression-note",
    `${recommendation.note} Tolerance selected: ${tolerance}%.`
  )
}

function initCompressionTool() {
  const tool = document.querySelector("[data-role='compression-tool']")

  if (!tool) {
    return
  }

  const state = {
    ...DEFAULT_COMPRESSION_STATE,
    ...readStorage(COMPRESSION_STORAGE_KEY, DEFAULT_COMPRESSION_STATE),
  }

  function saveAndRender() {
    state.fileType = normaliseFileType(state.fileType)
    state.tolerance = normaliseTolerance(state.tolerance)
    writeStorage(COMPRESSION_STORAGE_KEY, state)
    renderCompressionTool(tool, state)
  }

  tool.querySelectorAll("[data-file-type]").forEach((button) => {
    button.addEventListener("click", () => {
      state.fileType = button.dataset.fileType
      saveAndRender()
    })
  })

  tool
    .querySelector("[data-role='quality-tolerance']")
    ?.addEventListener("input", (event) => {
      state.tolerance = event.target.value
      saveAndRender()
    })

  renderCompressionTool(tool, state)
}

initLessonPage(lessonConfig)
initVigenereSquareTool()
initCipherTool()
initCompressionTool()
