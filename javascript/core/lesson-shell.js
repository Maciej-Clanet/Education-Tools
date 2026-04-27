import { readStorage, removeStorage, writeStorage } from "./storage.js"

const INTERACTIVE_SELECTOR = [
  "a",
  "button",
  "input",
  "label",
  "select",
  "textarea",
  "summary",
  "details",
  "[contenteditable='true']",
  "[data-no-slide-advance]",
].join(", ")

const TEACHER_CHUNK_HIDDEN_CLASS = "teacher-slide-chunk-hidden"

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function buildContextualHref(href, contextId) {
  if (!href || !contextId) {
    return href ?? ""
  }

  const [pathAndQuery, hash = ""] = href.split("#")
  const joiner = pathAndQuery.includes("?") ? "&" : "?"

  return `${pathAndQuery}${joiner}context=${encodeURIComponent(contextId)}${
    hash ? `#${hash}` : ""
  }`
}

function createSequenceCard(item, label, contextId) {
  const element = document.createElement(item?.href ? "a" : "article")
  element.className = `sequence-card ${
    item?.href ? "sequence-card--link" : "sequence-card--disabled"
  }`

  if (item?.href) {
    element.href = buildContextualHref(item.href, contextId)
  }

  const kicker = document.createElement("p")
  kicker.className = "eyebrow"
  kicker.textContent = label

  const title = document.createElement("h3")
  title.textContent = item?.title ?? `${label} not added yet`

  const description = document.createElement("p")
  description.textContent =
    item?.description ?? "This step in the lesson sequence is still being built."

  element.append(kicker, title, description)

  if (item?.status) {
    const status = document.createElement("span")
    status.className = "sequence-status"
    status.textContent = item.status
    element.append(status)
  }

  return element
}

function initContextNavigation(config) {
  const url = new URL(window.location.href)
  const requestedContextId = url.searchParams.get("context")
  const contextId =
    requestedContextId && config.contexts[requestedContextId]
      ? requestedContextId
      : config.defaultContext
  const context = config.contexts?.[contextId]

  if (!context) {
    return null
  }

  document.querySelectorAll("[data-role='context-label']").forEach((element) => {
    element.textContent = context.label
  })

  const breadcrumbUnitLink = document.querySelector(
    "[data-role='breadcrumb-unit-link']"
  )

  if (breadcrumbUnitLink && context.backHref) {
    breadcrumbUnitLink.href = context.backHref
    breadcrumbUnitLink.textContent = context.label
  }

  const backLink = document.querySelector("[data-role='back-to-unit']")

  if (backLink && context.backHref) {
    backLink.href = context.backHref
    backLink.textContent = context.backLabel ?? `Back to ${context.label}`
  }

  const sequenceGrid = document.querySelector("[data-role='lesson-sequence']")

  if (sequenceGrid) {
    sequenceGrid.replaceChildren(
      createSequenceCard(context.previous, "Previous lesson", contextId),
      createSequenceCard(context.next, "Next lesson", contextId)
    )
  }

  return { contextId, context }
}

function setActiveSectionLink(activeId) {
  document.querySelectorAll("[data-section-link]").forEach((link) => {
    const isActive = link.getAttribute("href") === `#${activeId}`
    link.classList.toggle("is-active", isActive)
    link.setAttribute("aria-current", isActive ? "true" : "false")
  })
}

function initSectionNavigation() {
  const sections = Array.from(document.querySelectorAll("[data-lesson-section]"))

  if (sections.length === 0) {
    return
  }

  let ticking = false

  function updateActiveSection() {
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight
    const activationLine = viewportHeight * 0.3
    const isNearPageBottom =
      window.scrollY + viewportHeight >=
      document.documentElement.scrollHeight - 24

    if (isNearPageBottom) {
      setActiveSectionLink(sections[sections.length - 1].id)
      return
    }

    let activeSection = sections[0]

    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= activationLine) {
        activeSection = section
      }
    })

    setActiveSectionLink(activeSection.id)
  }

  function requestSectionUpdate() {
    if (ticking) {
      return
    }

    ticking = true

    requestAnimationFrame(() => {
      updateActiveSection()
      ticking = false
    })
  }

  window.addEventListener("scroll", requestSectionUpdate, { passive: true })
  window.addEventListener("resize", requestSectionUpdate)
  window.addEventListener("hashchange", requestSectionUpdate)

  requestSectionUpdate()
}

function collectQuizAnswers(questions) {
  const answers = {}

  questions.forEach((question) => {
    const checkedInput = question.querySelector("input:checked")
    answers[question.dataset.question] = checkedInput?.value ?? ""
  })

  return answers
}

function restoreQuizAnswers(questions, answers) {
  questions.forEach((question) => {
    const selectedValue = answers?.[question.dataset.question]

    if (!selectedValue) {
      return
    }

    const matchingInput = question.querySelector(
      `input[value="${CSS.escape(selectedValue)}"]`
    )

    if (matchingInput) {
      matchingInput.checked = true
    }
  })
}

function setQuestionFeedback(question, isCorrect, isAnswered) {
  question.classList.toggle("is-correct", isCorrect)
  question.classList.toggle("is-incorrect", isAnswered && !isCorrect)
  question.classList.toggle("is-unanswered", !isAnswered)

  const feedback = question.querySelector("[data-question-feedback]")

  if (!feedback) {
    return
  }

  if (!isAnswered) {
    feedback.textContent = question.dataset.unanswered ?? "No answer selected."
    return
  }

  feedback.textContent = isCorrect
    ? question.dataset.success ?? "Correct."
    : question.dataset.feedback ??
      `Not quite. The correct answer is ${question.dataset.answer}.`
}

function updateQuizResult(element, score, totalQuestions, passScore, bestScore) {
  if (!element) {
    return
  }

  const passed = score >= passScore
  const progressText =
    bestScore === null || bestScore === undefined
      ? ""
      : ` Best score saved on this device: ${bestScore}/${totalQuestions}.`

  element.textContent = passed
    ? `Nice work. You scored ${score}/${totalQuestions}.${progressText}`
    : `You scored ${score}/${totalQuestions}. Aim for at least ${passScore}/${totalQuestions}.${progressText}`
}

function initQuiz(config) {
  const quizConfig = config.quiz ?? {}
  const form = document.querySelector(quizConfig.formSelector ?? "#lesson-quiz")

  if (!form) {
    return
  }

  const questions = Array.from(form.querySelectorAll("[data-question]"))
  const feedback = document.querySelector(
    quizConfig.feedbackSelector ?? "[data-role='quiz-result']"
  )
  const resetButton = form.querySelector("[data-action='reset-quiz']")
  const storageKey = quizConfig.storageKey ?? `${config.lessonId}-quiz`
  const passScore = quizConfig.passScore ?? questions.length
  const storedState = readStorage(storageKey, {
    answers: {},
    lastScore: null,
    bestScore: null,
  })

  restoreQuizAnswers(questions, storedState.answers)

  if (storedState.lastScore !== null) {
    questions.forEach((question) => {
      const selectedValue = storedState.answers?.[question.dataset.question] ?? ""
      const isAnswered = selectedValue !== ""
      const isCorrect = selectedValue === question.dataset.answer
      setQuestionFeedback(question, isCorrect, isAnswered)
    })

    updateQuizResult(
      feedback,
      storedState.lastScore,
      questions.length,
      passScore,
      storedState.bestScore
    )
  }

  form.addEventListener("change", () => {
    writeStorage(storageKey, {
      ...storedState,
      answers: collectQuizAnswers(questions),
      lastScore: storedState.lastScore,
      bestScore: storedState.bestScore,
    })
  })

  form.addEventListener("submit", (event) => {
    event.preventDefault()

    const answers = collectQuizAnswers(questions)
    let score = 0

    questions.forEach((question) => {
      const selectedValue = answers[question.dataset.question] ?? ""
      const isAnswered = selectedValue !== ""
      const isCorrect = selectedValue === question.dataset.answer

      if (isCorrect) {
        score += 1
      }

      setQuestionFeedback(question, isCorrect, isAnswered)
    })

    storedState.answers = answers
    storedState.lastScore = score
    storedState.bestScore =
      storedState.bestScore === null
        ? score
        : Math.max(storedState.bestScore, score)

    writeStorage(storageKey, storedState)
    updateQuizResult(
      feedback,
      score,
      questions.length,
      passScore,
      storedState.bestScore
    )
  })

  resetButton?.addEventListener("click", () => {
    form.reset()
    storedState.answers = {}
    storedState.lastScore = null
    storedState.bestScore = null
    removeStorage(storageKey)

    questions.forEach((question) => {
      question.classList.remove("is-correct", "is-incorrect", "is-unanswered")

      const questionFeedback = question.querySelector("[data-question-feedback]")

      if (questionFeedback) {
        questionFeedback.textContent = ""
      }
    })

    if (feedback) {
      feedback.textContent =
        "Your answers save automatically on this device once you start."
    }
  })
}

function initExamPractice(config) {
  const responseFields = Array.from(
    document.querySelectorAll("[data-exam-response]")
  )

  if (responseFields.length === 0) {
    return
  }

  const storageKey =
    config.examPractice?.storageKey ?? `${config.lessonId}-exam-practice`
  const savedResponses = readStorage(storageKey, {})

  function getFieldKey(field) {
    return field.dataset.examResponse ?? field.id ?? field.name ?? ""
  }

  function saveResponses() {
    const nextResponses = {}

    responseFields.forEach((field) => {
      const key = getFieldKey(field)

      if (!key) {
        return
      }

      nextResponses[key] = field.value
    })

    writeStorage(storageKey, nextResponses)
  }

  responseFields.forEach((field) => {
    const key = getFieldKey(field)

    if (key && typeof savedResponses[key] === "string") {
      field.value = savedResponses[key]
    }

    field.addEventListener("input", saveResponses)
  })
}

function buildTeacherSlideDeck(sections) {
  const sectionSlides = []
  const slides = []
  const firstSlideIndexBySection = new Map()

  sections.forEach((section) => {
    const children = Array.from(section.children)
    const persistentNodes = []
    const eyebrow = children.find((child) => child.classList.contains("eyebrow"))
    const heading = children.find((child) => /^H[1-6]$/.test(child.tagName))

    if (eyebrow) {
      persistentNodes.push(eyebrow)
    }

    if (heading && !persistentNodes.includes(heading)) {
      persistentNodes.push(heading)
    }

    const markers = children.filter((child) =>
      child.hasAttribute("data-slide-break")
    )
    const chunks = []
    let currentChunk = []

    // Empty `data-slide-break` markers let a section become multiple teacher slides
    // without changing the default lesson layout.
    children.forEach((child) => {
      if (persistentNodes.includes(child)) {
        return
      }

      if (child.hasAttribute("data-slide-break")) {
        child.hidden = true

        if (currentChunk.length > 0) {
          chunks.push(currentChunk)
          currentChunk = []
        }

        return
      }

      currentChunk.push(child)
    })

    if (currentChunk.length > 0) {
      chunks.push(currentChunk)
    }

    if (chunks.length === 0) {
      chunks.push([])
    }

    const sectionSlide = {
      section,
      markers,
      chunks,
    }

    sectionSlides.push(sectionSlide)
    firstSlideIndexBySection.set(section, slides.length)

    chunks.forEach((chunk, chunkIndex) => {
      slides.push({
        section,
        chunk,
        chunkIndex,
        chunkCount: chunks.length,
      })
    })
  })

  return { sectionSlides, slides, firstSlideIndexBySection }
}

function initTeacherMode(config) {
  const main = document.querySelector("[data-role='lesson-main']")
  const sections = Array.from(document.querySelectorAll("[data-lesson-section]"))
  const { sectionSlides, slides, firstSlideIndexBySection } =
    buildTeacherSlideDeck(sections)
  const toggleButton = document.querySelector(
    "[data-action='toggle-teacher-mode']"
  )
  const controls = document.querySelector("[data-role='teacher-controls']")
  const status = document.querySelector("[data-role='slide-status']")
  const previousButton = document.querySelector("[data-action='prev-slide']")
  const nextButton = document.querySelector("[data-action='next-slide']")
  const exitButton = document.querySelector("[data-action='exit-teacher-mode']")

  if (!main || sections.length === 0 || !toggleButton || !controls) {
    return
  }

  const storageKey = `${config.lessonId}-teacher-mode`
  let isTeacherMode = Boolean(readStorage(storageKey, false))
  let activeSlideIndex = 0
  let pointerStart = null
  let slideScrollTargetSection = null
  let updateTeacherToolsUI = () => {}
  let resetTeacherTools = () => {}

  const teacherToolsState = {
    shelfOpen: false,
    activeMode: null,
    highlightColor: "yellow",
    highlightHistory: [],
    blankScreen: false,
    spotlightX: 50,
    spotlightY: 34,
    spotlightSize: 210,
  }

  function getTeacherIcon(name) {
    const icons = {
      tools: `
        <svg viewBox="0 0 24 24" class="teacher-tool-icon" aria-hidden="true">
          <path d="M4 7h16" />
          <path d="M8 12h12" />
          <path d="M12 17h8" />
          <circle cx="6" cy="7" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="10" cy="12" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="14" cy="17" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      `,
      highlight: `
        <svg viewBox="0 0 24 24" class="teacher-tool-icon" aria-hidden="true">
          <path d="M6 18h6" />
          <path d="M12 6l6 6" />
          <path d="M8 16l8-8 2 2-8 8H8z" />
        </svg>
      `,
      spotlight: `
        <svg viewBox="0 0 24 24" class="teacher-tool-icon" aria-hidden="true">
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 3v3" />
          <path d="M12 18v3" />
          <path d="M3 12h3" />
          <path d="M18 12h3" />
        </svg>
      `,
      blank: `
        <svg viewBox="0 0 24 24" class="teacher-tool-icon" aria-hidden="true">
          <rect x="4" y="6" width="16" height="12" rx="2" />
          <path d="M8 16l8-8" />
        </svg>
      `,
      shortcuts: `
        <svg viewBox="0 0 24 24" class="teacher-tool-icon" aria-hidden="true">
          <rect x="3.5" y="6.5" width="17" height="11" rx="2.5" />
          <path d="M7 11h1" />
          <path d="M10 11h1" />
          <path d="M13 11h1" />
          <path d="M7 14h4" />
          <path d="M13 14h4" />
        </svg>
      `,
      undo: `
        <svg viewBox="0 0 24 24" class="teacher-tool-icon" aria-hidden="true">
          <path d="M9 8l-4 4 4 4" />
          <path d="M5 12h9a5 5 0 010 10h-2" />
        </svg>
      `,
      clearSlide: `
        <svg viewBox="0 0 24 24" class="teacher-tool-icon" aria-hidden="true">
          <rect x="6" y="6" width="12" height="12" rx="2" />
          <path d="M9 9l6 6" />
          <path d="M15 9l-6 6" />
        </svg>
      `,
      clearAll: `
        <svg viewBox="0 0 24 24" class="teacher-tool-icon" aria-hidden="true">
          <path d="M8 8h8a2 2 0 012 2v8" />
          <rect x="4" y="4" width="12" height="12" rx="2" />
          <path d="M7 7l6 6" />
          <path d="M13 7l-6 6" />
        </svg>
      `,
    }

    return icons[name] ?? ""
  }

  const controlsBar = document.createElement("div")
  controlsBar.className = "teacher-controls__bar"

  while (controls.firstChild) {
    controlsBar.append(controls.firstChild)
  }

  controls.append(controlsBar)

  const toolsDock = document.createElement("div")
  toolsDock.className = "teacher-tools-dock"
  toolsDock.hidden = true
  toolsDock.innerHTML = `
    <section
      class="teacher-tools-shelf"
      data-role="teacher-tools-shelf"
      aria-label="Presentation tools"
      hidden
    >
      <div class="teacher-tool-item" data-tool="shortcuts">
        <button
          type="button"
          class="teacher-tool-button teacher-tool-button--icon"
          data-action="show-shortcuts"
          aria-label="Keyboard shortcuts"
          title="Keyboard shortcuts (?)"
        >
          ${getTeacherIcon("shortcuts")}
          <span class="sr-only">Keyboard shortcuts</span>
        </button>
        <div class="teacher-tool-popover teacher-tool-popover--shortcuts" role="note">
          <div class="teacher-shortcut-list">
            <span class="teacher-shortcut"><kbd>&larr; &rarr;</kbd><span>Slides</span></span>
            <span class="teacher-shortcut"><kbd>Esc</kbd><span>Exit slides</span></span>
            <span class="teacher-shortcut"><kbd>H</kbd><span>Highlight</span></span>
            <span class="teacher-shortcut"><kbd>S</kbd><span>Spotlight</span></span>
            <span class="teacher-shortcut"><kbd>B</kbd><span>Blank screen</span></span>
            <span class="teacher-shortcut"><kbd>T</kbd><span>Toggle tools</span></span>
            <span class="teacher-shortcut"><kbd>U</kbd><span>Undo</span></span>
            <span class="teacher-shortcut"><kbd>C</kbd><span>Clear slide</span></span>
            <span class="teacher-shortcut"><kbd>1 2</kbd><span>Highlight colour</span></span>
            <span class="teacher-shortcut"><kbd>[ ]</kbd><span>Spotlight size</span></span>
          </div>
        </div>
      </div>
      <div class="teacher-tool-item" data-tool="blank">
        <button
          type="button"
          class="teacher-tool-button teacher-tool-button--icon"
          data-action="toggle-blank-screen"
          aria-label="Blank screen"
          title="Blank screen (B)"
        >
          ${getTeacherIcon("blank")}
          <span class="sr-only">Blank screen</span>
        </button>
      </div>
      <div class="teacher-tool-item" data-tool="spotlight">
        <button
          type="button"
          class="teacher-tool-button teacher-tool-button--icon"
          data-action="toggle-spotlight"
          aria-label="Spotlight"
          title="Spotlight (S)"
        >
          ${getTeacherIcon("spotlight")}
          <span class="sr-only">Spotlight</span>
        </button>
        <div class="teacher-tool-popover teacher-tool-popover--spotlight">
          <label class="teacher-tool-slider" for="teacher-spotlight-size">
            <span class="sr-only">Spotlight size</span>
            <input
              id="teacher-spotlight-size"
              type="range"
              min="130"
              max="320"
              step="10"
              value="210"
              data-action="spotlight-size"
              title="Spotlight size ([ and ])"
            />
            <span
              class="teacher-tool-slider__value"
              data-role="spotlight-size-value"
            >
              210
            </span>
          </label>
        </div>
      </div>
      <div class="teacher-tool-item" data-tool="highlight">
        <button
          type="button"
          class="teacher-tool-button teacher-tool-button--icon"
          data-action="toggle-highlight"
          aria-label="Highlight text"
          title="Highlight text (H)"
        >
          ${getTeacherIcon("highlight")}
          <span class="sr-only">Highlight text</span>
        </button>
        <div class="teacher-tool-popover teacher-tool-popover--highlight">
          <div class="teacher-tool-popover-row">
            <button
              type="button"
              class="teacher-tool-swatch"
              data-action="set-highlight-color"
              data-highlight-color="yellow"
              aria-label="Yellow highlight"
              title="Yellow highlight (1)"
            >
              <span class="teacher-tool-swatch__dot teacher-tool-swatch__dot--yellow"></span>
            </button>
            <button
              type="button"
              class="teacher-tool-swatch"
              data-action="set-highlight-color"
              data-highlight-color="mint"
              aria-label="Mint highlight"
              title="Mint highlight (2)"
            >
              <span class="teacher-tool-swatch__dot teacher-tool-swatch__dot--mint"></span>
            </button>
          </div>
          <div class="teacher-tool-popover-row">
            <button
              type="button"
              class="teacher-tool-mini"
              data-action="undo-highlight"
              aria-label="Undo highlight"
              title="Undo highlight (U)"
            >
              ${getTeacherIcon("undo")}
              <span class="sr-only">Undo highlight</span>
            </button>
            <button
              type="button"
              class="teacher-tool-mini"
              data-action="clear-slide-highlights"
              aria-label="Clear current slide highlights"
              title="Clear current slide highlights (C)"
            >
              ${getTeacherIcon("clearSlide")}
              <span class="sr-only">Clear current slide highlights</span>
            </button>
            <button
              type="button"
              class="teacher-tool-mini"
              data-action="clear-all-highlights"
              aria-label="Clear all highlights"
              title="Clear all highlights (Shift+C)"
            >
              ${getTeacherIcon("clearAll")}
              <span class="sr-only">Clear all highlights</span>
            </button>
          </div>
        </div>
      </div>
    </section>
    <button
      type="button"
      class="teacher-tool-toggle"
      data-action="toggle-tools-dock"
      aria-expanded="false"
      aria-label="Toggle presentation tools"
      title="Tools (T)"
    >
      ${getTeacherIcon("tools")}
      <span class="sr-only">Toggle presentation tools</span>
    </button>
  `
  document.body.append(toolsDock)

  const shelf = toolsDock.querySelector("[data-role='teacher-tools-shelf']")
  const toolsToggleButton = toolsDock.querySelector(
    "[data-action='toggle-tools-dock']"
  )
  const shortcutsButton = toolsDock.querySelector(
    "[data-action='show-shortcuts']"
  )
  const highlightItem = toolsDock.querySelector("[data-tool='highlight']")
  const spotlightItem = toolsDock.querySelector("[data-tool='spotlight']")
  const blankItem = toolsDock.querySelector("[data-tool='blank']")
  const highlightToggleButton = toolsDock.querySelector(
    "[data-action='toggle-highlight']"
  )
  const highlightColorButtons = Array.from(
    toolsDock.querySelectorAll("[data-action='set-highlight-color']")
  )
  const undoHighlightButton = toolsDock.querySelector(
    "[data-action='undo-highlight']"
  )
  const clearSlideHighlightsButton = toolsDock.querySelector(
    "[data-action='clear-slide-highlights']"
  )
  const clearAllHighlightsButton = toolsDock.querySelector(
    "[data-action='clear-all-highlights']"
  )
  const spotlightToggleButton = toolsDock.querySelector(
    "[data-action='toggle-spotlight']"
  )
  const spotlightSizeInput = toolsDock.querySelector(
    "[data-action='spotlight-size']"
  )
  const spotlightSizeValue = toolsDock.querySelector(
    "[data-role='spotlight-size-value']"
  )
  const blankScreenButton = toolsDock.querySelector(
    "[data-action='toggle-blank-screen']"
  )

  const overlay = document.createElement("div")
  overlay.className = "teacher-presentation-overlay"
  overlay.setAttribute("aria-hidden", "true")
  overlay.hidden = true
  document.body.append(overlay)

  previousButton?.setAttribute("title", "Previous slide (Arrow Left or Page Up)")
  nextButton?.setAttribute(
    "title",
    "Next slide (Arrow Right, Space, or Page Down)"
  )
  exitButton?.setAttribute("title", "Exit slides (Escape)")

  function getSlide(index = activeSlideIndex) {
    return slides[index] ?? slides[0] ?? null
  }

  function getActiveSlide() {
    return getSlide()?.section ?? sections[0] ?? null
  }

  function syncSectionChunkVisibility() {
    const activeSlide = getSlide()

    sectionSlides.forEach((sectionSlide) => {
      const activeChunkIndex =
        isTeacherMode && activeSlide?.section === sectionSlide.section
          ? activeSlide.chunkIndex
          : 0
      const shouldSplitSection =
        isTeacherMode && sectionSlide.chunks.length > 1

      sectionSlide.markers.forEach((marker) => {
        marker.hidden = true
      })

      sectionSlide.chunks.forEach((chunk, chunkIndex) => {
        const shouldHideChunk =
          shouldSplitSection && chunkIndex !== activeChunkIndex

        chunk.forEach((element) => {
          element.hidden = false
          element.classList.toggle(TEACHER_CHUNK_HIDDEN_CLASS, shouldHideChunk)
        })
      })
    })
  }

  function clearTextSelection() {
    const selection = window.getSelection()

    selection?.removeAllRanges()
  }

  function getHighlightLayer(slide) {
    if (!slide) {
      return null
    }

    let layer = slide.querySelector("[data-role='teacher-highlight-layer']")

    if (!layer) {
      layer = document.createElement("div")
      layer.className = "teacher-highlight-layer"
      layer.dataset.role = "teacher-highlight-layer"
      slide.append(layer)
    }

    layer.style.height = `${Math.ceil(slide.scrollHeight)}px`

    return layer
  }

  function pruneEmptyHighlightLayers() {
    sections.forEach((slide) => {
      const layer = slide.querySelector("[data-role='teacher-highlight-layer']")

      if (!layer) {
        return
      }

      layer.style.height = `${Math.ceil(slide.scrollHeight)}px`

      if (layer.childElementCount === 0) {
        layer.remove()
      }
    })
  }

  function pruneHighlightHistory() {
    teacherToolsState.highlightHistory = teacherToolsState.highlightHistory.filter(
      (entry) => entry.elements.some((element) => element.isConnected)
    )
  }

  function removeHighlightEntry(entry) {
    entry?.elements?.forEach((element) => {
      element.remove()
    })
  }

  function slideHasHighlights(slide = getActiveSlide()) {
    return Boolean(slide?.querySelector(".teacher-highlight"))
  }

  function applySelectionHighlight() {
    if (!isTeacherMode || teacherToolsState.activeMode !== "highlight") {
      return false
    }

    const selection = window.getSelection()

    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      return false
    }

    const range = selection.getRangeAt(0)
    const activeSlide = getActiveSlide()

    if (
      !activeSlide ||
      !activeSlide.contains(range.commonAncestorContainer) ||
      !activeSlide.contains(selection.anchorNode) ||
      !activeSlide.contains(selection.focusNode)
    ) {
      return false
    }

    const slideRect = activeSlide.getBoundingClientRect()
    const layer = getHighlightLayer(activeSlide)
    const highlightRects = Array.from(range.getClientRects()).filter(
      (rect) => rect.width > 4 && rect.height > 6
    )

    if (!layer || highlightRects.length === 0) {
      clearTextSelection()
      pruneEmptyHighlightLayers()
      return false
    }

    const elements = highlightRects.map((rect) => {
      const element = document.createElement("div")
      element.className = `teacher-highlight teacher-highlight--${teacherToolsState.highlightColor}`
      element.style.left = `${Math.max(
        rect.left - slideRect.left - 2,
        0
      )}px`
      element.style.top = `${Math.max(
        rect.top - slideRect.top + activeSlide.scrollTop - 1,
        0
      )}px`
      element.style.width = `${rect.width + 4}px`
      element.style.height = `${rect.height + 2}px`
      layer.append(element)
      return element
    })

    teacherToolsState.highlightHistory.push({
      slide: activeSlide,
      elements,
    })

    clearTextSelection()
    updateTeacherToolsUI()

    return true
  }

  function undoLastHighlight() {
    pruneHighlightHistory()

    const lastEntry = teacherToolsState.highlightHistory.pop()

    if (!lastEntry) {
      return
    }

    removeHighlightEntry(lastEntry)
    pruneEmptyHighlightLayers()
    updateTeacherToolsUI()
  }

  function clearSlideHighlights(slide = getActiveSlide()) {
    if (!slide) {
      return
    }

    teacherToolsState.highlightHistory.forEach((entry) => {
      if (entry.slide === slide) {
        removeHighlightEntry(entry)
      }
    })

    teacherToolsState.highlightHistory = teacherToolsState.highlightHistory.filter(
      (entry) => entry.slide !== slide
    )

    slide
      .querySelectorAll(".teacher-highlight")
      .forEach((element) => element.remove())

    pruneEmptyHighlightLayers()
    updateTeacherToolsUI()
  }

  function clearAllHighlights() {
    teacherToolsState.highlightHistory.forEach(removeHighlightEntry)
    teacherToolsState.highlightHistory = []

    sections.forEach((slide) => {
      slide
        .querySelectorAll(".teacher-highlight, [data-role='teacher-highlight-layer']")
        .forEach((element) => element.remove())
    })

    updateTeacherToolsUI()
  }

  function updatePresentationOverlay() {
    const showOverlay =
      isTeacherMode &&
      (teacherToolsState.blankScreen ||
        teacherToolsState.activeMode === "spotlight")

    overlay.hidden = !showOverlay
    overlay.classList.toggle("is-visible", showOverlay)
    overlay.classList.toggle("is-blank", teacherToolsState.blankScreen)
    overlay.classList.toggle(
      "is-spotlight",
      showOverlay &&
        teacherToolsState.activeMode === "spotlight" &&
        !teacherToolsState.blankScreen
    )
    overlay.style.setProperty(
      "--teacher-spotlight-x",
      `${teacherToolsState.spotlightX}%`
    )
    overlay.style.setProperty(
      "--teacher-spotlight-y",
      `${teacherToolsState.spotlightY}%`
    )
    overlay.style.setProperty(
      "--teacher-spotlight-size",
      `${teacherToolsState.spotlightSize}px`
    )
  }

  function setTeacherToolsOpen(nextOpen) {
    teacherToolsState.shelfOpen = Boolean(nextOpen) && isTeacherMode
    toolsDock.classList.toggle("teacher-tools-dock--open", teacherToolsState.shelfOpen)
    toolsToggleButton?.setAttribute(
      "aria-expanded",
      String(teacherToolsState.shelfOpen)
    )
    shelf.hidden = !teacherToolsState.shelfOpen
  }

  function setActiveTeacherTool(nextMode) {
    teacherToolsState.activeMode =
      teacherToolsState.activeMode === nextMode ? null : nextMode
    updateTeacherToolsUI()
    updatePresentationOverlay()
  }

  function setSpotlightPosition(clientX, clientY) {
    teacherToolsState.spotlightX = clamp(
      (clientX / Math.max(window.innerWidth, 1)) * 100,
      8,
      92
    )
    teacherToolsState.spotlightY = clamp(
      (clientY / Math.max(window.innerHeight, 1)) * 100,
      10,
      90
    )

    updatePresentationOverlay()
  }

  function setSpotlightSize(nextSize) {
    teacherToolsState.spotlightSize = clamp(nextSize, 130, 320)
    updateTeacherToolsUI()
    updatePresentationOverlay()
  }

  updateTeacherToolsUI = () => {
    pruneHighlightHistory()
    pruneEmptyHighlightLayers()

    const hasHighlights = teacherToolsState.highlightHistory.length > 0
    const hasActiveTool =
      teacherToolsState.blankScreen ||
      teacherToolsState.activeMode !== null ||
      hasHighlights

    toolsToggleButton?.classList.toggle("has-active-tool", hasActiveTool)
    highlightItem?.classList.toggle(
      "is-active",
      teacherToolsState.activeMode === "highlight"
    )
    spotlightItem?.classList.toggle(
      "is-active",
      teacherToolsState.activeMode === "spotlight"
    )
    blankItem?.classList.toggle("is-active", teacherToolsState.blankScreen)
    highlightToggleButton?.classList.toggle(
      "is-active",
      teacherToolsState.activeMode === "highlight"
    )
    highlightToggleButton?.setAttribute(
      "aria-pressed",
      String(teacherToolsState.activeMode === "highlight")
    )
    spotlightToggleButton?.classList.toggle(
      "is-active",
      teacherToolsState.activeMode === "spotlight"
    )
    spotlightToggleButton?.setAttribute(
      "aria-pressed",
      String(teacherToolsState.activeMode === "spotlight")
    )
    blankScreenButton?.classList.toggle("is-active", teacherToolsState.blankScreen)
    blankScreenButton?.setAttribute(
      "aria-pressed",
      String(teacherToolsState.blankScreen)
    )
    spotlightSizeInput.value = String(teacherToolsState.spotlightSize)

    if (spotlightSizeValue) {
      spotlightSizeValue.textContent = `${teacherToolsState.spotlightSize}`
    }

    highlightColorButtons.forEach((button) => {
      const isActive =
        button.dataset.highlightColor === teacherToolsState.highlightColor
      button.classList.toggle("is-active", isActive)
      button.setAttribute("aria-pressed", String(isActive))
    })

    undoHighlightButton.disabled = !hasHighlights
    clearAllHighlightsButton.disabled = !hasHighlights
    clearSlideHighlightsButton.disabled = !slideHasHighlights()
  }

  resetTeacherTools = () => {
    clearAllHighlights()
    clearTextSelection()
    teacherToolsState.shelfOpen = false
    teacherToolsState.activeMode = null
    teacherToolsState.blankScreen = false
    updatePresentationOverlay()
    setTeacherToolsOpen(false)
    updateTeacherToolsUI()
  }

  toolsToggleButton?.addEventListener("click", () => {
    setTeacherToolsOpen(!teacherToolsState.shelfOpen)
  })

  shortcutsButton?.addEventListener("click", () => {
    setTeacherToolsOpen(true)
  })

  highlightToggleButton?.addEventListener("click", () => {
    setActiveTeacherTool("highlight")
  })

  highlightColorButtons.forEach((button) => {
    button.addEventListener("click", () => {
      teacherToolsState.highlightColor =
        button.dataset.highlightColor ?? teacherToolsState.highlightColor
      teacherToolsState.activeMode = "highlight"
      updateTeacherToolsUI()
      updatePresentationOverlay()
    })
  })

  undoHighlightButton?.addEventListener("click", () => {
    undoLastHighlight()
  })

  clearSlideHighlightsButton?.addEventListener("click", () => {
    clearSlideHighlights()
  })

  clearAllHighlightsButton?.addEventListener("click", () => {
    clearAllHighlights()
  })

  spotlightToggleButton?.addEventListener("click", () => {
    setActiveTeacherTool("spotlight")
  })

  spotlightSizeInput?.addEventListener("input", () => {
    setSpotlightSize(
      Number(spotlightSizeInput.value) || teacherToolsState.spotlightSize
    )
  })

  blankScreenButton?.addEventListener("click", () => {
    teacherToolsState.blankScreen = !teacherToolsState.blankScreen
    updateTeacherToolsUI()
    updatePresentationOverlay()
  })

  function findNearestSectionIndex() {
    let nearestSection = sections[0] ?? null
    let nearestDistance = Number.MAX_SAFE_INTEGER

    sections.forEach((section) => {
      const distance = Math.abs(section.getBoundingClientRect().top - 150)

      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestSection = section
      }
    })

    return firstSlideIndexBySection.get(nearestSection) ?? 0
  }

  function updateControls() {
    toggleButton.textContent = isTeacherMode
      ? "Exit teacher slides"
      : "Teacher slides"
    toggleButton.setAttribute("aria-pressed", String(isTeacherMode))

    if (controls) {
      controls.hidden = !isTeacherMode
    }

    if (toolsDock) {
      toolsDock.hidden = !isTeacherMode
    }

    if (status) {
      status.textContent = `Slide ${activeSlideIndex + 1} of ${slides.length}`
    }

    if (previousButton) {
      previousButton.disabled = activeSlideIndex === 0
    }

    if (nextButton) {
      nextButton.disabled = activeSlideIndex === slides.length - 1
    }

    updateTeacherToolsUI()
  }

  function syncHash() {
    const activeSectionId = getSlide()?.section?.id

    if (activeSectionId) {
      history.replaceState(null, "", `#${activeSectionId}`)
    }
  }

  function goToSlide(index, behavior = "smooth") {
    const previousSlide = getSlide()

    activeSlideIndex = clamp(index, 0, slides.length - 1)
    clearTextSelection()
    syncSectionChunkVisibility()
    pruneEmptyHighlightLayers()

    const activeSlide = getSlide()

    if (activeSlide?.section) {
      activeSlide.section.scrollTop = 0
    }

    if (
      activeSlide?.section &&
      (!previousSlide ||
        previousSlide.section !== activeSlide.section ||
        !isTeacherMode)
    ) {
      slideScrollTargetSection = isTeacherMode ? activeSlide.section : null
      activeSlide.section.scrollIntoView({
        behavior,
        block: isTeacherMode ? "nearest" : "start",
        inline: "start",
      })
    } else {
      slideScrollTargetSection = null
    }

    syncHash()
    updateControls()
  }

  function setTeacherMode(nextMode) {
    isTeacherMode = nextMode

    if (!isTeacherMode) {
      resetTeacherTools()
    }

    document.body.classList.toggle("teacher-mode-active", isTeacherMode)
    syncSectionChunkVisibility()
    writeStorage(storageKey, isTeacherMode)
    updateControls()
    updatePresentationOverlay()

    requestAnimationFrame(() => {
      goToSlide(activeSlideIndex, "auto")
    })
  }

  const initialHashSection = sections.find(
    (section) => `#${section.id}` === window.location.hash
  )

  if (initialHashSection) {
    activeSlideIndex = firstSlideIndexBySection.get(initialHashSection) ?? 0
  }

  syncSectionChunkVisibility()
  updateControls()

  if (isTeacherMode) {
    document.body.classList.add("teacher-mode-active")

    requestAnimationFrame(() => {
      goToSlide(activeSlideIndex, "auto")
    })
  }

  updatePresentationOverlay()

  toggleButton.addEventListener("click", () => {
    if (!isTeacherMode) {
      activeSlideIndex = findNearestSectionIndex()
    }

    setTeacherMode(!isTeacherMode)
  })

  previousButton?.addEventListener("click", () => {
    goToSlide(activeSlideIndex - 1)
  })

  nextButton?.addEventListener("click", () => {
    goToSlide(activeSlideIndex + 1)
  })

  exitButton?.addEventListener("click", () => {
    setTeacherMode(false)
  })

  main.addEventListener("scroll", () => {
    if (!isTeacherMode) {
      return
    }

    const nextSectionIndex = clamp(
      Math.round(main.scrollLeft / Math.max(main.clientWidth, 1)),
      0,
      sections.length - 1
    )
    const visibleSection = sections[nextSectionIndex]

    if (slideScrollTargetSection) {
      if (visibleSection === slideScrollTargetSection) {
        slideScrollTargetSection = null
      } else {
        return
      }
    }

    const currentSlide = getSlide()
    const nextSlideIndex =
      currentSlide?.section === visibleSection
        ? activeSlideIndex
        : firstSlideIndexBySection.get(visibleSection) ?? activeSlideIndex

    if (nextSlideIndex !== activeSlideIndex) {
      activeSlideIndex = nextSlideIndex
      syncSectionChunkVisibility()
      syncHash()
      updateControls()
    }
  })

  main.addEventListener("pointerdown", (event) => {
    if (!isTeacherMode) {
      return
    }

    const startedOnInteractive = Boolean(event.target.closest(INTERACTIVE_SELECTOR))

    if (
      teacherToolsState.activeMode === "spotlight" &&
      !startedOnInteractive
    ) {
      setSpotlightPosition(event.clientX, event.clientY)
    }

    pointerStart = {
      x: event.clientX,
      y: event.clientY,
      interactive: startedOnInteractive,
      toolLocked:
        teacherToolsState.blankScreen ||
        teacherToolsState.activeMode === "highlight" ||
        teacherToolsState.activeMode === "spotlight",
    }
  })

  main.addEventListener("pointermove", (event) => {
    if (
      !isTeacherMode ||
      !pointerStart ||
      pointerStart.interactive ||
      teacherToolsState.activeMode !== "spotlight"
    ) {
      return
    }

    setSpotlightPosition(event.clientX, event.clientY)
  })

  main.addEventListener("pointerup", (event) => {
    if (!isTeacherMode || !pointerStart) {
      return
    }

    const deltaX = event.clientX - pointerStart.x
    const deltaY = event.clientY - pointerStart.y
    const startedOnInteractive = pointerStart.interactive
    const toolLocked = pointerStart.toolLocked
    pointerStart = null

    if (startedOnInteractive || event.target.closest(INTERACTIVE_SELECTOR)) {
      return
    }

    if (teacherToolsState.activeMode === "highlight") {
      applySelectionHighlight()
      return
    }

    if (teacherToolsState.activeMode === "spotlight") {
      setSpotlightPosition(event.clientX, event.clientY)
      return
    }

    if (teacherToolsState.blankScreen || toolLocked) {
      return
    }

    if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY)) {
      goToSlide(activeSlideIndex + (deltaX < 0 ? 1 : -1))
      return
    }

    if (Math.abs(deltaX) < 12 && Math.abs(deltaY) < 12) {
      goToSlide(activeSlideIndex + 1)
    }
  })

  main.addEventListener("pointercancel", () => {
    pointerStart = null
  })

  window.addEventListener("resize", () => {
    pruneEmptyHighlightLayers()
    updatePresentationOverlay()
  })

  document.addEventListener("pointerdown", (event) => {
    if (
      !isTeacherMode ||
      !teacherToolsState.shelfOpen ||
      toolsDock.contains(event.target)
    ) {
      return
    }

    setTeacherToolsOpen(false)
  })

  window.addEventListener("keydown", (event) => {
    if (!isTeacherMode) {
      return
    }

    if (event.metaKey || event.ctrlKey || event.altKey) {
      return
    }

    if (
      ["INPUT", "TEXTAREA", "SELECT"].includes(
        document.activeElement?.tagName ?? ""
      )
    ) {
      return
    }

    const lowerKey = event.key.toLowerCase()

    if (lowerKey === "t") {
      event.preventDefault()
      setTeacherToolsOpen(!teacherToolsState.shelfOpen)
      return
    }

    if (lowerKey === "h") {
      event.preventDefault()
      setTeacherToolsOpen(true)
      setActiveTeacherTool("highlight")
      return
    }

    if (lowerKey === "s") {
      event.preventDefault()
      setTeacherToolsOpen(true)
      setActiveTeacherTool("spotlight")
      return
    }

    if (lowerKey === "b") {
      event.preventDefault()
      teacherToolsState.blankScreen = !teacherToolsState.blankScreen
      updateTeacherToolsUI()
      updatePresentationOverlay()
      return
    }

    if (lowerKey === "u") {
      event.preventDefault()
      undoLastHighlight()
      return
    }

    if (lowerKey === "c") {
      event.preventDefault()

      if (event.shiftKey) {
        clearAllHighlights()
      } else {
        clearSlideHighlights()
      }

      return
    }

    if (event.key === "1") {
      event.preventDefault()
      teacherToolsState.highlightColor = "yellow"
      updateTeacherToolsUI()
      return
    }

    if (event.key === "2") {
      event.preventDefault()
      teacherToolsState.highlightColor = "mint"
      updateTeacherToolsUI()
      return
    }

    if (
      teacherToolsState.activeMode === "spotlight" &&
      ["[", "-", "_"].includes(event.key)
    ) {
      event.preventDefault()
      setSpotlightSize(teacherToolsState.spotlightSize - 10)
      return
    }

    if (
      teacherToolsState.activeMode === "spotlight" &&
      ["]", "=", "+"].includes(event.key)
    ) {
      event.preventDefault()
      setSpotlightSize(teacherToolsState.spotlightSize + 10)
      return
    }

    if (event.key === "?" || (event.key === "/" && event.shiftKey)) {
      event.preventDefault()
      setTeacherToolsOpen(true)
      shortcutsButton?.focus()
      return
    }

    if (
      event.key === "ArrowRight" ||
      event.key === "PageDown" ||
      event.key === " "
    ) {
      event.preventDefault()
      goToSlide(activeSlideIndex + 1)
    }

    if (event.key === "ArrowLeft" || event.key === "PageUp") {
      event.preventDefault()
      goToSlide(activeSlideIndex - 1)
    }

    if (event.key === "Escape") {
      event.preventDefault()
      setTeacherMode(false)
    }
  })
}

export function initLessonPage(config) {
  initContextNavigation(config)
  initSectionNavigation()
  initQuiz(config)
  initExamPractice(config)
  initTeacherMode(config)
}
