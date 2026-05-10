import { initLessonPage } from "../core/lesson-shell.js"
import { readStorage, writeStorage } from "../core/storage.js"

const lessonConfig = {
  lessonId: "packet-data-packet-switching-and-protocols",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-e",
      backLabel: "Back to Unit 2 content",
      previous: {
        title:
          "Transmission methods: synchronous, asynchronous, serial, and parallel",
        description: "Previous in E1 Transmitting data.",
        status: "Live",
        href: "../topics/transmission-methods-synchronous-asynchronous-serial-and-parallel.html",
      },
      next: {
        title: "Encryption and data compression",
        description: "Next in E1 Transmitting data.",
        status: "Live",
        href: "../topics/encryption-and-data-compression.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-packet-data-packet-switching-and-protocols-quiz",
    passScore: 4,
    version: 2,
  },
  examPractice: {
    storageKey:
      "lesson-packet-data-packet-switching-and-protocols-exam-practice",
  },
}

const SIM_STORAGE_KEY = "lesson-packet-switching-simulator"
const SOURCE_NAME = "Client A"
const DESTINATION_NAME = "Server B"
const ROUTES = ["A", "B", "C"]
const MAX_LOG_ITEMS = 8
const EXAMPLE_MESSAGES = [
  "Packet switching helps data cross busy networks efficiently.",
  "Save the diagram and send it to the classroom server.",
  "Meet in lab two after lunch for the network practical.",
  "The receiver rebuilds the message after all packets arrive.",
]

const DEFAULT_STATE = {
  message: "Packet switching helps data cross busy networks efficiently.",
  settings: {
    outOfOrder: true,
    packetLoss: false,
    corruption: false,
    autoResend: true,
  },
  packets: [],
  queue: [],
  arrivals: [],
  received: [],
  activeAttempt: null,
  status: "Ready",
  log: ["Simulator ready. Edit the message or send the first packet."],
}

const MOTION_QUERY = window.matchMedia("(prefers-reduced-motion: reduce)")

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

function cloneDefaultState() {
  return JSON.parse(JSON.stringify(DEFAULT_STATE))
}

function normaliseState(savedState) {
  return {
    ...cloneDefaultState(),
    ...savedState,
    settings: {
      ...DEFAULT_STATE.settings,
      ...(savedState?.settings ?? {}),
    },
    packets: Array.isArray(savedState?.packets) ? savedState.packets : [],
    queue: Array.isArray(savedState?.queue) ? savedState.queue : [],
    arrivals: Array.isArray(savedState?.arrivals) ? savedState.arrivals : [],
    received: Array.isArray(savedState?.received) ? savedState.received : [],
    log: Array.isArray(savedState?.log) ? savedState.log : DEFAULT_STATE.log,
  }
}

function calculateChecksum(payload, packetNumber, totalPackets) {
  let total = packetNumber * 11 + totalPackets * 7

  for (const character of payload) {
    total += character.charCodeAt(0)
  }

  return total % 97
}

function chunkMessage(message) {
  const chunkSize = message.length > 54 ? 8 : 6
  const chunks = []

  for (let index = 0; index < message.length; index += chunkSize) {
    chunks.push(message.slice(index, index + chunkSize))
  }

  return chunks
}

function createPackets(message) {
  const chunks = chunkMessage(message)

  return chunks.map((payload, index) => {
    const id = index + 1
    const totalPackets = chunks.length

    return {
      id,
      totalPackets,
      payload,
      source: SOURCE_NAME,
      destination: DESTINATION_NAME,
      checksum: calculateChecksum(payload, id, totalPackets),
      status: "queued",
      note: "Prepared at the sender.",
      attempts: 0,
    }
  })
}

function createCorruptedPayload(payload) {
  if (!payload) {
    return payload
  }

  const characters = payload.split("")
  const changeIndex = payload.length > 1 ? 1 : 0
  characters[changeIndex] = characters[changeIndex] === "#" ? "!" : "#"
  return characters.join("")
}

function getPacketById(state, packetId) {
  return state.packets.find((packet) => packet.id === packetId)
}

function getReceivedById(state, packetId) {
  return state.received.find((packet) => packet.id === packetId)
}

function chooseIssueIds(settings, packets) {
  const ids = packets.map((packet) => packet.id)
  const lostId = settings.packetLoss && ids.length > 1 ? ids[1] : null
  const corruptCandidate = ids.find((id) => id !== lostId)
  const corruptedId = settings.corruption ? corruptCandidate ?? null : null

  return { lostId, corruptedId }
}

function buildInitialQueue(settings, packets) {
  const { lostId, corruptedId } = chooseIssueIds(settings, packets)
  const orderedPackets = settings.outOfOrder
    ? [...packets].sort((a, b) => {
        const priority = [2, 0, 1]
        return priority[(a.id - 1) % 3] - priority[(b.id - 1) % 3]
      })
    : packets

  return orderedPackets.map((packet, index) => ({
    packetId: packet.id,
    route: ROUTES[index % ROUTES.length],
    outcome:
      packet.id === lostId
        ? "lost"
        : packet.id === corruptedId
          ? "corrupted"
          : "normal",
    isResend: false,
  }))
}

function getResendNeededPacketIds(state) {
  return state.packets
    .filter(
      (packet) =>
        (packet.status === "lost" || packet.status === "corrupted") &&
        !getReceivedById(state, packet.id)
    )
    .map((packet) => packet.id)
}

function addLog(state, message) {
  state.log = [message, ...state.log].slice(0, MAX_LOG_ITEMS)
}

function queueResends(state) {
  const queuedResends = new Set(
    state.queue
      .filter((attempt) => attempt.isResend)
      .map((attempt) => attempt.packetId)
  )
  const outstanding = getResendNeededPacketIds(state).filter(
    (id) => !queuedResends.has(id)
  )

  outstanding.forEach((packetId, index) => {
    state.queue.push({
      packetId,
      route: ROUTES[(packetId + index) % ROUTES.length],
      outcome: "normal",
      isResend: true,
    })

    const packet = getPacketById(state, packetId)
    if (packet) {
      packet.status = "queued"
      packet.note = "Retransmission queued."
    }
  })

  if (outstanding.length > 0) {
    addLog(
      state,
      `Retransmission queued for packet${outstanding.length === 1 ? "" : "s"} ${outstanding.join(", ")}.`
    )
  }
}

function updateCompletion(state) {
  if (!state.packets.length) {
    state.status = "Ready"
    return
  }

  if (state.received.length === state.packets.length) {
    state.status = "Complete"
    return
  }

  if (state.queue.length > 0) {
    state.status = "Transmitting"
    return
  }

  state.status = "Action needed"
}

function startSimulation(message, settings) {
  const cleanMessage = message.trim()

  if (!cleanMessage) {
    return {
      ...cloneDefaultState(),
      message,
      settings,
      log: ["Type a message to create packets."],
    }
  }

  const packets = createPackets(cleanMessage)
  const nextState = {
    ...cloneDefaultState(),
    message,
    settings,
    packets,
    queue: buildInitialQueue(settings, packets),
    log: [
      `Message split into ${packets.length} packet${packets.length === 1 ? "" : "s"}.`,
    ],
    status: "Ready to send",
  }

  return nextState
}

function processNextAttempt(state) {
  if (!state.queue.length) {
    addLog(state, "No packets are waiting to travel.")
    updateCompletion(state)
    return state
  }

  const attempt = state.queue.shift()
  const packet = getPacketById(state, attempt.packetId)

  if (!packet) {
    updateCompletion(state)
    return state
  }

  packet.attempts += 1
  state.activeAttempt = attempt

  if (attempt.outcome === "lost") {
    packet.status = "lost"
    packet.note = `Lost while travelling on route ${attempt.route}.`
    addLog(state, `Packet ${packet.id} was lost on route ${attempt.route}.`)

    if (state.settings.autoResend) {
      queueResends(state)
    }

    updateCompletion(state)
    return state
  }

  const payloadToCheck =
    attempt.outcome === "corrupted"
      ? createCorruptedPayload(packet.payload)
      : packet.payload
  const receivedChecksum = calculateChecksum(
    payloadToCheck,
    packet.id,
    packet.totalPackets
  )
  const isValid = receivedChecksum === packet.checksum

  state.arrivals.unshift({
    packetId: packet.id,
    payload: payloadToCheck,
    route: attempt.route,
    status: isValid ? "accepted" : "corrupted",
    resent: attempt.isResend,
    checksum: packet.checksum,
  })

  if (!isValid) {
    packet.status = "corrupted"
    packet.note = `Arrived on route ${attempt.route}, but checksum failed.`
    addLog(state, `Packet ${packet.id} arrived but failed its checksum.`)

    if (state.settings.autoResend) {
      queueResends(state)
    }

    updateCompletion(state)
    return state
  }

  packet.status = "delivered"
  packet.note = attempt.isResend
    ? "Accepted after retransmission."
    : `Accepted after travelling on route ${attempt.route}.`
  state.received = state.received.filter((item) => item.id !== packet.id)
  state.received.push({
    id: packet.id,
    payload: packet.payload,
    resent: attempt.isResend,
  })
  addLog(
    state,
    `Packet ${packet.id} reached the receiver${attempt.isResend ? " after retransmission" : ""}.`
  )

  updateCompletion(state)
  return state
}

function resetSimulation(
  message = DEFAULT_STATE.message,
  settings = DEFAULT_STATE.settings
) {
  return startSimulation(message, { ...settings })
}

function createPacketField(label, value) {
  const field = createElement("div", "packet-field")
  field.append(
    createElement("span", "", label),
    createElement("strong", "", String(value))
  )
  return field
}

function createPacketCard(packet, status = packet.status, note = packet.note) {
  const card = createElement("article", "packet-card")
  card.dataset.state = status

  const top = createElement("div", "packet-top")
  top.append(
    createElement("strong", "", `Packet ${packet.id}/${packet.totalPackets}`),
    createElement("span", `packet-badge packet-badge--${status}`, status)
  )

  const fields = createElement("div", "packet-fields")
  fields.append(
    createPacketField("Payload", packet.payload),
    createPacketField("Source", packet.source),
    createPacketField("Destination", packet.destination),
    createPacketField("Checksum", packet.checksum)
  )

  card.append(top, fields, createElement("p", "packet-note", note))
  return card
}

function renderPacketList(container, packets, emptyText) {
  container.replaceChildren()

  if (!packets.length) {
    container.classList.add("is-empty")
    container.textContent = emptyText
    return
  }

  container.classList.remove("is-empty")
  packets.forEach((packet) => {
    container.append(createPacketCard(packet))
  })
}

function renderArrivalList(container, state) {
  container.replaceChildren()

  if (!state.arrivals.length) {
    container.classList.add("is-empty")
    container.textContent = "Accepted and rejected arrivals will appear here."
    return
  }

  container.classList.remove("is-empty")
  state.arrivals.forEach((arrival) => {
    const packet = getPacketById(state, arrival.packetId)
    const card = createPacketCard(
      {
        ...packet,
        payload: arrival.payload,
      },
      arrival.status,
      arrival.status === "accepted"
        ? `${arrival.resent ? "Retransmitted and " : ""}arrived on route ${arrival.route}.`
        : `Arrived on route ${arrival.route}, but checksum failed.`
    )
    container.append(card)
  })
}

function renderNetworkStage(container) {
  container.replaceChildren()

  ROUTES.forEach((route) => {
    const lane = createElement("article", "network-lane-card")
    lane.dataset.route = route
    lane.append(
      createElement("span", "route-label", `Route ${route}`),
      createElement("span", "route-node", SOURCE_NAME),
      createElement("span", "route-line"),
      createElement("span", "route-end", DESTINATION_NAME)
    )

    container.append(lane)
  })
}

function renderReassembly(container, state) {
  container.replaceChildren()

  if (!state.packets.length) {
    container.classList.add("is-empty")
    container.textContent = "Reassembly slots will appear after packets are created."
    return
  }

  container.classList.remove("is-empty")
  state.packets.forEach((packet) => {
    const received = getReceivedById(state, packet.id)
    const slot = createElement("article", "slot-card")
    slot.dataset.state = received
      ? "ready"
      : packet.status === "lost" || packet.status === "corrupted"
        ? "issue"
        : "waiting"

    slot.append(
      createElement("strong", "", `Packet ${packet.id}`),
      createElement(
        "span",
        "slot-payload",
        received
          ? received.payload
          : packet.status === "lost"
            ? "missing"
            : packet.status === "corrupted"
              ? "checksum failed"
              : "waiting"
      )
    )
    container.append(slot)
  })
}

function getFinalMessage(state) {
  if (!state.packets.length) {
    return "The reconstructed message will appear here."
  }

  if (state.received.length === state.packets.length) {
    return state.packets
      .map((packet) => getReceivedById(state, packet.id)?.payload ?? "")
      .join("")
  }

  return state.packets
    .map((packet) => {
      const received = getReceivedById(state, packet.id)
      if (received) {
        return received.payload
      }

      return `[packet ${packet.id} pending]`
    })
    .join("")
}

function renderLog(container, state) {
  container.replaceChildren(
    ...state.log.map((message) => createElement("li", "log-entry", message))
  )
}

function animateAttempt(tool, state, attempt, index, shouldStagger) {
  const lane = tool.querySelector(`[data-route='${attempt.route}']`)
  const packet = getPacketById(state, attempt.packetId)

  if (!lane || !packet) {
    return Promise.resolve()
  }

  const movingPacket = createElement(
    "span",
    `moving-packet moving-packet--${attempt.outcome}`,
    `Packet ${packet.id}`
  )
  const duration = MOTION_QUERY.matches ? 80 : 1250 + index * 90
  const delay = shouldStagger && !MOTION_QUERY.matches ? index * 130 : 0

  movingPacket.style.animationDuration = `${duration}ms`
  movingPacket.style.animationDelay = `${delay}ms`
  lane.append(movingPacket)

  return new Promise((resolve) => {
    window.setTimeout(() => {
      movingPacket.remove()
      resolve()
    }, duration + delay + 80)
  })
}

function animateAttempts(tool, state, attempts, shouldStagger = false) {
  return Promise.all(
    attempts.map((attempt, index) =>
      animateAttempt(tool, state, attempt, index, shouldStagger)
    )
  )
}

function setText(root, role, text) {
  const element = root.querySelector(`[data-role='${role}']`)

  if (element) {
    element.textContent = text
  }
}

function readSettings(tool) {
  return {
    outOfOrder: Boolean(
      tool.querySelector("[data-setting='out-of-order']")?.checked
    ),
    packetLoss: Boolean(
      tool.querySelector("[data-setting='packet-loss']")?.checked
    ),
    corruption: Boolean(
      tool.querySelector("[data-setting='corruption']")?.checked
    ),
    autoResend: Boolean(
      tool.querySelector("[data-setting='auto-resend']")?.checked
    ),
  }
}

function renderSimulator(tool, state, isAnimating = false) {
  const messageInput = tool.querySelector("[data-role='packet-message']")
  const settings = {
    "out-of-order": state.settings.outOfOrder,
    "packet-loss": state.settings.packetLoss,
    corruption: state.settings.corruption,
    "auto-resend": state.settings.autoResend,
  }

  if (messageInput && messageInput.value !== state.message) {
    messageInput.value = state.message
  }

  Object.entries(settings).forEach(([setting, value]) => {
    const input = tool.querySelector(`[data-setting='${setting}']`)
    if (input) {
      input.checked = value
      input.closest(".setting-card")?.classList.toggle("is-selected", value)
    }
  })

  renderPacketList(
    tool.querySelector("[data-role='sender-packets']"),
    state.packets,
    "Packets will appear here after the message is split."
  )
  renderArrivalList(tool.querySelector("[data-role='arrival-packets']"), state)
  renderNetworkStage(tool.querySelector("[data-role='network-stage']"))
  renderReassembly(tool.querySelector("[data-role='reassembly-slots']"), state)
  renderLog(tool.querySelector("[data-role='packet-log']"), state)

  setText(tool, "packet-status", state.status)
  setText(tool, "sender-count", `${state.packets.length} prepared`)
  setText(tool, "arrival-count", `${state.arrivals.length} arrivals`)
  setText(tool, "queue-count", `${state.queue.length} waiting`)
  setText(tool, "final-message", getFinalMessage(state))

  const nextButton = tool.querySelector("[data-action='next-packet']")
  const runButton = tool.querySelector("[data-action='run-all']")
  const resendButton = tool.querySelector("[data-action='resend-packets']")
  const resetButton = tool.querySelector("[data-action='reset-simulation']")
  const randomButton = tool.querySelector("[data-action='random-message']")
  const settingInputs = tool.querySelectorAll("[data-setting]")
  const resendNeeded = getResendNeededPacketIds(state)
  const queuedResendIds = new Set(
    state.queue
      .filter((attempt) => attempt.isResend)
      .map((attempt) => attempt.packetId)
  )

  if (nextButton) {
    nextButton.disabled = isAnimating || state.queue.length === 0
  }

  if (runButton) {
    runButton.disabled = isAnimating || state.queue.length === 0
  }

  if (resendButton) {
    resendButton.disabled =
      isAnimating ||
      resendNeeded.length === 0 ||
      resendNeeded.every((id) => queuedResendIds.has(id))
  }

  if (resetButton) {
    resetButton.disabled = isAnimating
  }

  if (randomButton) {
    randomButton.disabled = isAnimating
  }

  if (messageInput) {
    messageInput.disabled = isAnimating
  }

  settingInputs.forEach((input) => {
    input.disabled = isAnimating
  })
}

function saveState(state) {
  writeStorage(SIM_STORAGE_KEY, state)
}

function initPacketSimulator() {
  const tool = document.querySelector("[data-role='packet-simulator']")

  if (!tool) {
    return
  }

  let state = normaliseState(readStorage(SIM_STORAGE_KEY, cloneDefaultState()))
  let isAnimating = false

  function commit(nextState) {
    state = normaliseState(nextState)
    saveState(state)
    renderSimulator(tool, state, isAnimating)
  }

  function prepareCurrentSimulation() {
    const message =
      tool.querySelector("[data-role='packet-message']")?.value ?? ""
    commit(startSimulation(message, readSettings(tool)))
  }

  async function sendNextPacket() {
    if (isAnimating || !state.queue.length) {
      return
    }

    const attempt = state.queue[0]
    isAnimating = true
    renderSimulator(tool, state, isAnimating)
    await animateAttempts(tool, state, [attempt])
    isAnimating = false
    commit(processNextAttempt(state))
  }

  async function runRemainingPackets() {
    if (isAnimating || !state.queue.length) {
      return
    }

    isAnimating = true
    renderSimulator(tool, state, isAnimating)

    let guard = 0
    while (state.queue.length > 0 && guard < 80) {
      const batch = [...state.queue]
      await animateAttempts(tool, state, batch, true)

      batch.forEach(() => {
        state = processNextAttempt(state)
      })

      guard += batch.length
      saveState(state)
      renderSimulator(tool, state, isAnimating)
    }

    isAnimating = false
    commit(state)
  }

  tool
    .querySelector("[data-role='packet-message']")
    ?.addEventListener("input", (event) => {
      commit(startSimulation(event.target.value, readSettings(tool)))
    })

  tool.querySelectorAll("[data-setting]").forEach((input) => {
    input.addEventListener("change", prepareCurrentSimulation)
  })

  tool
    .querySelector("[data-action='random-message']")
    ?.addEventListener("click", () => {
      const message =
        EXAMPLE_MESSAGES[Math.floor(Math.random() * EXAMPLE_MESSAGES.length)]
      commit(startSimulation(message, readSettings(tool)))
    })

  tool
    .querySelector("[data-action='next-packet']")
    ?.addEventListener("click", sendNextPacket)

  tool
    .querySelector("[data-action='run-all']")
    ?.addEventListener("click", runRemainingPackets)

  tool
    .querySelector("[data-action='resend-packets']")
    ?.addEventListener("click", () => {
      queueResends(state)
      updateCompletion(state)
      commit(state)
    })

  tool
    .querySelector("[data-action='reset-simulation']")
    ?.addEventListener("click", () => {
      commit(resetSimulation())
    })

  if (!state.packets.length && state.message.trim()) {
    state = startSimulation(state.message, state.settings)
    saveState(state)
  }

  renderSimulator(tool, state, isAnimating)
}

initLessonPage(lessonConfig)
initPacketSimulator()
