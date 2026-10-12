import { initLessonPage } from "../core/lesson-shell.js"
import { initLessonWalkthroughs } from "../core/lesson-walkthrough.js"
import { initArrayExplorers } from "../core/array-explorer.js"

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
        description: "Next in D2 Indices and matrices.",
        status: "Live",
        href: "../topics/matrices-and-arrays.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-arrays-lists-and-data-types-quiz-v2",
    passScore: 8,
    version: 2,
  },
  examPractice: {
    storageKey: "lesson-arrays-lists-and-data-types-exam-practice",
  },
}

initLessonPage(lessonConfig)
initLessonWalkthroughs()
initArrayExplorers()
