import { initLessonPage } from "../core/lesson-shell.js"
import { readStorage, writeStorage } from "../core/storage.js"

const lessonConfig = {
  lessonId: "pipelining-multi-processing-and-multi-threading",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-b",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "CPU performance, instruction sets, and cache",
        description: "Previous in B2 The concepts of microarchitecture.",
        status: "Live",
        href: "../topics/cpu-performance-instruction-sets-and-cache.html",
      },
      next: {
        title: "CPU architecture for different systems",
        description: "Next in B2 The concepts of microarchitecture.",
        status: "Live",
        href: "../topics/cpu-architecture-for-different-systems.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-pipelining-multi-processing-and-multi-threading-quiz",
    passScore: 4,
  },
  examPractice: {
    storageKey: "lesson-pipelining-multi-processing-and-multi-threading-exam-practice",
  },
}

const PIPELINE_SIMULATOR_STORAGE_KEY =
  "lesson-pipelining-multi-processing-and-multi-threading-simulator"

const PIPELINE_STAGES = [
  {
    id: "fetch",
    label: "Fetch",
    shortLabel: "F",
    description: "Read the next instruction from memory or cache.",
  },
  {
    id: "decode",
    label: "Decode",
    shortLabel: "D",
    description: "Work out the opcode, operands, and control signals.",
  },
  {
    id: "execute",
    label: "Execute",
    shortLabel: "E",
    description: "Carry out the operation and update CPU state.",
  },
]

const PIPELINE_INSTRUCTIONS = [
  {
    label: "Instruction A",
    shortLabel: "A",
    action: "LOAD 12",
  },
  {
    label: "Instruction B",
    shortLabel: "B",
    action: "ADD 13",
  },
  {
    label: "Instruction C",
    shortLabel: "C",
    action: "STORE 14",
  },
  {
    label: "Instruction D",
    shortLabel: "D",
    action: "COMPARE 15",
  },
]

const PIPELINE_TOTAL_CYCLES =
  PIPELINE_STAGES.length + PIPELINE_INSTRUCTIONS.length - 1

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function normalisePipelineState(value) {
  const cycle = Number.isInteger(value?.cycle) ? value.cycle : 0

  return {
    cycle: clamp(cycle, 0, PIPELINE_TOTAL_CYCLES),
  }
}

function getInstructionStageAtCycle(instructionIndex, cycle) {
  const stageIndex = cycle - instructionIndex - 1

  if (stageIndex < 0 || stageIndex >= PIPELINE_STAGES.length) {
    return null
  }

  return PIPELINE_STAGES[stageIndex]
}

function calculatePipelineSnapshot(cycle) {
  const stageSlots = PIPELINE_STAGES.map((stage, stageIndex) => {
    const instructionIndex = cycle - stageIndex - 1

    return {
      stage,
      instruction: PIPELINE_INSTRUCTIONS[instructionIndex] ?? null,
    }
  })

  return {
    stageSlots,
    activeCount: stageSlots.filter((slot) => slot.instruction).length,
    completedCount: clamp(
      cycle - (PIPELINE_STAGES.length - 1),
      0,
      PIPELINE_INSTRUCTIONS.length
    ),
  }
}

function describePipelineCycle(cycle, snapshot) {
  if (cycle === 0) {
    return "The pipeline is empty. Step forward to fetch the first instruction."
  }

  if (cycle < PIPELINE_STAGES.length) {
    return "The pipeline is filling, so only some stages have useful work yet."
  }

  if (snapshot.activeCount === PIPELINE_STAGES.length) {
    return "The pipeline is full. Fetch, decode, and execute are all busy in the same cycle."
  }

  return "The pipeline is draining. No new instruction is entering, but later instructions still need to finish."
}

function explainPipelineCycle(cycle, snapshot) {
  if (cycle === 0) {
    return "Watch how the first instruction takes time to move through the stages, then later cycles have several instructions active at once."
  }

  if (snapshot.completedCount === 0) {
    return "No instruction has completed yet because the first instruction has not reached the end of execute."
  }

  if (snapshot.completedCount === PIPELINE_INSTRUCTIONS.length) {
    return "All four instructions have completed in six cycles. Without overlap, four instructions with three stages each would take twelve cycles."
  }

  return `${snapshot.completedCount} instruction${
    snapshot.completedCount === 1 ? " has" : "s have"
  } completed while later instructions are already moving through earlier stages.`
}

function createPipelineStageLane(slot) {
  const lane = document.createElement("article")
  lane.className = `pipeline-stage-lane pipeline-stage-lane--${slot.stage.id}`
  lane.classList.toggle("is-active", Boolean(slot.instruction))

  const label = document.createElement("span")
  label.className = "pipeline-stage-label"
  label.textContent = slot.stage.label

  const value = document.createElement("strong")
  value.textContent = slot.instruction?.action ?? "Waiting"

  const note = document.createElement("span")
  if (!slot.instruction) {
    note.textContent = slot.stage.description
  } else if (slot.stage.id === "execute") {
    note.textContent = `${slot.instruction.label} completes execute in this cycle.`
  } else {
    note.textContent = `${slot.instruction.label} is in ${slot.stage.label.toLowerCase()}.`
  }

  lane.append(label, value, note)
  return lane
}

function createTimelineHeader() {
  const row = document.createElement("div")
  row.className = "pipeline-timeline-row pipeline-timeline-row--header"

  const corner = document.createElement("span")
  corner.textContent = "Instruction"
  row.append(corner)

  for (let cycle = 1; cycle <= PIPELINE_TOTAL_CYCLES; cycle += 1) {
    const cell = document.createElement("span")
    cell.textContent = `C${cycle}`
    row.append(cell)
  }

  return row
}

function createTimelineRow(instruction, instructionIndex, currentCycle) {
  const row = document.createElement("div")
  row.className = "pipeline-timeline-row"

  const label = document.createElement("strong")
  label.textContent = instruction.action
  row.append(label)

  for (let cycle = 1; cycle <= PIPELINE_TOTAL_CYCLES; cycle += 1) {
    const stage = getInstructionStageAtCycle(instructionIndex, cycle)
    const cell = document.createElement("span")
    cell.className = "pipeline-timeline-cell"
    cell.classList.toggle("is-current", cycle === currentCycle)

    if (stage) {
      cell.classList.add(`pipeline-timeline-cell--${stage.id}`)
      cell.classList.toggle("is-complete", cycle < currentCycle)
      cell.textContent = stage.shortLabel
      cell.setAttribute(
        "aria-label",
        `${instruction.action}, cycle ${cycle}, ${stage.label}`
      )
    } else {
      cell.textContent = "-"
      cell.setAttribute(
        "aria-label",
        `${instruction.action}, cycle ${cycle}, no pipeline stage`
      )
    }

    row.append(cell)
  }

  return row
}

function initPipelineSimulator() {
  const simulator = document.querySelector("[data-role='pipeline-simulator']")

  if (!simulator) {
    return
  }

  const stageLanes = simulator.querySelector("[data-role='pipeline-stage-lanes']")
  const timeline = simulator.querySelector("[data-role='pipeline-timeline']")
  const status = simulator.querySelector("[data-role='pipeline-status']")
  const explanation = simulator.querySelector("[data-role='pipeline-explanation']")
  const stepCounter = simulator.querySelector("[data-role='pipeline-step-counter']")
  const cyclePill = simulator.querySelector("[data-role='pipeline-cycle-pill']")
  const throughputPill = simulator.querySelector(
    "[data-role='pipeline-throughput-pill']"
  )
  const pipelineCycleValue = simulator.querySelector(
    "[data-role='pipeline-cycle-value']"
  )
  const serialCycleValue = simulator.querySelector(
    "[data-role='serial-cycle-value']"
  )
  const cycleSavingValue = simulator.querySelector(
    "[data-role='cycle-saving-value']"
  )
  const previousButton = simulator.querySelector(
    "[data-pipeline-action='previous']"
  )
  const nextButton = simulator.querySelector("[data-pipeline-action='next']")

  let state = normalisePipelineState(
    readStorage(PIPELINE_SIMULATOR_STORAGE_KEY, { cycle: 0 })
  )

  function saveState() {
    writeStorage(PIPELINE_SIMULATOR_STORAGE_KEY, state)
  }

  function render() {
    const snapshot = calculatePipelineSnapshot(state.cycle)
    const serialCycles = snapshot.completedCount * PIPELINE_STAGES.length
    const cycleSaving = Math.max(serialCycles - state.cycle, 0)

    stageLanes?.replaceChildren(
      ...snapshot.stageSlots.map((slot) => createPipelineStageLane(slot))
    )

    timeline?.replaceChildren(
      createTimelineHeader(),
      ...PIPELINE_INSTRUCTIONS.map((instruction, index) =>
        createTimelineRow(instruction, index, state.cycle)
      )
    )

    if (status) {
      status.textContent = describePipelineCycle(state.cycle, snapshot)
    }

    if (explanation) {
      explanation.textContent = explainPipelineCycle(state.cycle, snapshot)
    }

    if (stepCounter) {
      stepCounter.textContent = `Cycle ${state.cycle} of ${PIPELINE_TOTAL_CYCLES}`
    }

    if (cyclePill) {
      cyclePill.textContent =
        state.cycle === 0
          ? "Ready"
          : state.cycle === PIPELINE_TOTAL_CYCLES
            ? "Complete"
            : "Running"
    }

    if (throughputPill) {
      throughputPill.textContent = `Completed ${snapshot.completedCount} of ${PIPELINE_INSTRUCTIONS.length}`
    }

    if (pipelineCycleValue) {
      pipelineCycleValue.textContent = state.cycle.toString()
    }

    if (serialCycleValue) {
      serialCycleValue.textContent = serialCycles.toString()
    }

    if (cycleSavingValue) {
      cycleSavingValue.textContent = cycleSaving.toString()
    }

    if (previousButton) {
      previousButton.disabled = state.cycle === 0
    }

    if (nextButton) {
      nextButton.disabled = state.cycle === PIPELINE_TOTAL_CYCLES
    }
  }

  simulator.querySelectorAll("[data-pipeline-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.pipelineAction

      if (action === "previous") {
        state = { cycle: Math.max(state.cycle - 1, 0) }
      }

      if (action === "next") {
        state = {
          cycle: Math.min(state.cycle + 1, PIPELINE_TOTAL_CYCLES),
        }
      }

      if (action === "reset") {
        state = { cycle: 0 }
      }

      saveState()
      render()
    })
  })

  render()
}

initLessonPage(lessonConfig)
initPipelineSimulator()
