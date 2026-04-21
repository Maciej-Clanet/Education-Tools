import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "matrices-and-arrays",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-d",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Arrays, lists, and data types",
        description: "Previous in D1 Data structures.",
        status: "Live",
        href: "../topics/arrays-lists-and-data-types.html",
      },
      next: {
        title: "Multi-dimensional arrays and memory order",
        description: "Next in D2 Indices and matrices.",
        status: "Live",
        href: "../topics/multi-dimensional-arrays-and-memory-order.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-matrices-and-arrays-quiz",
    passScore: 4,
  },
  examPractice: {
    storageKey: "lesson-matrices-and-arrays-exam-practice",
  },
}

initLessonPage(lessonConfig)
