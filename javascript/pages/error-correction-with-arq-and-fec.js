import { initLessonPage } from "../core/lesson-shell.js"
import { readStorage, writeStorage } from "../core/storage.js"

const lessonConfig = {
  lessonId: "error-correction-with-arq-and-fec",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-e",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Error detection methods",
        description: "Previous in E2 Error detection.",
        status: "Live",
        href: "../topics/error-detection-methods.html",
      },
      next: {
        title: "Boolean logic",
        description: "Next in F1 Boolean logic.",
        status: "Live",
        href: "../topics/boolean-logic.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-error-correction-with-arq-and-fec-quiz",
    passScore: 4,
    version: 1,
  },
  examPractice: {
    storageKey: "lesson-error-correction-with-arq-and-fec-exam-practice",
  },
}

const SIM_STORAGE_KEY = "lesson-error-correction-simulator"
const DEFAULT_SIM_STATE = {
  scenario: "file",
  method: "arq",
  severity: 2,
}
const SCENARIOS = {
  file: {
    title: "File transfer",
    feedback: "Available",
    feedbackScore: 3,
    delaySensitivity: 1,
    arqFit: "Strong fit",
    fecFit: "Works, but extra overhead",
    arqNote:
      "ARQ is a strong fit because the receiver can send ACK/NAK messages " +
      "and the transfer can wait for a clean block.",
    fecNote:
      "FEC can work, but it sends extra redundancy even when a simple resend would be acceptable.",
  },
  stream: {
    title: "Live stream",
    feedback: "Impractical",
    feedbackScore: 1,
    delaySensitivity: 3,
    arqFit: "Weak fit",
    fecFit: "Strong fit",
    arqNote:
      "ARQ is weak here because waiting for resends can interrupt live " +
      "playback and many receivers may need different blocks resent.",
    fecNote:
      "FEC is a strong fit because viewers can repair some errors " +
      "immediately without waiting for another copy.",
  },
  satellite: {
    title: "Satellite link",
    feedback: "Very slow",
    feedbackScore: 2,
    delaySensitivity: 3,
    arqFit: "Possible but slow",
    fecFit: "Strong fit",
    arqNote:
      "ARQ can be used, but the long round trip delay makes each resend expensive.",
    fecNote:
      "FEC is often suitable because extra redundancy can avoid waiting " +
      "through a long return path.",
  },
  sensor: {
    title: "Remote sensor",
    feedback: "Unreliable",
    feedbackScore: 1,
    delaySensitivity: 2,
    arqFit: "Risky fit",
    fecFit: "Good fit",
    arqNote:
      "ARQ is risky if the return path is unreliable because resend " +
      "requests or ACKs may not get back.",
    fecNote:
      "FEC is useful when the receiver needs to recover small readings " +
      "without relying on a dependable return message.",
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

function setText(root, role, text) {
  const element = root.querySelector(`[data-role='${role}']`)

  if (element) {
    element.textContent = text
  }
}

function normaliseScenario(value) {
  return SCENARIOS[value] ? value : DEFAULT_SIM_STATE.scenario
}

function normaliseMethod(value) {
  return value === "fec" ? "fec" : "arq"
}

function normaliseSeverity(value) {
  const parsed = Number(value)

  if (!Number.isFinite(parsed)) {
    return DEFAULT_SIM_STATE.severity
  }

  return clamp(Math.trunc(parsed), 1, 3)
}

function getTimelineSteps(scenario, method, severity) {
  const canArqRecover = scenario.feedbackScore >= 2
  const fecCanRecover = severity < 3

  if (method === "arq") {
    return [
      {
        label: "1",
        title: "Block sent",
        detail: "The sender transmits the data block.",
        state: "normal",
      },
      {
        label: "2",
        title: "Error detected",
        detail: "The receiver spots that the block is damaged.",
        state: "error",
      },
      {
        label: "3",
        title: canArqRecover ? "Feedback returns" : "Feedback is a problem",
        detail: canArqRecover
          ? "ACK/NAK or timeout information reaches the sender."
          : "The return path is missing, unreliable, or too slow.",
        state: canArqRecover ? "normal" : "warning",
      },
      {
        label: "4",
        title: canArqRecover ? "Retransmit" : "Recovery delayed",
        detail: canArqRecover
          ? "The sender sends another copy of the damaged block."
          : "The receiver cannot quickly get a clean replacement.",
        state: canArqRecover ? "success" : "warning",
      },
    ]
  }

  return [
    {
      label: "1",
      title: "Data plus redundancy sent",
      detail: "The sender includes extra correction information.",
      state: "normal",
    },
    {
      label: "2",
      title: "Error detected",
      detail: "The receiver identifies that part of the data is damaged.",
      state: "error",
    },
    {
      label: "3",
      title: fecCanRecover ? "Redundancy used" : "Too much damage",
      detail: fecCanRecover
        ? "The receiver uses the redundant bits to rebuild the value."
        : "The error is beyond what the redundant data can repair.",
      state: fecCanRecover ? "normal" : "warning",
    },
    {
      label: "4",
      title: fecCanRecover ? "Corrected immediately" : "Correction fails",
      detail: fecCanRecover
        ? "No resend is needed, so delay stays low."
        : "The receiver would need another recovery strategy.",
      state: fecCanRecover ? "success" : "warning",
    },
  ]
}

function getRatings(scenario, method, severity) {
  if (method === "arq") {
    return {
      feedback: scenario.feedback,
      delay:
        scenario.delaySensitivity >= 3
          ? "High"
          : scenario.feedbackScore >= 3
            ? "Low"
            : "Medium",
      overhead: severity >= 3 ? "Several resends" : "Low",
      verdict: scenario.arqFit,
      note: scenario.arqNote,
    }
  }

  return {
    feedback: "Not required",
    delay: severity >= 3 ? "May fail" : "Low",
    overhead: severity >= 3 ? "High redundancy needed" : "Extra redundancy",
    verdict: scenario.fecFit,
    note:
      severity >= 3
        ? `${scenario.fecNote} However, severe errors may exceed what the ` +
          "forward error correction data can repair."
        : scenario.fecNote,
  }
}

function renderTimeline(container, steps) {
  container.replaceChildren()

  steps.forEach((step) => {
    const card = createElement("article", "timeline-card")
    card.dataset.state = step.state
    card.append(
      createElement("span", "", step.label),
      createElement("strong", "", step.title),
      createElement("p", "", step.detail)
    )
    container.append(card)
  })
}

function renderSimulator(tool, state) {
  const scenarioKey = normaliseScenario(state.scenario)
  const method = normaliseMethod(state.method)
  const severity = normaliseSeverity(state.severity)
  const scenario = SCENARIOS[scenarioKey]
  const ratings = getRatings(scenario, method, severity)
  const slider = tool.querySelector("[data-role='error-severity']")

  state.scenario = scenarioKey
  state.method = method
  state.severity = severity

  tool.querySelectorAll("[data-scenario]").forEach((button) => {
    const isSelected = button.dataset.scenario === scenarioKey
    button.classList.toggle("is-selected", isSelected)
    button.setAttribute("aria-pressed", String(isSelected))
  })

  tool.querySelectorAll("[data-method]").forEach((button) => {
    const isSelected = button.dataset.method === method
    button.classList.toggle("is-selected", isSelected)
    button.setAttribute("aria-pressed", String(isSelected))
  })

  if (slider) {
    slider.value = severity.toString()
  }

  renderTimeline(
    tool.querySelector("[data-role='correction-timeline']"),
    getTimelineSteps(scenario, method, severity)
  )
  setText(tool, "sim-verdict", ratings.verdict)
  setText(tool, "feedback-rating", ratings.feedback)
  setText(tool, "delay-rating", ratings.delay)
  setText(tool, "overhead-rating", ratings.overhead)
  setText(tool, "sim-note", `${scenario.title}: ${ratings.note}`)
}

function initCorrectionSimulator() {
  const tool = document.querySelector("[data-role='correction-simulator']")

  if (!tool) {
    return
  }

  const state = {
    ...DEFAULT_SIM_STATE,
    ...readStorage(SIM_STORAGE_KEY, DEFAULT_SIM_STATE),
  }

  function saveAndRender() {
    writeStorage(SIM_STORAGE_KEY, state)
    renderSimulator(tool, state)
  }

  tool.querySelectorAll("[data-scenario]").forEach((button) => {
    button.addEventListener("click", () => {
      state.scenario = button.dataset.scenario
      saveAndRender()
    })
  })

  tool.querySelectorAll("[data-method]").forEach((button) => {
    button.addEventListener("click", () => {
      state.method = button.dataset.method
      saveAndRender()
    })
  })

  tool
    .querySelector("[data-role='error-severity']")
    ?.addEventListener("input", (event) => {
      state.severity = event.target.value
      saveAndRender()
    })

  renderSimulator(tool, state)
}

initLessonPage(lessonConfig)
initCorrectionSimulator()
