import { initLessonPage } from "../core/lesson-shell.js"
import { readStorage, writeStorage } from "../core/storage.js"

const lessonConfig = {
  lessonId:
    "transmission-methods-synchronous-asynchronous-serial-and-parallel",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-e",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Communication channels and connection methods",
        description: "Previous in E1 Transmitting data.",
        status: "Live",
        href: "../topics/communication-channels-and-connection-methods.html",
      },
      next: {
        title: "Packet data, packet switching, and protocols",
        description: "Next in E1 Transmitting data.",
        status: "Live",
        href: "../topics/packet-data-packet-switching-and-protocols.html",
      },
    },
  },
  quiz: {
    storageKey:
      "lesson-transmission-methods-synchronous-asynchronous-serial-and-parallel-quiz",
    passScore: 4,
    version: 2,
  },
  examPractice: {
    storageKey:
      "lesson-transmission-methods-synchronous-asynchronous-serial-and-parallel-exam-practice",
  },
}

const VIEWER_STORAGE_KEY = "lesson-transmission-method-viewer"

const VIEWER_MODES = {
  synchronous: {
    label: "Synchronous",
    type: "Timing method",
    heading: "Synchronous transmission",
    best: "Continuous streams",
    caution: "Needs timing agreement",
    note:
      "Sender and receiver use shared timing so the stream can be read in step.",
    rows: [
      { label: "clock", kind: "clock", values: ["tick", "tick", "tick", "tick"] },
      { label: "data", kind: "bits", values: ["1", "0", "1", "1"] },
    ],
  },
  asynchronous: {
    label: "Asynchronous",
    type: "Timing method",
    heading: "Asynchronous transmission",
    best: "Irregular bursts",
    caution: "Extra framing overhead",
    note:
      "Each unit can be framed with start and stop control so the receiver can find it.",
    rows: [
      {
        label: "frame",
        kind: "frame",
        values: ["start", "1", "0", "1", "1", "stop"],
      },
    ],
  },
  serial: {
    label: "Serial",
    type: "Data path method",
    heading: "Serial transmission",
    best: "Longer links",
    caution: "One bit path at a time",
    note:
      "Bits follow one another along one path, which makes alignment easier over distance.",
    rows: [
      { label: "wire", kind: "serial", values: ["1", "0", "1", "1"] },
    ],
  },
  parallel: {
    label: "Parallel",
    type: "Data path method",
    heading: "Parallel transmission",
    best: "Short fast links",
    caution: "Timing skew between lines",
    note:
      "Several bits travel at once, but the lines must stay closely synchronised.",
    rows: [
      { label: "line 1", kind: "parallel", values: ["1"] },
      { label: "line 2", kind: "parallel", values: ["0"] },
      { label: "line 3", kind: "parallel", values: ["1"] },
      { label: "line 4", kind: "parallel", values: ["1"] },
    ],
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

function getModeKey(value) {
  return Object.prototype.hasOwnProperty.call(VIEWER_MODES, value)
    ? value
    : "synchronous"
}

function setText(root, role, value) {
  const element = root.querySelector(`[data-role='${role}']`)

  if (element) {
    element.textContent = value
  }
}

function renderViewerRow(row) {
  const rowElement = createElement(
    "div",
    `viewer-row viewer-row--${row.kind}`
  )
  const label = createElement("span", "viewer-label", row.label)
  rowElement.append(label)

  if (row.kind === "serial") {
    row.values.forEach((value) => {
      rowElement.append(createElement("span", "viewer-line"))
      rowElement.append(createElement("span", "viewer-bit", value))
    })
    return rowElement
  }

  if (row.kind === "parallel") {
    rowElement.append(createElement("span", "viewer-line"))
    rowElement.append(createElement("span", "viewer-bit", row.values[0]))
    return rowElement
  }

  row.values.forEach((value) => {
    const className =
      value === "start" || value === "stop"
        ? "viewer-bit control-bit"
        : "viewer-bit"
    rowElement.append(createElement("span", className, value))
  })

  return rowElement
}

function renderViewer(viewer, modeKey) {
  const safeKey = getModeKey(modeKey)
  const mode = VIEWER_MODES[safeKey]
  const buttonContainer = viewer.querySelector("[data-role='viewer-buttons']")
  const diagram = viewer.querySelector("[data-role='viewer-diagram']")

  if (buttonContainer && buttonContainer.children.length === 0) {
    Object.entries(VIEWER_MODES).forEach(([key, item]) => {
      const button = createElement("button", "viewer-button", item.label)
      button.type = "button"
      button.dataset.viewerMode = key
      button.addEventListener("click", () => {
        writeStorage(VIEWER_STORAGE_KEY, { mode: key })
        renderViewer(viewer, key)
      })
      buttonContainer.append(button)
    })
  }

  viewer.querySelectorAll("[data-viewer-mode]").forEach((button) => {
    const isSelected = button.dataset.viewerMode === safeKey
    button.classList.toggle("is-selected", isSelected)
    button.setAttribute("aria-pressed", isSelected ? "true" : "false")
  })

  if (diagram) {
    diagram.replaceChildren(...mode.rows.map((row) => renderViewerRow(row)))
  }

  setText(viewer, "viewer-heading", mode.heading)
  setText(viewer, "viewer-type", mode.type)
  setText(viewer, "viewer-best", mode.best)
  setText(viewer, "viewer-caution", mode.caution)
  setText(viewer, "viewer-note", mode.note)
}

function initTransmissionViewer() {
  const viewer = document.querySelector("[data-role='transmission-viewer']")

  if (!viewer) {
    return
  }

  const savedState = readStorage(VIEWER_STORAGE_KEY, {
    mode: "synchronous",
  })

  renderViewer(viewer, savedState?.mode)
}

initLessonPage(lessonConfig)
initTransmissionViewer()
