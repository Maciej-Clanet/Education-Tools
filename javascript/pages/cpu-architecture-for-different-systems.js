import { initLessonPage } from "../core/lesson-shell.js"
import { readStorage, writeStorage } from "../core/storage.js"

const lessonConfig = {
  lessonId: "cpu-architecture-for-different-systems",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-b",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Pipelining, multi-processing, and multi-threading",
        description: "Previous in B2 The concepts of microarchitecture.",
        status: "Live",
        href: "../topics/pipelining-multi-processing-and-multi-threading.html",
      },
      next: {
        title: "Registers and their functions",
        description: "Next in B3 Registers and register handling.",
        status: "Live",
        href: "../topics/registers-and-their-functions.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-cpu-architecture-for-different-systems-quiz",
    passScore: 4,
  },
  examPractice: {
    storageKey: "lesson-cpu-architecture-for-different-systems-exam-practice",
  },
}

const ARCHITECTURE_CHOOSER_STORAGE_KEY =
  "lesson-cpu-architecture-for-different-systems-chooser"

const ARCHITECTURE_SCENARIOS = {
  sensor: {
    title: "Battery sensor",
    architecture: "Embedded and mobile",
    summary:
      "Use an embedded or mobile-focused CPU because the device has strict limits on power, heat, and physical space.",
    justification:
      "Low power use extends battery life and low heat helps the small enclosure stay safe and reliable.",
    tradeoff:
      "It may have lower peak performance than a larger desktop or server CPU.",
    priorities: [
      { label: "Power efficiency", value: 94 },
      { label: "Low heat", value: 88 },
      { label: "Peak throughput", value: 28 },
    ],
  },
  tablet: {
    title: "Student tablet",
    architecture: "Mobile CPU architecture",
    summary:
      "Use a mobile CPU design because the device needs battery life, compact integration, and smooth everyday performance.",
    justification:
      "A system-on-chip can combine CPU, graphics, and controllers while keeping power use and heat manageable.",
    tradeoff:
      "Sustained heavy performance may be reduced when the device needs to protect battery life or avoid overheating.",
    priorities: [
      { label: "Battery life", value: 86 },
      { label: "Responsiveness", value: 74 },
      { label: "Sustained throughput", value: 46 },
    ],
  },
  desktop: {
    title: "Classroom desktop",
    architecture: "Microcomputer CPU architecture",
    summary:
      "Use a microcomputer CPU because the system needs balanced general-purpose performance at a sensible cost.",
    justification:
      "The CPU should run browsers, office tools, coding software, and media tasks without needing server-level hardware.",
    tradeoff:
      "It will not usually match a server CPU for large multi-user workloads or very high memory capacity.",
    priorities: [
      { label: "General purpose speed", value: 80 },
      { label: "Cost balance", value: 78 },
      { label: "Reliability at scale", value: 52 },
    ],
  },
  server: {
    title: "Company server",
    architecture: "Server CPU architecture",
    summary:
      "Use a server CPU because the system must support many users, shared services, and sustained throughput.",
    justification:
      "Many cores, large memory support, and reliability features help keep services responsive during heavy use.",
    tradeoff:
      "Server CPUs can cost more and use more power than a desktop or mobile CPU.",
    priorities: [
      { label: "Throughput", value: 94 },
      { label: "Reliability", value: 90 },
      { label: "Low power use", value: 42 },
    ],
  },
}

function normaliseChooserState(value) {
  const scenario = Object.prototype.hasOwnProperty.call(
    ARCHITECTURE_SCENARIOS,
    value?.scenario
  )
    ? value.scenario
    : "sensor"

  return { scenario }
}

function createPriorityBar(priority) {
  const bar = document.createElement("div")
  bar.className = "chooser-priority-bar"

  const label = document.createElement("span")
  label.textContent = priority.label

  const track = document.createElement("span")
  track.className = "chooser-priority-track"

  const fill = document.createElement("span")
  fill.className = "chooser-priority-fill"
  fill.style.width = `${priority.value}%`

  const value = document.createElement("strong")
  value.textContent = `${priority.value}%`

  track.append(fill)
  bar.append(label, track, value)
  return bar
}

function initArchitectureChooser() {
  const chooser = document.querySelector("[data-role='architecture-chooser']")

  if (!chooser) {
    return
  }

  const scenarioButtons = chooser.querySelectorAll("[data-architecture-scenario]")
  const type = chooser.querySelector("[data-role='architecture-result-type']")
  const title = chooser.querySelector("[data-role='architecture-result-title']")
  const summary = chooser.querySelector("[data-role='architecture-result-summary']")
  const justification = chooser.querySelector(
    "[data-role='architecture-result-justification']"
  )
  const tradeoff = chooser.querySelector("[data-role='architecture-result-tradeoff']")
  const priorityBars = chooser.querySelector(
    "[data-role='architecture-priority-bars']"
  )

  let state = normaliseChooserState(
    readStorage(ARCHITECTURE_CHOOSER_STORAGE_KEY, { scenario: "sensor" })
  )

  function saveState() {
    writeStorage(ARCHITECTURE_CHOOSER_STORAGE_KEY, state)
  }

  function render() {
    const scenario = ARCHITECTURE_SCENARIOS[state.scenario]

    scenarioButtons.forEach((button) => {
      const isActive = button.dataset.architectureScenario === state.scenario
      button.classList.toggle("is-active", isActive)
      button.setAttribute("aria-pressed", isActive ? "true" : "false")
    })

    if (type) {
      type.textContent = scenario.architecture
    }

    if (title) {
      title.textContent = scenario.title
    }

    if (summary) {
      summary.textContent = scenario.summary
    }

    if (justification) {
      justification.textContent = scenario.justification
    }

    if (tradeoff) {
      tradeoff.textContent = scenario.tradeoff
    }

    priorityBars?.replaceChildren(
      ...scenario.priorities.map((priority) => createPriorityBar(priority))
    )
  }

  scenarioButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const scenario = button.dataset.architectureScenario

      if (!Object.prototype.hasOwnProperty.call(ARCHITECTURE_SCENARIOS, scenario)) {
        return
      }

      state = { scenario }
      saveState()
      render()
    })
  })

  render()
}

initLessonPage(lessonConfig)
initArchitectureChooser()
