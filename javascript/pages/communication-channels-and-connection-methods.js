import { initLessonPage } from "../core/lesson-shell.js"

const lessonConfig = {
  lessonId: "communication-channels-and-connection-methods",
  defaultContext: "btec-level-3-unit-2",
  contexts: {
    "btec-level-3-unit-2": {
      label: "BTEC Level 3 Computing Unit 2",
      backHref: "../units/btec-level-3-unit-2.html#section-e",
      backLabel: "Back to Unit 2 content",
      previous: {
        title: "Multi-dimensional arrays and memory order",
        description: "Previous in D2 Indices and matrices.",
        status: "Live",
        href: "../topics/multi-dimensional-arrays-and-memory-order.html",
      },
      next: {
        title:
          "Transmission methods: synchronous, asynchronous, serial, and parallel",
        description: "Next in E1 Transmitting data.",
        status: "Live",
        href: "../topics/transmission-methods-synchronous-asynchronous-serial-and-parallel.html",
      },
    },
  },
  quiz: {
    storageKey: "lesson-communication-channels-and-connection-methods-quiz",
    passScore: 4,
  },
  examPractice: {
    storageKey:
      "lesson-communication-channels-and-connection-methods-exam-practice",
  },
}

initLessonPage(lessonConfig)
