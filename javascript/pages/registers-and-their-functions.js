import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "registers-and-their-functions",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-b",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "CPU architecture for different systems",
        description: "Previous in B2 The concepts of microarchitecture. This lesson is still planned.",
        status: "Planned",
      },
      next: {
        title: "Interrupts and register handling",
        description: "Next in B3 Registers and register handling.",
        status: "Live",
        href: "../topics/interrupts-and-register-handling.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-registers-and-their-functions-quiz",
    passScore: 4,
  },
  examPractice: {
    storageKey: "lesson-registers-and-their-functions-exam-practice",
  },
}

initLessonPage(lessonConfig)
