import {
  readSessionStorage,
  readStorage,
  removeStorage,
  writeSessionStorage,
  writeStorage,
} from "./storage.js"

const EMPTY_ATTEMPT = {
  answers: {},
  feedback: [],
  score: null,
}

function buildDraftKey(exam) {
  return `past-exam-draft:${exam.id}:v${exam.version ?? 1}`
}

function buildAttemptsKey(exam) {
  return `past-exam-attempts:${exam.id}:v${exam.version ?? 1}`
}

function buildUnlockKey(exam) {
  return `past-exam-unlocked:${exam.id}`
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function normaliseText(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
}

function normaliseCompact(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
}

function getAllParts(exam) {
  return exam.groups.flatMap((group) => group.parts)
}

function getPartFieldIds(part) {
  if (part.response.type === "list") {
    return Array.from(
      { length: part.response.count },
      (_, index) => `${part.id}-${index + 1}`
    )
  }

  if (part.response.type === "matrix-calculation") {
    const fields = [`${part.id}-working-note`]

    Array.from({ length: part.response.rows }, (_, rowIndex) => {
      Array.from({ length: part.response.columns }, (_, columnIndex) => {
        const row = rowIndex + 1
        const column = columnIndex + 1

        fields.push(`${part.id}-working-r${row}c${column}`)
        fields.push(`${part.id}-result-r${row}c${column}`)
      })
    })

    return fields
  }

  if (part.response.type === "table") {
    return part.response.rows.map((row) => `${part.id}-${row.id}`)
  }

  return [part.id]
}

function hasTermSet(text, termSet) {
  return termSet.every((term) => normaliseText(text).includes(normaliseText(term)))
}

function countTerms(text, terms = []) {
  const haystack = normaliseText(text)

  return terms.filter((term) => haystack.includes(normaliseText(term))).length
}

function getPartAnswerText(part, answers) {
  return getPartFieldIds(part)
    .map((fieldId) => answers[fieldId] ?? "")
    .join(" ")
}

function markPointsRubric(part, answers) {
  const answerText = getPartAnswerText(part, answers)
  const matched = []
  const missed = []

  part.rubric.points.forEach((point) => {
    const hit = point.terms.some((termSet) => hasTermSet(answerText, termSet))

    if (hit && matched.length < part.rubric.maxMarks) {
      matched.push(point.label)
      return
    }

    if (!hit && missed.length < 3) {
      missed.push(point.label)
    }
  })

  return {
    score: clamp(matched.length, 0, part.rubric.maxMarks),
    matched,
    missed,
  }
}

function markCalculationRubric(part, answers) {
  const answerText = getPartAnswerText(part, answers)
  const compact = normaliseCompact(answerText)
  const requiredHits = part.rubric.requiredNumbers.filter((number) =>
    compact.includes(number)
  ).length
  const workingHit =
    part.rubric.workingTerms?.some((termSet) => hasTermSet(answerText, termSet)) ||
    (answerText.includes("+") && /[\[\](){}]/.test(answerText))
  const finalHit = requiredHits === part.rubric.requiredNumbers.length
  const partialFinalHit = requiredHits >= Math.ceil(part.rubric.requiredNumbers.length / 2)
  const score = (workingHit ? 1 : 0) + (finalHit || partialFinalHit ? 1 : 0)

  return {
    score: clamp(score, 0, part.rubric.maxMarks),
    matched: [
      ...(workingHit ? ["Shows matrix-style working"] : []),
      ...(finalHit ? ["Includes the correct final daily totals"] : []),
    ],
    missed: [
      ...(!workingHit ? ["Show the matrix addition working"] : []),
      ...(!finalHit ? ["Final totals should be 55, 53, 84, 68, 53, 44"] : []),
    ],
  }
}

function markSequenceRubric(part, answers) {
  const answerText = getPartAnswerText(part, answers)
  const numbers = answerText.match(/\d+/g) ?? []
  const correct =
    numbers.length >= part.rubric.requiredNumbers.length &&
    part.rubric.requiredNumbers.every((number, index) => numbers[index] === number)

  return {
    score: correct ? part.rubric.maxMarks : 0,
    matched: correct ? ["Correct row-major order"] : [],
    missed: correct
      ? []
      : [`Use this order: ${part.rubric.requiredNumbers.join(", ")}`],
  }
}

function markExactTableRubric(part, answers) {
  const matched = []
  const missed = []

  Object.entries(part.rubric.answers).forEach(([fieldId, expectedValue]) => {
    const actualValue = normaliseCompact(answers[fieldId])
    const expected = normaliseCompact(expectedValue)

    if (actualValue === expected) {
      matched.push(`${fieldId.replace(`${part.id}-`, "")}: ${expectedValue}`)
      return
    }

    missed.push(`${fieldId.replace(`${part.id}-`, "")}: ${expectedValue}`)
  })

  return {
    score: matched.length,
    matched,
    missed,
  }
}

function markExtendedRubric(part, answers) {
  const answerText = getPartAnswerText(part, answers)
  const words = normaliseText(answerText)
    .split(/\s+/)
    .filter(Boolean)
  const topicHits = countTerms(answerText, part.rubric.topicTerms)
  const contextHits = countTerms(answerText, part.rubric.contextTerms)
  let level = 0

  if (words.length >= 25 && topicHits >= 2) {
    level = 1
  }

  if (words.length >= 80 && topicHits >= 4 && contextHits >= 1) {
    level = 2
  }

  if (words.length >= 140 && topicHits >= 6 && contextHits >= 2) {
    level = 3
  }

  const score = level === 0 ? 0 : part.rubric.levelBands[level - 1]
  const matched = []
  const missed = []

  if (topicHits > 0) {
    matched.push(`Uses ${topicHits} relevant technical idea${topicHits === 1 ? "" : "s"}`)
  }

  if (contextHits > 0) {
    matched.push(`Links to the scenario ${contextHits} time${contextHits === 1 ? "" : "s"}`)
  }

  if (level >= 2) {
    matched.push("Develops the answer beyond isolated points")
  }

  if (words.length < 80) {
    missed.push("Develop the answer with more explanation and examples")
  }

  if (topicHits < 4) {
    missed.push("Use more precise Unit 2 technical vocabulary")
  }

  if (contextHits < 2) {
    missed.push("Make clearer links to the named scenario")
  }

  if (level < 3) {
    missed.push("For the top band, weigh up several connected points in a sustained way")
  }

  return {
    score,
    matched,
    missed,
  }
}

function markPart(part, answers) {
  let result

  switch (part.rubric.type) {
    case "calculation":
      result = markCalculationRubric(part, answers)
      break
    case "sequence":
      result = markSequenceRubric(part, answers)
      break
    case "exact-table":
    case "exact-text-table":
      result = markExactTableRubric(part, answers)
      break
    case "extended":
      result = markExtendedRubric(part, answers)
      break
    case "points":
    default:
      result = markPointsRubric(part, answers)
      break
  }

  return {
    partId: part.id,
    label: part.label,
    score: clamp(result.score, 0, part.marks),
    maxMarks: part.marks,
    matched: result.matched,
    missed: result.missed,
    examinerTip: part.rubric.examinerTip,
  }
}

function markAttempt(exam, answers) {
  const feedback = getAllParts(exam).map((part) => markPart(part, answers))
  const score = feedback.reduce((total, item) => total + item.score, 0)

  return {
    score,
    totalMarks: exam.totalMarks,
    feedback,
    markedAt: new Date().toISOString(),
    mode: "local-demo",
  }
}

function createInputField(fieldId, label, value, readOnly, rows = 4) {
  const wrapper = document.createElement("label")
  wrapper.className = "exam-answer-field"

  const labelElement = document.createElement("span")
  labelElement.textContent = label

  const field = document.createElement("textarea")
  field.dataset.answerField = fieldId
  field.rows = rows
  field.value = value ?? ""
  field.disabled = readOnly

  wrapper.append(labelElement, field)
  return wrapper
}

function renderMatrixGrid(part, answers, readOnly, mode) {
  const response = part.response
  const table = document.createElement("table")
  table.className = "exam-matrix-answer"

  const tbody = document.createElement("tbody")

  Array.from({ length: response.rows }, (_, rowIndex) => {
    const tr = document.createElement("tr")

    Array.from({ length: response.columns }, (_, columnIndex) => {
      const row = rowIndex + 1
      const column = columnIndex + 1
      const fieldId = `${part.id}-${mode}-r${row}c${column}`
      const td = document.createElement("td")
      const input = document.createElement("input")

      input.dataset.answerField = fieldId
      input.type = "text"
      input.value = answers[fieldId] ?? ""
      input.disabled = readOnly

      if (mode === "working") {
        input.placeholder = response.placeholders?.[rowIndex]?.[columnIndex] ?? ""
        input.setAttribute(
          "aria-label",
          `Working cell row ${row}, column ${column}`
        )
      } else {
        input.inputMode = "numeric"
        input.setAttribute(
          "aria-label",
          `Final matrix cell row ${row}, column ${column}`
        )
      }

      td.append(input)
      tr.append(td)
    })

    tbody.append(tr)
  })

  table.append(tbody)
  return table
}

function renderResponse(part, answers, readOnly) {
  const response = part.response
  const wrapper = document.createElement("div")
  wrapper.className = "exam-response"

  if (response.type === "list") {
    Array.from({ length: response.count }, (_, index) => {
      const fieldId = `${part.id}-${index + 1}`
      wrapper.append(
        createInputField(
          fieldId,
          `${response.label ?? "Point"} ${index + 1}`,
          answers[fieldId],
          readOnly,
          response.rows ?? 3
        )
      )
    })
    return wrapper
  }

  if (response.type === "matrix-calculation") {
    if (response.note) {
      const note = document.createElement("p")
      note.className = "exam-response-note"
      note.textContent = response.note
      wrapper.append(note)
    }

    const matrixShell = document.createElement("div")
    matrixShell.className = "exam-matrix-shell"

    const workingBlock = document.createElement("section")
    workingBlock.className = "exam-matrix-block"
    const workingHeading = document.createElement("h4")
    workingHeading.textContent = response.workingLabel ?? "Matrix working"
    workingBlock.append(workingHeading, renderMatrixGrid(part, answers, readOnly, "working"))

    const resultBlock = document.createElement("section")
    resultBlock.className = "exam-matrix-block"
    const resultHeading = document.createElement("h4")
    resultHeading.textContent = response.resultLabel ?? "Final matrix"
    resultBlock.append(resultHeading, renderMatrixGrid(part, answers, readOnly, "result"))

    matrixShell.append(workingBlock, resultBlock)
    wrapper.append(matrixShell)
    wrapper.append(
      createInputField(
        `${part.id}-working-note`,
        "Extra working notes",
        answers[`${part.id}-working-note`],
        readOnly,
        3
      )
    )

    return wrapper
  }

  if (response.type === "table") {
    const table = document.createElement("table")
    table.className = "exam-answer-table"

    const thead = document.createElement("thead")
    const headerRow = document.createElement("tr")
    response.columns.forEach((heading) => {
      const th = document.createElement("th")
      th.textContent = heading
      headerRow.append(th)
    })
    thead.append(headerRow)

    const tbody = document.createElement("tbody")
    response.rows.forEach((row) => {
      const tr = document.createElement("tr")
      row.cells.forEach((cell) => {
        const td = document.createElement("td")
        td.textContent = cell
        tr.append(td)
      })

      const fieldId = `${part.id}-${row.id}`
      const answerCell = document.createElement("td")

      if (response.options) {
        const select = document.createElement("select")
        select.dataset.answerField = fieldId
        select.disabled = readOnly

        const emptyOption = document.createElement("option")
        emptyOption.value = ""
        emptyOption.textContent = "Choose"
        select.append(emptyOption)

        response.options.forEach((optionValue) => {
          const option = document.createElement("option")
          option.value = optionValue
          option.textContent = optionValue
          option.selected = answers[fieldId] === optionValue
          select.append(option)
        })

        answerCell.append(select)
      } else {
        const input = document.createElement("input")
        input.dataset.answerField = fieldId
        input.type = "text"
        input.value = answers[fieldId] ?? ""
        input.disabled = readOnly
        answerCell.append(input)
      }

      tr.append(answerCell)
      tbody.append(tr)
    })

    table.append(thead, tbody)
    wrapper.append(table)
    return wrapper
  }

  if (response.type === "input") {
    const field = document.createElement("label")
    field.className = "exam-answer-field"
    const label = document.createElement("span")
    label.textContent = response.label ?? "Answer"
    const input = document.createElement("input")
    input.dataset.answerField = part.id
    input.type = "text"
    input.placeholder = response.placeholder ?? ""
    input.value = answers[part.id] ?? ""
    input.disabled = readOnly
    field.append(label, input)
    wrapper.append(field)
    return wrapper
  }

  wrapper.append(
    createInputField(
      part.id,
      response.label ?? "Answer",
      answers[part.id],
      readOnly,
      response.rows ?? 6
    )
  )

  return wrapper
}

function renderFeedback(feedback) {
  const wrapper = document.createElement("aside")
  wrapper.className = `exam-feedback ${
    feedback.score === feedback.maxMarks ? "exam-feedback--strong" : ""
  }`
  wrapper.dataset.feedbackFor = feedback.partId

  const heading = document.createElement("h4")
  heading.textContent = `${feedback.label} feedback: ${feedback.score}/${feedback.maxMarks}`
  wrapper.append(heading)

  if (feedback.matched.length > 0) {
    const matched = document.createElement("p")
    matched.className = "exam-feedback__matched"
    matched.textContent = `Credit spotted: ${feedback.matched.join("; ")}.`
    wrapper.append(matched)
  }

  if (feedback.missed.length > 0) {
    const missed = document.createElement("p")
    missed.className = "exam-feedback__missed"
    missed.textContent = `To improve: ${feedback.missed.join("; ")}.`
    wrapper.append(missed)
  }

  if (feedback.examinerTip) {
    const tip = document.createElement("p")
    tip.className = "exam-feedback__tip"
    tip.textContent = feedback.examinerTip
    wrapper.append(tip)
  }

  return wrapper
}

function renderPart(part, answers, feedbackMap, readOnly) {
  const card = document.createElement("article")
  card.className = "exam-question"
  card.id = part.id

  const header = document.createElement("header")
  header.className = "exam-question__header"

  const heading = document.createElement("h3")
  heading.textContent = part.label

  const marks = document.createElement("span")
  marks.className = "exam-mark-pill"
  marks.textContent = `${part.marks} mark${part.marks === 1 ? "" : "s"}`

  header.append(heading, marks)

  const prompt = document.createElement("div")
  prompt.className = "exam-question__prompt"
  prompt.innerHTML = part.promptHtml

  card.append(header, prompt, renderResponse(part, answers, readOnly))

  const feedback = feedbackMap.get(part.id)
  if (feedback) {
    card.append(renderFeedback(feedback))
  }

  return card
}

function renderGroup(group, answers, feedbackMap, readOnly) {
  const section = document.createElement("section")
  section.className = "exam-group"
  section.id = group.id

  const header = document.createElement("header")
  header.className = "exam-group__header"
  header.innerHTML = `
    <p class="eyebrow">${group.title}</p>
    <h2>${group.title}</h2>
    <span class="exam-group__marks">${group.totalMarks} marks</span>
  `

  const scenario = document.createElement("div")
  scenario.className = "exam-scenario"
  scenario.innerHTML = group.scenarioHtml

  section.append(header, scenario)
  group.parts.forEach((part) => {
    section.append(renderPart(part, answers, feedbackMap, readOnly))
  })

  return section
}

function getAnsweredPartIds(exam, answers) {
  const answered = new Set()

  getAllParts(exam).forEach((part) => {
    if (getPartFieldIds(part).some((fieldId) => String(answers[fieldId] ?? "").trim())) {
      answered.add(part.id)
    }
  })

  return answered
}

function formatTime(totalSeconds) {
  const absoluteSeconds = Math.abs(totalSeconds)
  const hours = Math.floor(absoluteSeconds / 3600)
  const minutes = Math.floor((absoluteSeconds % 3600) / 60)
  const seconds = absoluteSeconds % 60

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":")
}

function getExamDurationSeconds(exam) {
  return Math.round(exam.durationMinutes * 60)
}

function getTimerState(exam, durationSeconds) {
  const suggestedSeconds = getExamDurationSeconds(exam)
  const remainingSeconds = suggestedSeconds - durationSeconds

  return {
    remainingSeconds,
    overtimeSeconds: Math.max(durationSeconds - suggestedSeconds, 0),
    text:
      remainingSeconds >= 0
        ? formatTime(remainingSeconds)
        : `+${formatTime(remainingSeconds)}`,
    isOvertime: remainingSeconds < 0,
  }
}

function readAttempts(exam) {
  return readStorage(buildAttemptsKey(exam), [])
}

function writeAttempts(exam, attempts) {
  writeStorage(buildAttemptsKey(exam), attempts)
}

function createDraft(exam, existingDraft = null) {
  const now = new Date().toISOString()
  const suggestedSeconds = getExamDurationSeconds(exam)
  const inferredDurationSeconds =
    existingDraft?.durationSeconds ??
    (existingDraft?.remainingSeconds !== undefined
      ? Math.max(suggestedSeconds - existingDraft.remainingSeconds, 0)
      : 0)
  const timerState = getTimerState(exam, inferredDurationSeconds)

  return {
    examId: exam.id,
    version: exam.version ?? 1,
    startedAt: existingDraft?.startedAt ?? now,
    updatedAt: now,
    durationSeconds: inferredDurationSeconds,
    remainingSeconds: timerState.remainingSeconds,
    answers: existingDraft?.answers ?? {},
  }
}

function createAttemptId(exam) {
  const randomValue =
    window.crypto?.getRandomValues?.(new Uint32Array(1))[0]?.toString(36) ??
    Math.random().toString(36).slice(2)

  return `${exam.id}-${Date.now().toString(36)}-${randomValue}`
}

function setStatus(statusElement, message) {
  if (statusElement) {
    statusElement.textContent = message
  }
}

function renderSummary(summaryElement, exam, state) {
  if (!summaryElement) {
    return
  }

  const attempt = state.activeAttempt
  const answered = getAnsweredPartIds(exam, state.answers).size
  const totalParts = getAllParts(exam).length

  if (attempt?.score !== null && attempt?.score !== undefined) {
    summaryElement.innerHTML = `
      <strong>${attempt.score}/${exam.totalMarks}</strong>
      <span>${exam.markingModeLabel}</span>
    `
    return
  }

  summaryElement.innerHTML = `
    <strong>${answered}/${totalParts}</strong>
    <span>question parts answered</span>
  `
}

function renderNavigation(navElement, exam, state) {
  if (!navElement) {
    return
  }

  const answered = getAnsweredPartIds(exam, state.answers)
  const feedbackMap = new Map((state.activeAttempt?.feedback ?? []).map((item) => [item.partId, item]))

  navElement.replaceChildren()

  getAllParts(exam).forEach((part) => {
    const link = document.createElement("a")
    link.href = `#${part.id}`
    link.className = "exam-nav-link"
    link.textContent = part.label

    if (feedbackMap.has(part.id)) {
      const feedback = feedbackMap.get(part.id)
      link.dataset.state =
        feedback.score === feedback.maxMarks ? "full" : feedback.score > 0 ? "marked" : "low"
      link.title = `${feedback.score}/${feedback.maxMarks}`
    } else {
      link.dataset.state = answered.has(part.id) ? "answered" : "empty"
      link.title = answered.has(part.id) ? "Answered" : "Not answered"
    }

    navElement.append(link)
  })
}

function renderAttempts(attemptsElement, exam, state, callbacks) {
  if (!attemptsElement) {
    return
  }

  const attempts = readAttempts(exam)
  attemptsElement.replaceChildren()

  if (attempts.length === 0) {
    const empty = document.createElement("p")
    empty.className = "exam-history-empty"
    empty.textContent = "No submitted attempts yet."
    attemptsElement.append(empty)
    return
  }

  attempts
    .slice()
    .reverse()
    .forEach((attempt, index) => {
      const button = document.createElement("button")
      button.type = "button"
      button.className = "exam-attempt-button"
      button.dataset.active = attempt.attemptId === state.activeAttempt?.attemptId
        ? "true"
        : "false"

      const submitted = new Date(attempt.submittedAt)
      const dateLabel = Number.isNaN(submitted.getTime())
        ? "Submitted attempt"
        : submitted.toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })

      button.innerHTML = `
        <strong>Attempt ${attempts.length - index}</strong>
        <span>${dateLabel}</span>
        <span>${attempt.score}/${exam.totalMarks}</span>
      `

      button.addEventListener("click", () => {
        callbacks.loadAttempt(attempt)
      })

      attemptsElement.append(button)
    })
}

function initLock(exam, elements, onUnlock) {
  const unlockKey = buildUnlockKey(exam)
  const unlocked = readSessionStorage(unlockKey, false)

  if (unlocked) {
    onUnlock()
    return
  }

  elements.lock.hidden = false
  elements.app.hidden = true

  elements.unlockForm?.addEventListener("submit", (event) => {
    event.preventDefault()

    const passwordInput = elements.unlockForm.querySelector("input")
    const providedPassword = passwordInput?.value ?? ""

    if (providedPassword === exam.unlockPassword) {
      writeSessionStorage(unlockKey, true)
      setStatus(elements.lockStatus, "")
      onUnlock()
      return
    }

    setStatus(elements.lockStatus, "That password did not unlock the paper.")
    passwordInput?.select()
  })
}

export function initPastExam(exam) {
  const elements = {
    lock: document.querySelector("[data-role='exam-lock']"),
    unlockForm: document.querySelector("[data-role='exam-unlock-form']"),
    lockStatus: document.querySelector("[data-role='exam-lock-status']"),
    app: document.querySelector("[data-role='exam-app']"),
    paper: document.querySelector("[data-role='exam-paper']"),
    nav: document.querySelector("[data-role='exam-nav']"),
    attempts: document.querySelector("[data-role='exam-attempts']"),
    summary: document.querySelector("[data-role='exam-summary']"),
    status: document.querySelector("[data-role='exam-status']"),
    timer: document.querySelector("[data-role='exam-timer']"),
    submit: document.querySelector("[data-action='submit-exam']"),
    newAttempt: document.querySelector("[data-action='new-attempt']"),
    resumeDraft: document.querySelector("[data-action='resume-draft']"),
  }

  if (!elements.lock || !elements.app || !elements.paper) {
    return
  }

  const draftKey = buildDraftKey(exam)
  let draft = createDraft(exam, readStorage(draftKey, null))
  let state = {
    mode: "draft",
    answers: draft.answers,
    activeAttempt: null,
  }
  let timerId = null
  let lastTick = Date.now()
  let overtimeMessageShown = draft.remainingSeconds < 0

  function saveDraft(options = {}) {
    if (state.mode !== "draft") {
      return
    }

    draft.answers = state.answers
    draft.updatedAt = new Date().toISOString()
    draft.remainingSeconds = getTimerState(exam, draft.durationSeconds).remainingSeconds
    writeStorage(draftKey, draft)

    if (!options.silent) {
      setStatus(elements.status, "Draft saved on this device.")
    }
  }

  function updateTimerDisplay() {
    const timerState = getTimerState(exam, draft.durationSeconds)
    const timerShell = elements.timer?.closest(".exam-timer")

    if (elements.timer) {
      elements.timer.textContent = timerState.text
    }

    timerShell?.classList.toggle("exam-timer--overtime", timerState.isOvertime)
    timerShell?.setAttribute(
      "aria-label",
      timerState.isOvertime
        ? `Suggested time exceeded by ${formatTime(timerState.overtimeSeconds)}`
        : `Suggested time remaining ${timerState.text}`
    )
  }

  function collectAnswers() {
    const answers = {}

    elements.paper
      .querySelectorAll("[data-answer-field]")
      .forEach((field) => {
        answers[field.dataset.answerField] = field.value
      })

    return answers
  }

  function render() {
    const feedbackMap = new Map(
      (state.activeAttempt?.feedback ?? []).map((item) => [item.partId, item])
    )
    const readOnly = state.mode === "review"

    elements.paper.replaceChildren()
    exam.groups.forEach((group) => {
      elements.paper.append(renderGroup(group, state.answers, feedbackMap, readOnly))
    })

    renderSummary(elements.summary, exam, state)
    renderNavigation(elements.nav, exam, state)
    renderAttempts(elements.attempts, exam, state, { loadAttempt })

    if (elements.submit) {
      elements.submit.disabled = readOnly
    }

    if (elements.resumeDraft) {
      const hasDraft = Boolean(readStorage(draftKey, null))
      elements.resumeDraft.disabled = !hasDraft || state.mode === "draft"
      elements.resumeDraft.textContent =
        state.mode === "draft"
          ? "Editing draft"
          : hasDraft
            ? "Return to draft"
            : "No draft saved"
      elements.resumeDraft.title =
        hasDraft
          ? "Use this after viewing a submitted attempt to return to the current unsent draft."
          : "Start a new attempt to create a draft."
    }
  }

  function handleFieldChange() {
    if (state.mode !== "draft") {
      return
    }

    state.answers = collectAnswers()
    saveDraft()
    renderSummary(elements.summary, exam, state)
    renderNavigation(elements.nav, exam, state)
  }

  function startTimer() {
    window.clearInterval(timerId)
    lastTick = Date.now()
    overtimeMessageShown = getTimerState(exam, draft.durationSeconds).isOvertime
    updateTimerDisplay()

    timerId = window.setInterval(() => {
      if (state.mode !== "draft") {
        return
      }

      const now = Date.now()
      const elapsedSeconds = Math.floor((now - lastTick) / 1000)

      if (elapsedSeconds <= 0) {
        return
      }

      lastTick = now
      draft.durationSeconds += elapsedSeconds
      updateTimerDisplay()

      const timerState = getTimerState(exam, draft.durationSeconds)

      if (timerState.isOvertime && !overtimeMessageShown) {
        overtimeMessageShown = true
        setStatus(
          elements.status,
          "Suggested time has passed. You can keep working if you have extra time."
        )
      }

      saveDraft({ silent: true })
    }, 1000)
  }

  function submitAttempt() {
    state.answers = collectAnswers()
    const answered = getAnsweredPartIds(exam, state.answers).size
    const totalParts = getAllParts(exam).length

    if (
      answered < totalParts &&
      !window.confirm(`You have answered ${answered}/${totalParts} parts. Submit anyway?`)
    ) {
      return
    }

    const marking = markAttempt(exam, state.answers)
    const attempt = {
      attemptId: createAttemptId(exam),
      examId: exam.id,
      version: exam.version ?? 1,
      startedAt: draft.startedAt,
      submittedAt: new Date().toISOString(),
      durationSeconds: draft.durationSeconds,
      answers: state.answers,
      ...marking,
    }

    const attempts = readAttempts(exam)
    attempts.push(attempt)
    writeAttempts(exam, attempts)
    removeStorage(draftKey)

    state = {
      mode: "review",
      answers: attempt.answers,
      activeAttempt: attempt,
    }

    setStatus(elements.status, "Attempt submitted. Feedback is shown under each question.")
    render()
    window.location.hash = "exam-results"
  }

  function startNewAttempt() {
    const hasDraftAnswers = Object.values(state.answers).some((value) =>
      String(value ?? "").trim()
    )

    if (
      state.mode === "draft" &&
      hasDraftAnswers &&
      !window.confirm("Start a new attempt and clear the current draft?")
    ) {
      return
    }

    removeStorage(draftKey)
    draft = createDraft(exam)
    state = {
      mode: "draft",
      answers: {},
      activeAttempt: null,
    }
    saveDraft()
    setStatus(elements.status, "New attempt started.")
    render()
    startTimer()
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function resumeDraft() {
    draft = createDraft(exam, readStorage(draftKey, null))
    state = {
      mode: "draft",
      answers: draft.answers,
      activeAttempt: null,
    }
    setStatus(elements.status, "Draft loaded.")
    render()
    startTimer()
  }

  function loadAttempt(attempt) {
    state = {
      mode: "review",
      answers: attempt.answers,
      activeAttempt: attempt,
    }
    setStatus(elements.status, "Viewing a submitted attempt.")
    render()
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  elements.submit?.addEventListener("click", submitAttempt)
  elements.newAttempt?.addEventListener("click", startNewAttempt)
  elements.resumeDraft?.addEventListener("click", resumeDraft)
  elements.paper.addEventListener("input", handleFieldChange)
  elements.paper.addEventListener("change", handleFieldChange)
  window.addEventListener("pagehide", () => saveDraft({ silent: true }))
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      saveDraft({ silent: true })
    }
  })

  initLock(exam, elements, () => {
    elements.lock.hidden = true
    elements.app.hidden = false
    saveDraft({ silent: true })
    render()
    startTimer()
  })
}
