import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "error-detection-methods",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-e",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Encryption and data compression",
        description: "Previous in E1 Transmitting data.",
        status: "Live",
        href: "../topics/encryption-and-data-compression.html",
      },
      next: {
        title: "Error correction with ARQ and FEC",
        description: "Next in E3 Error correction.",
        status: "Live",
        href: "../topics/error-correction-with-arq-and-fec.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-error-detection-methods-quiz",
    passScore: 4,
  },
  examPractice: {
    storageKey: "lesson-error-detection-methods-exam-practice",
  },
}

initLessonPage(lessonConfig)
