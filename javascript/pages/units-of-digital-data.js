import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "units-of-digital-data",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-c",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Interrupts and register handling",
        description: "Previous in B3 Registers and register handling.",
        status: "Live",
        href: "../topics/interrupts-and-register-handling.html",
      },
      next: {
        title: "Binary and BCD",
        description: "Next in C1 Number systems.",
        status: "Live",
        href: "../topics/binary-and-bcd.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-units-of-digital-data-quiz",
    passScore: 4,
  },
  examPractice: {
    storageKey: "lesson-units-of-digital-data-exam-practice",
  },
}

initLessonPage(lessonConfig)
