import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "error-correction-with-arq-and-fec",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-e",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Error detection methods",
        description: "Previous in E2 Error detection.",
        status: "Live",
        href: "../topics/error-detection-methods.html",
      },
      next: {
        title: "Boolean logic",
        description: "Next in F1 Boolean logic. This lesson is still planned.",
        status: "Planned",
      },
    },
  },
  quiz: {
    storageKey: "lesson-error-correction-with-arq-and-fec-quiz",
    passScore: 4,
  },
  examPractice: {
    storageKey: "lesson-error-correction-with-arq-and-fec-exam-practice",
  },
}

initLessonPage(lessonConfig)
