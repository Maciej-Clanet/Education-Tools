import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "operating-system-types",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-a",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "RAID and NAS storage systems",
        description: "Previous in A1 Computer hardware in a computer system.",
        status: "Live",
        href: "../topics/raid-and-nas-storage-systems.html",
      },
      next: {
        title: "Kernel functions and system management",
        description: "Next in A2 Computer software in a computer system.",
        status: "Live",
        href: "../topics/kernel-functions-and-system-management.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-operating-system-types-quiz-v2",
    version: 2,
    totalQuestions: 12,
    passScore: 9,
  },
  examPractice: {
    storageKey: "lesson-operating-system-types-exam-practice",
  },
}

initLessonPage(lessonConfig)

// Reuse the paired native-selection pattern used by the hardware lesson.
document.querySelectorAll("[data-os-scenario]").forEach((card) => {
  const type = card.querySelector('[data-choice="type"]')
  const clue = card.querySelector('[data-choice="clue"]')
  const feedback = card.querySelector("[data-os-feedback]")
  card.querySelector("[data-check-os]").addEventListener("click", () => {
    if (!type.value || !clue.value) {
      feedback.textContent = "Choose both an OS classification and its supporting clue."
      return
    }
    const typeCorrect = type.value === card.dataset.type
    const clueCorrect = clue.value === card.dataset.clue
    feedback.textContent = `${typeCorrect && clueCorrect ? "Correct classification and evidence." :
      `Classification: ${typeCorrect ? "correct" : "try again"}. Clue: ${clueCorrect ? "correct" : "try again"}.`} ${card.dataset.explanation}`
  })
  card.querySelectorAll("select").forEach((select) => {
    select.addEventListener("change", () => { feedback.textContent = "" })
  })
})
