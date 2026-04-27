import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "multi-dimensional-arrays-and-memory-order",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-d",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Matrices and arrays",
        description: "Previous in D2 Indices and matrices.",
        status: "Live",
        href: "../topics/matrices-and-arrays.html",
      },
      next: {
        title: "Communication channels and connection methods",
        description: "Next in E1 Transmitting data.",
        status: "Live",
        href: "../topics/communication-channels-and-connection-methods.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-multi-dimensional-arrays-and-memory-order-quiz",
    passScore: 4,
  },
  examPractice: {
    storageKey: "lesson-multi-dimensional-arrays-and-memory-order-exam-practice",
  },
}

const MEMORY_EXAMPLE = [
  [11, 12, 13],
  [21, 22, 23],
]

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

function createSequence(matrix, order) {
  if (order === "column-major") {
    return Array.from({ length: matrix[0].length }, (_, columnIndex) =>
      matrix.map((row, rowIndex) => ({
        value: row[columnIndex],
        rowIndex,
        columnIndex,
      }))
    ).flat()
  }

  return matrix.flatMap((row, rowIndex) =>
    row.map((value, columnIndex) => ({
      value,
      rowIndex,
      columnIndex,
    }))
  )
}

function formatCoordinate(rowIndex, columnIndex) {
  return `[${rowIndex}][${columnIndex}]`
}

function getOrderSummary(order) {
  return order === "column-major"
    ? "one full column before moving to the next column"
    : "one full row before moving to the next row"
}

function initMemoryOrderVisualiser() {
  const visualiser = document.querySelector("[data-memory-order-visualiser]")
  const card = visualiser?.closest(".memory-order-visual-card")

  if (!visualiser || !card) {
    return
  }

  const grid = visualiser.querySelector("[data-role='memory-order-grid']")
  const memory = visualiser.querySelector("[data-role='memory-order-memory']")
  const stepInput = visualiser.querySelector("[data-role='memory-order-step']")
  const stepOutput = visualiser.querySelector(
    "[data-role='memory-order-step-output']"
  )
  const status = visualiser.querySelector("[data-role='memory-order-status']")
  const sequenceSummary = visualiser.querySelector(
    "[data-role='memory-order-sequence']"
  )
  const modeButtons = Array.from(
    card.querySelectorAll("[data-memory-order-mode]")
  )
  const totalSlots = MEMORY_EXAMPLE.length * MEMORY_EXAMPLE[0].length

  if (
    !grid ||
    !memory ||
    !stepInput ||
    !stepOutput ||
    !status ||
    !sequenceSummary ||
    modeButtons.length === 0
  ) {
    return
  }

  let state = {
    order: "row-major",
    step: totalSlots,
  }

  function renderGrid(sequence) {
    const orderLookup = new Map(
      sequence.map((item, index) => [
        `${item.rowIndex}:${item.columnIndex}`,
        index,
      ])
    )
    const fragment = document.createDocumentFragment()

    grid.style.setProperty(
      "--memory-order-columns",
      String(MEMORY_EXAMPLE[0].length)
    )

    MEMORY_EXAMPLE.forEach((row, rowIndex) => {
      row.forEach((value, columnIndex) => {
        const stepIndex = orderLookup.get(`${rowIndex}:${columnIndex}`) ?? 0
        const cell = createElement("article", "memory-order-grid__cell")
        const coordinate = createElement(
          "span",
          "memory-order-grid__index",
          formatCoordinate(rowIndex, columnIndex)
        )
        const cellValue = createElement(
          "strong",
          "memory-order-grid__value",
          String(value)
        )
        const stepBadge = createElement(
          "span",
          "memory-order-grid__step",
          String(stepIndex + 1)
        )

        if (stepIndex < state.step) {
          cell.classList.add("is-stored")
        }

        if (stepIndex === state.step - 1) {
          cell.classList.add("is-current")
        }

        cell.append(coordinate, cellValue, stepBadge)
        fragment.append(cell)
      })
    })

    grid.replaceChildren(fragment)
  }

  function renderMemory(sequence) {
    const fragment = document.createDocumentFragment()

    sequence.forEach((item, index) => {
      const slot = createElement("li", "memory-order-slot")
      const label = createElement(
        "span",
        "memory-order-slot__label",
        `Slot ${index + 1}`
      )
      const value = createElement(
        "strong",
        "memory-order-slot__value",
        index < state.step ? String(item.value) : "Pending"
      )
      const meta = createElement(
        "span",
        "memory-order-slot__meta",
        index < state.step
          ? formatCoordinate(item.rowIndex, item.columnIndex)
          : "Waiting for this step"
      )

      if (index < state.step) {
        slot.classList.add("is-filled")
      }

      if (index === state.step - 1) {
        slot.classList.add("is-current")
      }

      slot.append(label, value, meta)
      fragment.append(slot)
    })

    memory.replaceChildren(fragment)
  }

  function renderStatus(sequence) {
    if (state.step === 0) {
      const first = sequence[0]
      status.textContent = `${
        state.order === "column-major" ? "Column-major" : "Row-major"
      } order will start with ${first.value} at ${formatCoordinate(
        first.rowIndex,
        first.columnIndex
      )}. Move the slider to see memory fill up.`
      return
    }

    const current = sequence[state.step - 1]
    const slotNumber = state.step

    status.textContent = `Step ${state.step} of ${totalSlots}: ${current.value} from ${formatCoordinate(
      current.rowIndex,
      current.columnIndex
    )} is now in memory slot ${slotNumber} because ${state.order} order stores ${getOrderSummary(
      state.order
    )}.`
  }

  function render() {
    const sequence = createSequence(MEMORY_EXAMPLE, state.order)

    modeButtons.forEach((button) => {
      const isActive = button.dataset.memoryOrderMode === state.order
      button.classList.toggle("is-active", isActive)
      button.setAttribute("aria-pressed", String(isActive))
    })

    stepInput.max = String(totalSlots)
    stepInput.value = String(state.step)
    stepOutput.textContent =
      state.step === totalSlots
        ? `Full order shown (${totalSlots}/${totalSlots})`
        : `Step ${state.step} of ${totalSlots}`
    sequenceSummary.textContent = `Sequence: ${sequence
      .map((item) => item.value)
      .join(", ")}.`

    renderGrid(sequence)
    renderMemory(sequence)
    renderStatus(sequence)
  }

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const order = button.dataset.memoryOrderMode

      if (order !== "row-major" && order !== "column-major") {
        return
      }

      state = {
        ...state,
        order,
      }

      render()
    })
  })

  stepInput.addEventListener("input", () => {
    state = {
      ...state,
      step: Number(stepInput.value),
    }

    render()
  })

  render()
}

initLessonPage(lessonConfig)
initMemoryOrderVisualiser()
