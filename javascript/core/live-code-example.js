import { renderHighlightedCode } from "./code-preview.js"

const DEFAULT_DEBOUNCE = 300
const DEFAULT_SPLIT = 55
const MIN_SPLIT = 30
const MAX_SPLIT = 70
const MIN_CODE_ZOOM = 0.8
const MAX_CODE_ZOOM = 1.8
const CODE_ZOOM_STEP = 0.1
const BLOCKED_ELEMENTS =
  "script, noscript, iframe, frame, frameset, object, embed, link, meta, base"
const URL_ATTRIBUTES = new Set([
  "action",
  "background",
  "cite",
  "data",
  "formaction",
  "href",
  "longdesc",
  "manifest",
  "ping",
  "poster",
  "profile",
  "src",
  "srcdoc",
  "srcset",
  "usemap",
  "xlink:href",
])
const PREVIEW_CSP = [
  "default-src 'none'",
  "script-src 'none'",
  "style-src 'unsafe-inline'",
  "img-src data:",
  "font-src 'none'",
  "media-src 'none'",
  "connect-src 'none'",
  "object-src 'none'",
  "frame-src 'none'",
  "worker-src 'none'",
  "form-action 'none'",
  "base-uri 'none'",
  "navigate-to 'none'",
].join("; ")

const PREVIEW_BASE_CSS = `
  :root { color-scheme: light; }
  *, *::before, *::after { box-sizing: border-box; }
  html { min-height: 100%; background: #fffdf8; }
  body {
    min-height: 100%;
    margin: 0;
    padding: 1.25rem;
    background: #fffdf8;
    color: #24313b;
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1.5;
    overflow-wrap: anywhere;
  }
`

function createElement(tagName, className = "", text = "") {
  const element = document.createElement(tagName)

  if (className) {
    element.className = className
  }

  if (text) {
    element.textContent = text
  }

  return element
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function normalizeSource(source, index) {
  const type = source.type ?? source.id ?? `source-${index + 1}`

  return {
    id: source.id ?? type,
    type,
    label: source.label ?? type.toUpperCase(),
    initialCode: String(source.code ?? ""),
    currentCode: String(source.code ?? ""),
  }
}

function escapeStyleEndTags(css) {
  return css.replace(/<\/style/gi, "<\\/style")
}

export function sanitizeLivePreviewHtml(markup) {
  const parsed = new DOMParser().parseFromString(
    `<!doctype html><html><body>${markup}</body></html>`,
    "text/html"
  )

  parsed.querySelectorAll(BLOCKED_ELEMENTS).forEach((element) => element.remove())

  parsed.querySelectorAll("*").forEach((element) => {
    Array.from(element.attributes).forEach((attribute) => {
      const name = attribute.name.toLowerCase()

      if (name.startsWith("on") || URL_ATTRIBUTES.has(name)) {
        element.removeAttribute(attribute.name)
      }
    })
  })

  return parsed.body.innerHTML
}

export function buildLivePreviewDocument(example, sources) {
  const sourceByType = new Map(sources.map((source) => [source.type, source]))
  const visibleHtml = sourceByType.get("html")?.currentCode ?? ""
  const visibleCss = sourceByType.get("css")?.currentCode ?? ""
  const scaffold = example.scaffold ?? {}
  const combinedHtml = sourceByType.has("html")
    ? `${scaffold.htmlBefore ?? ""}${visibleHtml}${scaffold.htmlAfter ?? ""}`
    : scaffold.html ?? ""
  const combinedCss = `${PREVIEW_BASE_CSS}\n${scaffold.css ?? ""}\n${visibleCss}`
  const safeHtml = sanitizeLivePreviewHtml(combinedHtml)
  const safeCss = escapeStyleEndTags(combinedCss)

  return `<!doctype html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="${PREVIEW_CSP}">
  <style>${safeCss}</style>
</head>
<body>${safeHtml}</body>
</html>`
}

function insertIndentation(textarea) {
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const value = textarea.value

  if (start === end) {
    textarea.setRangeText("  ", start, end, "end")
    return
  }

  const lineStart = value.lastIndexOf("\n", start - 1) + 1
  const selected = value.slice(lineStart, end)
  const changed = selected
    .split("\n")
    .map((line) => `  ${line}`)
    .join("\n")

  textarea.setRangeText(changed, lineStart, end, "select")
}

function removeIndentation(textarea) {
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const value = textarea.value
  const lineStart = value.lastIndexOf("\n", start - 1) + 1
  const selected = value.slice(lineStart, end)
  let removedBeforeStart = 0
  let removedTotal = 0
  const changed = selected
    .split("\n")
    .map((line, index) => {
      const match = line.match(/^( {1,2}|\t)/)
      const amount = match?.[0].length ?? 0
      removedTotal += amount

      if (index === 0) {
        removedBeforeStart = Math.min(amount, start - lineStart)
      }

      return line.slice(amount)
    })
    .join("\n")

  textarea.setRangeText(changed, lineStart, end, "select")
  textarea.setSelectionRange(
    Math.max(lineStart, start - removedBeforeStart),
    Math.max(lineStart, end - removedTotal)
  )
}

function initLiveCodeExample(root, example) {
  const sources = (example.sources ?? []).map(normalizeSource)

  if (!sources.length) {
    root.textContent = "This live code example has no visible source to edit."
    return
  }

  const sourceTypes = new Set(sources.map((source) => source.type))
  const unsupported = Array.from(sourceTypes).filter(
    (type) => !["html", "css"].includes(type)
  )

  if (unsupported.length) {
    root.textContent = "This live code example uses a source type that is not available yet."
    return
  }

  const state = {
    activeSourceId: sources[0].id,
    editing: false,
    split: clamp(Number(example.defaultSplit ?? DEFAULT_SPLIT), MIN_SPLIT, MAX_SPLIT),
    codeZoom: 1,
    updateTimer: null,
  }
  const shell = createElement("article", "live-code-example")
  const header = createElement("header", "live-code__header")
  const titleGroup = document.createElement("div")
  const eyebrow = createElement("p", "live-code__eyebrow", "LIVE CODE EXAMPLE")
  const title = createElement("h3", "", example.title ?? "Try the code")
  const description = createElement("p", "live-code__description", example.description ?? "")
  const headerActions = createElement("div", "live-code__header-actions")
  const tryButton = createElement("button", "live-code__primary-action", "Try it")
  const resetCodeButton = createElement(
    "button",
    "lesson-secondary-action",
    "Reset code"
  )
  const resetLayoutButton = createElement(
    "button",
    "lesson-secondary-action",
    "Reset view / layout"
  )
  const tabs = createElement("div", "live-code__tabs")
  const workspace = createElement("div", "live-code__workspace")
  const codePane = createElement("section", "live-code__code-pane")
  const codeToolbar = createElement("div", "live-code__code-toolbar")
  const sourceLabel = createElement("strong", "live-code__source-label")
  const zoomControls = createElement("div", "live-code__zoom-controls")
  const zoomDown = createElement("button", "live-code__icon-button", "−")
  const zoomValue = createElement("output", "live-code__zoom-value", "100%")
  const zoomUp = createElement("button", "live-code__icon-button", "+")
  const readonlyCode = createElement("div", "code-preview__code live-code__readonly")
  const editor = createElement("textarea", "live-code__editor")
  const separator = createElement("div", "live-code__separator")
  const previewPane = createElement("section", "live-code__preview-pane")
  const previewHeading = createElement("div", "live-code__preview-heading")
  const previewTitle = createElement("strong", "", "Generated preview")
  const previewStatus = createElement(
    "span",
    "live-code__preview-status",
    "Updates automatically"
  )
  const iframe = document.createElement("iframe")
  const layoutControls = createElement("div", "live-code__layout-controls")
  const moreCodeButton = createElement(
    "button",
    "lesson-secondary-action",
    "More code space"
  )
  const equalButton = createElement(
    "button",
    "lesson-secondary-action",
    "Equal split"
  )
  const morePreviewButton = createElement(
    "button",
    "lesson-secondary-action",
    "More preview space"
  )
  const ratioStatus = createElement("span", "live-code__ratio-status")
  const announcer = createElement("p", "sr-only")

  function getActiveSource() {
    return sources.find((source) => source.id === state.activeSourceId) ?? sources[0]
  }

  function announce(message) {
    announcer.textContent = ""
    window.requestAnimationFrame(() => {
      announcer.textContent = message
    })
  }

  function updatePreview(immediate = false) {
    window.clearTimeout(state.updateTimer)
    iframe.setAttribute("aria-busy", "true")

    const render = () => {
      iframe.srcdoc = buildLivePreviewDocument(example, sources)
    }

    if (immediate) {
      render()
    } else {
      state.updateTimer = window.setTimeout(
        render,
        clamp(Number(example.debounce ?? DEFAULT_DEBOUNCE), 200, 400)
      )
    }
  }

  function updateTabs() {
    tabs.querySelectorAll("[role='tab']").forEach((tab) => {
      const selected = tab.dataset.sourceId === state.activeSourceId
      tab.setAttribute("aria-selected", String(selected))
      tab.tabIndex = selected ? 0 : -1
      tab.classList.toggle("is-active", selected)
    })
  }

  function updateSourceView() {
    const source = getActiveSource()

    sourceLabel.textContent = source.label
    editor.value = source.currentCode
    editor.setAttribute("aria-label", `Edit ${source.label} source`)
    codePane.setAttribute(
      "aria-labelledby",
      `${example.id}-tab-${source.id}`
    )
    renderHighlightedCode(readonlyCode, source.currentCode)
    updateTabs()
  }

  function updateEditingState(shouldFocus = false) {
    shell.classList.toggle("is-editing", state.editing)
    tryButton.textContent = state.editing ? "Return to view mode" : "Try it"
    tryButton.setAttribute("aria-pressed", String(state.editing))
    resetCodeButton.hidden = !state.editing
    readonlyCode.hidden = state.editing
    editor.hidden = !state.editing

    if (!state.editing) {
      readonlyCode.tabIndex = 0
    }

    if (!shouldFocus) {
      return
    }

    if (state.editing) {
      editor.focus()
    } else {
      readonlyCode.focus()
    }
  }

  function updateLayout() {
    shell.style.setProperty("--live-code-split", `${state.split}%`)
    shell.style.setProperty("--live-code-local-zoom", state.codeZoom.toFixed(2))
    separator.setAttribute("aria-valuenow", String(Math.round(state.split)))
    separator.setAttribute(
      "aria-valuetext",
      `${Math.round(state.split)}% code and ${Math.round(100 - state.split)}% preview`
    )
    zoomValue.value = `${Math.round(state.codeZoom * 100)}%`
    zoomValue.textContent = `${Math.round(state.codeZoom * 100)}%`
    zoomDown.disabled = state.codeZoom <= MIN_CODE_ZOOM
    zoomUp.disabled = state.codeZoom >= MAX_CODE_ZOOM
    ratioStatus.textContent = `${Math.round(state.split)}% code · ${Math.round(100 - state.split)}% preview`
  }

  function setSplit(nextSplit, shouldAnnounce = true) {
    state.split = clamp(nextSplit, MIN_SPLIT, MAX_SPLIT)
    updateLayout()

    if (shouldAnnounce) {
      announce(separator.getAttribute("aria-valuetext"))
    }
  }

  function setCodeZoom(nextZoom) {
    state.codeZoom = clamp(nextZoom, MIN_CODE_ZOOM, MAX_CODE_ZOOM)
    updateLayout()
    announce(`Code size ${Math.round(state.codeZoom * 100)}%`)
  }

  function selectSource(sourceId, focusTab = false) {
    const nextSource = sources.find((source) => source.id === sourceId)

    if (!nextSource) {
      return
    }

    state.activeSourceId = nextSource.id
    updateSourceView()

    if (focusTab) {
      tabs.querySelector(`[data-source-id="${CSS.escape(sourceId)}"]`)?.focus()
    } else if (state.editing) {
      editor.focus()
    }
  }

  tryButton.type = "button"
  tryButton.setAttribute("aria-pressed", "false")
  resetCodeButton.type = "button"
  resetLayoutButton.type = "button"
  resetCodeButton.hidden = true
  titleGroup.append(eyebrow, title)

  if (example.description) {
    titleGroup.append(description)
  }

  headerActions.append(tryButton, resetCodeButton, resetLayoutButton)
  header.append(titleGroup, headerActions)

  tabs.setAttribute("role", "tablist")
  tabs.setAttribute("aria-label", "Visible source files")
  sources.forEach((source, index) => {
    const tab = createElement("button", "live-code__tab", source.label)
    tab.type = "button"
    tab.id = `${example.id}-tab-${source.id}`
    tab.dataset.sourceId = source.id
    tab.setAttribute("role", "tab")
    tab.setAttribute("aria-controls", `${example.id}-source-panel`)
    tab.setAttribute("aria-selected", String(index === 0))
    tab.tabIndex = index === 0 ? 0 : -1
    tabs.append(tab)
  })

  zoomDown.type = "button"
  zoomDown.setAttribute("aria-label", "Decrease local code size")
  zoomUp.type = "button"
  zoomUp.setAttribute("aria-label", "Increase local code size")
  zoomValue.setAttribute("aria-label", "Local code size")
  zoomControls.setAttribute("aria-label", "Local code size controls")
  zoomControls.append(createElement("span", "", "Code size"), zoomDown, zoomValue, zoomUp)
  codeToolbar.append(sourceLabel, zoomControls)

  codePane.id = `${example.id}-source-panel`
  codePane.setAttribute("role", "tabpanel")
  codePane.setAttribute("aria-labelledby", `${example.id}-tab-${sources[0].id}`)
  editor.id = `${example.id}-editor`
  editor.spellcheck = false
  editor.autocomplete = "off"
  editor.autocapitalize = "off"
  editor.wrap = "off"
  editor.hidden = true
  codePane.append(codeToolbar, readonlyCode, editor)

  separator.tabIndex = 0
  separator.setAttribute("role", "separator")
  separator.setAttribute("aria-label", "Resize code and preview panes")
  separator.setAttribute("aria-orientation", "vertical")
  separator.setAttribute("aria-valuemin", String(MIN_SPLIT))
  separator.setAttribute("aria-valuemax", String(MAX_SPLIT))

  iframe.className = "live-code__iframe"
  iframe.title = `Generated preview for ${example.title ?? "live code example"}`
  iframe.setAttribute("sandbox", "")
  iframe.setAttribute("referrerpolicy", "no-referrer")
  iframe.addEventListener("load", () => {
    iframe.setAttribute("aria-busy", "false")
  })
  previewHeading.append(previewTitle, previewStatus)
  previewPane.append(previewHeading, iframe)
  workspace.append(codePane, separator, previewPane)

  moreCodeButton.type = "button"
  equalButton.type = "button"
  morePreviewButton.type = "button"
  layoutControls.setAttribute("aria-label", "Code and preview layout controls")
  layoutControls.append(
    moreCodeButton,
    equalButton,
    morePreviewButton,
    ratioStatus
  )

  announcer.setAttribute("role", "status")
  announcer.setAttribute("aria-live", "polite")
  announcer.setAttribute("aria-atomic", "true")
  shell.dataset.noSlideAdvance = ""
  shell.append(header, tabs, workspace, layoutControls, announcer)
  root.replaceChildren(shell)

  tabs.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-source-id]")

    if (tab) {
      selectSource(tab.dataset.sourceId)
    }
  })

  tabs.addEventListener("keydown", (event) => {
    const tab = event.target.closest("[data-source-id]")

    if (!tab || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      return
    }

    event.preventDefault()
    const currentIndex = sources.findIndex((source) => source.id === tab.dataset.sourceId)
    let nextIndex = currentIndex

    if (event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + sources.length) % sources.length
    } else if (event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % sources.length
    } else if (event.key === "Home") {
      nextIndex = 0
    } else if (event.key === "End") {
      nextIndex = sources.length - 1
    }

    selectSource(sources[nextIndex].id, true)
  })

  tryButton.addEventListener("click", () => {
    state.editing = !state.editing
    updateEditingState(true)
    announce(state.editing ? "Editing activated." : "View mode activated.")
  })

  resetCodeButton.addEventListener("click", () => {
    sources.forEach((source) => {
      source.currentCode = source.initialCode
    })
    updateSourceView()
    updatePreview(true)
    announce("Code reset to the authored example. Preview updated.")
    editor.focus()
  })

  resetLayoutButton.addEventListener("click", () => {
    state.split = clamp(
      Number(example.defaultSplit ?? DEFAULT_SPLIT),
      MIN_SPLIT,
      MAX_SPLIT
    )
    state.codeZoom = 1
    updateLayout()
    announce("View layout reset. Code was not changed.")
  })

  editor.addEventListener("input", () => {
    getActiveSource().currentCode = editor.value
    updatePreview()
  })

  editor.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") {
      return
    }

    event.preventDefault()

    if (event.shiftKey) {
      removeIndentation(editor)
    } else {
      insertIndentation(editor)
    }

    editor.dispatchEvent(new Event("input", { bubbles: true }))
  })

  zoomDown.addEventListener("click", () => {
    setCodeZoom(state.codeZoom - CODE_ZOOM_STEP)
  })
  zoomUp.addEventListener("click", () => {
    setCodeZoom(state.codeZoom + CODE_ZOOM_STEP)
  })
  moreCodeButton.addEventListener("click", () => setSplit(state.split + 10))
  equalButton.addEventListener("click", () => setSplit(50))
  morePreviewButton.addEventListener("click", () => setSplit(state.split - 10))

  separator.addEventListener("keydown", (event) => {
    const actions = {
      ArrowLeft: () => setSplit(state.split - 5),
      ArrowRight: () => setSplit(state.split + 5),
      Home: () => setSplit(MIN_SPLIT),
      End: () => setSplit(MAX_SPLIT),
    }

    if (actions[event.key]) {
      event.preventDefault()
      actions[event.key]()
    }
  })

  separator.addEventListener("pointerdown", (event) => {
    separator.setPointerCapture(event.pointerId)
    shell.classList.add("is-resizing")
  })

  separator.addEventListener("pointermove", (event) => {
    if (!separator.hasPointerCapture(event.pointerId)) {
      return
    }

    const bounds = workspace.getBoundingClientRect()
    const percent = ((event.clientX - bounds.left) / bounds.width) * 100
    setSplit(percent, false)
  })

  function endResize(event) {
    if (separator.hasPointerCapture(event.pointerId)) {
      separator.releasePointerCapture(event.pointerId)
    }
    shell.classList.remove("is-resizing")
    announce(separator.getAttribute("aria-valuetext"))
  }

  separator.addEventListener("pointerup", endResize)
  separator.addEventListener("pointercancel", endResize)

  updateSourceView()
  updateEditingState()
  updateLayout()
  updatePreview(true)
}

export function initLiveCodeExamples(examples) {
  const exampleMap = new Map(examples.map((example) => [example.id, example]))

  document.querySelectorAll("[data-live-code-example-id]").forEach((root) => {
    const example = exampleMap.get(root.dataset.liveCodeExampleId)

    if (!example) {
      root.textContent = "This live code example could not be loaded."
      return
    }

    initLiveCodeExample(root, example)
  })
}
