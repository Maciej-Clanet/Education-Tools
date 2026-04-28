import { readStorage } from "./storage.js"
import { readAllLessonProgress } from "./quiz-progress.js"

function clampNumber(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function normalisePath(value) {
  if (!value) {
    return ""
  }

  try {
    return new URL(value, window.location.href).pathname
      .split("/")
      .filter(Boolean)
      .pop()
      .toLowerCase()
  } catch (error) {
    return value.split("?")[0].split("/").pop().toLowerCase()
  }
}

function getLessonQuiz(lesson) {
  const quiz = lesson.quiz ?? {}

  return {
    id: quiz.id ?? lesson.id,
    version: quiz.version ?? 1,
    totalQuestions: quiz.totalQuestions ?? 0,
    passScore: quiz.passScore ?? quiz.totalQuestions ?? 0,
    storageKey: quiz.storageKey ?? `lesson-${lesson.id}-quiz`,
  }
}

function countAnsweredAnswers(answers = {}) {
  return Object.values(answers).filter(Boolean).length
}

function readLegacyQuizProgress(lesson, quiz) {
  const storedState = readStorage(quiz.storageKey, null)

  if (!storedState?.answers) {
    return null
  }

  const answered = countAnsweredAnswers(storedState.answers)

  if (storedState.lastScore === null || storedState.lastScore === undefined) {
    return answered > 0
      ? {
          lessonId: lesson.id,
          quizId: quiz.id,
          quizVersion: quiz.version,
          totalQuestions: quiz.totalQuestions,
          answered,
          correct: 0,
          incorrect: 0,
          checked: false,
          completed: false,
          passed: false,
          source: "legacy",
        }
      : null
  }

  const correct = clampNumber(
    Number(storedState.lastScore) || 0,
    0,
    quiz.totalQuestions
  )
  const incorrect = clampNumber(answered - correct, 0, quiz.totalQuestions)

  return {
    lessonId: lesson.id,
    quizId: quiz.id,
    quizVersion: quiz.version,
    totalQuestions: quiz.totalQuestions,
    answered,
    correct,
    incorrect,
    checked: true,
    completed: correct === quiz.totalQuestions && quiz.totalQuestions > 0,
    passed: correct >= quiz.passScore,
    source: "legacy",
  }
}

function getLessonProgress(lesson, progressMap) {
  const quiz = getLessonQuiz(lesson)
  const storedProgress = progressMap?.[quiz.id]

  if (storedProgress) {
    const isCurrent = (storedProgress.quizVersion ?? 1) === quiz.version

    if (!isCurrent) {
      return {
        lesson,
        quiz,
        answered: 0,
        correct: 0,
        incorrect: 0,
        checked: false,
        completed: false,
        passed: false,
        stale: true,
        state: "stale",
      }
    }

    const checked = Boolean(storedProgress.checked)
    const correct = checked
      ? clampNumber(Number(storedProgress.correct) || 0, 0, quiz.totalQuestions)
      : 0
    const incorrect = checked
      ? clampNumber(
          Number(storedProgress.incorrect) || 0,
          0,
          quiz.totalQuestions - correct
        )
      : 0
    const answered = clampNumber(
      Number(storedProgress.answered) || 0,
      0,
      quiz.totalQuestions
    )
    const completed = checked && correct === quiz.totalQuestions
    const passed = checked && correct >= quiz.passScore

    return {
      lesson,
      quiz,
      answered,
      correct,
      incorrect,
      checked,
      completed,
      passed,
      stale: false,
      state: getLessonState({ answered, checked, completed, passed }),
    }
  }

  const legacyProgress = readLegacyQuizProgress(lesson, quiz)

  if (legacyProgress) {
    return {
      lesson,
      quiz,
      ...legacyProgress,
      stale: false,
      state: getLessonState(legacyProgress),
    }
  }

  return {
    lesson,
    quiz,
    answered: 0,
    correct: 0,
    incorrect: 0,
    checked: false,
    completed: false,
    passed: false,
    stale: false,
    state: "not-started",
  }
}

function getLessonState(progress) {
  if (progress.completed) {
    return "completed"
  }

  if (progress.passed) {
    return "passed"
  }

  if (progress.checked) {
    return "checked"
  }

  if (progress.answered > 0) {
    return "started"
  }

  return "not-started"
}

function getStateLabel(progress) {
  const total = progress.quiz.totalQuestions

  switch (progress.state) {
    case "completed":
      return `Full score: ${progress.correct}/${total}`
    case "passed":
      return `Passed: ${progress.correct}/${total}`
    case "checked":
      return `Checked: ${progress.correct}/${total}`
    case "started":
      return `Started: ${progress.answered}/${total} answered`
    case "stale":
      return "Quiz updated since your last attempt"
    default:
      return "Not started"
  }
}

function findTopicCard(section) {
  const explicitContainer = document.querySelector(
    `[data-topic-progress="${CSS.escape(section.id)}"]`
  )

  if (explicitContainer) {
    return explicitContainer.closest(".topic-card")
  }

  return Array.from(document.querySelectorAll(".topic-card")).find((card) => {
    const code = card.querySelector(".topic-code")?.textContent?.trim()
    return code === section.id
  })
}

function findOrCreateTopicProgressShell(card, section) {
  const existing = card.querySelector(
    `[data-topic-progress="${CSS.escape(section.id)}"]`
  )

  if (existing) {
    return existing
  }

  const shell = document.createElement("div")
  shell.className = "topic-progress"
  shell.dataset.topicProgress = section.id

  const heading = card.querySelector("h3")
  heading?.insertAdjacentElement("afterend", shell)

  return shell
}

function renderTopicProgress(shell, section, lessonProgress) {
  const total = lessonProgress.reduce(
    (sum, progress) => sum + progress.quiz.totalQuestions,
    0
  )
  const correct = lessonProgress.reduce(
    (sum, progress) => sum + progress.correct,
    0
  )
  const incorrect = lessonProgress.reduce(
    (sum, progress) => sum + progress.incorrect,
    0
  )
  const checkedLessons = lessonProgress.filter(
    (progress) => progress.checked && !progress.stale
  ).length
  const staleLessons = lessonProgress.filter((progress) => progress.stale).length
  const correctPercent = total > 0 ? (correct / total) * 100 : 0
  const incorrectPercent = total > 0 ? (incorrect / total) * 100 : 0
  const empty = Math.max(total - correct - incorrect, 0)
  const summary = `${correct}/${total} correct`
  const detail =
    staleLessons > 0
      ? `${checkedLessons}/${lessonProgress.length} lessons checked. ${staleLessons} quiz update needed.`
      : `${checkedLessons}/${lessonProgress.length} lessons checked.`

  shell.className = "topic-progress"
  shell.innerHTML = `
    <div class="topic-progress__summary">
      <span>Quiz progress</span>
      <strong>${summary}</strong>
    </div>
    <div
      class="topic-progress__track"
      role="img"
      aria-label="${section.id} quiz progress: ${correct} correct, ${incorrect} incorrect, ${empty} not yet correct or checked, out of ${total} questions."
    >
      <span
        class="topic-progress__segment topic-progress__segment--correct"
        style="width: ${correctPercent}%"
      ></span>
      <span
        class="topic-progress__segment topic-progress__segment--incorrect"
        style="left: ${correctPercent}%; width: ${incorrectPercent}%"
      ></span>
    </div>
    <p class="topic-progress__detail">${detail}</p>
  `
}

function findLessonItem(lesson) {
  const expectedPath = normalisePath(lesson.href)

  return Array.from(document.querySelectorAll(".lesson-link")).find((link) => {
    return normalisePath(link.getAttribute("href")) === expectedPath
  })?.closest(".lesson-item")
}

function renderLessonIndicator(progress) {
  const lessonItem = findLessonItem(progress.lesson)

  if (!lessonItem) {
    return
  }

  lessonItem.dataset.quizState = progress.state
  lessonItem.classList.add("lesson-item--has-progress")

  const existing = lessonItem.querySelector("[data-role='lesson-progress']")
  const indicator = existing ?? document.createElement("span")
  const label = getStateLabel(progress)

  indicator.dataset.role = "lesson-progress"
  indicator.className = `lesson-progress-indicator lesson-progress-indicator--${progress.state}`
  indicator.title = label
  indicator.setAttribute("aria-label", label)

  if (!existing) {
    lessonItem.append(indicator)
  }
}

function renderUnitProgress(unitData) {
  const progressMap = readAllLessonProgress()

  unitData.sections.forEach((section) => {
    const card = findTopicCard(section)

    if (!card) {
      return
    }

    const lessonProgress = section.lessons.map((lesson) =>
      getLessonProgress(lesson, progressMap)
    )
    const shell = findOrCreateTopicProgressShell(card, section)

    renderTopicProgress(shell, section, lessonProgress)
    lessonProgress.forEach(renderLessonIndicator)
  })
}

export function initUnitProgress(unitData) {
  if (!unitData?.sections?.length) {
    return
  }

  renderUnitProgress(unitData)

  window.addEventListener("pageshow", () => {
    renderUnitProgress(unitData)
  })

  window.addEventListener("storage", () => {
    renderUnitProgress(unitData)
  })
}
