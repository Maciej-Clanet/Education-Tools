import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "boolean-logic",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-f",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Error correction with ARQ and FEC",
        description: "Previous in E3 Error correction.",
        status: "Live",
        href: "../topics/error-correction-with-arq-and-fec.html",
      },
      next: {
        title: "Flow charts and system diagrams",
        description: "Next in F2 Flow charts and system diagrams.",
        status: "Live",
        href: "../topics/flow-charts-and-system-diagrams.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-boolean-logic-quiz",
    passScore: 4,
  },
  examPractice: {
    storageKey: "lesson-boolean-logic-exam-practice",
  },
}

initLessonPage(lessonConfig)
