import { initLessonPage } from "../core/lesson-shell.js"
import { readStorage, writeStorage } from "../core/storage.js"

const lessonConfig = {
  lessonId: "interrupts-and-register-handling",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-b",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Registers and their functions",
        description: "Previous in B3 Registers and register handling.",
        status: "Live",
        href: "../topics/registers-and-their-functions.html",
      },
      next: {
        title: "Units of digital data",
        description: "Next in C1 Number systems.",
        status: "Live",
        href: "../topics/units-of-digital-data.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-interrupts-and-register-handling-quiz",
    passScore: 4,
  },
  examPractice: {
    storageKey: "lesson-interrupts-and-register-handling-exam-practice",
  },
}

const INTERRUPT_SIMULATOR_STORAGE_KEY =
  "lesson-interrupts-and-register-handling-simulator"

const REGISTER_NAMES = ["PC", "ACC", "IR", "MAR", "MDR"]

const INTERRUPT_STEPS = [
  {
    stage: "Running",
    status: "The original program is running normally.",
    explanation:
      "The CPU has active values in registers. If these are lost, the calculation cannot resume correctly.",
    live: {
      PC: "204",
      ACC: "8",
      IR: "ADD 13",
      MAR: "13",
      MDR: "3",
    },
    saved: {},
    active: ["PC", "ACC", "IR"],
  },
  {
    stage: "Interrupt",
    status: "A keyboard interrupt arrives and asks for CPU attention.",
    explanation:
      "The CPU pauses the current task, but it must protect the task before running interrupt-handling code.",
    live: {
      PC: "204",
      ACC: "8",
      IR: "ADD 13",
      MAR: "13",
      MDR: "3",
    },
    saved: {},
    active: ["PC"],
  },
  {
    stage: "Save state",
    status: "The current register state is copied into a safe saved context.",
    explanation:
      "The saved context records the return point and active values needed to continue the interrupted program later.",
    live: {
      PC: "204",
      ACC: "8",
      IR: "ADD 13",
      MAR: "13",
      MDR: "3",
    },
    saved: {
      PC: "204",
      ACC: "8",
      IR: "ADD 13",
      MAR: "13",
      MDR: "3",
    },
    active: ["PC", "ACC", "IR", "MAR", "MDR"],
    savedActive: ["PC", "ACC", "IR", "MAR", "MDR"],
  },
  {
    stage: "Service routine",
    status: "The CPU runs the keyboard interrupt service routine.",
    explanation:
      "The live registers can now change because the CPU is doing interrupt work. The original values remain safe in the saved context.",
    live: {
      PC: "900",
      ACC: "key=A",
      IR: "READ KEY",
      MAR: "keyboard buffer",
      MDR: "A",
    },
    saved: {
      PC: "204",
      ACC: "8",
      IR: "ADD 13",
      MAR: "13",
      MDR: "3",
    },
    active: ["PC", "ACC", "IR", "MDR"],
    savedActive: [],
  },
  {
    stage: "Restore state",
    status: "The saved register values are restored after the interrupt is handled.",
    explanation:
      "Restoring the saved context puts the CPU back into the state it had before the interrupt routine changed the registers.",
    live: {
      PC: "204",
      ACC: "8",
      IR: "ADD 13",
      MAR: "13",
      MDR: "3",
    },
    saved: {
      PC: "204",
      ACC: "8",
      IR: "ADD 13",
      MAR: "13",
      MDR: "3",
    },
    active: ["PC", "ACC", "IR", "MAR", "MDR"],
    savedActive: ["PC", "ACC", "IR", "MAR", "MDR"],
  },
  {
    stage: "Resume",
    status: "The original program resumes from the correct point.",
    explanation:
      "Because the register state was restored, the interrupted calculation can continue with the correct values.",
    live: {
      PC: "204",
      ACC: "8",
      IR: "ADD 13",
      MAR: "13",
      MDR: "3",
    },
    saved: {},
    active: ["PC", "ACC"],
  },
]

function normaliseInterruptState(value) {
  const stepIndex = Number.isInteger(value?.stepIndex) ? value.stepIndex : 0

  return {
    stepIndex: Math.min(Math.max(stepIndex, 0), INTERRUPT_STEPS.length - 1),
  }
}

function createRegisterTile(name, value, activeNames = []) {
  const tile = document.createElement("article")
  tile.className = "sim-register-tile"
  tile.classList.toggle("is-active", activeNames.includes(name))

  const label = document.createElement("strong")
  label.textContent = name

  const content = document.createElement("span")
  content.textContent = value ?? "Not saved"

  tile.append(label, content)
  return tile
}

function createStepMarker(step, index, currentIndex) {
  const marker = document.createElement("article")
  marker.className = "interrupt-step-marker"
  marker.classList.toggle("is-current", index === currentIndex)
  marker.classList.toggle("is-complete", index < currentIndex)

  const number = document.createElement("strong")
  number.textContent = `${index + 1}`

  const label = document.createElement("span")
  label.textContent = step.stage

  marker.append(number, label)
  return marker
}

function initInterruptSimulator() {
  const simulator = document.querySelector("[data-role='interrupt-simulator']")

  if (!simulator) {
    return
  }

  const liveRegisters = simulator.querySelector("[data-role='live-registers']")
  const savedRegisters = simulator.querySelector("[data-role='saved-registers']")
  const stepTrack = simulator.querySelector("[data-role='interrupt-step-track']")
  const status = simulator.querySelector("[data-role='interrupt-status']")
  const explanation = simulator.querySelector("[data-role='interrupt-explanation']")
  const counter = simulator.querySelector("[data-role='interrupt-step-counter']")
  const stagePill = simulator.querySelector("[data-role='interrupt-stage-pill']")
  const previousButton = simulator.querySelector(
    "[data-interrupt-action='previous']"
  )
  const nextButton = simulator.querySelector("[data-interrupt-action='next']")

  let state = normaliseInterruptState(
    readStorage(INTERRUPT_SIMULATOR_STORAGE_KEY, { stepIndex: 0 })
  )

  function saveState() {
    writeStorage(INTERRUPT_SIMULATOR_STORAGE_KEY, state)
  }

  function render() {
    const step = INTERRUPT_STEPS[state.stepIndex]

    liveRegisters?.replaceChildren(
      ...REGISTER_NAMES.map((name) =>
        createRegisterTile(name, step.live[name], step.active)
      )
    )

    savedRegisters?.replaceChildren(
      ...REGISTER_NAMES.map((name) =>
        createRegisterTile(name, step.saved[name], step.savedActive)
      )
    )

    stepTrack?.replaceChildren(
      ...INTERRUPT_STEPS.map((item, index) =>
        createStepMarker(item, index, state.stepIndex)
      )
    )

    if (status) {
      status.textContent = step.status
    }

    if (explanation) {
      explanation.textContent = step.explanation
    }

    if (counter) {
      counter.textContent = `Step ${state.stepIndex + 1} of ${
        INTERRUPT_STEPS.length
      }`
    }

    if (stagePill) {
      stagePill.textContent = step.stage
    }

    if (previousButton) {
      previousButton.disabled = state.stepIndex === 0
    }

    if (nextButton) {
      nextButton.disabled = state.stepIndex === INTERRUPT_STEPS.length - 1
    }
  }

  simulator.querySelectorAll("[data-interrupt-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.interruptAction

      if (action === "previous") {
        state = { stepIndex: Math.max(state.stepIndex - 1, 0) }
      }

      if (action === "next") {
        state = {
          stepIndex: Math.min(
            state.stepIndex + 1,
            INTERRUPT_STEPS.length - 1
          ),
        }
      }

      if (action === "reset") {
        state = { stepIndex: 0 }
      }

      saveState()
      render()
    })
  })

  render()
}

initLessonPage(lessonConfig)
initInterruptSimulator()
