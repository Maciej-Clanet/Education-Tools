import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "computer-system-types-and-internal-components",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-a",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Start of the A1 lesson sequence",
        description:
          "Use the unit hub if you want to jump to a different Unit 2 topic.",
        status: "Start",
      },
      next: {
        title: "Input, output, and storage devices",
        description: "Next in A1 Computer hardware in a computer system.",
        status: "Live",
        href: "../topics/input-output-and-storage-devices.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-computer-system-types-and-internal-components-quiz-v2",
    version: 2,
    totalQuestions: 10,
    passScore: 7,
  },
  examPractice: {
    storageKey:
      "lesson-computer-system-types-and-internal-components-exam-practice",
  },
}

initLessonPage(lessonConfig)

// Native controls use the lesson shell's existing keyboard and slide interaction rules.
document.querySelectorAll("[data-scenario]").forEach((card) => {
  const feedback = card.querySelector("[data-scenario-feedback]")
  const type = card.querySelector('[data-choice="type"]')
  const priority = card.querySelector('[data-choice="priority"]')
  card.querySelector("[data-check-scenario]").addEventListener("click", () => {
    if (!type.value || !priority.value) {
      feedback.textContent = "Choose both a system type and a design priority first."
      return
    }
    const typeCorrect = type.value === card.dataset.type
    const priorityCorrect = priority.value === card.dataset.priority
    feedback.textContent = `${typeCorrect && priorityCorrect ? "Correct match." :
      `System type: ${typeCorrect ? "correct" : "try again"}. Priority: ${priorityCorrect ? "correct" : "try again"}.`} ${card.dataset.feedback}`
  })
  card.querySelectorAll("select").forEach((select) => {
    select.addEventListener("change", () => { feedback.textContent = "" })
  })
})
