import { initLessonPage } from "../core/lesson-shell.js"
import { readStorage, writeStorage } from "../core/storage.js"

const lessonConfig = {
  lessonId: "cpu-performance-instruction-sets-and-cache",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-b",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "The instruction cycle",
        description: "Previous in B2 The concepts of microarchitecture.",
        status: "Live",
        href: "../topics/instruction-cycle.html",
      },
      next: {
        title: "Pipelining, multi-processing, and multi-threading",
        description: "Next in B2 The concepts of microarchitecture.",
        status: "Live",
        href: "../topics/pipelining-multi-processing-and-multi-threading.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-cpu-performance-instruction-sets-and-cache-quiz",
    passScore: 4,
  },
  examPractice: {
    storageKey: "lesson-cpu-performance-instruction-sets-and-cache-exam-practice",
  },
}

const CACHE_SIMULATOR_STORAGE_KEY =
  "lesson-cpu-performance-instruction-sets-and-cache-simulator"
const CACHE_SLOT_COUNT = 4
const ACCESS_PATTERN = ["12", "13", "12", "14", "12", "13", "18", "12"]

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function normaliseCacheState(value) {
  const stepIndex = Number.isInteger(value?.stepIndex) ? value.stepIndex : 0

  return {
    stepIndex: clamp(stepIndex, 0, ACCESS_PATTERN.length),
  }
}

function calculateCacheSnapshot(stepIndex) {
  const cache = []
  const events = []

  ACCESS_PATTERN.slice(0, stepIndex).forEach((address, index) => {
    const existingIndex = cache.indexOf(address)
    const hit = existingIndex !== -1

    if (!hit) {
      if (cache.length >= CACHE_SLOT_COUNT) {
        cache.shift()
      }

      cache.push(address)
    }

    events.push({
      address,
      hit,
      index,
      slotIndex: hit ? existingIndex : cache.indexOf(address),
    })
  })

  return { cache, events }
}

function createCacheSlot(address, index, activeEvent) {
  const slot = document.createElement("article")
  slot.className = "cache-slot"
  slot.classList.toggle(
    "is-active",
    activeEvent?.slotIndex === index && activeEvent?.address === address
  )
  slot.classList.toggle("is-hit", activeEvent?.hit && activeEvent?.address === address)
  slot.classList.toggle(
    "is-miss",
    activeEvent && !activeEvent.hit && activeEvent.address === address
  )

  const label = document.createElement("span")
  label.className = "cache-slot-label"
  label.textContent = `Slot ${index + 1}`

  const value = document.createElement("strong")
  value.textContent = address ?? "Empty"

  const note = document.createElement("span")
  note.textContent = address
    ? `Address ${address} is currently stored in cache.`
    : "No address copied into this slot yet."

  slot.append(label, value, note)
  return slot
}

function createRequestItem(address, index, events, activeIndex) {
  const event = events[index]
  const request = document.createElement("article")
  request.className = "memory-request"
  request.classList.toggle("is-active", index === activeIndex)
  request.classList.toggle("is-hit", Boolean(event?.hit))
  request.classList.toggle("is-miss", Boolean(event && !event.hit))

  const position = document.createElement("strong")
  position.textContent = `${index + 1}`

  const value = document.createElement("span")
  value.textContent = `Address ${address}`

  const status = document.createElement("span")
  status.className = "request-status"
  status.textContent = event ? (event.hit ? "Hit" : "Miss") : "Waiting"

  request.append(position, value, status)
  return request
}

function formatHitRate(events) {
  if (events.length === 0) {
    return "Hit rate: 0%"
  }

  const hits = events.filter((event) => event.hit).length
  const percentage = Math.round((hits / events.length) * 100)

  return `Hit rate: ${percentage}% (${hits}/${events.length})`
}

function initCacheSimulator() {
  const simulator = document.querySelector("[data-role='cache-simulator']")

  if (!simulator) {
    return
  }

  const slots = simulator.querySelector("[data-role='cache-slots']")
  const requestTrack = simulator.querySelector("[data-role='memory-request-track']")
  const stepCounter = simulator.querySelector("[data-role='cache-step-counter']")
  const resultPill = simulator.querySelector("[data-role='cache-result-pill']")
  const hitRate = simulator.querySelector("[data-role='cache-hit-rate']")
  const status = simulator.querySelector("[data-role='cache-status']")
  const explanation = simulator.querySelector("[data-role='cache-explanation']")
  const previousButton = simulator.querySelector("[data-cache-action='previous']")
  const nextButton = simulator.querySelector("[data-cache-action='next']")

  let state = normaliseCacheState(
    readStorage(CACHE_SIMULATOR_STORAGE_KEY, { stepIndex: 0 })
  )

  function saveState() {
    writeStorage(CACHE_SIMULATOR_STORAGE_KEY, state)
  }

  function render() {
    const { cache, events } = calculateCacheSnapshot(state.stepIndex)
    const activeEvent = events[events.length - 1] ?? null
    const activeRequestIndex = state.stepIndex - 1
    const nextAddress = ACCESS_PATTERN[state.stepIndex]
    const cacheSlots = Array.from({ length: CACHE_SLOT_COUNT }, (_, index) =>
      createCacheSlot(cache[index], index, activeEvent)
    )
    const requestItems = ACCESS_PATTERN.map((address, index) =>
      createRequestItem(address, index, events, activeRequestIndex)
    )

    slots?.replaceChildren(...cacheSlots)
    requestTrack?.replaceChildren(...requestItems)

    if (stepCounter) {
      stepCounter.textContent = `Access ${state.stepIndex} of ${ACCESS_PATTERN.length}`
    }

    if (hitRate) {
      hitRate.textContent = formatHitRate(events)
    }

    if (resultPill) {
      resultPill.textContent = activeEvent
        ? activeEvent.hit
          ? "Cache hit"
          : "Cache miss"
        : "Ready"
    }

    if (status) {
      status.textContent = activeEvent
        ? activeEvent.hit
          ? `Address ${activeEvent.address} was already in cache, so the CPU can continue quickly.`
          : `Address ${activeEvent.address} was not in cache, so it is copied from RAM into cache.`
        : "The cache is empty. Step forward to request the first address."
    }

    if (explanation) {
      explanation.textContent = nextAddress
        ? `Next request: address ${nextAddress}. Repeated addresses are more likely to become cache hits.`
        : "All requests are complete. Repeated addresses 12 and 13 became hits after loading into cache."
    }

    if (previousButton) {
      previousButton.disabled = state.stepIndex === 0
    }

    if (nextButton) {
      nextButton.disabled = state.stepIndex === ACCESS_PATTERN.length
    }
  }

  simulator.querySelectorAll("[data-cache-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.cacheAction

      if (action === "previous") {
        state = { stepIndex: Math.max(state.stepIndex - 1, 0) }
      }

      if (action === "next") {
        state = {
          stepIndex: Math.min(state.stepIndex + 1, ACCESS_PATTERN.length),
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
initCacheSimulator()
