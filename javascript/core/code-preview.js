const DEFAULT_STEP_INTERVAL = 2600

const previewStates = new WeakMap()

function normalizeCode(value) {
  const lines = value
    .replace(/\r\n/g, "\n")
    .replace(/\t/g, "  ")
    .split("\n")

  while (lines.length && !lines[0].trim()) {
    lines.shift()
  }

  while (lines.length && !lines[lines.length - 1].trim()) {
    lines.pop()
  }

  const nonEmptyLines = lines.filter((line) => line.trim())

  if (nonEmptyLines.length === 0) {
    return ""
  }

  const sharedIndent = Math.min(
    ...nonEmptyLines.map((line) => line.match(/^\s*/)?.[0].length ?? 0)
  )

  const dedentedLines = lines.map((line) => line.slice(sharedIndent))
  const firstLineIndent = dedentedLines[0].match(/^\s*/)?.[0].length ?? 0
  const laterIndents = dedentedLines
    .slice(1)
    .filter((line) => line.trim())
    .map((line) => line.match(/^\s*/)?.[0].length ?? 0)
  const smallestLaterIndent = laterIndents.length
    ? Math.min(...laterIndents)
    : firstLineIndent

  if (firstLineIndent - smallestLaterIndent > 6) {
    dedentedLines[0] = dedentedLines[0].trimStart()
  }

  return dedentedLines.join("\n")
}

function getStepData(template, index) {
  const codeNode = template.content.querySelector(
    "[data-code-content] code, code[data-code-content], [data-code-content]"
  )
  const previewNode = template.content.querySelector("[data-preview-content]")

  return {
    label: template.dataset.stepLabel ?? `Step ${index + 1}`,
    note: template.dataset.stepNote ?? "",
    code: normalizeCode(codeNode?.textContent ?? ""),
    previewHtml: previewNode?.innerHTML ?? "",
  }
}

function createButton(label, action) {
  const button = document.createElement("button")
  button.className = "code-preview__button"
  button.type = "button"
  button.dataset.action = action
  button.textContent = label

  return button
}

function appendText(parent, value, className = "") {
  if (!value) {
    return
  }

  const span = document.createElement("span")
  span.textContent = value

  if (className) {
    span.className = className
  }

  parent.append(span)
}

function appendAttributeTokens(parent, value) {
  const attributePattern =
    /(\s+)([^\s=/>]+)(?:(\s*=\s*)("[^"]*"|'[^']*'|[^\s"'>=]+))?/g
  let lastIndex = 0
  let match = attributePattern.exec(value)

  while (match) {
    appendText(parent, value.slice(lastIndex, match.index))
    appendText(parent, match[1])
    appendText(parent, match[2], "code-preview__token code-preview__token--attr")

    if (match[3]) {
      appendText(parent, match[3], "code-preview__token code-preview__token--punct")
    }

    if (match[4]) {
      appendText(
        parent,
        match[4],
        "code-preview__token code-preview__token--string"
      )
    }

    lastIndex = attributePattern.lastIndex
    match = attributePattern.exec(value)
  }

  appendText(parent, value.slice(lastIndex))
}

function appendHighlightedHtml(parent, line) {
  const tagPattern = /(<\/?)([a-zA-Z][\w:-]*)([^>]*?)(\/?>)/g
  let lastIndex = 0
  let match = tagPattern.exec(line)

  while (match) {
    appendText(parent, line.slice(lastIndex, match.index))
    appendText(parent, match[1], "code-preview__token code-preview__token--punct")
    appendText(parent, match[2], "code-preview__token code-preview__token--tag")
    appendAttributeTokens(parent, match[3])
    appendText(parent, match[4], "code-preview__token code-preview__token--punct")

    lastIndex = tagPattern.lastIndex
    match = tagPattern.exec(line)
  }

  appendText(parent, line.slice(lastIndex))
}

function createCodeLine(line, index, changed) {
  const row = document.createElement("div")
  row.className = "code-preview__line"
  row.classList.toggle("code-preview__line--changed", changed)

  const number = document.createElement("span")
  number.className = "code-preview__line-number"
  number.textContent = String(index + 1)

  const content = document.createElement("span")
  content.className = "code-preview__line-code"
  appendHighlightedHtml(content, line || " ")

  row.append(number, content)
  return row
}

function renderCode(output, currentCode, previousCode) {
  const lines = currentCode.split("\n")
  const previousLines = previousCode ? previousCode.split("\n") : []
  const hasPrevious = previousLines.length > 0

  output.replaceChildren(
    ...lines.map((line, index) =>
      createCodeLine(line, index, hasPrevious && line !== previousLines[index])
    )
  )
}

export function renderHighlightedCode(output, code) {
  renderCode(output, normalizeCode(code), null)
}

function createDiffRow(kind, line) {
  const row = document.createElement("div")
  row.className = `code-preview__diff-row code-preview__diff-row--${kind}`

  const marker = document.createElement("span")
  marker.className = "code-preview__diff-marker"
  marker.textContent = kind === "removed" ? "-" : "+"

  const code = document.createElement("span")
  code.className = "code-preview__diff-code"
  code.textContent = line || " "

  row.append(marker, code)
  return row
}

function renderDiff(output, currentCode, previousCode) {
  if (!previousCode) {
    output.hidden = true
    output.replaceChildren()
    return
  }

  const currentLines = currentCode.split("\n")
  const previousLines = previousCode.split("\n")
  const maxLines = Math.max(currentLines.length, previousLines.length)
  const rows = []

  for (let index = 0; index < maxLines; index += 1) {
    const currentLine = currentLines[index]
    const previousLine = previousLines[index]

    if (currentLine === previousLine) {
      continue
    }

    if (previousLine !== undefined) {
      rows.push(createDiffRow("removed", previousLine))
    }

    if (currentLine !== undefined) {
      rows.push(createDiffRow("added", currentLine))
    }
  }

  output.hidden = rows.length === 0
  output.replaceChildren(...rows)
}

function stopPreview(component) {
  const state = previewStates.get(component)

  if (!state?.timer) {
    return
  }

  window.clearInterval(state.timer)
  state.timer = null
  state.playing = false
}

function setActiveStep(component, nextIndex) {
  const state = previewStates.get(component)

  if (!state) {
    return
  }

  state.activeIndex = Math.min(Math.max(nextIndex, 0), state.steps.length - 1)
  renderPreview(component)
}

function playPreview(component) {
  const state = previewStates.get(component)

  if (!state || state.steps.length < 2) {
    return
  }

  stopPreview(component)
  state.playing = true
  state.timer = window.setInterval(() => {
    const nextIndex = (state.activeIndex + 1) % state.steps.length
    setActiveStep(component, nextIndex)
  }, state.interval)

  renderPreview(component)
}

function togglePreviewPlayback(component) {
  const state = previewStates.get(component)

  if (!state) {
    return
  }

  if (state.playing) {
    stopPreview(component)
    renderPreview(component)
    return
  }

  playPreview(component)
}

function toggleFullscreen(component) {
  if (!document.fullscreenElement) {
    component.requestFullscreen?.()
    return
  }

  document.exitFullscreen?.()
}

function renderControls(component, steps) {
  const controls = component.querySelector("[data-code-preview-controls]")

  if (!controls) {
    return
  }

  controls.hidden = false

  const fullscreenButton = createButton("Fullscreen", "code-preview-fullscreen")
  fullscreenButton.dataset.role = "code-preview-fullscreen"

  if (steps.length < 2) {
    controls.replaceChildren(fullscreenButton)
    return
  }

  const previousButton = createButton("Previous", "code-preview-previous")
  const nextButton = createButton("Next", "code-preview-next")
  const playButton = createButton("Play steps", "code-preview-play")
  playButton.dataset.role = "code-preview-play"

  const stepList = document.createElement("div")
  stepList.className = "code-preview__step-list"
  stepList.setAttribute("aria-label", "Code example steps")

  steps.forEach((step, index) => {
    const stepButton = createButton(step.label, "code-preview-step")
    stepButton.dataset.codePreviewStep = String(index)
    stepButton.classList.add("code-preview__step-button")
    stepList.append(stepButton)
  })

  controls.replaceChildren(
    previousButton,
    stepList,
    nextButton,
    playButton,
    fullscreenButton
  )
}

function renderPreview(component) {
  const state = previewStates.get(component)

  if (!state) {
    return
  }

  const currentStep = state.steps[state.activeIndex]
  const previousStep = state.steps[state.activeIndex - 1]
  const codeOutput = component.querySelector("[data-code-preview-code]")
  const previewOutput = component.querySelector("[data-code-preview-output]")
  const note = component.querySelector("[data-code-preview-note]")
  const status = component.querySelector("[data-code-preview-status]")
  const diffOutput = component.querySelector("[data-code-preview-diff]")
  const playButton = component.querySelector("[data-role='code-preview-play']")
  const fullscreenButton = component.querySelector(
    "[data-role='code-preview-fullscreen']"
  )
  const stepButtons = component.querySelectorAll("[data-code-preview-step]")
  const previousButton = component.querySelector(
    "[data-action='code-preview-previous']"
  )
  const nextButton = component.querySelector("[data-action='code-preview-next']")

  if (codeOutput) {
    renderCode(
      codeOutput,
      currentStep.code,
      state.showDiff ? previousStep?.code : null
    )
  }

  if (previewOutput) {
    previewOutput.innerHTML = currentStep.previewHtml
  }

  if (note) {
    note.textContent = currentStep.note
    note.hidden = !currentStep.note
  }

  if (status) {
    status.textContent = `Step ${state.activeIndex + 1} of ${state.steps.length}`
  }

  if (diffOutput) {
    if (state.showDiff) {
      renderDiff(diffOutput, currentStep.code, previousStep?.code)
    } else {
      diffOutput.hidden = true
      diffOutput.replaceChildren()
    }
  }

  stepButtons.forEach((button) => {
    const isActive = Number(button.dataset.codePreviewStep) === state.activeIndex
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
    playButton.textContent = state.playing ? "Pause" : "Play steps"
    playButton.setAttribute("aria-pressed", String(state.playing))
  }

  if (fullscreenButton) {
    const isFullscreen = document.fullscreenElement === component
    fullscreenButton.textContent = isFullscreen ? "Exit fullscreen" : "Fullscreen"
    fullscreenButton.setAttribute("aria-pressed", String(isFullscreen))
  }
}

function initCodePreview(component) {
  if (component.dataset.codePreviewReady === "true") {
    return
  }

  const templates = Array.from(
    component.querySelectorAll("template[data-code-step]")
  )
  const steps = templates.map(getStepData)

  if (steps.length === 0) {
    return
  }

  const state = {
    activeIndex: 0,
    interval:
      Number(component.dataset.stepInterval) ||
      Number(component.dataset.interval) ||
      DEFAULT_STEP_INTERVAL,
    playing: false,
    showDiff:
      component.dataset.showDiff === "" ||
      component.dataset.showDiff === "true",
    steps,
    timer: null,
  }

  previewStates.set(component, state)
  component.dataset.codePreviewReady = "true"
  renderControls(component, steps)
  renderPreview(component)

  component.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]")

    if (!button || !component.contains(button)) {
      return
    }

    if (button.dataset.action === "code-preview-step") {
      stopPreview(component)
      setActiveStep(component, Number(button.dataset.codePreviewStep))
      return
    }

    if (button.dataset.action === "code-preview-previous") {
      stopPreview(component)
      setActiveStep(component, state.activeIndex - 1)
      return
    }

    if (button.dataset.action === "code-preview-next") {
      stopPreview(component)
      setActiveStep(component, state.activeIndex + 1)
      return
    }

    if (button.dataset.action === "code-preview-play") {
      togglePreviewPlayback(component)
      return
    }

    if (button.dataset.action === "code-preview-fullscreen") {
      toggleFullscreen(component)
    }
  })

  document.addEventListener("fullscreenchange", () => renderPreview(component))
}

export function initCodePreviews(root = document) {
  root.querySelectorAll("[data-code-preview]").forEach(initCodePreview)

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      root.querySelectorAll("[data-code-preview]").forEach(stopPreview)
    }
  })
}
