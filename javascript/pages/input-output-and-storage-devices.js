import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "input-output-and-storage-devices",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-a",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Computer system types and internal components",
        description: "Previous in A1 Computer hardware in a computer system.",
        status: "Live",
        href: "../topics/computer-system-types-and-internal-components.html",
      },
      next: {
        title: "Hardware performance and component choice",
        description: "Next in A1 Computer hardware in a computer system.",
        status: "Live",
        href: "../topics/hardware-performance-and-component-choice.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-input-output-and-storage-devices-quiz-v2",
    version: 2,
    totalQuestions: 12,
    passScore: 9,
  },
  examPractice: {
    storageKey: "lesson-input-output-and-storage-devices-exam-practice",
  },
}

initLessonPage(lessonConfig)

// Native selects and buttons follow the shared lesson shell's interaction rules.
document.querySelectorAll("[data-storage-match]").forEach((card) => {
  const choice = card.querySelector("select")
  const feedback = card.querySelector("[data-match-feedback]")
  card.querySelector("[data-check-match]").addEventListener("click", () => {
    feedback.textContent = !choice.value
      ? "Choose a storage device first."
      : choice.value === card.dataset.answer
        ? `Correct. ${card.dataset.reason}`
        : `Try again. A suitable choice is ${card.dataset.answer}. ${card.dataset.reason}`
  })
  choice.addEventListener("change", () => { feedback.textContent = "" })
})
