import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "binary-arithmetic",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-c",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Binary and BCD",
        description: "Previous in C1 Number systems.",
        status: "Live",
        href: "../topics/binary-and-bcd.html",
      },
      next: {
        title: "Negative and floating point representation",
        description: "Next in C1 Number systems.",
        status: "Live",
        href: "../topics/negative-and-floating-point-representation.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-binary-arithmetic-quiz",
    passScore: 4,
  },
  examPractice: {
    storageKey: "lesson-binary-arithmetic-exam-practice",
  },
}

initLessonPage(lessonConfig)
