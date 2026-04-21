import { initLessonPage } from "../core/lesson-shell.js"
import { readStorage, writeStorage } from "../core/storage.js"

const lessonConfig = {
  lessonId: "stacks-and-queues",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-d",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Resolution, bit depth, and image compression",
        description: "Previous in the Unit 2 teaching order. This lesson is still planned.",
        status: "Planned",
      },
      next: {
        title: "Arrays, lists, and data types",
        description: "Next in D1 Data structures.",
        status: "Live",
        href: "../topics/arrays-lists-and-data-types.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-stacks-and-queues-quiz",
    passScore: 4,
  },
}

const SIMULATOR_STORAGE_KEY = "lesson-stacks-and-queues-simulator"
const MAX_ITEMS = 8

function normaliseSimulatorState(value) {
  return {
    stack: Array.isArray(value?.stack) ? value.stack : [],
    queue: Array.isArray(value?.queue) ? value.queue : [],
  }
}

function createStructureItem(label, badge, structure) {
  const item = document.createElement("li")
  item.className = `structure-item structure-item--${structure}`

  const text = document.createElement("span")
  text.textContent = label

  const badgeElement = document.createElement("span")
  badgeElement.className = "structure-item__badge"
  badgeElement.textContent = badge

  item.append(text, badgeElement)
  return item
}

function createEmptyState(message) {
  const empty = document.createElement("li")
  empty.className = "structure-empty"
  empty.textContent = message
  return empty
}

function initSimulator() {
  const visuals = {
    stack: document.querySelector("[data-role='stack-visual']"),
    queue: document.querySelector("[data-role='queue-visual']"),
  }
  const statuses = {
    stack: document.querySelector("[data-role='stack-status']"),
    queue: document.querySelector("[data-role='queue-status']"),
  }
  const inputs = {
    stack: document.querySelector("#stack-input"),
    queue: document.querySelector("#queue-input"),
  }

  let state = normaliseSimulatorState(
    readStorage(SIMULATOR_STORAGE_KEY, {
      stack: [],
      queue: [],
    })
  )

  function saveState() {
    writeStorage(SIMULATOR_STORAGE_KEY, state)
  }

  function setStatus(structure, message) {
    const element = statuses[structure]

    if (element) {
      element.textContent = message
    }
  }

  function renderStack() {
    const visual = visuals.stack

    if (!visual) {
      return
    }

    visual.replaceChildren()

    if (state.stack.length === 0) {
      visual.append(
        createEmptyState("The stack is empty. Push a value to place it on top.")
      )

      if (!statuses.stack?.textContent) {
        setStatus("stack", "Last in, first out. New items go on top.")
      }

      return
    }

    const displayItems = [...state.stack].reverse()

    displayItems.forEach((item, index) => {
      const badge = index === 0 ? "Top" : "Lower"
      visual.append(createStructureItem(item, badge, "stack"))
    })
  }

  function renderQueue() {
    const visual = visuals.queue

    if (!visual) {
      return
    }

    visual.replaceChildren()

    if (state.queue.length === 0) {
      visual.append(
        createEmptyState(
          "The queue is empty. Enqueue a value to add it to the back."
        )
      )

      if (!statuses.queue?.textContent) {
        setStatus("queue", "First in, first out. Items join at the back.")
      }

      return
    }

    state.queue.forEach((item, index) => {
      let badge = "Middle"

      if (index === 0) {
        badge = "Front"
      } else if (index === state.queue.length - 1) {
        badge = "Back"
      }

      visual.append(createStructureItem(item, badge, "queue"))
    })
  }

  function renderAll() {
    renderStack()
    renderQueue()
  }

  function addItem(structure) {
    const input = inputs[structure]
    const value = input?.value.trim() ?? ""

    if (!value) {
      setStatus(structure, "Type a short label first so the item can be added.")
      input?.focus()
      return
    }

    if (state[structure].length >= MAX_ITEMS) {
      setStatus(
        structure,
        `Keep it to ${MAX_ITEMS} items so the visual stays easy to read.`
      )
      return
    }

    state = {
      ...state,
      [structure]: [...state[structure], value],
    }

    input.value = ""
    setStatus(
      structure,
      structure === "stack"
        ? `"${value}" was pushed onto the stack.`
        : `"${value}" joined the back of the queue.`
    )

    renderAll()
    saveState()
  }

  function removeItem(structure) {
    if (state[structure].length === 0) {
      setStatus(
        structure,
        structure === "stack"
          ? "The stack is already empty."
          : "The queue is already empty."
      )
      return
    }

    const removedItem =
      structure === "stack"
        ? state.stack[state.stack.length - 1]
        : state.queue[0]

    state = {
      ...state,
      [structure]:
        structure === "stack"
          ? state.stack.slice(0, -1)
          : state.queue.slice(1),
    }

    setStatus(
      structure,
      structure === "stack"
        ? `"${removedItem}" was popped from the top of the stack.`
        : `"${removedItem}" left the front of the queue.`
    )

    renderAll()
    saveState()
  }

  function clearItems(structure) {
    state = {
      ...state,
      [structure]: [],
    }

    setStatus(
      structure,
      structure === "stack"
        ? "The stack has been cleared."
        : "The queue has been cleared."
    )

    renderAll()
    saveState()
  }

  document.querySelectorAll("[data-structure-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const structure = button.dataset.structure
      const action = button.dataset.structureAction

      if (!structure || !action) {
        return
      }

      if (action === "add") {
        addItem(structure)
      }

      if (action === "remove") {
        removeItem(structure)
      }

      if (action === "clear") {
        clearItems(structure)
      }
    })
  })

  document.querySelectorAll("[data-structure-input]").forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") {
        return
      }

      event.preventDefault()
      addItem(input.dataset.structure)
    })
  })

  renderAll()
}

initLessonPage(lessonConfig)
initSimulator()
