import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "interrupts-and-register-handling",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-b",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Registers and their functions",
        description: "Previous in B3 Registers and register handling.",
        status: "Live",
        href: "../topics/registers-and-their-functions.html",
      },
      next: {
        title: "Units of digital data",
        description: "Next in C1 Number systems. This lesson is still planned.",
        status: "Planned",
      },
    },
  },
  quiz: {
    storageKey: "lesson-interrupts-and-register-handling-quiz",
    passScore: 4,
  },
  examPractice: {
    storageKey: "lesson-interrupts-and-register-handling-exam-practice",
  },
}

initLessonPage(lessonConfig)
