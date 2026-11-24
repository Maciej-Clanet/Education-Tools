import { initLessonPage } from "../core/lesson-shell.js"
import { readStorage, writeStorage } from "../core/storage.js"
import { initPairedScenarios } from "../core/paired-scenarios.js"
import { initTeachingAnimations } from "../core/teaching-animation.js"
import { initLessonWalkthroughs } from "../core/lesson-walkthrough.js"
import { communicationScenarios } from "../data/communication-scenarios.js"

const lessonConfig = {
  lessonId: "communication-channels-and-connection-methods",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-e",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Multi-dimensional arrays and memory order",
        description: "Previous in D2 Indices and matrices.",
        status: "Live",
        href: "../topics/multi-dimensional-arrays-and-memory-order.html",
      },
      next: {
        title: "Transmission methods: synchronous, asynchronous, serial, and parallel",
        description: "Next in E1 Transmitting data.",
        status: "Live",
        href: "../topics/transmission-methods-synchronous-asynchronous-serial-and-parallel.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-communication-channels-and-connection-methods-quiz",
    passScore: 4,
    version: 2,
  },
  examPractice: { storageKey: "lesson-communication-channels-and-connection-methods-exam-practice" },
}

// New activities do not reuse the retired scenario chooser's saved selection.
const PRACTICE_KEY = "lesson-communication-matching-v1"

function initMatchingPractice() {
  const saved = readStorage(PRACTICE_KEY, {})
  const groups = [...document.querySelectorAll('[data-practice]')]
  const state = {}
  const save = () => writeStorage(PRACTICE_KEY, state)
  groups.forEach(group => {
    const key = group.dataset.practice
    const cards = [...group.querySelectorAll('[data-practice-card]')]
    const previous = group.querySelector('[data-practice-prev]')
    const next = group.querySelector('[data-practice-next]')
    const progress = group.querySelector('[data-practice-progress]')
    const stored = saved?.[key]
    state[key] = { index: Number.isInteger(stored?.index) ? stored.index : 0, answers: {} }
    const show = requested => {
      const index = Math.max(0, Math.min(cards.length - 1, requested))
      state[key].index = index
      cards.forEach((card, i) => { card.hidden = i !== index })
      previous.setAttribute('aria-disabled', String(index === 0))
      next.setAttribute('aria-disabled', String(index === cards.length - 1))
      progress.textContent = `Task ${index + 1} of ${cards.length}`
    }
    cards.forEach(card => {
      const id = card.dataset.pairedScenario
      const selects = [...card.querySelectorAll('[data-choice]')]
      const record = () => {
        state[key].answers[id] = Object.fromEntries(selects.map(select => [select.dataset.choice, select.value]))
      }
      selects.forEach(select => {
        const value = stored?.answers?.[id]?.[select.dataset.choice]
        if (typeof value === 'string' && [...select.options].some(option => option.value === value)) select.value = value
        select.addEventListener('change', () => { record(); save() })
      })
      record()
      // The shared component clears the fields before this persistence listener runs.
      card.querySelector('[data-reset-pair]').addEventListener('click', () => { record(); save() })
    })
    previous.addEventListener('click', () => { show(state[key].index - 1); save() })
    next.addEventListener('click', () => { show(state[key].index + 1); save() })
    group.dataset.practiceReady = 'true'
    group.querySelector('[data-practice-controls]').hidden = false
    show(state[key].index)
  })
}

function initSharedBus() {
  const bus = document.querySelector('[data-shared-bus]')
  const meters = [...bus.querySelectorAll('[data-meter]')]
  meters.forEach(meter => meter.addEventListener('click', () => {
    meters.forEach(button => button.setAttribute('aria-pressed', String(button === meter)))
    const number = meter.dataset.meter
    bus.querySelector('[data-bus-status]').textContent = `The controller asks Meter ${number} for a reading. Only Meter ${number} replies.`
  }))
}

function initFactors() {
  const tool = document.querySelector('[data-factor-tool]')
  const buttons = [...tool.querySelectorAll('[data-factor]')]
  const panels = [...tool.querySelectorAll('[data-factor-panel]')]
  const show = key => {
    panels.forEach(panel => { panel.hidden = panel.dataset.factorPanel !== key })
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.factor === key)))
  }
  buttons.forEach(button => {
    button.setAttribute('aria-controls', `factor-${button.dataset.factor}`)
    button.addEventListener('click', () => show(button.dataset.factor))
  })
  tool.dataset.factorReady = 'true'
  tool.querySelector('[data-factor-controls]').hidden = false
  show(buttons[0].dataset.factor)
}

initLessonPage(lessonConfig)
initPairedScenarios(communicationScenarios)
initMatchingPractice()
initSharedBus()
initFactors()
initLessonWalkthroughs()
initTeachingAnimations()
document.body.dataset.communicationReady = 'true'
