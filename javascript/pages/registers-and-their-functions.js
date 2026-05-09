import { initLessonPage } from "../core/lesson-shell.js"
import { readStorage, writeStorage } from "../core/storage.js"

const lessonConfig = {
  lessonId: "registers-and-their-functions",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-b",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "CPU architecture for different systems",
        description: "Previous in B2 The concepts of microarchitecture.",
        status: "Live",
        href: "../topics/cpu-architecture-for-different-systems.html",
      },
      next: {
        title: "Interrupts and register handling",
        description: "Next in B3 Registers and register handling.",
        status: "Live",
        href: "../topics/interrupts-and-register-handling.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-registers-and-their-functions-quiz",
    passScore: 4,
  },
  examPractice: {
    storageKey: "lesson-registers-and-their-functions-exam-practice",
  },
}

const REGISTER_INSPECTOR_STORAGE_KEY =
  "lesson-registers-and-their-functions-inspector"

const REGISTER_DETAILS = {
  pc: {
    name: "Program counter",
    kind: "Special purpose",
    holds: "The address of the next instruction to fetch.",
    use: "The CPU begins the next fetch stage of the instruction cycle.",
    example: "200",
    trap: "The PC holds an address, not the instruction itself.",
  },
  mar: {
    name: "Memory address register",
    kind: "Special purpose",
    holds: "The memory address currently being read from or written to.",
    use: "The CPU needs to access a specific location in main memory.",
    example: "200 or 14",
    trap: "The MAR holds the address, not the data stored at that address.",
  },
  mdr: {
    name: "Memory data register",
    kind: "Special purpose",
    holds: "The data or instruction being transferred to or from memory.",
    use: "A value is moving between the CPU and main memory.",
    example: "LOAD 12 or 8",
    trap: "The MDR holds the moving value, not the memory location.",
  },
  ir: {
    name: "Instruction register",
    kind: "Special purpose",
    holds: "The current instruction while it is decoded or executed.",
    use: "The control unit needs to interpret the instruction.",
    example: "ADD 13",
    trap: "The instruction register is for the current instruction, not the next instruction address.",
  },
  acc: {
    name: "Accumulator",
    kind: "Special purpose",
    holds: "Intermediate arithmetic or logic results.",
    use: "The ALU carries out a calculation and needs somewhere to keep the result.",
    example: "8",
    trap: "The accumulator is not mainly for addresses; link it to calculation results.",
  },
  gpr: {
    name: "General purpose register",
    kind: "General purpose",
    holds: "Temporary values, operands, or intermediate data used by a program.",
    use: "The CPU needs flexible working storage for active data.",
    example: "Value 5, counter 3, or a copied operand",
    trap: "A general purpose register is flexible, so do not give it one fixed special job.",
  },
}

function normaliseInspectorState(value) {
  const register = Object.prototype.hasOwnProperty.call(
    REGISTER_DETAILS,
    value?.register
  )
    ? value.register
    : "pc"

  return { register }
}

function initRegisterInspector() {
  const inspector = document.querySelector("[data-role='register-inspector']")

  if (!inspector) {
    return
  }

  const buttons = inspector.querySelectorAll("[data-register-choice]")
  const kind = inspector.querySelector("[data-role='register-kind']")
  const name = inspector.querySelector("[data-role='register-name']")
  const holds = inspector.querySelector("[data-role='register-holds']")
  const use = inspector.querySelector("[data-role='register-use']")
  const example = inspector.querySelector("[data-role='register-example']")
  const trap = inspector.querySelector("[data-role='register-trap']")

  let state = normaliseInspectorState(
    readStorage(REGISTER_INSPECTOR_STORAGE_KEY, { register: "pc" })
  )

  function saveState() {
    writeStorage(REGISTER_INSPECTOR_STORAGE_KEY, state)
  }

  function render() {
    const details = REGISTER_DETAILS[state.register]

    buttons.forEach((button) => {
      const isActive = button.dataset.registerChoice === state.register
      button.classList.toggle("is-active", isActive)
      button.setAttribute("aria-pressed", isActive ? "true" : "false")
    })

    if (kind) {
      kind.textContent = details.kind
    }

    if (name) {
      name.textContent = details.name
    }

    if (holds) {
      holds.textContent = details.holds
    }

    if (use) {
      use.textContent = details.use
    }

    if (example) {
      example.textContent = details.example
    }

    if (trap) {
      trap.textContent = details.trap
    }
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const register = button.dataset.registerChoice

      if (!Object.prototype.hasOwnProperty.call(REGISTER_DETAILS, register)) {
        return
      }

      state = { register }
      saveState()
      render()
    })
  })

  render()
}

initLessonPage(lessonConfig)
initRegisterInspector()
