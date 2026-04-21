import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "multi-dimensional-arrays-and-memory-order",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-d",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Matrices and arrays",
        description: "Previous in D2 Indices and matrices.",
        status: "Live",
        href: "../topics/matrices-and-arrays.html",
      },
      next: {
        title: "Communication channels and connection methods",
        description: "Next in E1 Transmitting data. This lesson is still planned.",
        status: "Planned",
      },
    },
  },
  quiz: {
    storageKey: "lesson-multi-dimensional-arrays-and-memory-order-quiz",
    passScore: 4,
  },
  examPractice: {
    storageKey: "lesson-multi-dimensional-arrays-and-memory-order-exam-practice",
  },
}

initLessonPage(lessonConfig)
