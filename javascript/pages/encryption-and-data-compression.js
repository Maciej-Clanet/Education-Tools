import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "encryption-and-data-compression",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-e",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Packet data, packet switching, and protocols",
        description: "Previous in E1 Transmitting data.",
        status: "Live",
        href: "../topics/packet-data-packet-switching-and-protocols.html",
      },
      next: {
        title: "Error detection methods",
        description: "Next in E2 Error detection.",
        status: "Live",
        href: "../topics/error-detection-methods.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-encryption-and-data-compression-quiz",
    passScore: 4,
  },
  examPractice: {
    storageKey: "lesson-encryption-and-data-compression-exam-practice",
  },
}

initLessonPage(lessonConfig)
