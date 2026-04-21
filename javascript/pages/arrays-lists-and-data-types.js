import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "arrays-lists-and-data-types",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-d",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Stacks and queues",
        description: "Previous in D1 Data structures.",
        status: "Live",
        href: "../topics/stacks-and-queues.html",
      },
      next: {
        title: "Matrices and arrays",
        description:
          "Next in the Unit 2 teaching order. This lesson is still planned.",
        status: "Planned",
      },
    },
  },
  quiz: {
    storageKey: "lesson-arrays-lists-and-data-types-quiz",
    passScore: 4,
  },
  examPractice: {
    storageKey: "lesson-arrays-lists-and-data-types-exam-practice",
  },
}

initLessonPage(lessonConfig)
