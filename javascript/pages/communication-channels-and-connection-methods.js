import { initLessonPage } from "../core/lesson-shell.js"
import { readStorage, writeStorage } from "../core/storage.js"

const lessonConfig = {
  lessonId: "communication-channels-and-connection-methods",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-e",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Multi-dimensional arrays and memory order",
        description: "Previous in D2 Indices and matrices.",
        status: "Live",
        href: "../topics/multi-dimensional-arrays-and-memory-order.html",
      },
      next: {
        title:
          "Transmission methods: synchronous, asynchronous, serial, and parallel",
        description: "Next in E1 Transmitting data.",
        status: "Live",
        href: "../topics/transmission-methods-synchronous-asynchronous-serial-and-parallel.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-communication-channels-and-connection-methods-quiz",
    passScore: 4,
    version: 2,
  },
  examPractice: {
    storageKey:
      "lesson-communication-channels-and-connection-methods-exam-practice",
  },
}

const SCENARIO_STORAGE_KEY = "lesson-communication-scenario-tool"

const SCENARIOS = {
  classroom: {
    label: "Classroom PCs",
    need: "Stable fixed access",
    method: "Ethernet cable",
    channel: "Full-duplex point-to-point through a switch",
    reasons: [
      "The PCs stay in one place, so a cable will not restrict users.",
      "Switched Ethernet gives each device a stable, predictable link.",
      "It is usually less affected by wireless interference than Wi-Fi.",
    ],
  },
  warehouse: {
    label: "Warehouse scanners",
    need: "Mobility across aisles",
    method: "Wi-Fi",
    channel: "Wireless full-duplex network access",
    reasons: [
      "Staff need to move, so a fixed cable would be impractical.",
      "Wi-Fi can cover a wider working area than Bluetooth.",
      "Security and coverage planning are still needed for reliability.",
    ],
  },
  backbone: {
    label: "Building backbone",
    need: "High bandwidth over distance",
    method: "Fibre optic",
    channel: "Point-to-point backbone link",
    reasons: [
      "Fibre supports high data rates over longer cable runs.",
      "It is less affected by electromagnetic interference than copper cable.",
      "The higher installation cost can be justified for a critical backbone.",
    ],
  },
  sensors: {
    label: "Factory sensors",
    need: "Many low-rate devices",
    method: "Multi-drop sensor bus",
    channel: "Multi-drop shared path",
    reasons: [
      "Many sensors can share one communication path.",
      "This can reduce cabling for simple low-rate readings.",
      "Access must be controlled so devices do not transmit over each other.",
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

function getScenarioKey(value) {
  return Object.prototype.hasOwnProperty.call(SCENARIOS, value)
    ? value
    : "classroom"
}

function setText(root, role, value) {
  const element = root.querySelector(`[data-role='${role}']`)

  if (element) {
    element.textContent = value
  }
}

function renderScenario(tool, scenarioKey) {
  const safeKey = getScenarioKey(scenarioKey)
  const scenario = SCENARIOS[safeKey]
  const buttonContainer = tool.querySelector("[data-role='scenario-buttons']")
  const reasonList = tool.querySelector("[data-role='scenario-reasons']")

  if (buttonContainer && buttonContainer.children.length === 0) {
    Object.entries(SCENARIOS).forEach(([key, item]) => {
      const button = createElement("button", "scenario-button", item.label)
      button.type = "button"
      button.dataset.scenario = key
      button.addEventListener("click", () => {
        writeStorage(SCENARIO_STORAGE_KEY, { scenario: key })
        renderScenario(tool, key)
      })
      buttonContainer.append(button)
    })
  }

  tool.querySelectorAll("[data-scenario]").forEach((button) => {
    const isSelected = button.dataset.scenario === safeKey
    button.classList.toggle("is-selected", isSelected)
    button.setAttribute("aria-pressed", isSelected ? "true" : "false")
  })

  if (reasonList) {
    reasonList.replaceChildren(
      ...scenario.reasons.map((reason) => createElement("li", "", reason))
    )
  }

  setText(tool, "scenario-pill", scenario.label)
  setText(tool, "scenario-need", scenario.need)
  setText(tool, "scenario-method", scenario.method)
  setText(tool, "scenario-channel", scenario.channel)
}

function initScenarioTool() {
  const tool = document.querySelector("[data-role='scenario-tool']")

  if (!tool) {
    return
  }

  const savedState = readStorage(SCENARIO_STORAGE_KEY, {
    scenario: "classroom",
  })

  renderScenario(tool, savedState?.scenario)
}

initLessonPage(lessonConfig)
initScenarioTool()
