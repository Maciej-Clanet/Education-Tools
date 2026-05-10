import { initLessonPage } from "../core/lesson-shell.js"
import { readStorage, writeStorage } from "../core/storage.js"

const lessonConfig = {
  lessonId: "error-detection-methods",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-e",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Encryption and data compression",
        description: "Previous in E1 Transmitting data.",
        status: "Live",
        href: "../topics/encryption-and-data-compression.html",
      },
      next: {
        title: "Error correction with ARQ and FEC",
        description: "Next in E3 Error correction.",
        status: "Live",
        href: "../topics/error-correction-with-arq-and-fec.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-error-detection-methods-quiz",
    passScore: 4,
    version: 1,
  },
  examPractice: {
    storageKey: "lesson-error-detection-methods-exam-practice",
  },
}

const PARITY_STORAGE_KEY = "lesson-error-detection-parity-lab"
const CHECKSUM_STORAGE_KEY = "lesson-error-detection-checksum-lab"
const DEFAULT_PARITY_STATE = {
  mode: "even",
  bits: [1, 0, 1, 1, 0, 0, 1],
  receivedFrame: null,
}
const DEFAULT_CHECKSUM_STATE = {
  message: "HELLO",
  receivedMessage: "HELLO",
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

function setText(root, role, text) {
  const element = root.querySelector(`[data-role='${role}']`)

  if (element) {
    element.textContent = text
  }
}

function normaliseBit(value) {
  return Number(value) === 1 ? 1 : 0
}

function normaliseBits(bits) {
  if (!Array.isArray(bits) || bits.length !== DEFAULT_PARITY_STATE.bits.length) {
    return [...DEFAULT_PARITY_STATE.bits]
  }

  return bits.map(normaliseBit)
}

function normaliseParityMode(value) {
  return value === "odd" ? "odd" : "even"
}

function countOnes(bits) {
  return bits.reduce((total, bit) => total + normaliseBit(bit), 0)
}

function getParityBit(bits, mode) {
  const ones = countOnes(bits)
  const needsOddTotal = mode === "odd"

  if (needsOddTotal) {
    return ones % 2 === 0 ? 1 : 0
  }

  return ones % 2 === 0 ? 0 : 1
}

function getSentFrame(bits, mode) {
  return [...bits, getParityBit(bits, mode)]
}

function getFrameStatus(receivedFrame, mode) {
  const ones = countOnes(receivedFrame)
  const passes = mode === "even" ? ones % 2 === 0 : ones % 2 === 1

  return { ones, passes }
}

function renderBitRow(container, bits, options = {}) {
  container.replaceChildren()

  bits.forEach((bit, index) => {
    const button = createElement("button", "bit-cell", String(bit))
    button.type = "button"
    button.dataset.bit = String(bit)

    if (options.parityIndex === index) {
      button.classList.add("bit-cell--parity")
      button.title = "Parity bit"
    }

    if (options.onToggle) {
      button.addEventListener("click", () => options.onToggle(index))
    } else {
      button.disabled = true
    }

    container.append(button)
  })
}

function renderParityLab(tool, state) {
  const mode = normaliseParityMode(state.mode)
  const bits = normaliseBits(state.bits)
  const sentFrame = getSentFrame(bits, mode)
  const receivedFrame =
    Array.isArray(state.receivedFrame) &&
    state.receivedFrame.length === sentFrame.length
      ? state.receivedFrame.map(normaliseBit)
      : [...sentFrame]
  const frameChanged = sentFrame.join("") !== receivedFrame.join("")
  const status = getFrameStatus(receivedFrame, mode)

  state.mode = mode
  state.bits = bits
  state.receivedFrame = receivedFrame

  tool.querySelectorAll("[data-parity-mode]").forEach((button) => {
    const isSelected = button.dataset.parityMode === mode
    button.classList.toggle("is-selected", isSelected)
    button.setAttribute("aria-pressed", String(isSelected))
  })

  renderBitRow(tool.querySelector("[data-role='sender-bits']"), bits, {
    onToggle(index) {
      state.bits[index] = state.bits[index] ? 0 : 1
      state.receivedFrame = getSentFrame(state.bits, state.mode)
      saveAndRenderParityLab(tool, state)
    },
  })
  renderBitRow(tool.querySelector("[data-role='sent-frame']"), sentFrame, {
    parityIndex: sentFrame.length - 1,
  })
  renderBitRow(
    tool.querySelector("[data-role='received-frame']"),
    receivedFrame,
    {
      parityIndex: receivedFrame.length - 1,
      onToggle(index) {
        state.receivedFrame[index] = state.receivedFrame[index] ? 0 : 1
        saveAndRenderParityLab(tool, state)
      },
    }
  )

  setText(tool, "parity-expected", `${mode === "even" ? "Even" : "Odd"} 1s`)
  setText(tool, "parity-ones", String(status.ones))
  setText(
    tool,
    "parity-result",
    status.passes ? "Check passes" : "Mismatch detected"
  )
  setText(tool, "parity-status", status.passes ? "Pass" : "Error")
  let note =
    "The received frame does not match the expected parity, so the receiver " +
    "should reject it or request a resend."

  if (status.passes && frameChanged) {
    note =
      "The frame changed, but parity still passes. This can happen when an " +
      "even number of bits changes."
  } else if (status.passes) {
    note =
      "The received frame matches the expected parity. This does not prove " +
      "the data is perfect, but no parity mismatch was found."
  }

  setText(tool, "parity-note", note)
}

function saveAndRenderParityLab(tool, state) {
  writeStorage(PARITY_STORAGE_KEY, state)
  renderParityLab(tool, state)
}

function initParityLab() {
  const tool = document.querySelector("[data-role='parity-lab']")

  if (!tool) {
    return
  }

  const state = {
    ...DEFAULT_PARITY_STATE,
    ...readStorage(PARITY_STORAGE_KEY, DEFAULT_PARITY_STATE),
  }

  tool.querySelectorAll("[data-parity-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state.mode = button.dataset.parityMode
      state.receivedFrame = getSentFrame(state.bits, state.mode)
      saveAndRenderParityLab(tool, state)
    })
  })

  tool
    .querySelector("[data-action='random-parity-data']")
    ?.addEventListener("click", () => {
      state.bits = state.bits.map(() => (Math.random() > 0.5 ? 1 : 0))
      state.receivedFrame = getSentFrame(state.bits, state.mode)
      saveAndRenderParityLab(tool, state)
    })

  tool
    .querySelector("[data-action='flip-received-bit']")
    ?.addEventListener("click", () => {
      const frame = state.receivedFrame ?? getSentFrame(state.bits, state.mode)
      const index = Math.floor(Math.random() * frame.length)
      frame[index] = frame[index] ? 0 : 1
      state.receivedFrame = frame
      saveAndRenderParityLab(tool, state)
    })

  tool
    .querySelector("[data-action='reset-parity-error']")
    ?.addEventListener("click", () => {
      state.receivedFrame = getSentFrame(state.bits, state.mode)
      saveAndRenderParityLab(tool, state)
    })

  renderParityLab(tool, state)
}

function getByteValues(message) {
  return String(message ?? "")
    .slice(0, 18)
    .split("")
    .map((character) => character.charCodeAt(0))
}

function getChecksum(bytes) {
  return bytes.reduce((total, byte) => total + byte, 0) % 256
}

function renderByteStrip(container, bytes) {
  container.replaceChildren()

  if (!bytes.length) {
    container.textContent = "Type a message to create bytes."
    return
  }

  bytes.forEach((byte) => {
    const cell = createElement("span", "byte-cell")
    cell.append(
      createElement(
        "strong",
        "",
        byte.toString(16).padStart(2, "0").toUpperCase()
      ),
      createElement("em", "", String(byte))
    )
    container.append(cell)
  })
}

function renderChecksumLab(tool, state) {
  const message = String(state.message ?? "").slice(0, 18)
  const receivedMessage = String(state.receivedMessage ?? message).slice(0, 18)
  const senderBytes = getByteValues(message)
  const receiverBytes = getByteValues(receivedMessage)
  const senderChecksum = getChecksum(senderBytes)
  const receiverChecksum = getChecksum(receiverBytes)
  const matches = senderChecksum === receiverChecksum
  const input = tool.querySelector("[data-role='checksum-message']")

  state.message = message
  state.receivedMessage = receivedMessage

  if (input && input.value !== message) {
    input.value = message
  }

  renderByteStrip(tool.querySelector("[data-role='sender-bytes']"), senderBytes)
  renderByteStrip(
    tool.querySelector("[data-role='receiver-bytes']"),
    receiverBytes
  )

  setText(tool, "sender-checksum", senderChecksum.toString())
  setText(tool, "receiver-checksum", receiverChecksum.toString())
  setText(tool, "checksum-result", matches ? "Match" : "Mismatch")
  setText(tool, "checksum-status", matches ? "Pass" : "Error")
  setText(
    tool,
    "checksum-note",
    matches
      ? "The recalculated checksum matches the transmitted checksum, so no " +
          "checksum error is detected."
      : "The recalculated checksum is different, so the receiver should " +
          "treat the data as corrupted."
  )
}

function saveAndRenderChecksumLab(tool, state) {
  writeStorage(CHECKSUM_STORAGE_KEY, state)
  renderChecksumLab(tool, state)
}

function corruptMessage(message) {
  if (!message) {
    return "X"
  }

  const characters = message.split("")
  const index = Math.min(1, characters.length - 1)
  characters[index] =
    characters[index] === "Z"
      ? "A"
      : String.fromCharCode(characters[index].charCodeAt(0) + 1)

  return characters.join("")
}

function initChecksumLab() {
  const tool = document.querySelector("[data-role='checksum-lab']")

  if (!tool) {
    return
  }

  const state = {
    ...DEFAULT_CHECKSUM_STATE,
    ...readStorage(CHECKSUM_STORAGE_KEY, DEFAULT_CHECKSUM_STATE),
  }

  tool
    .querySelector("[data-role='checksum-message']")
    ?.addEventListener("input", (event) => {
      state.message = event.target.value
      state.receivedMessage = event.target.value
      saveAndRenderChecksumLab(tool, state)
    })

  tool
    .querySelector("[data-action='corrupt-checksum-message']")
    ?.addEventListener("click", () => {
      state.receivedMessage = corruptMessage(
        state.receivedMessage ?? state.message
      )
      saveAndRenderChecksumLab(tool, state)
    })

  tool
    .querySelector("[data-action='reset-checksum-message']")
    ?.addEventListener("click", () => {
      state.receivedMessage = state.message
      saveAndRenderChecksumLab(tool, state)
    })

  renderChecksumLab(tool, state)
}

initLessonPage(lessonConfig)
initParityLab()
initChecksumLab()
