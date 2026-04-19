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

function initTeacherMode(config) {
  const main = document.querySelector("[data-role='lesson-main']")
  const sections = Array.from(document.querySelectorAll("[data-lesson-section]"))
  const toggleButton = document.querySelector(
    "[data-action='toggle-teacher-mode']"
  )
  const controls = document.querySelector("[data-role='teacher-controls']")
  const status = document.querySelector("[data-role='slide-status']")
  const previousButton = document.querySelector("[data-action='prev-slide']")
  const nextButton = document.querySelector("[data-action='next-slide']")
  const exitButton = document.querySelector("[data-action='exit-teacher-mode']")

  if (!main || sections.length === 0 || !toggleButton) {
    return
  }

  const storageKey = `${config.lessonId}-teacher-mode`
  let isTeacherMode = Boolean(readStorage(storageKey, false))
  let activeSlideIndex = 0
  let pointerStart = null

  function findNearestSectionIndex() {
    let nearestIndex = 0
    let nearestDistance = Number.MAX_SAFE_INTEGER

    sections.forEach((section, index) => {
      const distance = Math.abs(section.getBoundingClientRect().top - 150)

      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestIndex = index
      }
    })

    return nearestIndex
  }

  function updateControls() {
    toggleButton.textContent = isTeacherMode
      ? "Exit teacher slides"
      : "Teacher slides"
    toggleButton.setAttribute("aria-pressed", String(isTeacherMode))

    if (controls) {
      controls.hidden = !isTeacherMode
    }

    if (status) {
      status.textContent = `Slide ${activeSlideIndex + 1} of ${sections.length}`
    }

    if (previousButton) {
      previousButton.disabled = activeSlideIndex === 0
    }

    if (nextButton) {
      nextButton.disabled = activeSlideIndex === sections.length - 1
    }
  }

  function syncHash() {
    const activeSectionId = sections[activeSlideIndex]?.id

    if (activeSectionId) {
      history.replaceState(null, "", `#${activeSectionId}`)
    }
  }

  function goToSlide(index, behavior = "smooth") {
    activeSlideIndex = clamp(index, 0, sections.length - 1)

    sections[activeSlideIndex].scrollIntoView({
      behavior,
      block: isTeacherMode ? "nearest" : "start",
      inline: "start",
    })

    syncHash()
    updateControls()
  }

  function setTeacherMode(nextMode) {
    isTeacherMode = nextMode
    document.body.classList.toggle("teacher-mode-active", isTeacherMode)
    writeStorage(storageKey, isTeacherMode)
    updateControls()

    requestAnimationFrame(() => {
      goToSlide(activeSlideIndex, "auto")
    })
  }

  const initialHashIndex = sections.findIndex(
    (section) => `#${section.id}` === window.location.hash
  )

  if (initialHashIndex >= 0) {
    activeSlideIndex = initialHashIndex
  }

  updateControls()

  if (isTeacherMode) {
    document.body.classList.add("teacher-mode-active")

    requestAnimationFrame(() => {
      goToSlide(activeSlideIndex, "auto")
    })
  }

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

    const nextIndex = clamp(
      Math.round(main.scrollLeft / Math.max(main.clientWidth, 1)),
      0,
      sections.length - 1
    )

    if (nextIndex !== activeSlideIndex) {
      activeSlideIndex = nextIndex
      syncHash()
      updateControls()
    }
  })

  main.addEventListener("pointerdown", (event) => {
    if (!isTeacherMode) {
      return
    }

    pointerStart = {
      x: event.clientX,
      y: event.clientY,
      interactive: Boolean(event.target.closest(INTERACTIVE_SELECTOR)),
    }
  })

  main.addEventListener("pointerup", (event) => {
    if (!isTeacherMode || !pointerStart) {
      return
    }

    const deltaX = event.clientX - pointerStart.x
    const deltaY = event.clientY - pointerStart.y
    const startedOnInteractive = pointerStart.interactive
    pointerStart = null

    if (startedOnInteractive || event.target.closest(INTERACTIVE_SELECTOR)) {
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

  window.addEventListener("keydown", (event) => {
    if (!isTeacherMode) {
      return
    }

    if (
      ["INPUT", "TEXTAREA", "SELECT"].includes(
        document.activeElement?.tagName ?? ""
      )
    ) {
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
