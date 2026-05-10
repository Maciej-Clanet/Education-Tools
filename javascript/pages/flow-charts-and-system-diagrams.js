import { initLessonPage } from "../core/lesson-shell.js"
import { readStorage, writeStorage } from "../core/storage.js"

const lessonConfig = {
  lessonId: "flow-charts-and-system-diagrams",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-f",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Boolean logic",
        description: "Previous in F1 Boolean logic.",
        status: "Live",
        href: "../topics/boolean-logic.html",
      },
      next: {
        title: "More Unit 2 lessons coming soon",
        description:
          "This is currently the last live lesson in the Unit 2 sequence.",
        status: "Live",
      },
    },
  },
  quiz: {
    storageKey: "lesson-flow-charts-and-system-diagrams-quiz",
    passScore: 4,
    version: 1,
  },
  examPractice: {
    storageKey: "lesson-flow-charts-and-system-diagrams-exam-practice",
  },
}

const TRACE_STORAGE_KEY = "lesson-flow-charts-and-system-diagrams-trace"
const SCENARIOS = {
  login: {
    title: "Login check",
    start: "start",
    nodes: [
      {
        id: "start",
        type: "terminator",
        label: "Start",
        detail: "The login process begins when the user opens the sign-in page.",
        next: "enter",
      },
      {
        id: "enter",
        type: "io",
        label: "Enter username and password",
        detail: "The user provides input data for the system to check.",
        next: "check",
      },
      {
        id: "check",
        type: "decision",
        label: "Password correct?",
        detail:
          "A decision symbol asks a question and sends the process down a labelled branch.",
        branches: {
          yes: "grant",
          no: "error",
        },
      },
      {
        id: "grant",
        type: "process",
        label: "Grant access",
        detail: "The system updates the session so the user can enter.",
        next: "endAccess",
      },
      {
        id: "error",
        type: "io",
        label: "Show error message",
        detail: "A failed check outputs feedback before another decision is made.",
        next: "attempts",
      },
      {
        id: "attempts",
        type: "decision",
        label: "Attempts left?",
        detail:
          "This decision either loops back for another try or moves towards account lockout.",
        branches: {
          yes: "enter",
          no: "lock",
        },
      },
      {
        id: "lock",
        type: "process",
        label: "Lock account",
        detail: "The process takes action because the failed-attempt limit was reached.",
        next: "endLock",
      },
      {
        id: "endAccess",
        type: "terminator",
        label: "End",
        detail: "The successful login path stops here.",
      },
      {
        id: "endLock",
        type: "terminator",
        label: "End",
        detail: "The locked-account path stops here.",
      },
    ],
    diagram: {
      viewBox: "0 0 760 760",
      nodes: {
        start: { x: 300, y: 20, w: 160, h: 54 },
        enter: { x: 280, y: 105, w: 200, h: 64 },
        check: { x: 300, y: 210, w: 160, h: 100 },
        grant: { x: 80, y: 365, w: 170, h: 64 },
        endAccess: { x: 80, y: 500, w: 170, h: 54 },
        error: { x: 510, y: 350, w: 180, h: 70 },
        attempts: { x: 520, y: 470, w: 160, h: 100 },
        lock: { x: 300, y: 610, w: 170, h: 64 },
        endLock: { x: 300, y: 700, w: 170, h: 54 },
      },
      edges: [
        { id: "start->enter", points: [[380, 74], [380, 105]] },
        { id: "enter->check", points: [[380, 169], [380, 210]] },
        {
          id: "check:yes",
          label: "Yes",
          labelAt: [255, 255],
          points: [[300, 260], [165, 260], [165, 365]],
        },
        {
          id: "check:no",
          label: "No",
          labelAt: [505, 255],
          points: [[460, 260], [600, 260], [600, 350]],
        },
        { id: "grant->endAccess", points: [[165, 429], [165, 500]] },
        { id: "error->attempts", points: [[600, 420], [600, 470]] },
        {
          id: "attempts:yes",
          label: "Yes",
          labelAt: [710, 500],
          points: [[680, 520], [730, 520], [730, 137], [480, 137]],
        },
        {
          id: "attempts:no",
          label: "No",
          labelAt: [500, 610],
          points: [[600, 570], [600, 642], [470, 642]],
        },
        { id: "lock->endLock", points: [[385, 674], [385, 700]] },
      ],
    },
  },
  sensor: {
    title: "Temperature alert",
    start: "start",
    nodes: [
      {
        id: "start",
        type: "terminator",
        label: "Start",
        detail: "The monitoring process starts when the system takes a reading.",
        next: "read",
      },
      {
        id: "read",
        type: "io",
        label: "Read temperature",
        detail: "The temperature sensor provides input data to the control program.",
        next: "check",
      },
      {
        id: "check",
        type: "decision",
        label: "Temperature too high?",
        detail:
          "The system branches depending on whether the reading is above the allowed limit.",
        branches: {
          yes: "alert",
          no: "store",
        },
      },
      {
        id: "alert",
        type: "process",
        label: "Send alert to display",
        detail: "The system produces an output because the condition is true.",
        next: "store",
      },
      {
        id: "store",
        type: "storage",
        label: "Store reading",
        detail: "The reading is saved so it can be reviewed later.",
        next: "end",
      },
      {
        id: "end",
        type: "terminator",
        label: "End",
        detail: "The process finishes after the reading has been handled.",
      },
    ],
    diagram: {
      viewBox: "0 0 760 580",
      nodes: {
        start: { x: 300, y: 20, w: 160, h: 54 },
        read: { x: 280, y: 105, w: 200, h: 64 },
        check: { x: 300, y: 210, w: 160, h: 100 },
        alert: { x: 80, y: 360, w: 180, h: 70 },
        store: { x: 500, y: 360, w: 180, h: 70 },
        end: { x: 300, y: 500, w: 160, h: 54 },
      },
      edges: [
        { id: "start->read", points: [[380, 74], [380, 105]] },
        { id: "read->check", points: [[380, 169], [380, 210]] },
        {
          id: "check:yes",
          label: "Yes",
          labelAt: [255, 255],
          points: [[300, 260], [170, 260], [170, 360]],
        },
        {
          id: "check:no",
          label: "No",
          labelAt: [505, 255],
          points: [[460, 260], [590, 260], [590, 360]],
        },
        {
          id: "alert->store",
          points: [[260, 395], [500, 395]],
        },
        {
          id: "store->end",
          points: [[590, 430], [590, 470], [380, 470], [380, 500]],
        },
      ],
    },
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

function createSvgElement(tagName, className) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", tagName)

  if (className) {
    element.setAttribute("class", className)
  }

  return element
}

function getScenario(id) {
  return SCENARIOS[id] || SCENARIOS.login
}

function getNode(scenario, nodeId) {
  return scenario.nodes.find((node) => node.id === nodeId) || scenario.nodes[0]
}

function getInitialTraceState() {
  return {
    scenario: "login",
    activeId: SCENARIOS.login.start,
    history: [SCENARIOS.login.start],
  }
}

function normaliseTraceState(savedState = {}) {
  const initialState = getInitialTraceState()
  const scenarioId = SCENARIOS[savedState.scenario]
    ? savedState.scenario
    : initialState.scenario
  const scenario = getScenario(scenarioId)
  const activeNode = scenario.nodes.find((node) => node.id === savedState.activeId)

  if (!activeNode) {
    return {
      scenario: scenarioId,
      activeId: scenario.start,
      history: [scenario.start],
    }
  }

  const activeId = activeNode.id
  const rawHistory = Array.isArray(savedState.history)
    ? savedState.history
    : [scenario.start]
  const validIds = new Set(scenario.nodes.map((node) => node.id))
  const history = rawHistory.filter((entry) => {
    const [nodeId] = String(entry).split(":")
    return validIds.has(nodeId)
  })

  return {
    scenario: scenarioId,
    activeId,
    history: history.length ? history : [scenario.start],
  }
}

function getVisitedNodeIds(history) {
  return new Set(history.map((entry) => String(entry).split(":")[0]))
}

function formatBranchLabel(branchKey) {
  return branchKey === "yes" ? "Yes" : "No"
}

function getVisitedEdgeIds(history) {
  const visitedEdges = new Set()

  history.forEach((entry, index) => {
    const [nodeId, branchKey] = String(entry).split(":")

    if (branchKey) {
      visitedEdges.add(`${nodeId}:${branchKey}`)
      return
    }

    const nextEntry = history[index + 1]

    if (!nextEntry || String(nextEntry).includes(":")) {
      return
    }

    visitedEdges.add(`${nodeId}->${nextEntry}`)
  })

  return visitedEdges
}

function getTextLines(text, maxChars = 18) {
  const words = text.split(" ")
  const lines = []
  let currentLine = ""

  words.forEach((word) => {
    const nextLine = currentLine ? `${currentLine} ${word}` : word

    if (nextLine.length > maxChars && currentLine) {
      lines.push(currentLine)
      currentLine = word
      return
    }

    currentLine = nextLine
  })

  if (currentLine) {
    lines.push(currentLine)
  }

  return lines
}

function setSvgAttributes(element, attributes) {
  Object.entries(attributes).forEach(([name, value]) => {
    element.setAttribute(name, value)
  })
}

function createNodeShape(node, box) {
  if (node.type === "terminator") {
    const rect = createSvgElement("rect", "trace-svg-node-shape")
    setSvgAttributes(rect, {
      x: box.x,
      y: box.y,
      width: box.w,
      height: box.h,
      rx: box.h / 2,
      ry: box.h / 2,
    })
    return rect
  }

  if (node.type === "decision") {
    const polygon = createSvgElement("polygon", "trace-svg-node-shape")
    setSvgAttributes(polygon, {
      points: `${box.x + box.w / 2},${box.y} ${box.x + box.w},${
        box.y + box.h / 2
      } ${box.x + box.w / 2},${box.y + box.h} ${box.x},${box.y + box.h / 2}`,
    })
    return polygon
  }

  if (node.type === "io") {
    const polygon = createSvgElement("polygon", "trace-svg-node-shape")
    setSvgAttributes(polygon, {
      points: `${box.x + 18},${box.y} ${box.x + box.w},${box.y} ${
        box.x + box.w - 18
      },${box.y + box.h} ${box.x},${box.y + box.h}`,
    })
    return polygon
  }

  const rect = createSvgElement("rect", "trace-svg-node-shape")
  setSvgAttributes(rect, {
    x: box.x,
    y: box.y,
    width: box.w,
    height: box.h,
    rx: 14,
    ry: 14,
  })
  return rect
}

function createSvgNode(node, box, isActive, isVisited) {
  const group = createSvgElement("g", `trace-svg-node trace-svg-node--${node.type}`)
  group.classList.toggle("is-active", isActive)
  group.classList.toggle("is-visited", isVisited)
  group.append(createNodeShape(node, box))

  const text = createSvgElement("text", "trace-svg-node-label")
  const lines = getTextLines(node.label, node.type === "decision" ? 16 : 20)
  const startY = box.y + box.h / 2 - ((lines.length - 1) * 16) / 2

  setSvgAttributes(text, {
    x: box.x + box.w / 2,
    y: startY,
  })

  lines.forEach((line, index) => {
    const tspan = createSvgElement("tspan")
    tspan.textContent = line
    setSvgAttributes(tspan, {
      x: box.x + box.w / 2,
      dy: index === 0 ? 0 : 18,
    })
    text.append(tspan)
  })

  group.append(text)
  return group
}

function renderTraceEdge(svg, edge, visitedEdges) {
  const polyline = createSvgElement("polyline", "trace-svg-edge")
  const isVisited = visitedEdges.has(edge.id)
  polyline.classList.toggle("is-visited", isVisited)
  setSvgAttributes(polyline, {
    points: edge.points.map(([x, y]) => `${x},${y}`).join(" "),
    markerEnd: "url(#trace-arrow)",
  })
  svg.append(polyline)

  if (edge.label) {
    const label = createSvgElement(
      "text",
      `trace-svg-edge-label trace-svg-edge-label--${edge.label.toLowerCase()}`
    )
    label.textContent = edge.label
    setSvgAttributes(label, {
      x: edge.labelAt[0],
      y: edge.labelAt[1],
    })
    svg.append(label)
  }
}

function renderTraceFlow(container, scenario, state) {
  const visitedIds = getVisitedNodeIds(state.history)
  const visitedEdges = getVisitedEdgeIds(state.history)
  const svg = createSvgElement("svg", "trace-svg")
  const defs = createSvgElement("defs")
  const marker = createSvgElement("marker")
  const arrow = createSvgElement("path")

  container.replaceChildren()

  setSvgAttributes(svg, {
    viewBox: scenario.diagram.viewBox,
    role: "img",
    "aria-label": `${scenario.title} flow chart`,
  })
  setSvgAttributes(marker, {
    id: "trace-arrow",
    viewBox: "0 0 10 10",
    refX: 8,
    refY: 5,
    markerWidth: 7,
    markerHeight: 7,
    orient: "auto-start-reverse",
  })
  setSvgAttributes(arrow, {
    d: "M 0 0 L 10 5 L 0 10 z",
  })
  marker.append(arrow)
  defs.append(marker)
  svg.append(defs)

  scenario.diagram.edges.forEach((edge) => {
    renderTraceEdge(svg, edge, visitedEdges)
  })

  scenario.nodes.forEach((node) => {
    svg.append(
      createSvgNode(
        node,
        scenario.diagram.nodes[node.id],
        node.id === state.activeId,
        visitedIds.has(node.id)
      )
    )
  })

  container.append(svg)
}

function renderTraceLog(container, scenario, history) {
  container.replaceChildren()

  history.forEach((entry) => {
    const item = createElement("li")
    const [nodeId, branchKey] = String(entry).split(":")
    const node = getNode(scenario, nodeId)

    if (branchKey) {
      const targetNode = getNode(scenario, node.branches?.[branchKey])
      item.textContent = `${node.label}: ${formatBranchLabel(branchKey)} -> ${
        targetNode.label
      }`
    } else {
      item.textContent = node.label
    }

    container.append(item)
  })
}

function saveTraceState(state) {
  writeStorage(TRACE_STORAGE_KEY, state)
}

function renderTraceTool(tool, state) {
  const scenario = getScenario(state.scenario)
  const activeNode = getNode(scenario, state.activeId)
  const scenarioSelect = tool.querySelector("[data-role='trace-scenario']")
  const nextButton = tool.querySelector("[data-action='trace-next']")
  const choices = tool.querySelector("[data-role='trace-choices']")

  if (scenarioSelect) {
    scenarioSelect.value = state.scenario
  }

  renderTraceFlow(tool.querySelector("[data-role='trace-flow']"), scenario, state)
  renderTraceLog(
    tool.querySelector("[data-role='trace-log']"),
    scenario,
    state.history
  )

  tool.querySelector("[data-role='trace-status']").textContent = `Step ${
    state.history.length
  }`
  tool.querySelector("[data-role='trace-current']").textContent =
    activeNode.label
  tool.querySelector("[data-role='trace-detail']").textContent =
    activeNode.detail

  choices.replaceChildren()

  if (activeNode.branches) {
    Object.keys(activeNode.branches).forEach((branchKey) => {
      const button = createElement(
        "button",
        "trace-button trace-button--choice",
        formatBranchLabel(branchKey)
      )
      button.type = "button"
      button.addEventListener("click", () => {
        state.history.push(`${activeNode.id}:${branchKey}`)
        state.activeId = activeNode.branches[branchKey]
        state.history.push(state.activeId)
        saveTraceState(state)
        renderTraceTool(tool, state)
      })
      choices.append(button)
    })
  }

  nextButton.disabled = !activeNode.next
  nextButton.hidden = Boolean(activeNode.branches)
}

function resetTraceState(tool, state) {
  const scenario = getScenario(state.scenario)
  state.activeId = scenario.start
  state.history = [scenario.start]
  saveTraceState(state)
  renderTraceTool(tool, state)
}

function initTraceTool() {
  const tool = document.querySelector("[data-role='flow-trace-tool']")

  if (!tool) {
    return
  }

  const state = normaliseTraceState(
    readStorage(TRACE_STORAGE_KEY, getInitialTraceState())
  )

  tool
    .querySelector("[data-role='trace-scenario']")
    ?.addEventListener("change", (event) => {
      state.scenario = event.target.value
      resetTraceState(tool, state)
    })

  tool.querySelector("[data-action='trace-next']")?.addEventListener("click", () => {
    const scenario = getScenario(state.scenario)
    const activeNode = getNode(scenario, state.activeId)

    if (!activeNode.next) {
      return
    }

    state.activeId = activeNode.next
    state.history.push(state.activeId)
    saveTraceState(state)
    renderTraceTool(tool, state)
  })

  tool
    .querySelector("[data-action='trace-reset']")
    ?.addEventListener("click", () => resetTraceState(tool, state))

  renderTraceTool(tool, state)
}

initLessonPage(lessonConfig)
initTraceTool()
