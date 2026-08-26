import { initCodePreviews } from "../core/code-preview.js"
import { initLessonPage } from "../core/lesson-shell.js"

const TAG_CYCLE_INTERVAL = 2400
const tagCycleStates = new WeakMap()
let tagCycleVisibilityListenerBound = false

const lessonConfig = {
  lessonId: "what-is-html",
  defaultContext: "web-development",
  contexts: {
    "web-development": {
      label: "Web Development",
      backHref: "../resources/web-development.html#html-basics",
      backLabel: "Back to Web Development resources",
      previous: {
        title: "Start of HTML basics",
        description:
          "Use the Web Development hub if you want to jump to another topic.",
        status: "Start",
      },
      next: {
        title: "HTML document structure",
        description:
          "Next planned HTML basics lesson on page structure, headings, paragraphs, lists, and links.",
        status: "Planned",
      },
    },
  },
  quiz: {
    storageKey: "lesson-what-is-html-quiz",
    passScore: 6,
  },
}

function createTagCycleButton(label, action) {
  const button = document.createElement("button")
  button.className = "tag-cycle__button"
  button.type = "button"
  button.dataset.action = action
  button.textContent = label

  return button
}

function getTagCycleStep(template, index) {
  const visual = template.content.querySelector("[data-tag-visual]")
  const preview = template.content.querySelector("[data-tag-preview]")

  return {
    label: template.dataset.stepLabel ?? `Step ${index + 1}`,
    visualHtml: visual?.innerHTML ?? "",
    previewHtml: preview?.innerHTML ?? "",
  }
}

function renderTagCycleControls(component, steps) {
  const controls = component.querySelector("[data-tag-cycle-controls]")

  if (!controls || steps.length < 2) {
    return
  }

  const previousButton = createTagCycleButton("Previous", "tag-cycle-previous")
  const nextButton = createTagCycleButton("Next", "tag-cycle-next")
  const playButton = createTagCycleButton("Play examples", "tag-cycle-play")
  playButton.dataset.role = "tag-cycle-play"

  const stepList = document.createElement("div")
  stepList.className = "tag-cycle__step-list"
  stepList.setAttribute("aria-label", "Tag examples")

  steps.forEach((step, index) => {
    const button = createTagCycleButton(step.label, "tag-cycle-step")
    button.classList.add("tag-cycle__step-button")
    button.dataset.tagCycleStep = String(index)
    stepList.append(button)
  })

  controls.replaceChildren(previousButton, stepList, nextButton, playButton)
}

function stopTagCycle(component) {
  const state = tagCycleStates.get(component)

  if (!state?.timer) {
    return
  }

  window.clearInterval(state.timer)
  state.timer = null
  state.playing = false
}

function renderTagCycle(component, animate = true) {
  const state = tagCycleStates.get(component)

  if (!state) {
    return
  }

  const step = state.steps[state.activeIndex]
  const status = component.querySelector("[data-tag-cycle-status]")
  const code = component.querySelector("[data-tag-cycle-code]")
  const preview = component.querySelector("[data-tag-cycle-preview]")
  const display = component.querySelector(".tag-cycle__display")
  const playButton = component.querySelector("[data-role='tag-cycle-play']")
  const stepButtons = component.querySelectorAll("[data-tag-cycle-step]")
  const previousButton = component.querySelector(
    "[data-action='tag-cycle-previous']"
  )
  const nextButton = component.querySelector("[data-action='tag-cycle-next']")

  if (status) {
    status.textContent = `${step.label} (${state.activeIndex + 1} of ${
      state.steps.length
    })`
  }

  if (code) {
    code.innerHTML = step.visualHtml
  }

  if (preview) {
    preview.innerHTML = step.previewHtml
  }

  if (display && animate) {
    display.classList.remove("is-updating")
    void display.offsetWidth
    display.classList.add("is-updating")
  }

  stepButtons.forEach((button) => {
    const isActive = Number(button.dataset.tagCycleStep) === state.activeIndex
    button.classList.toggle("is-active", isActive)
    button.setAttribute("aria-pressed", String(isActive))
  })

  if (previousButton) {
    previousButton.disabled = state.activeIndex === 0
  }

  if (nextButton) {
    nextButton.disabled = state.activeIndex === state.steps.length - 1
  }

  if (playButton) {
    playButton.textContent = state.playing ? "Pause" : "Play examples"
    playButton.setAttribute("aria-pressed", String(state.playing))
  }
}

function setTagCycleStep(component, nextIndex) {
  const state = tagCycleStates.get(component)

  if (!state) {
    return
  }

  state.activeIndex = Math.min(Math.max(nextIndex, 0), state.steps.length - 1)
  renderTagCycle(component)
}

function playTagCycle(component) {
  const state = tagCycleStates.get(component)

  if (!state || state.steps.length < 2) {
    return
  }

  stopTagCycle(component)
  state.playing = true
  state.timer = window.setInterval(() => {
    const nextIndex = (state.activeIndex + 1) % state.steps.length
    setTagCycleStep(component, nextIndex)
  }, state.interval)
  renderTagCycle(component, false)
}

function toggleTagCyclePlayback(component) {
  const state = tagCycleStates.get(component)

  if (!state) {
    return
  }

  if (state.playing) {
    stopTagCycle(component)
    renderTagCycle(component, false)
    return
  }

  playTagCycle(component)
}

function initTagCycle(component) {
  if (component.dataset.tagCycleReady === "true") {
    return
  }

  const steps = Array.from(
    component.querySelectorAll("template[data-tag-cycle-step]")
  ).map(getTagCycleStep)

  if (steps.length === 0) {
    return
  }

  tagCycleStates.set(component, {
    activeIndex: 0,
    interval:
      Number(component.dataset.stepInterval) ||
      Number(component.dataset.interval) ||
      TAG_CYCLE_INTERVAL,
    playing: false,
    steps,
    timer: null,
  })

  component.dataset.tagCycleReady = "true"
  renderTagCycleControls(component, steps)
  renderTagCycle(component, false)

  component.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]")

    if (!button || !component.contains(button)) {
      return
    }

    if (button.dataset.action === "tag-cycle-step") {
      stopTagCycle(component)
      setTagCycleStep(component, Number(button.dataset.tagCycleStep))
      return
    }

    if (button.dataset.action === "tag-cycle-previous") {
      stopTagCycle(component)
      setTagCycleStep(component, tagCycleStates.get(component).activeIndex - 1)
      return
    }

    if (button.dataset.action === "tag-cycle-next") {
      stopTagCycle(component)
      setTagCycleStep(component, tagCycleStates.get(component).activeIndex + 1)
      return
    }

    if (button.dataset.action === "tag-cycle-play") {
      toggleTagCyclePlayback(component)
    }
  })
}

function initTagCycles(root = document) {
  root.querySelectorAll("[data-tag-cycle]").forEach(initTagCycle)

  if (tagCycleVisibilityListenerBound) {
    return
  }

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      document.querySelectorAll("[data-tag-cycle]").forEach(stopTagCycle)
    }
  })

  tagCycleVisibilityListenerBound = true
}

initLessonPage(lessonConfig)
initCodePreviews()
initTagCycles()
