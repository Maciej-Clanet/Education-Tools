import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "binary-and-bcd",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-c",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Units of digital data",
        description: "Previous in C1 Number systems.",
        status: "Live",
        href: "../topics/units-of-digital-data.html",
      },
      next: {
        title: "Binary arithmetic",
        description: "Next in C1 Number systems.",
        status: "Live",
        href: "../topics/binary-arithmetic.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-binary-and-bcd-quiz",
    passScore: 4,
  },
  examPractice: {
    storageKey: "lesson-binary-and-bcd-exam-practice",
  },
}

initLessonPage(lessonConfig)
