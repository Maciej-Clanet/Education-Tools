import { initLessonPage } from "../core/lesson-shell.js"
import { readStorage, writeStorage } from "../core/storage.js"

const lessonConfig = {
  lessonId: "boolean-logic",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-f",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Error correction with ARQ and FEC",
        description: "Previous in E3 Error correction.",
        status: "Live",
        href: "../topics/error-correction-with-arq-and-fec.html",
      },
      next: {
        title: "Flow charts and system diagrams",
        description: "Next in F2 Flow charts and system diagrams.",
        status: "Live",
        href: "../topics/flow-charts-and-system-diagrams.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-boolean-logic-quiz",
    passScore: 4,
    version: 1,
  },
  examPractice: {
    storageKey: "lesson-boolean-logic-exam-practice",
  },
}

const LOGIC_LAB_STORAGE_KEY = "lesson-boolean-logic-lab"
const DEFAULT_LOGIC_STATE = {
  expression: "and",
  inputs: {
    A: 1,
    B: 0,
    C: 0,
  },
}
const EXPRESSIONS = {
  and: {
    label: "A AND B",
    inputs: ["A", "B"],
    description: "The output is 1 only when A and B are both 1.",
    evaluate: ({ A, B }) => A && B,
    steps: ({ A, B }) => [
      { label: "A", value: A },
      { label: "AND", value: A && B },
      { label: "B", value: B },
    ],
  },
  or: {
    label: "A OR B",
    inputs: ["A", "B"],
    description: "The output is 1 when A, B, or both inputs are 1.",
    evaluate: ({ A, B }) => A || B,
    steps: ({ A, B }) => [
      { label: "A", value: A },
      { label: "OR", value: A || B },
      { label: "B", value: B },
    ],
  },
  notA: {
    label: "NOT A",
    inputs: ["A"],
    description: "The output is the opposite of input A.",
    evaluate: ({ A }) => !A,
    steps: ({ A }) => [
      { label: "A", value: A },
      { label: "NOT", value: !A },
    ],
  },
  alarm: {
    label: "A AND (B OR C)",
    inputs: ["A", "B", "C"],
    description:
      "The output is 1 when A is 1 and at least one of B or C is also 1.",
    evaluate: ({ A, B, C }) => A && (B || C),
    steps: ({ A, B, C }) => [
      { label: "A", value: A },
      { label: "B OR C", value: B || C },
      { label: "Output", value: A && (B || C) },
    ],
  },
  secure: {
    label: "(A OR B) AND NOT C",
    inputs: ["A", "B", "C"],
    description:
      "The output is 1 when A or B is 1, but C must be 0.",
    evaluate: ({ A, B, C }) => (A || B) && !C,
    steps: ({ A, B, C }) => [
      { label: "A OR B", value: A || B },
      { label: "NOT C", value: !C },
      { label: "Output", value: (A || B) && !C },
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

function setText(root, role, text) {
  const element = root.querySelector(`[data-role='${role}']`)

  if (element) {
    element.textContent = text
  }
}

function normaliseExpression(value) {
  return EXPRESSIONS[value] ? value : DEFAULT_LOGIC_STATE.expression
}

function normaliseInput(value) {
  return Number(value) === 1 ? 1 : 0
}

function getInputState(savedInputs = {}) {
  return {
    A: normaliseInput(savedInputs.A ?? DEFAULT_LOGIC_STATE.inputs.A),
    B: normaliseInput(savedInputs.B ?? DEFAULT_LOGIC_STATE.inputs.B),
    C: normaliseInput(savedInputs.C ?? DEFAULT_LOGIC_STATE.inputs.C),
  }
}

function getOutput(expression, inputs) {
  return EXPRESSIONS[expression].evaluate({
    A: Boolean(inputs.A),
    B: Boolean(inputs.B),
    C: Boolean(inputs.C),
  })
    ? 1
    : 0
}

function getRows(inputNames) {
  const rowCount = 2 ** inputNames.length

  return Array.from({ length: rowCount }, (_, rowIndex) => {
    const row = {}
    inputNames.forEach((name, inputIndex) => {
      const bitPosition = inputNames.length - inputIndex - 1
      row[name] = (rowIndex >> bitPosition) & 1
    })
    return row
  })
}

function getActiveRowIndex(rows, inputs, inputNames) {
  return rows.findIndex((row) =>
    inputNames.every((name) => row[name] === inputs[name])
  )
}

function formatInputSummary(inputNames, inputs) {
  return inputNames.map((name) => `${name} = ${inputs[name]}`).join(", ")
}

function renderInputToggles(container, state, onToggle) {
  container.replaceChildren()

  EXPRESSIONS[state.expression].inputs.forEach((inputName) => {
    const button = createElement("button", "input-toggle")
    const inputValue = state.inputs[inputName]
    button.type = "button"
    button.dataset.state = String(inputValue)
    button.setAttribute("aria-pressed", inputValue ? "true" : "false")
    button.setAttribute(
      "aria-label",
      `${inputName} is ${inputValue}. Toggle ${inputName}.`
    )
    button.append(
      createElement("span", "", inputName),
      createElement("strong", "", String(inputValue))
    )
    button.addEventListener("click", () => onToggle(inputName))
    container.append(button)
  })
}

function renderLiveFlow(container, expression, inputs) {
  container.replaceChildren()

  EXPRESSIONS[expression].steps({
    A: Boolean(inputs.A),
    B: Boolean(inputs.B),
    C: Boolean(inputs.C),
  }).forEach((step) => {
    const card = createElement("article", "logic-flow-step")
    card.dataset.state = step.value ? "true" : "false"
    card.append(
      createElement("span", "", step.label),
      createElement("strong", "", step.value ? "1" : "0")
    )
    container.append(card)
  })
}

function renderTruthTable(table, expression, inputs) {
  const inputNames = EXPRESSIONS[expression].inputs
  const rows = getRows(inputNames)
  const activeRowIndex = getActiveRowIndex(rows, inputs, inputNames)
  const thead = createElement("thead")
  const headRow = createElement("tr")

  inputNames.forEach((name) => {
    const heading = createElement("th", "", name)
    heading.scope = "col"
    headRow.append(heading)
  })
  const outputHeading = createElement("th", "", "Output")
  outputHeading.scope = "col"
  headRow.append(outputHeading)
  thead.append(headRow)

  const tbody = createElement("tbody")
  rows.forEach((row, rowIndex) => {
    const tableRow = createElement("tr")
    const output = getOutput(expression, row)
    tableRow.classList.toggle("is-active", rowIndex === activeRowIndex)
    if (rowIndex === activeRowIndex) {
      tableRow.setAttribute("aria-current", "true")
      tableRow.setAttribute("aria-label", "Selected input row")
    }

    inputNames.forEach((name) => {
      tableRow.append(createElement("td", "", String(row[name])))
    })

    const outputCell = createElement(
      "td",
      `truth-output truth-output--${output ? "true" : "false"}`,
      String(output)
    )
    tableRow.append(outputCell)
    tbody.append(tableRow)
  })

  table.replaceChildren(thead, tbody)
}

function renderLogicLab(tool, state) {
  state.expression = normaliseExpression(state.expression)
  state.inputs = getInputState(state.inputs)

  const expression = EXPRESSIONS[state.expression]
  const output = getOutput(state.expression, state.inputs)
  const select = tool.querySelector("[data-role='logic-expression']")

  if (select) {
    select.value = state.expression
  }

  renderInputToggles(
    tool.querySelector("[data-role='logic-inputs']"),
    state,
    (inputName) => {
      state.inputs[inputName] = state.inputs[inputName] ? 0 : 1
      saveAndRenderLogicLab(tool, state)
    }
  )
  renderLiveFlow(
    tool.querySelector("[data-role='logic-live-flow']"),
    state.expression,
    state.inputs
  )
  renderTruthTable(
    tool.querySelector("[data-role='logic-truth-table']"),
    state.expression,
    state.inputs
  )

  setText(tool, "logic-output-pill", `Selected output ${output}`)
  setText(tool, "logic-expression-text", expression.label)
  setText(
    tool,
    "logic-note",
    `Highlighted row: ${formatInputSummary(
      expression.inputs,
      state.inputs
    )} gives Output = ${output}. ${expression.description}`
  )
}

function saveAndRenderLogicLab(tool, state) {
  writeStorage(LOGIC_LAB_STORAGE_KEY, state)
  renderLogicLab(tool, state)
}

function initLogicLab() {
  const tool = document.querySelector("[data-role='logic-lab']")

  if (!tool) {
    return
  }

  const state = {
    ...DEFAULT_LOGIC_STATE,
    ...readStorage(LOGIC_LAB_STORAGE_KEY, DEFAULT_LOGIC_STATE),
  }
  state.inputs = getInputState(state.inputs)

  tool
    .querySelector("[data-role='logic-expression']")
    ?.addEventListener("change", (event) => {
      state.expression = event.target.value
      saveAndRenderLogicLab(tool, state)
    })

  renderLogicLab(tool, state)
}

initLessonPage(lessonConfig)
initLogicLab()
