import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "flow-charts-and-system-diagrams",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-f",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Boolean logic",
        description: "Previous in F1 Boolean logic.",
        status: "Live",
        href: "../topics/boolean-logic.html",
      },
      next: {
        title: "More Unit 2 lessons coming soon",
        description:
          "This is currently the last live lesson in the Unit 2 sequence.",
        status: "Live",
      },
    },
  },
  quiz: {
    storageKey: "lesson-flow-charts-and-system-diagrams-quiz",
    passScore: 4,
  },
  examPractice: {
    storageKey: "lesson-flow-charts-and-system-diagrams-exam-practice",
  },
}

initLessonPage(lessonConfig)
