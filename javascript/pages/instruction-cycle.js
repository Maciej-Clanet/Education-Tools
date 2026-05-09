import { initLessonPage } from "../core/lesson-shell.js"
import { readStorage, writeStorage } from "../core/storage.js"

const lessonConfig = {
  lessonId: "instruction-cycle",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-b",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Emulation",
        description: "Previous in B1 Approaches to computer architecture.",
        status: "Live",
        href: "../topics/emulation-in-computer-systems.html",
      },
      next: {
        title: "CPU performance, instruction sets, and cache",
        description: "Next in B2 The concepts of microarchitecture.",
        status: "Live",
        href: "../topics/cpu-performance-instruction-sets-and-cache.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-instruction-cycle-quiz",
    passScore: 4,
  },
  examPractice: {
    storageKey: "lesson-instruction-cycle-exam-practice",
  },
}

const SIMULATOR_STORAGE_KEY = "lesson-instruction-cycle-simulator"

const MEMORY_BLUEPRINT = [
  {
    address: "200",
    kind: "Instruction",
    value: "LOAD 12",
    description: "Copy the value at address 12 into the accumulator.",
  },
  {
    address: "201",
    kind: "Instruction",
    value: "ADD 13",
    description: "Add the value at address 13 to the accumulator.",
  },
  {
    address: "202",
    kind: "Instruction",
    value: "STORE 14",
    description: "Store the accumulator value at address 14.",
  },
  {
    address: "12",
    kind: "Data",
    value: "5",
    description: "First value used by the program.",
  },
  {
    address: "13",
    kind: "Data",
    value: "3",
    description: "Second value used by the program.",
  },
  {
    address: "14",
    kind: "Data",
    value: "?",
    description: "Result location. This changes when STORE executes.",
  },
]

const SIMULATOR_STEPS = [
  {
    stage: "fetch",
    label: "Ready",
    pc: "200",
    mar: "-",
    mdr: "-",
    ir: "-",
    acc: "0",
    activeRegisters: ["pc"],
    activeAddresses: ["200"],
    status: "The program counter points to the first instruction.",
    explanation:
      "The CPU has not fetched anything yet. PC = 200 tells it where the next instruction starts.",
  },
  {
    stage: "fetch",
    label: "Fetch 1",
    pc: "200",
    mar: "200",
    mdr: "-",
    ir: "-",
    acc: "0",
    activeRegisters: ["pc", "mar"],
    activeAddresses: ["200"],
    status: "The address in the PC is copied into the MAR.",
    explanation:
      "The MAR now holds 200, so memory can be read at the address of the next instruction.",
  },
  {
    stage: "fetch",
    label: "Fetch 2",
    pc: "201",
    mar: "200",
    mdr: "LOAD 12",
    ir: "-",
    acc: "0",
    activeRegisters: ["pc", "mar", "mdr"],
    activeAddresses: ["200"],
    status: "Memory address 200 is read into the MDR, and the PC moves on.",
    explanation:
      "The fetched instruction is LOAD 12. The PC now points to 201 so the CPU is ready for the next instruction later.",
  },
  {
    stage: "fetch",
    label: "Fetch 3",
    pc: "201",
    mar: "200",
    mdr: "LOAD 12",
    ir: "LOAD 12",
    acc: "0",
    activeRegisters: ["mdr", "ir"],
    activeAddresses: ["200"],
    status: "The instruction in the MDR is copied into the instruction register.",
    explanation:
      "The IR now holds the current instruction. The CPU can decode LOAD 12 next.",
  },
  {
    stage: "decode",
    label: "Decode",
    pc: "201",
    mar: "200",
    mdr: "LOAD 12",
    ir: "LOAD 12",
    acc: "0",
    activeRegisters: ["ir"],
    activeAddresses: ["200", "12"],
    status: "The control unit decodes LOAD 12.",
    explanation:
      "The opcode is LOAD, and the operand is address 12. The CPU now knows it must copy a value from memory into the accumulator.",
  },
  {
    stage: "execute",
    label: "Execute",
    pc: "201",
    mar: "12",
    mdr: "5",
    ir: "LOAD 12",
    acc: "5",
    activeRegisters: ["mar", "mdr", "acc"],
    activeAddresses: ["12"],
    status: "LOAD executes: the value at address 12 is placed in the accumulator.",
    explanation:
      "The accumulator now contains 5. The first instruction is complete.",
  },
  {
    stage: "fetch",
    label: "Ready",
    pc: "201",
    mar: "-",
    mdr: "-",
    ir: "-",
    acc: "5",
    activeRegisters: ["pc", "acc"],
    activeAddresses: ["201"],
    status: "The CPU returns to fetch with PC pointing at address 201.",
    explanation:
      "The next cycle begins. The accumulator keeps the value loaded by the previous instruction.",
  },
  {
    stage: "fetch",
    label: "Fetch 1",
    pc: "201",
    mar: "201",
    mdr: "-",
    ir: "-",
    acc: "5",
    activeRegisters: ["pc", "mar"],
    activeAddresses: ["201"],
    status: "The PC value is copied into the MAR again.",
    explanation:
      "The same fetch pattern repeats, this time for the instruction stored at address 201.",
  },
  {
    stage: "fetch",
    label: "Fetch 2",
    pc: "202",
    mar: "201",
    mdr: "ADD 13",
    ir: "-",
    acc: "5",
    activeRegisters: ["pc", "mar", "mdr"],
    activeAddresses: ["201"],
    status: "The ADD instruction is fetched from memory through the MDR.",
    explanation:
      "The PC has moved to 202 so it points at the next instruction after ADD 13.",
  },
  {
    stage: "fetch",
    label: "Fetch 3",
    pc: "202",
    mar: "201",
    mdr: "ADD 13",
    ir: "ADD 13",
    acc: "5",
    activeRegisters: ["mdr", "ir"],
    activeAddresses: ["201"],
    status: "ADD 13 is copied into the instruction register.",
    explanation:
      "The current instruction is now in the IR and ready to be decoded.",
  },
  {
    stage: "decode",
    label: "Decode",
    pc: "202",
    mar: "201",
    mdr: "ADD 13",
    ir: "ADD 13",
    acc: "5",
    activeRegisters: ["ir", "acc"],
    activeAddresses: ["201", "13"],
    status: "The control unit decodes ADD 13.",
    explanation:
      "The CPU identifies an addition operation using the value stored at address 13.",
  },
  {
    stage: "execute",
    label: "Execute",
    pc: "202",
    mar: "13",
    mdr: "3",
    ir: "ADD 13",
    acc: "8",
    activeRegisters: ["mar", "mdr", "acc"],
    activeAddresses: ["13"],
    status: "ADD executes: 3 is added to the accumulator value 5.",
    explanation:
      "The accumulator now contains 8. This is the result that will be stored by the next instruction.",
  },
  {
    stage: "fetch",
    label: "Ready",
    pc: "202",
    mar: "-",
    mdr: "-",
    ir: "-",
    acc: "8",
    activeRegisters: ["pc", "acc"],
    activeAddresses: ["202"],
    status: "The CPU begins the next cycle at address 202.",
    explanation:
      "The PC points to STORE 14 while the accumulator keeps the current result, 8.",
  },
  {
    stage: "fetch",
    label: "Fetch 1",
    pc: "202",
    mar: "202",
    mdr: "-",
    ir: "-",
    acc: "8",
    activeRegisters: ["pc", "mar"],
    activeAddresses: ["202"],
    status: "The address 202 is copied from the PC into the MAR.",
    explanation:
      "The CPU is preparing to read the next instruction from memory.",
  },
  {
    stage: "fetch",
    label: "Fetch 2",
    pc: "203",
    mar: "202",
    mdr: "STORE 14",
    ir: "-",
    acc: "8",
    activeRegisters: ["pc", "mar", "mdr"],
    activeAddresses: ["202"],
    status: "STORE 14 is fetched from memory through the MDR.",
    explanation:
      "The PC moves on to 203. If this program continued, that would be the next instruction address.",
  },
  {
    stage: "fetch",
    label: "Fetch 3",
    pc: "203",
    mar: "202",
    mdr: "STORE 14",
    ir: "STORE 14",
    acc: "8",
    activeRegisters: ["mdr", "ir"],
    activeAddresses: ["202"],
    status: "STORE 14 is copied into the instruction register.",
    explanation:
      "The instruction register now holds the store instruction so it can be decoded.",
  },
  {
    stage: "decode",
    label: "Decode",
    pc: "203",
    mar: "202",
    mdr: "STORE 14",
    ir: "STORE 14",
    acc: "8",
    activeRegisters: ["ir", "acc"],
    activeAddresses: ["202", "14"],
    status: "The control unit decodes STORE 14.",
    explanation:
      "The CPU identifies a memory write operation. The value in the accumulator must be written to address 14.",
  },
  {
    stage: "execute",
    label: "Execute",
    pc: "203",
    mar: "14",
    mdr: "8",
    ir: "STORE 14",
    acc: "8",
    activeRegisters: ["mar", "mdr", "acc"],
    activeAddresses: ["14"],
    writtenAddresses: ["14"],
    memoryOverrides: { 14: "8" },
    status: "STORE executes: the accumulator value is written to address 14.",
    explanation:
      "The result location now contains 8. The program has loaded, added, and stored a value through repeated instruction cycles.",
  },
  {
    stage: "complete",
    label: "Complete",
    pc: "203",
    mar: "14",
    mdr: "8",
    ir: "STORE 14",
    acc: "8",
    activeRegisters: ["pc", "acc"],
    activeAddresses: ["14"],
    writtenAddresses: ["14"],
    memoryOverrides: { 14: "8" },
    status: "The sample program is complete.",
    explanation:
      "The PC is ready for address 203, and memory address 14 stores the result. Real programs keep repeating this pattern for many instructions.",
  },
]

function normaliseSimulatorState(value) {
  const stepIndex = Number.isInteger(value?.stepIndex) ? value.stepIndex : 0

  return {
    stepIndex: Math.min(Math.max(stepIndex, 0), SIMULATOR_STEPS.length - 1),
  }
}

function createMemoryRow(memoryItem, step) {
  const value =
    step.memoryOverrides?.[memoryItem.address] ?? memoryItem.value
  const row = document.createElement("article")
  row.className = "memory-row"
  row.classList.toggle("is-active", step.activeAddresses?.includes(memoryItem.address))
  row.classList.toggle(
    "is-written",
    step.writtenAddresses?.includes(memoryItem.address)
  )

  const address = document.createElement("strong")
  address.className = "memory-address"
  address.textContent = memoryItem.address

  const body = document.createElement("span")
  body.className = "memory-value"

  const kind = document.createElement("span")
  kind.className = "memory-kind"
  kind.textContent = memoryItem.kind

  const content = document.createElement("strong")
  content.textContent = value

  const description = document.createElement("span")
  description.textContent = memoryItem.description

  body.append(content, kind, description)
  row.append(address, body)

  return row
}

function initInstructionCycleSimulator() {
  const simulator = document.querySelector("[data-role='instruction-simulator']")

  if (!simulator) {
    return
  }

  const memory = simulator.querySelector("[data-role='cycle-memory']")
  const status = simulator.querySelector("[data-role='cycle-status']")
  const stepCounter = simulator.querySelector("[data-role='cycle-step-counter']")
  const stagePill = simulator.querySelector("[data-role='cycle-stage-pill']")
  const explanation = simulator.querySelector("[data-role='cycle-explanation']")
  const registerValues = simulator.querySelectorAll("[data-register-value]")
  const registerTiles = simulator.querySelectorAll("[data-register]")
  const stageMarkers = simulator.querySelectorAll("[data-cycle-stage-marker]")
  const previousButton = simulator.querySelector("[data-cycle-action='previous']")
  const nextButton = simulator.querySelector("[data-cycle-action='next']")

  let state = normaliseSimulatorState(
    readStorage(SIMULATOR_STORAGE_KEY, { stepIndex: 0 })
  )

  function saveState() {
    writeStorage(SIMULATOR_STORAGE_KEY, state)
  }

  function render() {
    const step = SIMULATOR_STEPS[state.stepIndex]

    registerValues.forEach((element) => {
      const key = element.dataset.registerValue

      if (key && Object.prototype.hasOwnProperty.call(step, key)) {
        element.textContent = step[key]
      }
    })

    registerTiles.forEach((tile) => {
      tile.classList.toggle(
        "is-active",
        step.activeRegisters?.includes(tile.dataset.register)
      )
    })

    memory?.replaceChildren(
      ...MEMORY_BLUEPRINT.map((memoryItem) => createMemoryRow(memoryItem, step))
    )

    stageMarkers.forEach((marker) => {
      marker.classList.toggle(
        "is-active",
        marker.dataset.cycleStageMarker === step.stage
      )
    })

    if (status) {
      status.textContent = step.status
    }

    if (explanation) {
      explanation.textContent = step.explanation
    }

    if (stepCounter) {
      stepCounter.textContent = `Step ${state.stepIndex + 1} of ${
        SIMULATOR_STEPS.length
      }`
    }

    if (stagePill) {
      stagePill.textContent = step.label
    }

    if (previousButton) {
      previousButton.disabled = state.stepIndex === 0
    }

    if (nextButton) {
      nextButton.disabled = state.stepIndex === SIMULATOR_STEPS.length - 1
    }
  }

  simulator.querySelectorAll("[data-cycle-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.cycleAction

      if (action === "previous") {
        state = {
          stepIndex: Math.max(state.stepIndex - 1, 0),
        }
      }

      if (action === "next") {
        state = {
          stepIndex: Math.min(
            state.stepIndex + 1,
            SIMULATOR_STEPS.length - 1
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
initInstructionCycleSimulator()
